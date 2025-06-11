import {redis} from "@/lib/redis";
import {cityClues} from "@/data/dummy_data";
import {
  GameStatus,
  LeaderboardEntry,
  MultiplayerGameSession,
} from "@/types/multi_player";

// Constants
const SESSION_TTL = 3600; // 1 hour in seconds - This is equal to (lobby + game + extra time for leader board to persist) time
// const GAME_TIME = 900; // 15 min actual game play time, starts when the host presses begin. Up until this point other client or players will wait and poll every 10-15 sec to get the game status: LOBBY | ACTIVE | COMPLETED, Once started, the player or the host will receive same response from this point onwards. {todo} user server sent events with redis pub-sub in future implementation. use same for realtime leader board.
const QUESTIONS_PER_GAME = 15; // number of questions per multiplayer game

// Helper to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// // Helper to get correct answer format
// function getCorrectAnswer(cityClue: CityClue): string {
//   return `${cityClue.city}, ${cityClue.country}`;
// }

// // Helper to generate options for a question
// function generateOptions(correctAnswer: string): string[] {
//   // Get 3 random options that aren't the correct answer
//   const filteredOptions = DummyOptions.filter(
//     (option) => option !== correctAnswer
//   );
//   const randomOptions = shuffleArray(filteredOptions).slice(0, 3);

//   // Add correct answer and shuffle
//   const allOptions = [...randomOptions, correctAnswer];
//   return shuffleArray(allOptions);
// }

// Helper to generate a random room code
// function generateRoomCode(): string {
//   const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed similar looking characters
//   let result = "";
//   for (let i = 0; i < 6; i++) {
//     result += characters.charAt(Math.floor(Math.random() * characters.length));
//   }
//   return result;
// }

// Redis key helpers - 2 Keys
// sessionKey stores game session (normal set)
const sessionKey = (gameId: string) => `game:multi:session:${gameId}`;
// leaderboardKey stores ranks of the participated players (Zset) based on number of correct answers.
const leaderboardKey = (gameId: string) => `game:multi:leaderboard:${gameId}`;

/**
 * Create New multiplayer session as a hset.
 * @param hostId UserId of the User from user session
 * @param hostDisplayName Name of the user from user session
 * @param duration Test Duration @default 900 (15 Minutes)
 * @returns GameId, Room Code
 */
export async function createMultiplayerGame(
  hostId: string,
  hostDisplayName: string
): Promise<{gameId: string}> {
  if (process.env.NODE_ENV === "development") {
    console.log(
      "######### DEBUG #########\n",
      "> createMultiplayerGame()\n",
      "> user's name: " + hostDisplayName + "\n",
      "#########################\n"
    );
  }

  const gameId = crypto.randomUUID();

  // select random questions
  const totalQuestions = cityClues.length;
  const questionIds = Array.from({length: totalQuestions}, (_, i) => i + 1);
  const selectedQuestions = shuffleArray(questionIds).slice(
    0,
    QUESTIONS_PER_GAME
  );

  // Create game session structure
  const newSession: MultiplayerGameSession = {
    gameId,
    hostId,
    hostDisplayName,
    status: GameStatus.WAITING,
    startTime: null,
    questions: selectedQuestions,
  };

  // // Add user attempts dynamically (initializing userIds with 0 attempts)
  // const userAttempts = {
  //   [hostId]: 0,
  // };

  // Create new leaderboard member entry
  const newLeaderBoardEntry: LeaderboardEntry = {
    userId: hostId,
    userDisplayName: hostDisplayName,
  };

  // Start Redis transaction
  const multi = redis.multi();

  // Store session details in a Redis hash
  multi.hset(sessionKey(gameId), {
    ...newSession,
    [hostId]: 0,
  });

  multi.zadd(leaderboardKey(gameId), {
    score: 0,
    member: JSON.stringify(newLeaderBoardEntry),
  });

  // Set expiration for all keys
  multi.expire(sessionKey(gameId), SESSION_TTL);
  multi.expire(leaderboardKey(gameId), SESSION_TTL);

  await multi.exec();

  return {gameId};
}

/**
 * Join a multiplayer game session from the shared URL
 * @param userId userID of the user from user details who made the request
 * @param userDisplayName Name of the user who is entering the room
 * @param gameId gameId of the room, extracted from URL params shared by the host to the world
 * @returns Destails of the session such as: status, isHost, hostDisplayName, hostId
 */
export async function joinMultiPlayerGame(
  userId: string,
  userDisplayName: string,
  gameId: string
): Promise<{
  isHost: boolean;
  status: string;
  hostName: string;
  hostId: string;
}> {
  if (process.env.NODE_ENV === "development") {
    console.log(
      "######### DEBUG #########\n",
      "> joinMultiPlayerGame()\n",
      "> user's name: " + userDisplayName + "\n",
      "#######################\n"
    );
  }

  /*
    {todo}
    1. If a user tries to enter a room and status is not waiting. USER the questions.
    2. If the game has finished or does not exist give user options to create a new game
  */

  // Define the fields you want to retrieve
  const fieldsToGet = ["status", "hostId", "hostDisplayName"];

  // Use HMGET to retrieve specific fields
  const rawSessionDetails = (await redis.hmget(
    sessionKey(gameId),
    ...fieldsToGet
  )) as Partial<MultiplayerGameSession>;

  // console.log(">> Raw session details: ", rawSessionDetails);

  if (rawSessionDetails === null) {
    throw new Error("Game session does not exist or is completed.");
  }

  const sessionDetails: Partial<MultiplayerGameSession> = {
    status: rawSessionDetails.status,
    hostId: rawSessionDetails.hostId,
    hostDisplayName: rawSessionDetails.hostDisplayName,
  };

  if (
    !sessionDetails ||
    !sessionDetails.status ||
    (sessionDetails.status !== GameStatus.WAITING &&
      sessionDetails.status !== GameStatus.ACTIVE)
  ) {
    throw new Error("Game session does not exist or is completed.");
  }

  // Check if the joining User is the host of the room or not
  const isHost = sessionDetails.hostId === userId;

  // Create new leaderboard member entry
  const newLeaderBoardEntry: LeaderboardEntry = {
    userId: userId,
    userDisplayName: userDisplayName,
  };

  console.log(">> New leaboard entry", newLeaderBoardEntry);

  // Start Redis transaction
  const multi = redis.multi();

  multi.hset(sessionKey(gameId), {[userId]: 0});

  // Add player to leaderboard(zset) with initial score of 0
  multi.zadd(leaderboardKey(gameId), {
    score: 0,
    member: JSON.stringify(newLeaderBoardEntry),
  });

  // Execute transaction
  await multi.exec();

  return {
    isHost,
    status: sessionDetails.status,
    hostName: sessionDetails.hostDisplayName!,
    hostId: sessionDetails.hostId!,
  };
}

export async function startGame(
  userId: string,
  gameId: string
): Promise<{
  status: string;
}> {
  if (process.env.NODE_ENV === "development") {
    console.log(
      "######### DEBUG #########\n",
      "> startGame()\n",
      "> user's name: " + userId + "\n",
      "> game room: " + gameId + "\n",
      "#########################\n"
    );
  }

  // Define the fields you want to retrieve
  const fieldsToGet = ["status", "hostId"];

  // Use HMGET to retrieve specific fields
  const rawSessionDetails = (await redis.hmget(
    sessionKey(gameId),
    ...fieldsToGet
  )) as Partial<MultiplayerGameSession>;

  // This
  // const sessionDetails: MultiplayerGameSession =
  //   rawSessionDetails as MultiplayerGameSession;

  // or

  // this: which is more defined
  const sessionDetails: Partial<MultiplayerGameSession> = {
    status: rawSessionDetails.status,
    hostId: rawSessionDetails.hostId,
  };

  if (!sessionDetails) {
    throw new Error("Game session does not exist.");
  }

  if (sessionDetails.hostId !== userId) {
    throw new Error("You are not host of this room!");
  }

  // Do not allow players to join if game has started - optional
  // if (sessionDetails.status === GameStatus.ACTIVE) {
  //   throw new Error("Game has already started!");
  // }

  // {todo} Do not allow players to join if current_time - start_time > 15 mins

  if (sessionDetails.status === GameStatus.COMPLETED) {
    throw new Error("Game already completed. Create New game?");
  }

  try {
    sessionDetails.status = GameStatus.ACTIVE;
    sessionDetails.startTime = Date.now();

    await redis.hset(sessionKey(gameId), {...sessionDetails});

    console.log("Game session updated to ACTIVE");
  } catch (error) {
    console.error("Failed to start game:", error);
    throw new Error("Failed to update game session. Database error.");
  }

  return {
    status: GameStatus.ACTIVE,
  };
}

export async function polling(gameId: string): Promise<{
  status: string;
}> {
  if (process.env.NODE_ENV === "development") {
    console.log(
      "######### DEBUG #########\n",
      "> polling()\n",
      "> gameId: " + gameId + "\n",
      "#########################\n"
    );
  }

  // Retrieve the current status for polling
  const rawSessionDetails = await redis.hget(sessionKey(gameId), "status");

  // console.log("Raw detail session:", rawSessionDetails);
  // console.log("TYPE OF Raw detail session:", typeof rawSessionDetails);

  if (!rawSessionDetails) {
    throw new Error("Game session does not exist.");
  }

  const gameSession = rawSessionDetails as string;

  return {
    status: gameSession,
  };
}

// Get Questions
/*
{Todo}
- validate the old response write back the response to the redis
- get the question index and question Id
- check if the user can still continue to play(time limit + questions left)
- Now what are important data that needs to be received and sent back
- receive(gameId, userId, questionId)
- send (next question + options + clues + time_left + )
*/
export async function verifyResponse_sendNextQuestion(
  gameId: string,
  userId: string,
): Promise<{
  // question: CityClue | null;
  // options: string[] | null;
  // questionNumber: number | null;
  // totalQuestions: number | null;
  isComplete: boolean;
}> {
  if (process.env.NODE_ENV === "development") {
    console.log(
      "######### DEBUG #########\n",
      "> verifyResponse_sendNextQuestion()\n",
      "> user's name: " + userId + "\n",
      "> game room: " + gameId + "\n",
      "#########################\n"
    );
  }

  // Define the fields you want to retrieve
  const fieldsToGet = ["status", "hostId", "questions"];
  const rawSessionDetails = (await redis.hmget(
    sessionKey(gameId),
    ...fieldsToGet
  )) as Partial<MultiplayerGameSession>;

  
  console.log(">> Raw session details: ", rawSessionDetails);
  console.log(rawSessionDetails?.questions);

  if (rawSessionDetails === null) {
    throw new Error("Game session does not exist or is completed.");
  }

  return {
    isComplete: false,
  };
}

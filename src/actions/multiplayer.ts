// actions/multiplayer.ts

import {redis} from "@/lib/redis";
import {v4 as uuidv4} from "uuid";
import {cityClues, DummyOptions, CityClue} from "@/data/dummy_data";

// Constants
const MULTIPLAYER_SESSION_TTL = 3600; // 60 minutes in seconds
const QUESTIONS_PER_GAME = 15;

// Types specific to multiplayer
export interface MultiplayerQuestion {
  id: number;
  answered: boolean;
  correct: boolean;
  selectedOption: string | null;
}

export interface MultiplayerPlayerState {
  userId: string;
  questions: MultiplayerQuestion[];
  currentQuestionIndex: number;
  totalAnswered: number;
  totalCorrect: number;
  score: number;
  completed: boolean;
}

export interface MultiplayerGame {
  gameId: string;
  createdBy: string;
  startTime: number;
  endTime: number | null;
  players: string[];
  playerStates: Record<string, MultiplayerPlayerState>;
  status: "waiting" | "active" | "completed";
  maxPlayers: number;
  questionIds: number[];
}

export interface LeaderboardEntry {
  userId: string;
  score: number;
  totalCorrect: number;
  totalAnswered: number;
  completionTime?: number;
}

// Helper functions
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function getCorrectAnswer(cityClue: CityClue): string {
  return `${cityClue.city}, ${cityClue.country}`;
}

function generateOptions(correctAnswer: string): string[] {
  const filteredOptions = DummyOptions.filter(
    (option) => option !== correctAnswer
  );
  const randomOptions = shuffleArray(filteredOptions).slice(0, 3);
  const allOptions = [...randomOptions, correctAnswer];
  return shuffleArray(allOptions);
}

// Create a new multiplayer game
export async function createMultiplayerGame(
  creatorId: string,
  maxPlayers: number = 2
): Promise<MultiplayerGame> {
  const gameId = uuidv4();

  // Select random questions
  const totalQuestions = cityClues.length;
  const questionIds = Array.from({length: totalQuestions}, (_, i) => i + 1);
  const selectedQuestionIds = shuffleArray(questionIds).slice(
    0,
    QUESTIONS_PER_GAME
  );

  // Create player's initial state
  const creatorState: MultiplayerPlayerState = {
    userId: creatorId,
    questions: selectedQuestionIds.map((id) => ({
      id,
      answered: false,
      correct: false,
      selectedOption: null,
    })),
    currentQuestionIndex: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    score: 0,
    completed: false,
  };

  const newGame: MultiplayerGame = {
    gameId,
    createdBy: creatorId,
    startTime: Date.now(),
    endTime: null,
    players: [creatorId],
    playerStates: {[creatorId]: creatorState},
    status: "waiting",
    maxPlayers,
    questionIds: selectedQuestionIds,
  };

  // Store in Redis
  const gameKey = `multiplayer:game:${gameId}`;
  await redis.set(gameKey, JSON.stringify(newGame), {
    ex: MULTIPLAYER_SESSION_TTL,
  });

  return newGame;
}

// Get a multiplayer game by ID
export async function getMultiplayerGame(
  gameId: string
): Promise<MultiplayerGame | null> {
  const gameKey = `multiplayer:game:${gameId}`;
  const game = await redis.get(gameKey);

  if (!game) return null;

  if (typeof game === "object") {
    return game as MultiplayerGame;
  }

  if (typeof game === "string") {
    try {
      return JSON.parse(game) as MultiplayerGame;
    } catch (error) {
      console.error("Failed to parse game JSON:", error);
      return null;
    }
  }

  return null;
}

// Join a multiplayer game
export async function joinMultiplayerGame(
  userId: string,
  gameId: string
): Promise<{success: boolean; game: MultiplayerGame | null; message: string}> {
  const game = await getMultiplayerGame(gameId);

  if (!game) {
    return {success: false, game: null, message: "Game not found"};
  }

  if (game.status !== "waiting") {
    return {success: false, game, message: "Game already started or completed"};
  }

  if (game.players.includes(userId)) {
    return {success: true, game, message: "Already joined this game"};
  }

  if (game.players.length >= game.maxPlayers) {
    return {success: false, game, message: "Game is already full"};
  }

  // Create player's initial state
  const playerState: MultiplayerPlayerState = {
    userId,
    questions: game.questionIds.map((id) => ({
      id,
      answered: false,
      correct: false,
      selectedOption: null,
    })),
    currentQuestionIndex: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    score: 0,
    completed: false,
  };

  // Add player to the game
  game.players.push(userId);
  game.playerStates[userId] = playerState;

  // If max players reached, start the game
  if (game.players.length === game.maxPlayers) {
    game.status = "active";
  }

  // Update game in Redis
  const gameKey = `multiplayer:game:${gameId}`;
  await redis.set(gameKey, JSON.stringify(game), {ex: MULTIPLAYER_SESSION_TTL});

  return {success: true, game, message: "Successfully joined the game"};
}

// Get current question for a player in multiplayer game
export async function getMultiplayerCurrentQuestion(
  userId: string,
  gameId: string
): Promise<{
  question: CityClue | null;
  options: string[] | null;
  questionNumber: number | null;
  totalQuestions: number | null;
}> {
  const game = await getMultiplayerGame(gameId);

  if (!game || !game.players.includes(userId)) {
    return {
      question: null,
      options: null,
      questionNumber: null,
      totalQuestions: null,
    };
  }

  const playerState = game.playerStates[userId];
  if (!playerState || playerState.completed) {
    return {
      question: null,
      options: null,
      questionNumber: null,
      totalQuestions: null,
    };
  }

  const currentQuestionId =
    playerState.questions[playerState.currentQuestionIndex].id;
  const question = cityClues.find((q) => q.id === currentQuestionId);

  if (!question) {
    return {
      question: null,
      options: null,
      questionNumber: null,
      totalQuestions: null,
    };
  }

  const correctAnswer = getCorrectAnswer(question);
  const options = generateOptions(correctAnswer);

  return {
    question,
    options,
    questionNumber: playerState.currentQuestionIndex + 1,
    totalQuestions: QUESTIONS_PER_GAME,
  };
}

// Submit an answer for multiplayer game
export async function submitMultiplayerAnswer(
  userId: string,
  gameId: string,
  selectedOption: string
): Promise<{
  correct: boolean;
  correctAnswer: string;
  nextQuestion: boolean;
  rank: {rank: number; totalPlayers: number} | null;
}> {
  const game = await getMultiplayerGame(gameId);

  if (!game || !game.players.includes(userId)) {
    return {
      correct: false,
      correctAnswer: "",
      nextQuestion: false,
      rank: null,
    };
  }

  const playerState = game.playerStates[userId];
  if (!playerState || playerState.completed) {
    return {
      correct: false,
      correctAnswer: "",
      nextQuestion: false,
      rank: null,
    };
  }

  // Get the current question
  if (playerState.currentQuestionIndex >= playerState.questions.length) {
    return {
      correct: false,
      correctAnswer: "",
      nextQuestion: false,
      rank: null,
    };
  }

  const currentQuestion =
    playerState.questions[playerState.currentQuestionIndex];

  // If already answered, return the current state
  if (currentQuestion.answered) {
    const question = cityClues.find((q) => q.id === currentQuestion.id);
    return {
      correct: currentQuestion.correct,
      correctAnswer: question ? getCorrectAnswer(question) : "",
      nextQuestion:
        playerState.currentQuestionIndex < playerState.questions.length - 1,
      rank: await calculatePlayerRank(game, userId),
    };
  }

  // Get the question details
  const question = cityClues.find((q) => q.id === currentQuestion.id);
  if (!question) {
    return {
      correct: false,
      correctAnswer: "",
      nextQuestion: false,
      rank: null,
    };
  }

  // Get correct answer
  const correctAnswer = getCorrectAnswer(question);

  // Check if the selected option is correct
  const isCorrect = selectedOption === correctAnswer;

  // Update the player state
  currentQuestion.answered = true;
  currentQuestion.correct = isCorrect;
  currentQuestion.selectedOption = selectedOption;
  playerState.totalAnswered += 1;

  if (isCorrect) {
    playerState.totalCorrect += 1;
  }

  // Calculate the new score
  playerState.score =
    playerState.totalAnswered > 0
      ? Math.round(
          (playerState.totalCorrect / playerState.totalAnswered) * 100
        ) / 100
      : 0;

  // Move to the next question
  const hasNextQuestion =
    playerState.currentQuestionIndex < playerState.questions.length - 1;
  if (hasNextQuestion) {
    playerState.currentQuestionIndex += 1;
  } else {
    playerState.completed = true;
  }

  // Check if all players have completed the game
  const allCompleted = game.players.every(
    (playerId) =>
      game.playerStates[playerId] && game.playerStates[playerId].completed
  );

  if (allCompleted) {
    game.status = "completed";
    game.endTime = Date.now();
  }

  // Store updated game
  const gameKey = `multiplayer:game:${gameId}`;
  await redis.set(gameKey, JSON.stringify(game), {ex: MULTIPLAYER_SESSION_TTL});

  // Calculate player's rank
  const rankInfo = await calculatePlayerRank(game, userId);

  return {
    correct: isCorrect,
    correctAnswer,
    nextQuestion: hasNextQuestion,
    rank: rankInfo,
  };
}

// Calculate player's rank in the game
async function calculatePlayerRank(
  game: MultiplayerGame,
  userId: string
): Promise<{rank: number; totalPlayers: number} | null> {
  if (!game.players.includes(userId)) return null;

  // Sort players by score and then by total answered
  const sortedPlayers = [...game.players].sort((a, b) => {
    const stateA = game.playerStates[a];
    const stateB = game.playerStates[b];

    if (stateA.score !== stateB.score) {
      return stateB.score - stateA.score; // Higher score first
    }

    if (stateA.totalCorrect !== stateB.totalCorrect) {
      return stateB.totalCorrect - stateA.totalCorrect; // More correct answers first
    }

    return stateA.totalAnswered - stateB.totalAnswered; // Fewer questions answered first (efficiency)
  });

  const playerRank = sortedPlayers.indexOf(userId) + 1; // 1-based ranking

  return {
    rank: playerRank,
    totalPlayers: game.players.length,
  };
}

// Get leaderboard for a game
export async function getMultiplayerLeaderboard(
  gameId: string
): Promise<LeaderboardEntry[]> {
  const game = await getMultiplayerGame(gameId);

  if (!game) return [];

  // Create leaderboard entries from player states
  const entries: LeaderboardEntry[] = game.players.map((playerId) => {
    const state = game.playerStates[playerId];
    return {
      userId: playerId,
      score: state.score,
      totalCorrect: state.totalCorrect,
      totalAnswered: state.totalAnswered,
      completionTime: state.completed ? Date.now() - game.startTime : undefined,
    };
  });

  // Sort entries: highest score first, then by completion time if available
  entries.sort((a, b) => {
    if (a.score !== b.score) return b.score - a.score;
    if (a.completionTime && b.completionTime)
      return a.completionTime - b.completionTime;
    return 0;
  });

  return entries;
}

// Get available games to join
export async function getAvailableMultiplayerGames(): Promise<
  MultiplayerGame[]
> {
  const keys = await redis.keys("multiplayer:game:*");
  const games: MultiplayerGame[] = [];

  for (const key of keys) {
    const game = await redis.get(key);
    if (game) {
      try {
        const parsedGame =
          typeof game === "string"
            ? (JSON.parse(game) as MultiplayerGame)
            : (game as MultiplayerGame);
        if (
          parsedGame.status === "waiting" &&
          parsedGame.players.length < parsedGame.maxPlayers
        ) {
          games.push(parsedGame);
        }
      } catch (error) {
        console.error("Failed to parse game:", error);
      }
    }
  }

  return games;
}

// Skip the current question in multiplayer game
export async function skipMultiplayerQuestion(
  userId: string,
  gameId: string
): Promise<{
  nextQuestion: boolean;
  rank: {rank: number; totalPlayers: number} | null;
}> {
  const game = await getMultiplayerGame(gameId);

  if (!game || !game.players.includes(userId)) {
    return {
      nextQuestion: false,
      rank: null,
    };
  }

  const playerState = game.playerStates[userId];
  if (!playerState || playerState.completed) {
    return {
      nextQuestion: false,
      rank: null,
    };
  }

  // If already at the end, no more questions to skip
  if (playerState.currentQuestionIndex >= playerState.questions.length - 1) {
    playerState.completed = true;

    // Check if all players have completed
    const allCompleted = game.players.every(
      (playerId) =>
        game.playerStates[playerId] && game.playerStates[playerId].completed
    );

    if (allCompleted) {
      game.status = "completed";
      game.endTime = Date.now();
    }

    // Store updated game
    const gameKey = `multiplayer:game:${gameId}`;
    await redis.set(gameKey, JSON.stringify(game), {
      ex: MULTIPLAYER_SESSION_TTL,
    });

    return {
      nextQuestion: false,
      rank: await calculatePlayerRank(game, userId),
    };
  }

  // Move to the next question
  playerState.currentQuestionIndex += 1;

  // Store updated game
  const gameKey = `multiplayer:game:${gameId}`;
  await redis.set(gameKey, JSON.stringify(game), {ex: MULTIPLAYER_SESSION_TTL});

  return {
    nextQuestion:
      playerState.currentQuestionIndex < playerState.questions.length - 1,
    rank: await calculatePlayerRank(game, userId),
  };
}


// Calculate a player's rank in a multiplayer game
export async function getUserRank(
  gameId: string,
  userId: string
): Promise<{ rank: number; totalPlayers: number } | null> {
  const game = await getMultiplayerGame(gameId);

  if (!game || !game.players.includes(userId)) {
    return null;
  }

  // Get all player scores
  const playerScores = Object.values(game.playerStates).map((player) => ({
    userId: player.userId,
    score: player.score,
  }));

  // Sort scores in descending order
  playerScores.sort((a, b) => b.score - a.score);

  // Find the user's rank (1-based index)
  const rank = playerScores.findIndex((player) => player.userId === userId) + 1;

  return {
    rank,
    totalPlayers: playerScores.length,
  };
}

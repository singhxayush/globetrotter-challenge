import {redis} from "@/lib/redis";
import {GameSession, GameQuestion} from "../types/single_player";
import {cityClues, DummyOptions, CityClue} from "@/data/dummy_data";

const SESSION_TTL = 900; // 15 min
const QUESTIONS_PER_GAME = 15;

// Helper to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Helper to get correct answer format
function getCorrectAnswer(cityClue: CityClue): string {
  return `${cityClue.city}, ${cityClue.country}`;
}

// Helper to generate options for a question
function generateOptions(correctAnswer: string): string[] {
  // Get 3 random options that aren't the correct answer
  const filteredOptions = DummyOptions.filter(
    (option) => option !== correctAnswer
  );
  const randomOptions = shuffleArray(filteredOptions).slice(0, 3);

  // Add correct answer and shuffle
  const allOptions = [...randomOptions, correctAnswer];
  return shuffleArray(allOptions);
}

// Create a new game sesstion
// Delete any existing session
// {todo} Or may be ask a user to continue with existing session or start a new one
export async function createGameSession(userId: string): Promise<GameSession> {
  // Check if a session already exists and delete it
  // Redundant - because new sesssion will set new data as value to the session key(userID) replacing the old data.
  // No need to delete explicitly.
  // await deleteGameSession(userId);

  // Select 15 random questions from the dummy data
  const totalQuestions = cityClues.length;
  const questionIds = Array.from({length: totalQuestions}, (_, i) => i + 1);
  const selectedIds = shuffleArray(questionIds).slice(0, QUESTIONS_PER_GAME);

  // Create question array for the game session
  const questions: GameQuestion[] = selectedIds.map((id) => ({
    id,
    answered: false,
    correct: false,
    selectedOption: null,
  }));

  // Create a new session sr
  const newSession: GameSession = {
    userId,
    startTime: Date.now(),
    questions,
    currentQuestionIndex: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    score: 0,
    active: true,
  };

  // Store in Redis with TTL
  const sessionKey = `game:session:${userId}`;
  await redis.set(sessionKey, JSON.stringify(newSession), {
    ex: SESSION_TTL,
  });

  return newSession;
}

export async function getGameSession(
  userId: string
): Promise<GameSession | null> {
  // console.log("#getGameSession");
  // console.log("USER_ID:", userId);

  const sessionKey = `game:session:${userId}`;
  // console.log("SESSION_KEY:", sessionKey);

  const session = await redis.get(sessionKey);
  // console.log("SESSION:", session);

  if (!session) return null;

  if (typeof session === "object") {
    return session as GameSession; // Already parsed, return directly
  }

  if (typeof session === "string") {
    try {
      return JSON.parse(session) as GameSession; // Parse if it's JSON
    } catch (error) {
      console.error("Failed to parse session JSON:", error);
      return null;
    }
  }

  console.error("Unexpected session format:", typeof session);
  return null; // Catch-all for any weird cases
}

// Delete a game session
export async function deleteGameSession(userId: string): Promise<void> {
  const sessionKey = `game:session:${userId}`;
  await redis.del(sessionKey);
}

// Get current question for user
export async function getCurrentQuestion(userId: string): Promise<{
  question: CityClue | null;
  options: string[] | null;
  questionNumber: number | null;
  totalQuestions: number | null;
}> {
  const session = await getGameSession(userId);

  if (
    !session ||
    !session.active ||
    session.currentQuestionIndex >= session.questions.length
  ) {
    return {
      question: null,
      options: null,
      questionNumber: null,
      totalQuestions: null,
    };
  }

  const currentQuestionId = session.questions[session.currentQuestionIndex].id;
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
    questionNumber: session.currentQuestionIndex + 1,
    totalQuestions: session.questions.length,
  };
}

// Submit an answer for the current question
export async function submitAnswer(
  userId: string,
  selectedOption: string
): Promise<{
  correct: boolean;
  correctAnswer: string;
  session: GameSession | null;
  nextQuestion: boolean;
}> {
  const session = await getGameSession(userId);
  if (!session || !session.active) {
    return {
      correct: false,
      correctAnswer: "",
      session: null,
      nextQuestion: false,
    };
  }

  // Get the current question
  if (session.currentQuestionIndex >= session.questions.length) {
    return {
      correct: false,
      correctAnswer: "",
      session,
      nextQuestion: false,
    };
  }

  const currentQuestion = session.questions[session.currentQuestionIndex];

  // If already answered, return the current state
  if (currentQuestion.answered) {
    const question = cityClues.find((q) => q.id === currentQuestion.id);
    return {
      correct: currentQuestion.correct,
      correctAnswer: question ? getCorrectAnswer(question) : "",
      session,
      nextQuestion: false,
    };
  }

  // Get the question details
  const question = cityClues.find((q) => q.id === currentQuestion.id);
  if (!question) {
    return {
      correct: false,
      correctAnswer: "",
      session,
      nextQuestion: false,
    };
  }

  // Get correct answer
  const correctAnswer = getCorrectAnswer(question);

  // Check if the selected option is correct
  const isCorrect = selectedOption === correctAnswer;

  // Update the session
  currentQuestion.answered = true;
  currentQuestion.correct = isCorrect;
  currentQuestion.selectedOption = selectedOption;
  session.totalAnswered += 1;

  if (isCorrect) {
    session.totalCorrect += 1;
  }

  // Calculate the new score
  session.score =
    session.totalAnswered > 0
      ? Math.round((session.totalCorrect / session.totalAnswered) * 100) / 100
      : 0;

  // Move to the next question
  const hasNextQuestion =
    session.currentQuestionIndex < session.questions.length - 1;
  // if (hasNextQuestion) {
  //   session.currentQuestionIndex += 1;
  // }

  // Store updated session
  const sessionKey = `game:session:${userId}`;
  await redis.set(sessionKey, JSON.stringify(session), {ex: SESSION_TTL});

  return {
    correct: isCorrect,
    correctAnswer,
    session,
    nextQuestion: hasNextQuestion,
  };
}

// End a game session
export async function endGameSession(userId: string): Promise<void> {
  const session = await getGameSession(userId);
  if (!session) return;

  session.active = false;

  const sessionKey = `game:session:${userId}`;
  await redis.set(sessionKey, JSON.stringify(session), {ex: SESSION_TTL});
}

// Add this to src/actions/game.ts

// Skip the current question
export async function skipCurrentQuestion(userId: string): Promise<{
  session: GameSession | null;
  nextQuestion: boolean;
}> {
  const session = await getGameSession(userId);
  if (!session || !session.active) {
    return {
      session: null,
      nextQuestion: false,
    };
  }

  // If we're already at the end, no more questions to skip
  if (session.currentQuestionIndex >= session.questions.length - 1) {
    return {
      session,
      nextQuestion: false,
    };
  }

  // Move to the next question
  session.currentQuestionIndex += 1;

  // Store updated session
  const sessionKey = `game:session:${userId}`;
  await redis.set(sessionKey, JSON.stringify(session), {ex: SESSION_TTL});

  return {
    session,
    nextQuestion: session.currentQuestionIndex < session.questions.length - 1,
  };
}

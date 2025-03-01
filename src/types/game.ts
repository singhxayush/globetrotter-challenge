export interface GameQuestion {
  id: number;
  answered: boolean;
  correct: boolean;
  selectedOption: string | null;
}

export interface GameSession {
  userId: string;
  startTime: number;
  questions: GameQuestion[];
  currentQuestionIndex: number;
  totalAnswered: number;
  totalCorrect: number;
  score: number;
  active: boolean;
}

// New types for multiplayer
export interface MultiplayerGame {
  gameId: string;
  createdBy: string;
  startTime: number | null;
  endTime: number | null;
  players: string[];
  status: "waiting" | "active" | "completed";
  maxPlayers: number;
  questions: number[]; // Array of question IDs
}

export interface LeaderboardEntry {
  userId: string;
  score: number;
  totalCorrect: number;
  totalAnswered: number;
  completionTime?: number; // Time taken to complete the game
}

export interface Leaderboard {
  gameId: string;
  entries: LeaderboardEntry[];
  lastUpdated: number;
}

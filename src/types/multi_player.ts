// Game status enum
export enum GameStatus {
  WAITING = "waiting",
  ACTIVE = "active",
  COMPLETED = "completed",
}

// Minimal multiplayer game session
export interface MultiplayerGameSession {
  gameId: string;
  hostId: string;
  hostDisplayName: string;
  status: GameStatus;
  startTime: number | null;
  questions: number[];
}

// Leaderboard entry for Redis ZSET
export interface LeaderboardEntry {
  userId: string;
  userDisplayName: string;
  totalAttempted: number;
}

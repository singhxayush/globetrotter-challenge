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

export enum GameStatus {
  PENDING = 'PENDING',
  DUE = 'DUE',
  ANSWERED_CORRECT = 'ANSWERED_CORRECT',
  ANSWERED_INCORRECT = 'ANSWERED_INCORRECT',
}

export interface GameEntry {
  id: string;
  question: string;
  correctAnswer: string;
  submittedAnswer?: string;
  setDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  answeredDate?: string; // YYYY-MM-DD
  status: GameStatus;
  delayDays: number;
}

export interface GameState {
  hasOnboarded: boolean;
  currentStreak: number;
  longestStreak: number;
  games: GameEntry[];
  unlockedAchievements: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isSecret?: boolean; // For hidden achievements
}

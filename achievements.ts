
import { Achievement } from './types';

export const ACHIEVEMENTS: Achievement[] = [
  // Onboarding & Firsts
  { id: 'first_question', icon: '🌱', title: 'First Step', description: 'You set your first observation question.' },
  { id: 'first_answer', icon: '✅', title: 'Recaller', description: 'You answered your first question correctly.' },

  // Streaks
  { id: 'streak_3', icon: '🥉', title: 'Getting Started', description: 'Achieved a 3-day streak.' },
  { id: 'streak_7', icon: '🥈', title: 'Perfect Week', description: 'Achieved a 7-day streak.' },
  { id: 'streak_14', icon: '🥇', title: 'Fortnight', description: 'Achieved a 14-day streak.' },
  { id: 'streak_30', icon: '🏆', title: 'Mind Palace', description: 'Achieved a 30-day streak.' },

  // Question Setting
  { id: 'set_10', icon: '✍️', title: 'Scribe', description: 'Set 10 questions.' },
  { id: 'set_25', icon: '📜', title: 'Chronicler', description: 'Set 25 questions.' },
  { id: 'set_50', icon: '📚', title: 'Librarian', description: 'Set 50 questions.' },

  // Long Recall
  { id: 'recall_7', icon: '🧠', title: 'Time Traveler', description: 'Correctly recalled a 7-day old memory.' },
  { id: 'recall_14', icon: '✨', title: 'Deep Memory', description: 'Correctly recalled a 14-day old memory.' },
  
  // Total Correct
  { id: 'correct_10', icon: '🎯', title: 'Sharp Shooter', description: 'Answered 10 questions correctly.' },
  { id: 'correct_25', icon: '🧐', title: 'Observer', description: 'Answered 25 questions correctly.' },
  { id: 'correct_50', icon: '🦉', title: 'Wise Owl', description: 'Answered 50 questions correctly.' },
];

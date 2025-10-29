
import { useState, useEffect, useCallback, useMemo } from 'react';
import { GameState, GameEntry, GameStatus, Achievement } from '../types';
import { LOCAL_STORAGE_KEY, MILESTONES } from '../constants';
import { ACHIEVEMENTS } from '../achievements';


const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const addDays = (dateStr: string, days: number): string => {
  // Parse the date string as local time by appending T00:00:00
  const date = new Date(`${dateStr}T00:00:00`);
  date.setDate(date.getDate() + days);
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


const getInitialState = (): GameState => {
  try {
    const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (item) {
      const state = JSON.parse(item) as GameState;
      // Check for due questions on load
      const today = getTodayDateString();
      state.games = state.games.map(game => {
        if (game.status === GameStatus.PENDING && game.dueDate <= today) {
          return { ...game, status: GameStatus.DUE };
        }
        return game;
      });
      // Ensure unlockedAchievements exists
      if (!state.unlockedAchievements) {
        state.unlockedAchievements = [];
      }
      return state;
    }
  } catch (error) {
    console.error("Error reading from localStorage", error);
  }
  return {
    hasOnboarded: false,
    currentStreak: 0,
    longestStreak: 0,
    games: [],
    unlockedAchievements: [],
  };
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(getInitialState);
  const [streakMilestone, setStreakMilestone] = useState<{ newLongest: boolean; milestone: number | null } | null>(null);
  const [newlyUnlockedAchievement, setNewlyUnlockedAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [gameState]);
  
  const unlockedAchievements = useMemo(() => {
    return ACHIEVEMENTS.filter(ach => gameState.unlockedAchievements.includes(ach.id))
      .sort((a, b) => gameState.unlockedAchievements.indexOf(b.id) - gameState.unlockedAchievements.indexOf(a.id));
  }, [gameState.unlockedAchievements]);

  const dueGames = useMemo(() => {
    const today = getTodayDateString();
    return gameState.games
      .filter(g => 
        g.status === GameStatus.DUE || 
        (g.answeredDate === today && (g.status === GameStatus.ANSWERED_CORRECT || g.status === GameStatus.ANSWERED_INCORRECT))
      )
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [gameState.games]);

  const pendingGames = useMemo(() =>
    gameState.games.filter(g => g.status === GameStatus.PENDING).sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [gameState.games]
  );

  const answeredGames = useMemo(() =>
    gameState.games
      .filter(g => g.status === GameStatus.ANSWERED_CORRECT || g.status === GameStatus.ANSWERED_INCORRECT)
      .sort((a, b) => b.answeredDate!.localeCompare(a.answeredDate!)),
    [gameState.games]
  );

  const completeOnboarding = useCallback(() => {
    setGameState(prev => ({ ...prev, hasOnboarded: true }));
  }, []);

  const checkForAchievements = (currentState: GameState): GameState => {
    const newlyUnlocked: string[] = [];
    const { games, currentStreak, unlockedAchievements } = currentState;
    const correctGames = games.filter(g => g.status === GameStatus.ANSWERED_CORRECT);

    const unlock = (id: string) => {
        if (!unlockedAchievements.includes(id) && !newlyUnlocked.includes(id)) {
            newlyUnlocked.push(id);
        }
    };

    // Firsts
    if (games.length > 0) unlock('first_question');
    if (correctGames.length > 0) unlock('first_answer');

    // Question setting
    if (games.length >= 10) unlock('set_10');
    if (games.length >= 25) unlock('set_25');
    if (games.length >= 50) unlock('set_50');

    // Correct answers
    if (correctGames.length >= 10) unlock('correct_10');
    if (correctGames.length >= 25) unlock('correct_25');
    if (correctGames.length >= 50) unlock('correct_50');

    // Streaks
    if (currentStreak >= 3) unlock('streak_3');
    if (currentStreak >= 7) unlock('streak_7');
    if (currentStreak >= 14) unlock('streak_14');
    if (currentStreak >= 30) unlock('streak_30');

    // Long recall
    if (correctGames.some(g => g.delayDays >= 7)) unlock('recall_7');
    if (correctGames.some(g => g.delayDays >= 14)) unlock('recall_14');
    
    if (newlyUnlocked.length > 0) {
        const firstUnlocked = ACHIEVEMENTS.find(a => a.id === newlyUnlocked[0]);
        if(firstUnlocked) setNewlyUnlockedAchievement(firstUnlocked);
        return { ...currentState, unlockedAchievements: [...unlockedAchievements, ...newlyUnlocked] };
    }
    
    return currentState;
  };

  const setQuestion = useCallback((question: string, answer: string, delayDays: number) => {
    const today = getTodayDateString();
    const newGame: GameEntry = {
      id: `game-${Date.now()}`,
      question,
      correctAnswer: answer,
      setDate: today,
      dueDate: addDays(today, delayDays),
      status: delayDays === 0 ? GameStatus.DUE : GameStatus.PENDING,
      delayDays,
    };
    setGameState(prev => {
        const newState = { ...prev, games: [...prev.games, newGame] };
        return checkForAchievements(newState);
    });
  }, []);
  
  const submitAnswer = useCallback((gameId: string, answer: string) => {
    const gameToAnswer = gameState.games.find(g => g.id === gameId);
    if (!gameToAnswer || gameToAnswer.status !== GameStatus.DUE) return;

    const isCorrect = answer.trim().toLowerCase() === gameToAnswer.correctAnswer.trim().toLowerCase();
    const newStatus = isCorrect ? GameStatus.ANSWERED_CORRECT : GameStatus.ANSWERED_INCORRECT;
    
    const updatedGame: GameEntry = {
      ...gameToAnswer,
      submittedAnswer: answer,
      status: newStatus,
      answeredDate: getTodayDateString(),
    };
    
    setGameState(prev => {
      const newStreak = isCorrect ? prev.currentStreak + 1 : 0;
      const newLongestStreak = Math.max(prev.longestStreak, newStreak);

      if (isCorrect) {
          const isNewLongest = newStreak > prev.longestStreak;
          const hitMilestone = MILESTONES.includes(newStreak);
          if (isNewLongest || hitMilestone) {
              setStreakMilestone({ newLongest: isNewLongest, milestone: hitMilestone ? newStreak : null });
          }
      }

      const newState = {
        ...prev,
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        games: prev.games.map(g => g.id === gameId ? updatedGame : g)
      };
      
      return checkForAchievements(newState);
    });
  }, [gameState.games]);

  const clearStreakMilestone = useCallback(() => {
    setStreakMilestone(null);
  }, []);

  const clearNewlyUnlockedAchievement = useCallback(() => {
    setNewlyUnlockedAchievement(null);
  }, []);

  return { 
      gameState, 
      dueGames, 
      pendingGames, 
      answeredGames, 
      unlockedAchievements,
      completeOnboarding, 
      setQuestion, 
      submitAnswer, 
      streakMilestone, 
      clearStreakMilestone,
      newlyUnlockedAchievement,
      clearNewlyUnlockedAchievement
    };
};

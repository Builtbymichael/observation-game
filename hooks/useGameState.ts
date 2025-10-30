"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { type GameState, type GameEntry, GameStatus, type Achievement } from "../types"
import { LOCAL_STORAGE_KEY, MILESTONES } from "../constants"
import { ACHIEVEMENTS } from "../achievements"
import {
  getUserStats,
  getObservations,
  saveObservation,
  updateObservation,
  updateUserStats,
  migrateLocalStorageData,
} from "@/lib/actions/game-actions"

const getTodayDateString = (): string => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const addDays = (dateStr: string, days: number): string => {
  // Parse the date string as local time by appending T00:00:00
  const date = new Date(`${dateStr}T00:00:00`)
  date.setDate(date.getDate() + days)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const getInitialState = (): GameState => {
  try {
    const item = window.localStorage.getItem(LOCAL_STORAGE_KEY)
    if (item) {
      const state = JSON.parse(item) as GameState
      // Check for due questions on load
      const today = getTodayDateString()
      state.games = state.games.map((game) => {
        if (game.status === GameStatus.PENDING && game.dueDate <= today) {
          return { ...game, status: GameStatus.DUE }
        }
        return game
      })
      // Ensure unlockedAchievements exists
      if (!state.unlockedAchievements) {
        state.unlockedAchievements = []
      }
      return state
    }
  } catch (error) {
    console.error("Error reading from localStorage", error)
  }
  return {
    hasOnboarded: false,
    currentStreak: 0,
    longestStreak: 0,
    games: [],
    unlockedAchievements: [],
  }
}

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(getInitialState)
  const [isLoading, setIsLoading] = useState(true)
  const [streakMilestone, setStreakMilestone] = useState<{ newLongest: boolean; milestone: number | null } | null>(null)
  const [newlyUnlockedAchievement, setNewlyUnlockedAchievement] = useState<Achievement | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [stats, observations] = await Promise.all([getUserStats(), getObservations()])

        const today = getTodayDateString()
        const updatedObservations = observations.map((game) => {
          if (game.status === GameStatus.PENDING && game.dueDate <= today) {
            return { ...game, status: GameStatus.DUE }
          }
          return game
        })

        const dbState: GameState = {
          hasOnboarded: stats.hasOnboarded,
          currentStreak: stats.currentStreak,
          longestStreak: stats.longestStreak,
          games: updatedObservations,
          unlockedAchievements: stats.unlockedAchievements,
        }

        const localData = getInitialState()
        if (localData.games.length > 0 && observations.length === 0) {
          console.log("[v0] Migrating localStorage data to database...")
          await migrateLocalStorageData(localData)
          const [newStats, newObservations] = await Promise.all([getUserStats(), getObservations()])
          setGameState({
            hasOnboarded: newStats.hasOnboarded,
            currentStreak: newStats.currentStreak,
            longestStreak: newStats.longestStreak,
            games: newObservations,
            unlockedAchievements: newStats.unlockedAchievements,
          })
          window.localStorage.removeItem(LOCAL_STORAGE_KEY)
        } else {
          setGameState(dbState)
        }
      } catch (error) {
        console.error("[v0] Error loading data from database:", error)
        setGameState(getInitialState())
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    if (!isLoading) {
      try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState))
      } catch (error) {
        console.error("Error writing to localStorage", error)
      }
    }
  }, [gameState, isLoading])

  const unlockedAchievements = useMemo(() => {
    return ACHIEVEMENTS.filter((ach) => gameState.unlockedAchievements.includes(ach.id)).sort(
      (a, b) => gameState.unlockedAchievements.indexOf(b.id) - gameState.unlockedAchievements.indexOf(a.id),
    )
  }, [gameState.unlockedAchievements])

  const dueGames = useMemo(() => {
    const today = getTodayDateString()
    return gameState.games
      .filter(
        (g) =>
          g.status === GameStatus.DUE ||
          (g.answeredDate === today &&
            (g.status === GameStatus.ANSWERED_CORRECT || g.status === GameStatus.ANSWERED_INCORRECT)),
      )
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  }, [gameState.games])

  const pendingGames = useMemo(
    () =>
      gameState.games.filter((g) => g.status === GameStatus.PENDING).sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [gameState.games],
  )

  const answeredGames = useMemo(
    () =>
      gameState.games
        .filter((g) => g.status === GameStatus.ANSWERED_CORRECT || g.status === GameStatus.ANSWERED_INCORRECT)
        .sort((a, b) => b.answeredDate!.localeCompare(a.answeredDate!)),
    [gameState.games],
  )

  const completeOnboarding = useCallback(() => {
    setGameState((prev) => {
      const newState = { ...prev, hasOnboarded: true }
      updateUserStats({
        currentStreak: newState.currentStreak,
        longestStreak: newState.longestStreak,
        hasOnboarded: true,
        unlockedAchievements: newState.unlockedAchievements,
      }).catch((err) => console.error("[v0] Error updating onboarding:", err))
      return newState
    })
  }, [])

  const checkForAchievements = (currentState: GameState): GameState => {
    const newlyUnlocked: string[] = []
    const { games, currentStreak, unlockedAchievements } = currentState
    const correctGames = games.filter((g) => g.status === GameStatus.ANSWERED_CORRECT)

    const unlock = (id: string) => {
      if (!unlockedAchievements.includes(id) && !newlyUnlocked.includes(id)) {
        newlyUnlocked.push(id)
      }
    }

    if (games.length > 0) unlock("first_question")
    if (correctGames.length > 0) unlock("first_answer")

    if (games.length >= 10) unlock("set_10")
    if (games.length >= 25) unlock("set_25")
    if (games.length >= 50) unlock("set_50")

    if (correctGames.length >= 10) unlock("correct_10")
    if (correctGames.length >= 25) unlock("correct_25")
    if (correctGames.length >= 50) unlock("correct_50")

    if (currentStreak >= 3) unlock("streak_3")
    if (currentStreak >= 7) unlock("streak_7")
    if (currentStreak >= 14) unlock("streak_14")
    if (currentStreak >= 30) unlock("streak_30")

    if (correctGames.some((g) => g.delayDays >= 7)) unlock("recall_7")
    if (correctGames.some((g) => g.delayDays >= 14)) unlock("recall_14")

    if (newlyUnlocked.length > 0) {
      const firstUnlocked = ACHIEVEMENTS.find((a) => a.id === newlyUnlocked[0])
      if (firstUnlocked) setNewlyUnlockedAchievement(firstUnlocked)
      return { ...currentState, unlockedAchievements: [...unlockedAchievements, ...newlyUnlocked] }
    }

    return currentState
  }

  const setQuestion = useCallback((question: string, answer: string, delayDays: number) => {
    const today = getTodayDateString()
    const newGame: GameEntry = {
      id: `game-${Date.now()}`,
      question,
      correctAnswer: answer,
      setDate: today,
      dueDate: addDays(today, delayDays),
      status: delayDays === 0 ? GameStatus.DUE : GameStatus.PENDING,
      delayDays,
    }
    setGameState((prev) => {
      const newState = { ...prev, games: [...prev.games, newGame] }
      const stateWithAchievements = checkForAchievements(newState)

      saveObservation(newGame).catch((err) => console.error("[v0] Error saving observation:", err))

      if (stateWithAchievements.unlockedAchievements !== newState.unlockedAchievements) {
        updateUserStats({
          currentStreak: stateWithAchievements.currentStreak,
          longestStreak: stateWithAchievements.longestStreak,
          unlockedAchievements: stateWithAchievements.unlockedAchievements,
        }).catch((err) => console.error("[v0] Error updating achievements:", err))
      }

      return stateWithAchievements
    })
  }, [])

  const submitAnswer = useCallback(
    (gameId: string, answer: string) => {
      const gameToAnswer = gameState.games.find((g) => g.id === gameId)
      if (!gameToAnswer || gameToAnswer.status !== GameStatus.DUE) return

      const isCorrect = answer.trim().toLowerCase() === gameToAnswer.correctAnswer.trim().toLowerCase()
      const newStatus = isCorrect ? GameStatus.ANSWERED_CORRECT : GameStatus.ANSWERED_INCORRECT

      const updatedGame: GameEntry = {
        ...gameToAnswer,
        submittedAnswer: answer,
        status: newStatus,
        answeredDate: getTodayDateString(),
      }

      setGameState((prev) => {
        const newStreak = isCorrect ? prev.currentStreak + 1 : 0
        const newLongestStreak = Math.max(prev.longestStreak, newStreak)

        if (isCorrect) {
          const isNewLongest = newStreak > prev.longestStreak
          const hitMilestone = MILESTONES.includes(newStreak)
          if (isNewLongest || hitMilestone) {
            setStreakMilestone({ newLongest: isNewLongest, milestone: hitMilestone ? newStreak : null })
          }
        }

        const newState = {
          ...prev,
          currentStreak: newStreak,
          longestStreak: newLongestStreak,
          games: prev.games.map((g) => (g.id === gameId ? updatedGame : g)),
        }

        const stateWithAchievements = checkForAchievements(newState)

        updateObservation(updatedGame).catch((err) => console.error("[v0] Error updating observation:", err))
        updateUserStats({
          currentStreak: stateWithAchievements.currentStreak,
          longestStreak: stateWithAchievements.longestStreak,
          unlockedAchievements: stateWithAchievements.unlockedAchievements,
        }).catch((err) => console.error("[v0] Error updating stats:", err))

        return stateWithAchievements
      })
    },
    [gameState.games],
  )

  const clearStreakMilestone = useCallback(() => {
    setStreakMilestone(null)
  }, [])

  const clearNewlyUnlockedAchievement = useCallback(() => {
    setNewlyUnlockedAchievement(null)
  }, [])

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
    clearNewlyUnlockedAchievement,
    isLoading,
  }
}

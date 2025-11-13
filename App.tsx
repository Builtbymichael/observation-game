"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useGameState } from "./hooks/useGameState"
import { Header } from "./components/Header"
import { OnboardingFlow } from "./components/OnboardingFlow"
import { StreakMilestoneAnimation } from "./components/StreakMilestoneAnimation"
import { DashboardView } from "./components/DashboardView"
import { AchievementUnlockedToast } from "./components/AchievementUnlockedToast"
import { getUserProfile } from "./lib/actions/game-actions"

const Stat: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex flex-col items-center">
    <span className="text-3xl font-serif">{value}</span>
    <span className="text-xs text-muted-foreground uppercase tracking-widest">{label}</span>
  </div>
)

const App: React.FC = () => {
  const {
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
  } = useGameState()

  const [userName, setUserName] = useState<string>("there")

  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("observation-game-theme")
      if (storedTheme) return storedTheme
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    return "light"
  })

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const profile = await getUserProfile()
        if (profile?.name) {
          setUserName(profile.name)
        }
      } catch (error) {
        console.error("Failed to fetch user name", error)
      }
    }
    fetchUserName()
  }, [])

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.toggle("dark", theme === "dark")
    localStorage.setItem("observation-game-theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
        </div>
      )
    }

    if (!gameState.hasOnboarded) {
      return <OnboardingFlow onComplete={completeOnboarding} />
    }

    return (
      <DashboardView
        dueGames={dueGames}
        pendingGames={pendingGames}
        answeredGames={answeredGames}
        unlockedAchievements={unlockedAchievements}
        onQuestionSet={setQuestion}
        onSubmitAnswer={submitAnswer}
        userName={userName}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center pt-8 font-sans transition-colors duration-300">
      {streakMilestone && (
        <StreakMilestoneAnimation
          newLongest={streakMilestone.newLongest}
          milestone={streakMilestone.milestone}
          currentStreak={gameState.currentStreak}
          onComplete={clearStreakMilestone}
        />
      )}
      {newlyUnlockedAchievement && (
        <AchievementUnlockedToast achievement={newlyUnlockedAchievement} onClose={clearNewlyUnlockedAchievement} />
      )}
      <Header onToggleTheme={toggleTheme} currentTheme={theme} />
      <main className="w-full flex-grow flex items-start justify-center pt-20 pb-16">{renderContent()}</main>
      <footer className="w-full max-w-lg mx-auto text-center text-muted-foreground p-4 text-sm mt-auto">
        <div className="flex justify-center space-x-12 mb-4">
          <Stat label="Streak" value={gameState.currentStreak} />
          <Stat label="Max Streak" value={gameState.longestStreak} />
        </div>
      </footer>
    </div>
  )
}

export default App

"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { GameEntry, GameStatus } from "@/types"

export async function getUserProfile() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return profile
}

export async function getUserStats() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data: stats } = await supabase.from("user_stats").select("*").eq("user_id", user.id).maybeSingle()

  if (!stats) {
    // Create initial stats
    const { data: newStats } = await supabase
      .from("user_stats")
      .insert({
        user_id: user.id,
        current_streak: 0,
        longest_streak: 0,
        unlocked_achievements: [],
        has_onboarded: false,
      })
      .select()
      .single()

    return {
      currentStreak: 0,
      longestStreak: 0,
      unlockedAchievements: [],
      hasOnboarded: false,
    }
  }

  return {
    currentStreak: stats.current_streak,
    longestStreak: stats.longest_streak,
    unlockedAchievements: stats.unlocked_achievements || [],
    hasOnboarded: stats.has_onboarded,
  }
}

export async function getObservations(): Promise<GameEntry[]> {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data: observations, error } = await supabase
    .from("observations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) throw error

  return (observations || []).map((obs) => ({
    id: obs.id,
    question: obs.question,
    correctAnswer: obs.correct_answer,
    submittedAnswer: obs.submitted_answer,
    setDate: obs.set_date,
    dueDate: obs.due_date,
    answeredDate: obs.answered_date,
    status: obs.status as GameStatus,
    delayDays: obs.delay_days,
  }))
}

export async function createObservation(observation: Omit<GameEntry, "id">) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("observations")
    .insert({
      user_id: user.id,
      question: observation.question,
      correct_answer: observation.correctAnswer,
      set_date: observation.setDate,
      due_date: observation.dueDate,
      status: observation.status,
      delay_days: observation.delayDays,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/")
  return data
}

export async function saveObservation(observation: GameEntry) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("observations")
    .insert({
      user_id: user.id,
      question: observation.question,
      correct_answer: observation.correctAnswer,
      submitted_answer: observation.submittedAnswer,
      set_date: observation.setDate,
      due_date: observation.dueDate,
      answered_date: observation.answeredDate,
      status: observation.status,
      delay_days: observation.delayDays,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath("/")
  return data
}

export async function updateObservation(observation: GameEntry) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("observations")
    .update({
      submitted_answer: observation.submittedAnswer,
      status: observation.status,
      answered_date: observation.answeredDate,
    })
    .eq("id", observation.id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/")
  return data
}

export async function updateUserStats(stats: {
  currentStreak?: number
  longestStreak?: number
  unlockedAchievements?: string[]
  hasOnboarded?: boolean
}) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  const { data, error } = await supabase
    .from("user_stats")
    .update({
      current_streak: stats.currentStreak,
      longest_streak: stats.longestStreak,
      unlocked_achievements: stats.unlockedAchievements,
      has_onboarded: stats.hasOnboarded,
    })
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) throw error

  revalidatePath("/")
  return data
}

export async function migrateLocalStorageData(localData: {
  hasOnboarded: boolean
  currentStreak: number
  longestStreak: number
  games: GameEntry[]
  unlockedAchievements: string[]
}) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Not authenticated")
  }

  // Update user stats
  await supabase
    .from("user_stats")
    .update({
      current_streak: localData.currentStreak,
      longest_streak: localData.longestStreak,
      unlocked_achievements: localData.unlockedAchievements,
      has_onboarded: localData.hasOnboarded,
    })
    .eq("user_id", user.id)

  // Insert all observations
  if (localData.games.length > 0) {
    const observations = localData.games.map((game) => ({
      user_id: user.id,
      question: game.question,
      correct_answer: game.correctAnswer,
      submitted_answer: game.submittedAnswer,
      set_date: game.setDate,
      due_date: game.dueDate,
      answered_date: game.answeredDate,
      status: game.status,
      delay_days: game.delayDays,
    }))

    await supabase.from("observations").insert(observations)
  }

  revalidatePath("/")
  return { success: true }
}

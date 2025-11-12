"use client"

import type React from "react"

import { Brain, Calendar, Target, Trophy } from "lucide-react"
import Link from "next/link"

export default function AuthPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <Link href="/" className="text-xl sm:text-2xl font-semibold hover:opacity-80 transition-opacity">
            Observation Game
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="order-2 lg:order-1">{children}</div>

          <div className="order-1 lg:order-2 space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Sharpen Your Memory Through Daily Practice</h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Train your observational skills and memory retention with personalized daily questions that adapt to
                your learning curve.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold">Why Practice Observation?</h2>
              <div className="grid gap-3 sm:gap-4">
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium text-sm sm:text-base">Enhance Memory Retention</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Regular practice strengthens neural pathways and improves long-term memory formation.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium text-sm sm:text-base">Build Better Focus</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Train yourself to notice details others miss and stay present in the moment.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium text-sm sm:text-base">Daily Learning Habit</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Build consistency with spaced repetition designed to optimize your learning schedule.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium text-sm sm:text-base">Track Your Progress</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      Earn achievements and maintain streaks as you develop a powerful observation practice.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Play */}
            <div className="space-y-3 sm:space-y-4">
              <h2 className="text-lg sm:text-xl font-semibold">How It Works</h2>
              <ol className="space-y-2 sm:space-y-3 text-sm sm:text-base text-muted-foreground">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                    1
                  </span>
                  <span className="leading-relaxed">Set a personal observation question each day</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                    2
                  </span>
                  <span className="leading-relaxed">Answer it after 1, 3, or 7 days based on memory strength</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                    3
                  </span>
                  <span className="leading-relaxed">Build streaks and unlock achievements as you improve</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

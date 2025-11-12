"use client"

import type React from "react"
import { useState, useMemo } from "react"
import type { GameEntry, Achievement } from "../types"
import { Button } from "./common/Button"
import { Modal } from "./common/Modal"
import { SetQuestionView } from "./SetQuestionView"
import { AnsweringView } from "./AnsweringView"
import { PendingQuestionRow } from "./PendingQuestionRow"
import { HistoryEntryRow } from "./HistoryEntryRow"
import { AchievementsView } from "./AchievementsView"
import { MEMORY_FACTS } from "../memoryFacts"
import { ACHIEVEMENTS } from "../achievements"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./ui/collapsible"
import { ChevronDown } from "lucide-react"

interface DashboardViewProps {
  dueGames: GameEntry[]
  pendingGames: GameEntry[]
  answeredGames: GameEntry[]
  unlockedAchievements: Achievement[]
  onQuestionSet: (question: string, answer: string, delayDays: number) => void
  onSubmitAnswer: (gameId: string, answer: string) => void
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  dueGames,
  pendingGames,
  answeredGames,
  unlockedAchievements,
  onQuestionSet,
  onSubmitAnswer,
}) => {
  const [isSetQuestionModalOpen, setIsSetQuestionModalOpen] = useState(false)
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false)

  const [isDueOpen, setIsDueOpen] = useState(true)
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false)
  const [isUpcomingOpen, setIsUpcomingOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const unlockedAchievementIds = unlockedAchievements.map((a) => a.id)
  const recentAchievements = unlockedAchievements.slice(0, 3)

  const totalAchievements = ACHIEVEMENTS.length

  const dailyFact = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).valueOf()) / 86400000)
    return MEMORY_FACTS[dayOfYear % MEMORY_FACTS.length]
  }, [])

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-4 space-y-6 sm:space-y-8">
      <div className="flex justify-between items-center gap-3 animate-fade-in">
        <h2 className="text-2xl sm:text-4xl font-serif">Today</h2>
        <Button onClick={() => setIsSetQuestionModalOpen(true)} className="text-sm sm:text-base whitespace-nowrap">
          + Set Observation
        </Button>
      </div>

      <div className="bg-secondary/30 border border-secondary rounded-lg p-3 sm:p-4 animate-fade-in">
        <div className="flex flex-col gap-1.5">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Memory Insight</h4>
          <p className="text-sm sm:text-base text-muted-foreground/90 leading-relaxed italic">{dailyFact}</p>
        </div>
      </div>

      <Modal
        isOpen={isSetQuestionModalOpen}
        onClose={() => setIsSetQuestionModalOpen(false)}
        title="Set Today's Observation"
      >
        <SetQuestionView onQuestionSet={onQuestionSet} onClose={() => setIsSetQuestionModalOpen(false)} />
      </Modal>

      <Modal isOpen={isAchievementsModalOpen} onClose={() => setIsAchievementsModalOpen(false)} title="Achievements">
        <AchievementsView unlockedIds={unlockedAchievementIds} />
      </Modal>

      <Collapsible open={isDueOpen} onOpenChange={setIsDueOpen}>
        <section className="animate-fade-in" style={{ animationDelay: "100ms" }}>
          <CollapsibleTrigger className="w-full">
            <div className="flex justify-between items-center mb-3 sm:mb-4 cursor-pointer group">
              <h3 className="text-lg sm:text-2xl font-serif text-foreground">Due for Answering ({dueGames.length})</h3>
              <ChevronDown className={`w-5 h-5 transition-transform ${isDueOpen ? "rotate-180" : ""}`} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {dueGames.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {dueGames.map((game) => (
                  <AnsweringView key={game.id} game={game} onSubmit={onSubmitAnswer} />
                ))}
              </div>
            ) : (
              <div className="text-center text-sm sm:text-base text-muted-foreground border-2 border-dashed border-secondary rounded-lg p-6 sm:p-8">
                <p>No questions are due today.</p>
              </div>
            )}
          </CollapsibleContent>
        </section>
      </Collapsible>

      <Collapsible open={isAchievementsOpen} onOpenChange={setIsAchievementsOpen}>
        <section className="animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <CollapsibleTrigger className="flex items-center gap-2 cursor-pointer group">
              <h3 className="text-lg sm:text-2xl font-serif text-muted-foreground">
                Achievements ({unlockedAchievements.length}/{totalAchievements})
              </h3>
              <ChevronDown className={`w-5 h-5 transition-transform ${isAchievementsOpen ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <Button variant="ghost" onClick={() => setIsAchievementsModalOpen(true)} className="text-xs sm:text-sm">
              View All
            </Button>
          </div>
          <CollapsibleContent>
            {unlockedAchievements.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {recentAchievements.map((ach) => (
                  <div key={ach.id} className="flex items-center gap-2 bg-secondary rounded-full px-3 py-1.5">
                    <span className="text-lg">{ach.icon}</span>
                    <span className="text-xs sm:text-sm font-medium">{ach.title}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm sm:text-base text-muted-foreground">
                Your achievements will appear here. Keep playing to unlock them!
              </p>
            )}
          </CollapsibleContent>
        </section>
      </Collapsible>

      <Collapsible open={isUpcomingOpen} onOpenChange={setIsUpcomingOpen}>
        <section className="animate-fade-in" style={{ animationDelay: "300ms" }}>
          <CollapsibleTrigger className="w-full">
            <div className="flex justify-between items-center mb-3 sm:mb-4 cursor-pointer group">
              <h3 className="text-lg sm:text-2xl font-serif text-muted-foreground">Upcoming ({pendingGames.length})</h3>
              <ChevronDown className={`w-5 h-5 transition-transform ${isUpcomingOpen ? "rotate-180" : ""}`} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {pendingGames.length > 0 ? (
              <div className="space-y-2">
                {pendingGames.map((game) => (
                  <PendingQuestionRow key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <p className="text-sm sm:text-base text-muted-foreground">
                No upcoming questions. Set one to challenge your future self.
              </p>
            )}
          </CollapsibleContent>
        </section>
      </Collapsible>

      <Collapsible open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <section className="animate-fade-in" style={{ animationDelay: "400ms" }}>
          <CollapsibleTrigger className="w-full">
            <div className="flex justify-between items-center mb-3 sm:mb-4 cursor-pointer group">
              <h3 className="text-lg sm:text-2xl font-serif text-muted-foreground">History ({answeredGames.length})</h3>
              <ChevronDown className={`w-5 h-5 transition-transform ${isHistoryOpen ? "rotate-180" : ""}`} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {answeredGames.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {answeredGames.map((game) => (
                  <HistoryEntryRow key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <p className="text-sm sm:text-base text-muted-foreground">
                Your history will appear here once you've answered a few questions.
              </p>
            )}
          </CollapsibleContent>
        </section>
      </Collapsible>
    </div>
  )
}

"use client"

import type React from "react"
import { useState } from "react"
import { type GameEntry, GameStatus } from "../types"
import { Button } from "./common/Button"

interface AnsweringViewProps {
  game: GameEntry
  onSubmit: (gameId: string, answer: string) => void
}

export const AnsweringView: React.FC<AnsweringViewProps> = ({ game, onSubmit }) => {
  const [answer, setAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isAnswered = game.status === GameStatus.ANSWERED_CORRECT || game.status === GameStatus.ANSWERED_INCORRECT

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (answer.trim() && !isAnswered && !isSubmitting) {
      setIsSubmitting(true)
      try {
        await onSubmit(game.id, answer)
      } catch (error) {
        console.error("[v0] Error submitting answer:", error)
        alert("Failed to submit answer. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const isCorrect = game.status === GameStatus.ANSWERED_CORRECT

  return (
    <div className="w-full bg-secondary rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4 animate-fade-in">
      <p className="text-base sm:text-xl font-serif text-center leading-relaxed">{game.question}</p>
      <p className="text-xs sm:text-sm text-center text-muted-foreground -mt-1 sm:-mt-2 mb-3 sm:mb-4">
        Asked on {new Date(game.setDate + "T00:00:00").toLocaleDateString()}
      </p>

      {isAnswered ? (
        <div className="text-center">
          <h3
            className={`text-xl sm:text-2xl font-serif mb-3 sm:mb-4 ${isCorrect ? "text-correct" : "text-incorrect"}`}
          >
            {isCorrect ? "Correct!" : "Not Quite"}
          </h3>
          <div className="space-y-2 text-left p-3 sm:p-4 bg-background rounded-md text-xs sm:text-sm">
            <p>
              <span className="font-medium text-muted-foreground">Your Answer:</span> {game.submittedAnswer}
            </p>
            <p>
              <span className="font-medium text-muted-foreground">Correct Answer:</span> {game.correctAnswer}
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <label htmlFor={`user-answer-${game.id}`} className="sr-only">
            Your Answer
          </label>
          <input
            id={`user-answer-${game.id}`}
            type="text"
            autoFocus
            className="w-full bg-background border border-secondary/0 focus:border-primary/50 rounded-md p-3 text-sm sm:text-base text-foreground focus:outline-none transition-colors touch-manipulation"
            placeholder="What do you remember?"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            variant="primary"
            disabled={!answer.trim() || isSubmitting}
            className="w-full !py-3 text-sm sm:text-base touch-manipulation min-h-[44px]"
          >
            {isSubmitting ? "Submitting..." : "Submit Answer"}
          </Button>
        </form>
      )}
    </div>
  )
}

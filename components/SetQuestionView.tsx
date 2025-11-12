"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "./common/Button"
import { getSuggestedQuestion } from "../services/geminiService"

interface SetQuestionViewProps {
  onQuestionSet: (question: string, answer: string, delayDays: number) => void
  onClose: () => void
}

export const SetQuestionView: React.FC<SetQuestionViewProps> = ({ onQuestionSet, onClose }) => {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [delayDays, setDelayDays] = useState(1)
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false)
  const [suggestionError, setSuggestionError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleGetSuggestion = async () => {
    setIsLoadingSuggestion(true)
    setSuggestionError(null)
    try {
      const suggested = await getSuggestedQuestion()
      setQuestion(suggested)
    } catch (error) {
      setSuggestionError("Failed to generate question. Please try again or write your own.")
      console.error("[v0] Error generating suggestion:", error)
    } finally {
      setIsLoadingSuggestion(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (question.trim() && answer.trim() && !isSubmitting) {
      setIsSubmitting(true)
      try {
        await onQuestionSet(question, answer, delayDays)
        onClose()
      } catch (error) {
        console.error("[v0] Error setting question:", error)
        alert("Failed to save observation. Please try again.")
        setIsSubmitting(false)
      }
    }
  }

  const isFormValid = question.trim().length > 0 && answer.trim().length > 0

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="question" className="block text-sm font-medium text-muted-foreground mb-2">
          Your Question
        </label>
        <textarea
          id="question"
          rows={3}
          className="w-full bg-secondary border border-secondary/0 focus:border-primary/50 rounded-md p-3 text-foreground focus:outline-none transition-colors"
          placeholder="e.g., What was the first thing I ate today?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={isSubmitting}
        />
        <div className="text-right mt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleGetSuggestion}
            isLoading={isLoadingSuggestion}
            className="text-sm"
            disabled={isSubmitting}
          >
            {isLoadingSuggestion ? "Generating..." : "Suggest a Question ✨"}
          </Button>
        </div>
        {suggestionError && <p className="text-sm text-red-500 mt-2">{suggestionError}</p>}
      </div>
      <div>
        <label htmlFor="answer" className="block text-sm font-medium text-muted-foreground mb-2">
          The Correct Answer (this will be hidden)
        </label>
        <input
          id="answer"
          type="text"
          className="w-full bg-secondary border border-secondary/0 focus:border-primary/50 rounded-md p-3 text-foreground focus:outline-none transition-colors"
          placeholder="e.g., A banana"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label htmlFor="delay" className="block text-sm font-medium text-muted-foreground mb-2">
          Answer in {delayDays} day{delayDays > 1 && "s"}
        </label>
        <input
          id="delay"
          type="range"
          min="1"
          max="14"
          value={delayDays}
          onChange={(e) => setDelayDays(Number(e.target.value))}
          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          disabled={isSubmitting}
        />
      </div>
      <Button type="submit" variant="primary" disabled={!isFormValid || isSubmitting} className="w-full !py-3">
        {isSubmitting ? "Saving..." : "Set Observation"}
      </Button>
    </form>
  )
}

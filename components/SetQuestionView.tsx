import React, { useState } from 'react';
import { Button } from './common/Button';
import { getSuggestedQuestion } from '../services/geminiService';

interface SetQuestionViewProps {
  onQuestionSet: (question: string, answer: string, delayDays: number) => void;
  onClose: () => void;
}

export const SetQuestionView: React.FC<SetQuestionViewProps> = ({ onQuestionSet, onClose }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [delayDays, setDelayDays] = useState(1);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  
  const handleGetSuggestion = async () => {
    setIsLoadingSuggestion(true);
    const suggested = await getSuggestedQuestion();
    setQuestion(suggested);
    setIsLoadingSuggestion(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && answer.trim()) {
      onQuestionSet(question, answer, delayDays);
      onClose();
    }
  };

  const isFormValid = question.trim().length > 0 && answer.trim().length > 0;

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
        />
          <div className="text-right mt-2">
          <Button type="button" variant="ghost" onClick={handleGetSuggestion} isLoading={isLoadingSuggestion} className="text-sm">
            Suggest a Question ✨
          </Button>
        </div>
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
        />
      </div>
      <div>
          <label htmlFor="delay" className="block text-sm font-medium text-muted-foreground mb-2">
              Answer in {delayDays} day{delayDays > 1 && 's'}
          </label>
          <input
              id="delay"
              type="range"
              min="1"
              max="14"
              value={delayDays}
              onChange={(e) => setDelayDays(Number(e.target.value))}
              className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
      </div>
      <Button type="submit" variant="primary" disabled={!isFormValid} className="w-full !py-3">
        Set Observation
      </Button>
    </form>
  );
};

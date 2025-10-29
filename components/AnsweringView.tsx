import React, { useState } from 'react';
import { GameEntry, GameStatus } from '../types';
import { Button } from './common/Button';

interface AnsweringViewProps {
  game: GameEntry;
  onSubmit: (gameId: string, answer: string) => void;
}

export const AnsweringView: React.FC<AnsweringViewProps> = ({ game, onSubmit }) => {
  const [answer, setAnswer] = useState('');
  
  const isAnswered = game.status === GameStatus.ANSWERED_CORRECT || game.status === GameStatus.ANSWERED_INCORRECT;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim() && !isAnswered) {
      onSubmit(game.id, answer);
    }
  };
  
  const isCorrect = game.status === GameStatus.ANSWERED_CORRECT;

  return (
    <div className="w-full bg-secondary rounded-lg p-6 space-y-4 animate-fade-in">
      <p className="text-xl font-serif text-center">{game.question}</p>
      <p className="text-sm text-center text-muted-foreground -mt-2 mb-4">
        Asked on {new Date(game.setDate + 'T00:00:00').toLocaleDateString()}
      </p>

      {isAnswered ? (
         <div className="text-center">
            <h3 className={`text-2xl font-serif mb-4 ${isCorrect ? 'text-correct' : 'text-incorrect'}`}>{isCorrect ? 'Correct!' : 'Not Quite'}</h3>
            <div className="space-y-2 text-left p-4 bg-background rounded-md text-sm">
                <p><span className="font-medium text-muted-foreground">Your Answer:</span> {game.submittedAnswer}</p>
                <p><span className="font-medium text-muted-foreground">Correct Answer:</span> {game.correctAnswer}</p>
            </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
            <label htmlFor={`user-answer-${game.id}`} className="sr-only">
                Your Answer
            </label>
            <input
            id={`user-answer-${game.id}`}
            type="text"
            autoFocus
            className="w-full bg-background border border-secondary/0 focus:border-primary/50 rounded-md p-3 text-foreground focus:outline-none transition-colors"
            placeholder="What do you remember?"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            />
            <Button type="submit" variant="primary" disabled={!answer.trim()} className="w-full !py-3">
            Submit Answer
            </Button>
        </form>
      )}
    </div>
  );
};

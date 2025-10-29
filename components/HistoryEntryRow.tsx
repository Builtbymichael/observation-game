import React from 'react';
import { GameEntry, GameStatus } from '../types';

interface HistoryEntryRowProps {
  game: GameEntry;
}

const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};


export const HistoryEntryRow: React.FC<HistoryEntryRowProps> = ({ game }) => {
  const isCorrect = game.status === GameStatus.ANSWERED_CORRECT;

  return (
    <div className="border border-secondary p-4 rounded-lg animate-fade-in space-y-3">
      <div className="flex justify-between items-start gap-4">
        <p className="font-serif text-foreground flex-grow">{game.question}</p>
        <span className={`text-xs uppercase font-bold px-2 py-1 rounded-full text-white whitespace-nowrap ${isCorrect ? 'bg-correct' : 'bg-incorrect'}`}>
          {isCorrect ? 'Correct' : 'Incorrect'}
        </span>
      </div>
      <div className="space-y-1 text-sm p-3 bg-secondary rounded-md">
        <p><span className="font-medium text-muted-foreground">Your Answer:</span> {game.submittedAnswer}</p>
        <p><span className="font-medium text-muted-foreground">Correct Answer:</span> {game.correctAnswer}</p>
      </div>
       <div className="text-xs text-muted-foreground pt-2 border-t border-secondary/50">
        <p>Answered: {formatDate(game.answeredDate)} ({game.delayDays}-day recall)</p>
      </div>
    </div>
  );
};

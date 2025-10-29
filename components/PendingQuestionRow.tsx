import React from 'react';
import { GameEntry } from '../types';

interface PendingQuestionRowProps {
  game: GameEntry;
}

export const PendingQuestionRow: React.FC<PendingQuestionRowProps> = ({ game }) => {
  const { dueDate } = game;
  const date = new Date(dueDate + 'T00:00:00');
  const formattedDate = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  return (
    <div className="border-b border-secondary p-4 flex items-center justify-between animate-fade-in">
      <div className="flex items-center space-x-4">
        <p className="text-muted-foreground">Question locked until {formattedDate}</p>
      </div>
      <span className="text-xs text-muted-foreground font-medium bg-secondary px-2 py-1 rounded-md whitespace-nowrap">
        {game.delayDays} day recall
      </span>
    </div>
  );
};

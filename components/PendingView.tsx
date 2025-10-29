
import React from 'react';
import { GameEntry } from '../types';

interface PendingViewProps {
  game: GameEntry;
}

export const PendingView: React.FC<PendingViewProps> = ({ game }) => {
  const { dueDate } = game;
  const date = new Date(dueDate + 'T00:00:00'); // Ensure it's parsed as local time
  const formattedDate = date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="w-full max-w-lg mx-auto p-8 text-center animate-flip-in">
      <div className="text-6xl mb-6">⏳</div>
      <h2 className="text-2xl font-bold mb-4">Question Locked</h2>
      <p className="text-medium-text text-lg">
        Your memory will be tested on:
      </p>
      <p className="text-present text-2xl font-bold mt-2">{formattedDate}</p>
      <p className="text-medium-text mt-8">Come back then to answer your question and test your recall!</p>
    </div>
  );
};

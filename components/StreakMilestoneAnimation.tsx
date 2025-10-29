import React, { useEffect } from 'react';

interface StreakMilestoneAnimationProps {
  newLongest: boolean;
  milestone: number | null;
  currentStreak: number;
  onComplete: () => void;
}

export const StreakMilestoneAnimation: React.FC<StreakMilestoneAnimationProps> = ({ newLongest, milestone, currentStreak, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000); // 3s
    return () => clearTimeout(timer);
  }, [onComplete]);

  let message = "Day Streak!";
  if (newLongest) {
    message = `New Longest Streak!`;
  } else if (milestone) {
    message = `${milestone} Day Streak!`;
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="relative text-center p-8">
        <div className="bg-background rounded-lg py-12 px-16 m-4 max-w-md w-full shadow-2xl border border-secondary">
            <h2 className="text-3xl font-serif mb-2 text-foreground">{message}</h2>
            <p className="text-7xl font-serif font-bold text-primary">{currentStreak}</p>
        </div>
      </div>
    </div>
  );
};

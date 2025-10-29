
import React from 'react';
import { Achievement } from '../../types';

interface AchievementBadgeProps {
  achievement: Achievement;
  isUnlocked: boolean;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement, isUnlocked }) => {
  const { icon, title, description } = achievement;
  
  const unlockedClasses = "bg-secondary border-secondary";
  const lockedClasses = "bg-secondary/50 border-secondary/50 grayscale opacity-60";

  return (
    <div 
      className={`p-4 border rounded-lg text-center transition-all duration-300 flex flex-col items-center justify-start ${isUnlocked ? unlockedClasses : lockedClasses}`}
      title={isUnlocked ? `${title}: ${description}` : description}
    >
      <span className="text-4xl mb-2">{isUnlocked ? icon : '❓'}</span>
      <h4 className={`font-medium text-sm leading-tight ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>{title}</h4>
      {/* <p className="text-xs text-muted-foreground">{description}</p> */}
    </div>
  );
};

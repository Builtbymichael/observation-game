import React from 'react';
import { ACHIEVEMENTS } from '../achievements';
import { AchievementBadge } from './common/AchievementBadge';

interface AchievementsViewProps {
  unlockedIds: string[];
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ unlockedIds }) => {
  return (
    <div className="max-h-[60vh] overflow-y-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-1">
        {ACHIEVEMENTS.map(ach => (
          <AchievementBadge 
            key={ach.id} 
            achievement={ach}
            isUnlocked={unlockedIds.includes(ach.id)}
          />
        ))}
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Achievement } from '../types';

interface AchievementUnlockedToastProps {
  achievement: Achievement;
  onClose: () => void;
}

export const AchievementUnlockedToast: React.FC<AchievementUnlockedToastProps> = ({ achievement, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Fade in
    const inTimer = setTimeout(() => setVisible(true), 100);
    // Fade out and close
    const outTimer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // allow fade out animation
    }, 4000);
    
    return () => {
        clearTimeout(inTimer);
        clearTimeout(outTimer);
    }
  }, [achievement, onClose]);

  return (
    <div 
        className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        role="alert"
        aria-live="assertive"
    >
      <div className="bg-background border border-secondary rounded-full shadow-2xl p-3 flex items-center space-x-3">
        <span className="text-2xl">{achievement.icon}</span>
        <div className="flex flex-col text-left pr-2">
            <span className="text-sm font-medium text-foreground">Achievement Unlocked</span>
            <span className="text-xs text-muted-foreground">{achievement.title}</span>
        </div>
      </div>
    </div>
  );
};

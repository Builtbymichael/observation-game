import React, { useState, useEffect, useMemo } from 'react';
import { GameEntry, Achievement } from '../types';
import { Button } from './common/Button';
import { Modal } from './common/Modal';
import { SetQuestionView } from './SetQuestionView';
import { AnsweringView } from './AnsweringView';
import { PendingQuestionRow } from './PendingQuestionRow';
import { HistoryEntryRow } from './HistoryEntryRow';
import { AchievementBadge } from './common/AchievementBadge';
import { AchievementsView } from './AchievementsView';
import { MEMORY_FACTS } from '../memoryFacts';

interface DashboardViewProps {
  dueGames: GameEntry[];
  pendingGames: GameEntry[];
  answeredGames: GameEntry[];
  unlockedAchievements: Achievement[];
  onQuestionSet: (question: string, answer: string, delayDays: number) => void;
  onSubmitAnswer: (gameId: string, answer: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
    dueGames, 
    pendingGames, 
    answeredGames, 
    unlockedAchievements, 
    onQuestionSet, 
    onSubmitAnswer 
}) => {
  const [isSetQuestionModalOpen, setIsSetQuestionModalOpen] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  
  const unlockedAchievementIds = unlockedAchievements.map(a => a.id);
  const recentAchievements = unlockedAchievements.slice(0, 4);

  const dailyFact = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).valueOf()) / 86400000);
    return MEMORY_FACTS[dayOfYear % MEMORY_FACTS.length];
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-12">
      <div className="flex justify-between items-center animate-fade-in">
        <h2 className="text-4xl font-serif">Today</h2>
        <Button onClick={() => setIsSetQuestionModalOpen(true)}>
          + Set Observation
        </Button>
      </div>

      <Modal isOpen={isSetQuestionModalOpen} onClose={() => setIsSetQuestionModalOpen(false)} title="Set Today's Observation">
        <SetQuestionView onQuestionSet={onQuestionSet} onClose={() => setIsSetQuestionModalOpen(false)} />
      </Modal>

      <Modal isOpen={isAchievementsModalOpen} onClose={() => setIsAchievementsModalOpen(false)} title="Achievements">
        <AchievementsView unlockedIds={unlockedAchievementIds} />
      </Modal>

      <section className="animate-fade-in" style={{ animationDelay: '100ms' }}>
        <h3 className="text-2xl font-serif text-foreground mb-4">Due for Answering ({dueGames.length})</h3>
        {dueGames.length > 0 ? (
          <div className="space-y-4">
            {dueGames.map(game => (
              <AnsweringView key={game.id} game={game} onSubmit={onSubmitAnswer} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground border-2 border-dashed border-secondary rounded-lg p-8">
            <p>No questions are due today.</p>
            <p className="text-sm italic mt-4 max-w-md mx-auto">
              "{dailyFact}"
            </p>
          </div>
        )}
      </section>

      <section className="animate-fade-in" style={{ animationDelay: '200ms' }}>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-serif text-muted-foreground">Achievements ({unlockedAchievements.length})</h3>
            <Button variant="ghost" onClick={() => setIsAchievementsModalOpen(true)}>View All</Button>
        </div>
        {unlockedAchievements.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recentAchievements.map(ach => (
              <AchievementBadge key={ach.id} achievement={ach} isUnlocked={true} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Your achievements will appear here. Keep playing to unlock them!</p>
        )}
      </section>


      <section className="animate-fade-in" style={{ animationDelay: '300ms' }}>
        <h3 className="text-2xl font-serif text-muted-foreground mb-4">Upcoming ({pendingGames.length})</h3>
        {pendingGames.length > 0 ? (
          <div className="space-y-2">
            {pendingGames.map(game => (
              <PendingQuestionRow key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No upcoming questions. Set one to challenge your future self.</p>
        )}
      </section>

      <section className="animate-fade-in" style={{ animationDelay: '400ms' }}>
        <h3 className="text-2xl font-serif text-muted-foreground mb-4">History ({answeredGames.length})</h3>
        {answeredGames.length > 0 ? (
          <div className="space-y-4">
            {answeredGames.map(game => (
              <HistoryEntryRow key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Your history will appear here once you've answered a few questions.</p>
        )}
      </section>
    </div>
  );
};

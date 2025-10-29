import React from 'react';

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
);
const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
);

interface HeaderProps {
    onToggleTheme: () => void;
    currentTheme: string;
}

export const Header: React.FC<HeaderProps> = ({ onToggleTheme, currentTheme }) => {
  return (
    <header className="w-full max-w-2xl mx-auto p-4 absolute top-0 left-1/2 -translate-x-1/2">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif">
          Observation
        </h1>
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-full text-muted-foreground hover:bg-secondary transition-colors"
          aria-label="Toggle theme"
        >
          {currentTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  );
};

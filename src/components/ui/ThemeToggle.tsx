import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light-clean' | 'dark-premium'>('dark-premium');

  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as 'light-clean' | 'dark-premium') ?? 'dark-premium';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = (newTheme: 'light-clean' | 'dark-premium') => {
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  return (
    <div className="flex items-center bg-[var(--muted)] rounded-[var(--radius)] p-1 border border-[var(--border)]">
      <button
        onClick={() => toggleTheme('light-clean')}
        className={`flex items-center space-x-1 px-3 py-2 rounded-[calc(var(--radius)-4px)] transition-all duration-200 ${
          theme === 'light-clean'
            ? 'bg-[var(--primary)] text-white shadow-[var(--shadow)]'
            : 'text-[var(--fg)] hover:bg-[var(--card)]'
        }`}
      >
        <Sun size={16} />
        <span className="text-sm font-medium">Clair</span>
      </button>
      <button
        onClick={() => toggleTheme('dark-premium')}
        className={`flex items-center space-x-1 px-3 py-2 rounded-[calc(var(--radius)-4px)] transition-all duration-200 ${
          theme === 'dark-premium'
            ? 'bg-[var(--primary)] text-white shadow-[var(--shadow)]'
            : 'text-[var(--fg)] hover:bg-[var(--card)]'
        }`}
      >
        <Moon size={16} />
        <span className="text-sm font-medium">Sombre</span>
      </button>
    </div>
  );
};
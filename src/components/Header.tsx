import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';
import { ThemeToggle } from './ui/ThemeToggle';

interface HeaderProps {
  title: string;
  user?: {
    username: string;
    avatar: string;
  } | null;
}

export const Header: React.FC<HeaderProps> = ({ title, user }) => {
  return (
    <header className="sticky top-0 bg-[var(--card)] border-b border-[var(--border)] z-40 shadow-[var(--shadow)]">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold text-[var(--fg)]">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          <button className="p-2 text-[var(--fg)] opacity-70 hover:opacity-100 hover:bg-[var(--muted)] rounded-full transition-all duration-200">
            <Search size={20} />
          </button>
          <button className="p-2 text-[var(--fg)] opacity-70 hover:opacity-100 hover:bg-[var(--muted)] rounded-full transition-all duration-200 relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--primary)] rounded-full"></span>
          </button>
          {user ? (
            <div className="flex items-center space-x-2">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-8 h-8 rounded-full border border-[var(--border)]"
              />
            </div>
          ) : (
            <button className="p-2 text-[var(--fg)] opacity-70 hover:opacity-100 hover:bg-[var(--muted)] rounded-full transition-all duration-200">
              <Settings size={20} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
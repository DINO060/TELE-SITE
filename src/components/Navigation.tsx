import React from 'react';
import { Home, Send, BarChart3, Users, User } from 'lucide-react';

interface NavigationProps {
  activeTab: 'home' | 'channel-post' | 'analytics' | 'game' | 'profile';
  onTabChange: (tab: 'home' | 'channel-post' | 'analytics' | 'game' | 'profile') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as const, icon: Home, label: 'Home' },
    { id: 'channel-post' as const, icon: Send, label: 'Channel Post' },
    { id: 'analytics' as const, icon: BarChart3, label: 'Analytics' },
    { id: 'game' as const, icon: Users, label: 'Loup-Garou' },
    { id: 'profile' as const, icon: User, label: 'Profil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--card)] border-t border-[var(--border)] z-50 shadow-[var(--shadow)]">
      <div className="flex justify-around items-center py-2">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center py-2 px-3 rounded-[var(--radius)] transition-all duration-200 ${
              activeTab === id
                ? 'text-[var(--primary)] bg-[var(--muted)]'
                : 'text-[var(--fg)] opacity-70 hover:opacity-100 hover:bg-[var(--muted)]'
            }`}
          >
            <Icon size={24} className={`mb-1 transition-transform duration-200 ${
              activeTab === id ? 'scale-110' : ''
            }`} />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
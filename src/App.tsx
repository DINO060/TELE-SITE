import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Header } from './components/Header';
import { HomeView } from './components/home/HomeView';
import { ChannelPostView } from './components/channel-post/ChannelPostView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { GameView } from './components/game/GameView';
import ProfileView from './components/profile/ProfileView';
import { LoginView } from './components/auth/LoginView';
import { getCurrentUser } from './lib/api';
import { User } from './types';

type Tab = 'home' | 'channel-post' | 'analytics' | 'game' | 'profile';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const handleLogin = () => {
    const user = getCurrentUser();
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('home');
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'home':
        return 'Home';
      case 'channel-post':
        return 'Channel Post';
      case 'analytics':
        return 'Analytics';
      case 'game':
        return 'Loup-Garou';
      case 'profile':
        return 'Profil';
      default:
        return 'SocialHub';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--fg)] opacity-70">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <Header 
        title={getTabTitle()} 
        user={currentUser}
      />

      {/* Main Content */}
      <main className="pt-16">
        {activeTab === 'home' && (
          <HomeView 
            currentUserId={currentUser.id}
            user={currentUser}
          />
        )}
        
        {activeTab === 'channel-post' && (
          <ChannelPostView 
            currentUserId={currentUser.id}
            user={currentUser}
          />
        )}
        
        {activeTab === 'analytics' && (
          <AnalyticsView />
        )}
        
        {activeTab === 'game' && (
          <GameView 
            currentUserId={currentUser.id}
            user={currentUser}
          />
        )}
        
        {activeTab === 'profile' && (
          <ProfileView 
            user={currentUser}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Navigation */}
      <Navigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}

export default App;
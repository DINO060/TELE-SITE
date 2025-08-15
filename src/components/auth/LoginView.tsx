import React, { useEffect, useState } from 'react';
import { MessageCircle, Users, BarChart3, Zap, Shield, Globe } from 'lucide-react';

declare global {
  interface Window {
    onTelegramAuth?: (user: any) => void;
  }
}

interface LoginViewProps {
  onLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const botUsername = (import.meta as any).env?.VITE_BOT_USERNAME as string | undefined;

  // Inject Telegram Login Widget and handle auth
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    // Use env-defined bot username (without @). Fallback to placeholder to avoid crash.
    script.setAttribute('data-telegram-login', botUsername || 'RENAMSEND_BOT');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '20');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');
    script.async = true;

    const container = document.getElementById('telegram-login-container');
    if (container) container.appendChild(script);

    window.onTelegramAuth = async (telegramUser: any) => {
      setIsLoggingIn(true);
      setError(null);
      try {
        const res = await fetch('/api/auth-telegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(telegramUser),
        });
        if (!res.ok) throw new Error('Auth failed');
        const data = await res.json();

        // Persist user like getCurrentUser expects
        const user = {
          id: String(data.user?.id ?? telegramUser.id),
          username: data.user?.username || telegramUser.username || telegramUser.first_name || 'User',
          avatar: data.user?.avatar || data.user?.photo_url || telegramUser.photo_url || '',
          telegramHandle: data.user?.username ? `@${data.user.username}` : (telegramUser.username ? `@${telegramUser.username}` : undefined),
        };
        localStorage.setItem('currentUser', JSON.stringify(user));

        onLogin();
      } catch (e) {
        console.error(e);
        setError("Erreur de connexion avec Telegram");
      } finally {
        setIsLoggingIn(false);
      }
    };

    return () => {
      if (container && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete window.onTelegramAuth;
    };
  }, [onLogin, botUsername]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <MessageCircle size={32} className="text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">SocialHub</h1>
          <p className="text-blue-100 text-lg">
            Réseau social · Analytics · Jeux
          </p>
        </div>

        {/* Features */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Fonctionnalités</h2>
          <div className="space-y-3">
            {[
              { icon: MessageCircle, text: 'Feed social interactif' },
              { icon: BarChart3, text: 'Analytics Telegram avancés' },
              { icon: Users, text: 'Jeu Loup-Garou intégré' },
              { icon: Shield, text: 'Sécurisé et privé' },
              { icon: Globe, text: 'Expérience temps réel' },
              { icon: Zap, text: 'Interface moderne' },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Icon size={20} className="text-blue-200" />
                <span className="text-white">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Telegram Login (Widget injected here) */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <div id="telegram-login-container" className="flex justify-center" />

          {isLoggingIn && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-white">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Connexion...</span>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-500/20 text-white p-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-blue-100 text-sm">
            Démo complète · Données locales uniquement
          </p>
        </div>
      </div>
    </div>
  );
};
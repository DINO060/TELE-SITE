import React, { useState } from 'react';
import { MessageCircle, Users, BarChart3, Zap, Shield, Globe } from 'lucide-react';
import { loginWithTelegramMock } from '../../lib/api';

interface LoginViewProps {
  onLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await loginWithTelegramMock();
      onLogin();
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoggingIn(false);
    }
  };

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

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl"
        >
          {isLoggingIn ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Connexion...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <MessageCircle size={20} />
              <span>Se connecter avec Telegram</span>
            </div>
          )}
        </button>

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
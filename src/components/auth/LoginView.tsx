import React, { useEffect, useState } from 'react';
import { MessageCircle, Users, BarChart3, Zap, Shield, Globe, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { loginWithEmail, registerWithEmail } from '../../lib/api';

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
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: ''
  });
  const botUsername = (import.meta as any).env?.VITE_BOT_USERNAME as string | undefined;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (mode === 'register') {
      if (!formData.username) {
        setError('Le nom d\'utilisateur est requis');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }
      if (formData.password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères');
        return;
      }
    }

    setIsLoggingIn(true);
    setError(null);

    try {
      if (mode === 'register') {
        await registerWithEmail(formData.email, formData.password, formData.username);
      } else {
        await loginWithEmail(formData.email, formData.password);
      }
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    } finally {
      setIsLoggingIn(false);
    }
  };

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
          <h3 className="text-lg font-semibold text-white mb-4 text-center">
            {mode === 'login' ? 'Se connecter' : 'Créer un compte'}
          </h3>
          
          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
            {mode === 'register' && (
              <div className="relative">
                <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                <input
                  type="text"
                  placeholder="Nom d'utilisateur"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                />
              </div>
            )}
            
            <div className="relative">
              <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mot de passe"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full pl-10 pr-12 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {mode === 'register' && (
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirmer le mot de passe"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
                />
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoggingIn ? 'Chargement...' : (mode === 'login' ? 'Se connecter' : 'Créer le compte')}
            </button>
          </form>
          
          <div className="text-center mb-4">
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError(null);
                setFormData({ email: '', password: '', username: '', confirmPassword: '' });
              }}
              className="text-white/80 hover:text-white underline text-sm"
            >
              {mode === 'login' ? 'Pas de compte ? Créer un compte' : 'Déjà un compte ? Se connecter'}
            </button>
          </div>
          
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-white/60">ou</span>
            </div>
          </div>
          
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
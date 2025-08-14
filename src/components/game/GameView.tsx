import React, { useState, useEffect } from 'react';
import { Moon, Sun, Users, Clock, Crown, Skull } from 'lucide-react';
import { GameLobby } from './GameLobby';
import { GameChat } from './GameChat';
import { GameSnapshot } from '../../types';
import { getGameSnapshot, joinGame, startGame } from '../../lib/api';

interface GameViewProps {
  currentUserId?: string;
  user?: {
    username: string;
    avatar: string;
  } | null;
}

export const GameView: React.FC<GameViewProps> = ({ currentUserId, user }) => {
  const [game, setGame] = useState<GameSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<string>('');

  const loadGameSnapshot = async () => {
    try {
      const snapshot = await getGameSnapshot();
      setGame(snapshot);
    } catch (error) {
      console.error('Error loading game:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGameSnapshot();
    const interval = setInterval(loadGameSnapshot, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, []);

  // Update countdown timer
  useEffect(() => {
    if (!game) return;

    const updateTimer = () => {
      const now = Date.now();
      const phaseEnd = new Date(game.phaseEndsAt).getTime();
      const remaining = Math.max(0, phaseEnd - now);
      
      if (remaining === 0) {
        loadGameSnapshot(); // Refresh when phase ends
        return;
      }

      const minutes = Math.floor(remaining / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [game]);

  const handleJoinGame = async () => {
    try {
      await joinGame();
      await loadGameSnapshot();
    } catch (error) {
      console.error('Error joining game:', error);
    }
  };

  const handleStartGame = async () => {
    try {
      await startGame();
      await loadGameSnapshot();
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const getPhaseInfo = () => {
    if (!game) return { title: 'Chargement...', description: '', icon: <Clock size={24} /> };

    switch (game.state) {
      case 'LOBBY':
        return {
          title: 'Salle d\'attente',
          description: 'En attente de joueurs...',
          icon: <Users size={24} />,
        };
      case 'NIGHT':
        return {
          title: 'Phase de nuit',
          description: 'Les loups-garous choisissent leur victime',
          icon: <Moon size={24} />,
        };
      case 'DAY':
        return {
          title: 'Phase de jour',
          description: 'Discussion entre les joueurs',
          icon: <Sun size={24} />,
        };
      case 'VOTE':
        return {
          title: 'Phase de vote',
          description: 'Éliminez un suspect',
          icon: <Crown size={24} />,
        };
      case 'RESOLUTION':
        return {
          title: 'Résolution',
          description: 'Résultats de la phase',
          icon: <Skull size={24} />,
        };
      case 'END':
        return {
          title: 'Fin de partie',
          description: game.winner ? `Victoire des ${game.winner === 'wolves' ? 'loups-garous' : 'villageois'} !` : 'Partie terminée',
          icon: <Crown size={24} />,
        };
      default:
        return {
          title: 'Jeu en cours',
          description: '',
          icon: <Users size={24} />,
        };
    }
  };

  if (loading) {
    return (
      <div className="pb-20 p-4 bg-[var(--bg)]">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 animate-pulse">
          <div className="h-6 bg-[var(--muted)] rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-[var(--muted)] rounded w-full"></div>
            <div className="h-4 bg-[var(--muted)] rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="pb-20 p-4 bg-[var(--bg)]">
        <div className="text-center py-12">
          <p className="text-[var(--fg)] opacity-60">Aucune partie en cours</p>
        </div>
      </div>
    );
  }

  const phaseInfo = getPhaseInfo();
  const currentPlayer = game.players.find(p => p.id === currentUserId);

  return (
    <div className="pb-20 bg-[var(--bg)]">
      {/* Game status header */}
      <div className="p-4">
        <div className={`bg-gradient-to-r rounded-xl p-4 text-white ${
          game.state === 'NIGHT' 
            ? 'from-indigo-600 to-purple-700' 
            : game.state === 'DAY'
            ? 'from-yellow-500 to-orange-600'
            : 'from-blue-600 to-blue-700'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {phaseInfo.icon}
              <h2 className="text-lg font-semibold">{phaseInfo.title}</h2>
            </div>
            {game.state !== 'LOBBY' && game.state !== 'END' && (
              <div className="flex items-center space-x-1 bg-black/20 px-3 py-1 rounded-full">
                <Clock size={16} />
                <span className="font-mono">{timeLeft}</span>
              </div>
            )}
          </div>
          <p className="text-white/90">{phaseInfo.description}</p>
          {game.round > 0 && (
            <p className="text-white/80 text-sm mt-2">Manche {game.round}</p>
          )}
        </div>
      </div>

      {/* Game content */}
      {game.state === 'LOBBY' ? (
        <GameLobby
          game={game}
          currentUserId={currentUserId}
          user={user}
          onJoin={handleJoinGame}
          onStart={handleStartGame}
        />
      ) : (
        <div className="px-4 space-y-4">
          {/* Players list */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
            <h3 className="font-semibold text-[var(--fg)] mb-3">
              Joueurs ({game.players.filter(p => p.alive).length}/{game.players.length})
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {game.players.map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center space-x-2 p-2 rounded-lg ${
                    player.alive ? 'bg-[var(--muted)]' : 'bg-red-500/10 opacity-60'
                  } ${player.id === currentUserId ? 'ring-2 ring-blue-500' : ''}`}
                >
                  <div className={`w-3 h-3 rounded-full ${
                    player.alive ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className={`font-medium ${
                    player.alive ? 'text-[var(--fg)]' : 'text-[var(--fg)] opacity-50 line-through'
                  }`}>
                    {player.name}
                    {player.id === currentUserId && ' (Vous)'}
                  </span>
                  {!player.alive && <Skull size={16} className="text-red-500" />}
                </div>
              ))}
            </div>
          </div>

          {/* Role info for current player */}
          {currentPlayer?.roleSelf && (
            <div className={`border rounded-xl p-4 ${
              currentPlayer.roleSelf === 'wolf'
                ? 'bg-red-500/10 border-red-500/20'
                : 'bg-blue-500/10 border-blue-500/20'
            }`}>
              <h3 className="font-semibold mb-2">
                Votre rôle : {currentPlayer.roleSelf === 'wolf' ? '🐺 Loup-Garou' : '👨‍🌾 Villageois'}
              </h3>
              <p className="text-sm text-[var(--fg)] opacity-70">
                {currentPlayer.roleSelf === 'wolf'
                  ? 'Éliminez les villageois en secret pendant la nuit'
                  : 'Trouvez et éliminez les loups-garous par le vote'
                }
              </p>
            </div>
          )}

          {/* Vote results */}
          {game.tally && game.tally.length > 0 && (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
              <h3 className="font-semibold text-[var(--fg)] mb-3">Résultats du vote</h3>
              <div className="space-y-2">
                {game.tally.map((vote) => {
                  const player = game.players.find(p => p.id === vote.targetId);
                  return (
                    <div key={vote.targetId} className="flex items-center justify-between p-2 bg-[var(--muted)] rounded-lg">
                      <span className="font-medium">{player?.name || 'Inconnu'}</span>
                      <span className="text-sm text-[var(--fg)] opacity-70">{vote.count} vote{vote.count > 1 ? 's' : ''}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chat */}
      <div className="px-4 mt-6">
        <GameChat 
          currentUserId={currentUserId}
          user={user}
        />
      </div>
    </div>
  );
};
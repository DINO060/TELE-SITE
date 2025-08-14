import React from 'react';
import { Users, Crown, Play } from 'lucide-react';
import { GameSnapshot } from '../../types';

interface GameLobbyProps {
  game: GameSnapshot;
  currentUserId?: string;
  user?: {
    username: string;
    avatar: string;
  } | null;
  onJoin: () => void;
  onStart: () => void;
}

export const GameLobby: React.FC<GameLobbyProps> = ({
  game,
  currentUserId,
  user,
  onJoin,
  onStart,
}) => {
  const isPlayerInGame = game.players.some(p => p.id === currentUserId);
  const canStart = game.players.length >= 4;

  return (
    <div className="px-4 space-y-4">
      {/* Players list */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[var(--fg)] flex items-center space-x-2">
            <Users size={20} />
            <span>Joueurs ({game.players.length}/12)</span>
          </h3>
          <div className="text-sm text-[var(--fg)] opacity-60">
            Min. 4 joueurs
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {game.players.map((player, index) => (
            <div
              key={player.id}
              className={`flex items-center space-x-3 p-3 rounded-lg ${
                player.id === currentUserId ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-[var(--muted)]'
              }`}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {player.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-medium text-[var(--fg)]">
                  {player.name}
                  {player.id === currentUserId && ' (Vous)'}
                </p>
                <p className="text-sm text-[var(--fg)] opacity-60">
                  {index === 0 ? 'Organisateur' : 'Joueur'}
                </p>
              </div>
              {index === 0 && (
                <Crown size={16} className="text-yellow-500" />
              )}
            </div>
          ))}
        </div>

        {/* Empty slots */}
        {game.players.length < 12 && (
          <div className="mt-3 grid grid-cols-1 gap-2">
            {Array.from({ length: Math.min(3, 12 - game.players.length) }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 rounded-lg border border-dashed border-[var(--border)]">
                <div className="w-8 h-8 bg-[var(--muted)] rounded-full flex items-center justify-center">
                  <Users size={16} className="text-[var(--fg)] opacity-40" />
                </div>
                <span className="text-[var(--fg)] opacity-40">En attente d'un joueur...</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Game rules */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4">
        <h3 className="font-semibold text-[var(--fg)] mb-3">🐺 Règles du Loup-Garou</h3>
        <ul className="space-y-2 text-sm text-[var(--fg)] opacity-80">
          <li>• Les <strong>Loups-Garous</strong> éliminent secrètement les villageois la nuit</li>
          <li>• Les <strong>Villageois</strong> votent pour éliminer les suspects le jour</li>
          <li>• Les loups gagnent s'ils égalent le nombre de villageois</li>
          <li>• Les villageois gagnent s'ils éliminent tous les loups</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {user && !isPlayerInGame && (
          <button
            onClick={onJoin}
            className="w-full bg-[var(--primary)] text-white py-3 px-4 rounded-xl font-semibold hover:opacity-90 transition-colors flex items-center justify-center space-x-2"
          >
            <Users size={20} />
            <span>Rejoindre la partie</span>
          </button>
        )}

        {isPlayerInGame && canStart && (
          <button
            onClick={onStart}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Play size={20} />
            <span>Commencer la partie</span>
          </button>
        )}

        {isPlayerInGame && !canStart && (
          <div className="w-full bg-[var(--muted)] text-[var(--fg)] opacity-70 py-3 px-4 rounded-xl font-medium text-center">
            En attente de {4 - game.players.length} joueur(s) supplémentaire(s)
          </div>
        )}

        {!user && (
          <div className="w-full bg-[var(--muted)] text-[var(--fg)] opacity-70 py-3 px-4 rounded-xl font-medium text-center">
            Connectez-vous pour rejoindre la partie
          </div>
        )}
      </div>
    </div>
  );
};
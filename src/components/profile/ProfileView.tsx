import React, { useState, useEffect } from 'react';
import { Settings, Edit3, Calendar, MapPin, Link2, Users, Heart, MessageSquare, Share, Verified } from 'lucide-react';
import { User, Post } from '../../types';
import { getFeed, logout } from '../../lib/api';

interface ProfileViewProps {
  user: User;
  onLogout: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout }) => {
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'stats'>('posts');

  useEffect(() => {
    const loadUserPosts = async () => {
      try {
        const response = await getFeed({ sort: 'recent' });
        // Filter posts by current user (simplified for demo)
        const filtered = response.items.filter(post => 
          post.author.handle === user.telegramHandle?.replace('@', '') || 
          post.author.title === user.username
        );
        setUserPosts(filtered);
      } catch (error) {
        console.error('Error loading user posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserPosts();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      onLogout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const totalReactions = userPosts.reduce((sum, post) => sum + post.metrics.reactions, 0);
  const totalComments = userPosts.reduce((sum, post) => sum + post.metrics.comments, 0);
  const totalShares = userPosts.reduce((sum, post) => sum + post.metrics.shares, 0);

  return (
    <div className="pb-20 bg-[var(--bg)]">
      {/* Profile Header */}
      <div className="relative">
        {/* Cover Image */}
        <div 
          className="h-48 rounded-[var(--radius)]"
          style={{ background: 'linear-gradient(135deg, var(--grad-1), var(--grad-2))' }}
        ></div>
        
        {/* Profile Info */}
        <div className="px-4 pb-4">
          <div className="relative -mt-16 mb-4">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-24 h-24 rounded-full border-4 border-[var(--card)] shadow-[var(--shadow)]"
            />
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-[var(--primary)] text-white rounded-full flex items-center justify-center shadow-[var(--shadow)] hover:opacity-90 transition-all duration-200">
              <Edit3 size={16} />
            </button>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-2xl font-bold text-[var(--fg)]">{user.username}</h1>
                {user.verified && (
                  <Verified size={20} className="text-[var(--primary)]" />
                )}
              </div>
              {user.telegramHandle && (
                <p className="text-[var(--primary)] font-medium mb-2">{user.telegramHandle}</p>
              )}
              <p className="text-[var(--fg)] opacity-70 mb-4">
                Passionné de tech et de développement. Créateur de contenu sur Telegram 🚀
              </p>
              
              <div className="flex items-center space-x-4 text-sm text-[var(--fg)] opacity-60 mb-4">
                <div className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <span>Rejoint en 2024</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin size={16} />
                  <span>France</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Link2 size={16} />
                  <span>telegram.me/{user.telegramHandle?.replace('@', '')}</span>
                </div>
              </div>

              <div className="flex items-center space-x-6 mb-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-[var(--fg)]">
                    {formatNumber(user.followers || 0)}
                  </p>
                  <p className="text-sm text-[var(--fg)] opacity-60">Abonnés</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-[var(--fg)]">
                    {formatNumber(user.following?.length || 0)}
                  </p>
                  <p className="text-sm text-[var(--fg)] opacity-60">Abonnements</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-[var(--fg)]">
                    {userPosts.length}
                  </p>
                  <p className="text-sm text-[var(--fg)] opacity-60">Posts</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="p-2 text-[var(--fg)] opacity-70 hover:opacity-100 hover:bg-[var(--muted)] rounded-full transition-all duration-200">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
            <Heart size={20} className="text-red-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">{formatNumber(totalReactions)}</p>
            <p className="text-xs text-gray-500">Réactions</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
            <MessageSquare size={20} className="text-blue-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">{formatNumber(totalComments)}</p>
            <p className="text-xs text-gray-500">Commentaires</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
            <Share size={20} className="text-green-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">{formatNumber(totalShares)}</p>
            <p className="text-xs text-gray-500">Partages</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex space-x-1 bg-[var(--muted)] rounded-lg p-1">
          {[
            { id: 'posts', label: 'Posts' },
            { id: 'media', label: 'Médias' },
            { id: 'stats', label: 'Stats' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === id
                  ? 'bg-[var(--card)] text-[var(--fg)] shadow-sm'
                  : 'text-[var(--fg)] opacity-70 hover:opacity-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4">
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 animate-pulse">
                    <div className="h-4 bg-[var(--muted)] rounded mb-2"></div>
                    <div className="h-4 bg-[var(--muted)] rounded w-3/4 mb-3"></div>
                    <div className="h-32 bg-[var(--muted)] rounded"></div>
                  </div>
                ))}
              </div>
            ) : userPosts.length > 0 ? (
              userPosts.map(post => (
                <div key={post.id} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
                  <p className="text-[var(--fg)] mb-3 whitespace-pre-wrap">{post.body}</p>
                  {post.media && (
                    <img
                      src={post.media.url}
                      alt="Post media"
                      className="w-full h-48 object-cover rounded-lg mb-3"
                    />
                  )}
                  <div className="flex items-center justify-between text-sm text-[var(--fg)] opacity-60">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <div className="flex items-center space-x-4">
                      <span>{formatNumber(post.metrics.reactions)} ❤️</span>
                      <span>{formatNumber(post.metrics.comments)} 💬</span>
                      <span>{formatNumber(post.metrics.shares)} 🔄</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-[var(--fg)] opacity-60">Aucun post pour le moment</p>
                <p className="text-sm text-[var(--fg)] opacity-40 mt-1">Commencez à créer du contenu !</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'media' && (
          <div className="grid grid-cols-2 gap-3">
            {userPosts.filter(p => p.media).length > 0 ? (
              userPosts.filter(p => p.media).map(post => (
                <div key={post.id} className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={post.media!.url}
                    alt="Media"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <p className="text-[var(--fg)] opacity-60">Aucun média partagé</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4">
              <h3 className="font-semibold text-[var(--fg)] mb-4">Activité récente</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--fg)] opacity-70">Posts cette semaine</span>
                  <span className="font-semibold text-[var(--fg)]">{userPosts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--fg)] opacity-70">Engagement moyen</span>
                  <span className="font-semibold text-[var(--fg)]">
                    {userPosts.length > 0 
                      ? Math.round((totalReactions + totalComments) / userPosts.length)
                      : 0
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--fg)] opacity-70">Taux de réaction</span>
                  <span className="font-semibold text-green-600">
                    {userPosts.length > 0
                      ? `${((totalReactions / userPosts.length) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <div className="px-4 mt-8">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-red-700 transition-colors"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
};

export default ProfileView;
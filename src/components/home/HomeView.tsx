import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import { PostCard } from '../feed/PostCard';
import { CreatePostModal } from '../feed/CreatePostModal';
import { Post } from '../../types';
import { getFeed } from '../../lib/api';

interface HomeViewProps {
  currentUserId?: string;
  user?: {
    username: string;
    avatar: string;
  } | null;
}

export const HomeView: React.FC<HomeViewProps> = ({ currentUserId, user }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pinned' | 'media' | 'videos'>('all');
  const [sort, setSort] = useState<'recent' | 'views' | 'reactions'>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadFeed = async () => {
    try {
      setLoading(true);
      const response = await getFeed({ 
        filter, 
        sort, 
        source: 'site',
        q: searchQuery.trim() || undefined
      });
      setPosts(response.items);
    } catch (error) {
      console.error('Error loading home feed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, [filter, sort, searchQuery]);

  const handlePostCreated = () => {
    loadFeed();
  };

  const filters = [
    { id: 'all', label: 'Tous' },
    { id: 'pinned', label: 'Épinglés' },
    { id: 'media', label: 'Médias' },
    { id: 'videos', label: 'Vidéos' },
  ] as const;

  const sortOptions = [
    { id: 'recent', label: 'Récents' },
    { id: 'views', label: 'Vues' },
    { id: 'reactions', label: 'Réactions' },
  ] as const;

  return (
    <div className="pb-20">
      {/* Search Bar */}
      <div className="sticky top-16 bg-[var(--card)] border-b border-[var(--border)] px-4 py-3 z-30">
        <div className="relative mb-3">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--fg)] opacity-40" />
          <input
            type="text"
            placeholder="Rechercher dans les posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[var(--muted)] border border-[var(--border)] rounded-lg text-[var(--fg)] placeholder-[var(--fg)] placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {filters.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === id
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--muted)] text-[var(--fg)] hover:bg-[var(--border)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="text-sm border border-[var(--border)] bg-[var(--card)] text-[var(--fg)] rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              {sortOptions.map(({ id, label }) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
            <button className="p-2 text-[var(--fg)] opacity-60 hover:opacity-100 hover:bg-[var(--muted)] rounded-full transition-colors">
              <Filter size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Create post button */}
      {user && (
        <div className="p-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full flex items-center space-x-3 p-3 bg-[var(--muted)] hover:bg-[var(--border)] rounded-lg transition-colors text-left"
          >
            <img
              src={user.avatar}
              alt={user.username}
              className="w-10 h-10 rounded-full border border-[var(--border)]"
            />
            <span className="text-[var(--fg)] opacity-60">Quoi de neuf ?</span>
            <Plus size={20} className="text-[var(--primary)] ml-auto" />
          </button>
        </div>
      )}

      {/* Posts */}
      <div className="px-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 animate-pulse">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-[var(--muted)] rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-[var(--muted)] rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-[var(--border)] rounded w-1/4"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-3">
                  <div className="h-4 bg-[var(--muted)] rounded"></div>
                  <div className="h-4 bg-[var(--muted)] rounded w-3/4"></div>
                </div>
                <div className="h-48 bg-[var(--muted)] rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={currentUserId}
              showChannelBadge={false}
              onPostClick={(post) => {
                // Comportement pour les posts de site (préview/détail interne)
                console.log('Post de site cliqué:', post);
              }}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-[var(--fg)] opacity-60">
              {searchQuery ? 'Aucun post trouvé pour cette recherche' : 'Aucun post pour le moment'}
            </p>
            <p className="text-sm text-[var(--fg)] opacity-40 mt-1">
              {searchQuery ? 'Essayez avec d\'autres mots-clés' : 'Soyez le premier à créer du contenu !'}
            </p>
          </div>
        )}
      </div>

      {/* Create post modal */}
      {user && (
        <CreatePostModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onPostCreated={handlePostCreated}
          user={user}
        />
      )}
    </div>
  );
};
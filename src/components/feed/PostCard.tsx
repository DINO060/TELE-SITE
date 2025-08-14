import React, { useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal, Verified, Eye, Send } from 'lucide-react';
import { Post } from '../../types';
import { toggleLike } from '../../lib/api';

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  showChannelBadge?: boolean;
  onCommentClick?: (post: Post) => void;
  onPostClick?: (post: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  currentUserId, 
  showChannelBadge = false,
  onCommentClick, 
  onPostClick 
}) => {
  const [isLiked, setIsLiked] = useState(post.likedBy?.includes(currentUserId || '') || false);
  const [likesCount, setLikesCount] = useState(post.metrics.reactions);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!currentUserId || isLiking) return;
    
    setIsLiking(true);
    try {
      await toggleLike(post.id);
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const timeAgo = (date: string) => {
    const now = Date.now();
    const postTime = new Date(date).getTime();
    const diff = now - postTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}j`;
    if (hours > 0) return `${hours}h`;
    return 'maintenant';
  };

  const handlePostClick = () => {
    if (onPostClick) {
      onPostClick(post);
    }
  };

  return (
    <article 
      className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius)] p-4 mb-4 hover:shadow-[var(--shadow)] transition-all duration-200 cursor-pointer"
      onClick={handlePostClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img
            src={post.author.avatar}
            alt={post.author.title}
            className="w-10 h-10 rounded-full border border-[var(--border)]"
          />
          <div>
            <div className="flex items-center space-x-1">
              <h3 className="font-semibold text-[var(--fg)]">{post.author.title}</h3>
              {post.author.verified && (
                <Verified size={16} className="text-[var(--primary)]" />
              )}
            </div>
            <p className="text-sm text-[var(--fg)] opacity-60">@{post.author.handle} · {timeAgo(post.createdAt)}</p>
          </div>
        </div>
        <button className="p-2 text-[var(--fg)] opacity-60 hover:opacity-100 hover:bg-[var(--muted)] rounded-full transition-all duration-200">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Channel Badge */}
      {showChannelBadge && post.source === 'channel' && (
        <div className="mb-3">
          <span className="inline-flex items-center space-x-1 text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded-full border border-blue-500/20">
            <Send size={12} />
            <span>Channel Post</span>
          </span>
        </div>
      )}

      {/* Content */}
      <div className="mb-3">
        <p className="text-[var(--fg)] whitespace-pre-wrap">{post.body}</p>
      </div>

      {/* Media */}
      {post.media && (
        <div className="mb-3 rounded-lg overflow-hidden border border-[var(--border)]">
          {post.media.type === 'video' ? (
            <div className="relative">
              <img
                src={post.media.thumbnailUrl || post.media.url}
                alt="Video thumbnail"
                className="w-full h-auto max-h-96 object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-3">
                  <svg className="w-8 h-8 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              {post.media.durationSec && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {Math.floor(post.media.durationSec / 60)}:{(post.media.durationSec % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>
          ) : (
            <img
              src={post.media.url}
              alt="Post media"
              className="w-full h-auto max-h-96 object-cover"
            />
          )}
        </div>
      )}

      {/* Metrics */}
      {post.metrics.views && (
        <div className="flex items-center text-sm text-[var(--fg)] opacity-60 mb-3">
          <Eye size={16} className="mr-1" />
          <span>{formatNumber(post.metrics.views)} vues</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
          disabled={isLiking}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
            isLiked
              ? 'text-red-500 bg-red-500/10 hover:bg-red-500/20'
              : 'text-[var(--fg)] opacity-60 hover:text-red-500 hover:bg-red-500/10'
          } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Heart size={18} className={isLiked ? 'fill-current' : ''} />
          <span className="font-medium">{formatNumber(likesCount)}</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onCommentClick?.(post);
          }}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg text-[var(--fg)] opacity-60 hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-all duration-200"
        >
          <MessageCircle size={18} />
          <span className="font-medium">{formatNumber(post.metrics.comments)}</span>
        </button>

        <button 
          onClick={(e) => e.stopPropagation()}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg text-[var(--fg)] opacity-60 hover:text-green-500 hover:bg-green-500/10 transition-all duration-200"
        >
          <Share size={18} />
          <span className="font-medium">{formatNumber(post.metrics.shares)}</span>
        </button>
      </div>
    </article>
  );
};
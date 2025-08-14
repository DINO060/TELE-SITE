import React, { useState } from 'react';
import { X, Image, Video, Calendar } from 'lucide-react';
import { createPost } from '../../lib/api';
import { Media } from '../../types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
  user: {
    username: string;
    avatar: string;
  };
}

export function CreatePostModal({
  isOpen,
  onClose,
  onPostCreated,
  user,
}: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<Media | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setError('');

    try {
      await createPost({
        body: content.trim(),
        media,
      });
      setContent('');
      setMedia(undefined);
      onPostCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création du post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaAdd = (type: 'image' | 'video') => {
    // Simulate media addition
    const mockMedia: Media = {
      url: type === 'image' 
        ? 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800'
        : 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      type,
      durationSec: type === 'video' ? 60 : undefined,
    };
    setMedia(mockMedia);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--card)] rounded-xl shadow-[var(--shadow)] w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold text-[var(--fg)]">Nouveau post</h2>
          <button
            onClick={onClose}
            className="p-2 text-[var(--fg)] opacity-60 hover:opacity-100 hover:bg-[var(--muted)] rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 p-4">
            {/* User info */}
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-10 h-10 rounded-full border border-[var(--border)]"
              />
              <span className="font-medium text-[var(--fg)]">{user.username}</span>
            </div>

            {/* Text input */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Quoi de neuf ?"
              className="w-full h-32 p-3 border border-[var(--border)] bg-[var(--card)] text-[var(--fg)] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              autoFocus
            />

            {/* Media preview */}
            {media && (
              <div className="mt-3 relative rounded-lg overflow-hidden border border-[var(--border)]">
                <img
                  src={media.url}
                  alt="Media preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setMedia(undefined)}
                  className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between p-4 border-t border-[var(--border)]">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleMediaAdd('image')}
                className="p-2 text-[var(--fg)] opacity-60 hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-full transition-colors"
              >
                <Image size={20} />
              </button>
              <button
                type="button"
                onClick={() => handleMediaAdd('video')}
                className="p-2 text-[var(--fg)] opacity-60 hover:text-purple-500 hover:bg-purple-500/10 rounded-full transition-colors"
              >
                <Video size={20} />
              </button>
              <button
                type="button"
                className="p-2 text-[var(--fg)] opacity-60 hover:text-green-500 hover:bg-green-500/10 rounded-full transition-colors"
              >
                <Calendar size={20} />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-[var(--fg)] opacity-60">{content.length}/280</span>
              <button
                type="submit"
                disabled={!content.trim() || isSubmitting}
                className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSubmitting ? 'Publication...' : 'Publier'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
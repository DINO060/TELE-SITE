import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile } from 'lucide-react';
import { GroupMessage } from '../../types';
import { getGameMessages, sendGameMessage } from '../../lib/api';

interface GameChatProps {
  currentUserId?: string;
  user?: {
    username: string;
    avatar: string;
  } | null;
}

export const GameChat: React.FC<GameChatProps> = ({ currentUserId, user }) => {
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadMessages = async () => {
    try {
      const msgs = await getGameMessages();
      setMessages(msgs);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || sending) return;

    setSending(true);
    try {
      await sendGameMessage(newMessage.trim());
      setNewMessage('');
      await loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const timeAgo = (date: string) => {
    const now = Date.now();
    const msgTime = new Date(date).getTime();
    const diff = now - msgTime;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}min`;
    return 'maintenant';
  };

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <h3 className="font-semibold text-[var(--fg)]">Chat de la partie</h3>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[var(--fg)] opacity-60">Aucun message pour le moment</p>
            <p className="text-sm text-[var(--fg)] opacity-40 mt-1">Soyez le premier à écrire !</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.userId === currentUserId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                  message.userId === currentUserId
                    ? 'bg-blue-600 text-white'
                    : 'bg-[var(--muted)] text-[var(--fg)]'
                }`}
              >
                {message.userId !== currentUserId && (
                  <p className="text-xs font-medium mb-1 opacity-70">
                    {message.username}
                  </p>
                )}
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 opacity-70 ${
                  message.userId === currentUserId ? 'text-right' : 'text-left'
                }`}>
                  {timeAgo(message.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {user ? (
        <form onSubmit={handleSendMessage} className="p-4 border-t border-[var(--border)]">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="p-2 text-[var(--fg)] opacity-60 hover:opacity-100 hover:bg-[var(--muted)] rounded-full transition-colors"
            >
              <Smile size={20} />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="w-full px-3 py-2 border border-[var(--border)] bg-[var(--card)] text-[var(--fg)] rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                maxLength={200}
              />
            </div>
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="p-2 bg-[var(--primary)] text-white rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 border-t border-[var(--border)] text-center">
          <p className="text-[var(--fg)] opacity-60 text-sm">Connectez-vous pour participer au chat</p>
        </div>
      )}
    </div>
  );
};
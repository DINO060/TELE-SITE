import React from 'react';
import { Verified, TrendingUp, TrendingDown, Eye, Heart, MessageSquare } from 'lucide-react';
import { Channel, Kpis } from '../../types';

interface ChannelCardProps {
  channel: Channel;
  kpis?: Kpis;
  onChannelClick?: (channel: Channel) => void;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({ 
  channel, 
  kpis, 
  onChannelClick 
}) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const isGrowthPositive = (kpis?.growth24hPct || 0) >= 0;

  return (
    <div 
      className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 hover:shadow-[var(--shadow)] transition-all duration-200 cursor-pointer"
      onClick={() => onChannelClick?.(channel)}
    >
      {/* Header with cover image */}
      <div className="relative -m-4 mb-4 h-24 rounded-t-xl overflow-hidden">
        <img
          src={channel.coverImage || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400'}
          alt={`${channel.title} cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-2 left-4 flex items-center">
          <img
            src={channel.avatar}
            alt={channel.title}
            className="w-12 h-12 rounded-full border-2 border-white mr-3"
          />
          <div>
            <div className="flex items-center space-x-1">
              <h3 className="font-semibold text-white">{channel.title}</h3>
              {channel.verified && (
                <Verified size={16} className="text-blue-400" />
              )}
            </div>
            <p className="text-sm text-white/90">@{channel.handle}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-[var(--fg)] opacity-70 text-sm mb-4 line-clamp-2">{channel.description}</p>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Followers */}
        <div className="text-center">
          <p className="text-lg font-bold text-[var(--fg)]">
            {formatNumber(channel.followers)}
          </p>
          <p className="text-xs text-[var(--fg)] opacity-60">Abonnés</p>
          {kpis && (
            <div className={`flex items-center justify-center space-x-1 text-xs font-medium mt-1 ${
              isGrowthPositive ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {isGrowthPositive ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              <span>{Math.abs(kpis.growth24hPct).toFixed(1)}%</span>
            </div>
          )}
        </div>

        {/* Engagement */}
        <div className="text-center">
          <p className="text-lg font-bold text-[var(--fg)]">
            {kpis ? `${kpis.engagementRate.toFixed(1)}%` : '-'}
          </p>
          <p className="text-xs text-[var(--fg)] opacity-60">Engagement</p>
        </div>
      </div>

      {/* Additional metrics */}
      {kpis && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]">
          <div className="flex items-center space-x-1 text-xs text-[var(--fg)] opacity-60">
            <Eye size={12} />
            <span>{formatNumber(kpis.viewsPerPost || 0)}/post</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-[var(--fg)] opacity-60">
            <MessageSquare size={12} />
            <span>{kpis.postsPerDay.toFixed(1)}/jour</span>
          </div>
        </div>
      )}

      {/* Category badge */}
      {channel.category && (
        <div className="mt-3">
          <span className="inline-block px-2 py-1 bg-[var(--muted)] text-[var(--fg)] opacity-70 text-xs rounded-full">
            {channel.category}
          </span>
        </div>
      )}
    </div>
  );
};
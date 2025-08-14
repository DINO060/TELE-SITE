import React, { useState, useEffect } from 'react';
import { Users, Eye, Heart, TrendingUp, Filter, ChevronDown } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { ChannelCard } from './ChannelCard';
import { Channel, Kpis, User } from '../../types';
import { getChannels, getChannelKpis, getCurrentUser } from '../../lib/api';

export const AnalyticsView: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelKpis, setChannelKpis] = useState<Record<string, Kpis>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'owned' | 'following' | 'top'>('owned');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    
    const loadData = async () => {
      try {
        const channelsData = await getChannels();
        setChannels(channelsData);

        // Load KPIs for each channel
        const kpisPromises = channelsData.map(async (channel) => {
          const kpis = await getChannelKpis(channel.handle);
          return { handle: channel.handle, kpis };
        });

        const kpisResults = await Promise.all(kpisPromises);
        const kpisMap: Record<string, Kpis> = {};
        kpisResults.forEach(({ handle, kpis }) => {
          if (kpis) kpisMap[handle] = kpis;
        });
        setChannelKpis(kpisMap);
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate global metrics for user's channels only
  const globalMetrics = React.useMemo(() => {
    if (!currentUser) return { totalFollowers: 0, totalViewsPerPost: 0, avgEngagement: 0, avgGrowth: 0 };
    
    // Only calculate for user's owned channels
    const userChannels = channels.filter(c => currentUser.ownedChannels?.includes(c.id));
    const userChannelKpis = userChannels.map(c => channelKpis[c.handle]).filter(Boolean);
    
    const totalFollowers = userChannels.reduce((sum, channel) => sum + channel.followers, 0);
    const totalViewsPerPost = userChannelKpis.reduce((sum, kpis) => sum + (kpis.viewsPerPost || 0), 0);
    const avgEngagement = userChannelKpis.reduce((sum, kpis) => sum + kpis.engagementRate, 0) / userChannelKpis.length || 0;
    const avgGrowth = userChannelKpis.reduce((sum, kpis) => sum + kpis.growth24hPct, 0) / userChannelKpis.length || 0;

    return {
      totalFollowers,
      totalViewsPerPost,
      avgEngagement,
      avgGrowth,
    };
  }, [channels, channelKpis, currentUser]);

  // Filter channels based on selected filter
  const filteredChannels = React.useMemo(() => {
    if (!currentUser) return [];
    
    switch (filter) {
      case 'owned':
        return channels.filter(c => currentUser.ownedChannels?.includes(c.id));
      case 'following':
        return channels.filter(c => currentUser.followingChannels?.includes(c.id));
      case 'top':
        return [...channels].sort((a, b) => b.followers - a.followers).slice(0, 10);
      default:
        return channels;
    }
  }, [channels, filter, currentUser]);

  const filterOptions = [
    { id: 'owned', label: 'Mes canaux', count: currentUser?.ownedChannels?.length || 0 },
    { id: 'following', label: 'Following', count: currentUser?.followingChannels?.length || 0 },
    { id: 'top', label: 'Top canaux', count: 10 },
  ];

  const currentFilterLabel = filterOptions.find(f => f.id === filter)?.label || 'Mes canaux';

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return Math.round(num).toString();
  };

  return (
    <div className="pb-20">
      {/* Global metrics */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--fg)]">Mes métriques globales</h2>
          <span className="text-sm text-[var(--fg)] opacity-60">
            {currentUser?.ownedChannels?.length || 0} canal(aux)
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            title="Abonnés totaux"
            value={formatNumber(globalMetrics.totalFollowers)}
            change={{
              value: globalMetrics.avgGrowth,
              label: '24h',
            }}
            icon={<Users size={20} />}
            color="blue"
          />
          <MetricCard
            title="Vues moyennes"
            value={formatNumber(globalMetrics.totalViewsPerPost)}
            icon={<Eye size={20} />}
            color="green"
          />
          <MetricCard
            title="Engagement moyen"
            value={`${globalMetrics.avgEngagement.toFixed(1)}%`}
            icon={<Heart size={20} />}
            color="purple"
          />
          <MetricCard
            title="Croissance"
            value={`${Math.abs(globalMetrics.avgGrowth).toFixed(1)}%`}
            change={{
              value: globalMetrics.avgGrowth,
              label: '24h',
            }}
            icon={<TrendingUp size={20} />}
            color="orange"
          />
        </div>
      </div>

      {/* Channels grid */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--fg)]">
            Canaux ({filteredChannels.length})
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-[var(--fg)] opacity-60">Types</span>
            <div className="relative">
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-[var(--fg)] bg-[var(--card)] border border-[var(--border)] rounded-lg hover:bg-[var(--muted)] transition-colors"
              >
                <Filter size={16} />
                <span>{currentFilterLabel}</span>
                <ChevronDown size={16} className={`transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showFilterDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-[var(--shadow)] z-10">
                  {filterOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setFilter(option.id as any);
                        setShowFilterDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-[var(--muted)] transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        filter === option.id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option.label}</span>
                        <span className="text-xs text-[var(--fg)] opacity-40">({option.count})</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 animate-pulse">
                <div className="h-24 bg-[var(--muted)] rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-[var(--muted)] rounded w-3/4"></div>
                  <div className="h-3 bg-[var(--border)] rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredChannels.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                kpis={channelKpis[channel.handle]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
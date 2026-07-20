'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { Tv, Search, X, Play, ShieldAlert, Star } from 'lucide-react';
import { IptvChannel, IptvPlaylist } from '@/utils/m3uParser';
import { useIptvStore } from '@/hooks/useIptvStore';

interface IptvChannelGuideProps {
  isOpen: boolean;
  onClose: () => void;
  playlist: IptvPlaylist | null;
  currentStreamUrl: string;
  onSelectChannel: (channel: IptvChannel) => void;
}

export const IptvChannelGuide: React.FC<IptvChannelGuideProps> = ({
  isOpen,
  onClose,
  playlist,
  currentStreamUrl,
  onSelectChannel,
}) => {
  const { toggleFavorite, isFavorite } = useIptvStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(60);

  if (!isOpen || !playlist) return null;

  const filteredChannels = playlist.channels.filter((channel) => {
    const matchesSearch =
      channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (channel.group && channel.group.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' ||
      (channel.group && channel.group.toLowerCase().includes(selectedCategory.toLowerCase()));

    return matchesSearch && matchesCategory;
  });

  const pagedChannels = filteredChannels.slice(0, visibleCount);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-[#141416] border-l border-white/10 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#1B1B1E]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 flex items-center justify-center border border-red-500/30">
              <Tv className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                {playlist.name}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-cyan-400">
                  {playlist.channels.length} ch
                </span>
              </h2>
              <p className="text-[11px] text-[#A1A1AA]">Select channel to stream live</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-3 border-b border-white/10 space-y-2.5 bg-[#18181B]">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#71717A]" />
            <input
              type="text"
              placeholder="Search channel or group..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-[#09090B] border border-white/10 rounded-lg text-white placeholder-[#71717A] focus:outline-none focus:border-red-500 transition-colors font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-[#71717A] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Categories Pill Selector */}
          {playlist.categories.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-white text-black font-bold'
                    : 'bg-white/5 text-[#A1A1AA] hover:bg-white/10 hover:text-white'
                }`}
              >
                All ({playlist.channels.length})
              </button>
              {playlist.categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-white text-black font-bold'
                      : 'bg-white/5 text-[#A1A1AA] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredChannels.length === 0 ? (
            <div className="p-8 text-center text-[#71717A] space-y-2">
              <ShieldAlert className="w-8 h-8 mx-auto opacity-50" />
              <p className="text-xs font-mono">No channels found matching query.</p>
            </div>
          ) : (
            <>
              {pagedChannels.map((channel) => {
                const isActive = channel.streamUrl === currentStreamUrl;
                const fav = isFavorite(channel.streamUrl);
                return (
                  <div
                    key={channel.id}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all text-left group ${
                      isActive
                        ? 'bg-red-600/15 border-red-500/50 text-white shadow-md'
                        : 'bg-[#18181B]/60 hover:bg-[#27272A] border-white/5 text-[#D4D4D8]'
                    }`}
                  >
                    <div
                      onClick={() => {
                        onSelectChannel(channel);
                        onClose();
                      }}
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                    >
                      {/* Logo / Thumbnail */}
                      {channel.logo ? (
                        <img
                          src={channel.logo}
                          alt={channel.name}
                          className="w-7 h-7 object-contain rounded bg-black/40 p-0.5 flex-shrink-0 border border-white/10"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-7 h-7 rounded bg-white/10 flex items-center justify-center text-[10px] font-mono font-bold text-[#A1A1AA] flex-shrink-0">
                          {channel.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs font-semibold truncate group-hover:text-white transition-colors">
                          {channel.name}
                        </h3>
                        {channel.group && (
                          <span className="text-[10px] font-mono text-[#A1A1AA] block truncate">
                            {channel.group}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => toggleFavorite(channel)}
                        className={`p-1 rounded transition-colors ${
                          fav ? 'text-yellow-400' : 'text-[#555558] hover:text-white'
                        }`}
                        title={fav ? 'Remove from Favorites' : 'Add to Favorites'}
                      >
                        <Star className={`w-3.5 h-3.5 ${fav ? 'fill-current' : ''}`} />
                      </button>

                      {isActive ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold font-mono text-red-500 px-1.5 py-0.5 rounded bg-red-500/10">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            onSelectChannel(channel);
                            onClose();
                          }}
                          className="w-6 h-6 rounded bg-white/10 group-hover:bg-white text-black flex items-center justify-center transition-all"
                        >
                          <Play className="w-3 h-3 fill-black ml-0.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredChannels.length > visibleCount && (
                <div className="p-3 text-center">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 60)}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono text-white transition-colors"
                  >
                    Load More Channels ({filteredChannels.length - visibleCount} left)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

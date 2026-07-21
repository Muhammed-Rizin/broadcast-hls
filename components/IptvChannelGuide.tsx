"use client";

import React, { useState, useMemo } from "react";
import { Tv, Search, X, ShieldAlert } from "lucide-react";
import { IptvChannel, IptvPlaylist } from "@/utils/m3uParser";
import { useIptvStore } from "@/hooks/useIptvStore";
import { IptvChannelRow } from "./iptv/IptvChannelRow";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(60);

  const filteredChannels = useMemo(() => {
    if (!playlist) return [];
    const query = searchQuery.toLowerCase();
    const cat = selectedCategory.toLowerCase();

    return playlist.channels.filter((channel) => {
      const matchesSearch =
        !query ||
        channel.name.toLowerCase().includes(query) ||
        (channel.group && channel.group.toLowerCase().includes(query));

      const matchesCategory =
        selectedCategory === "all" ||
        (channel.group && channel.group.toLowerCase().includes(cat));

      return matchesSearch && matchesCategory;
    });
  }, [playlist, searchQuery, selectedCategory]);

  const pagedChannels = useMemo(() => {
    return filteredChannels.slice(0, visibleCount);
  }, [filteredChannels, visibleCount]);

  if (!isOpen || !playlist) return null;

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
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none" />
            <input
              type="text"
              placeholder="Search channel or group..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs bg-[#09090B] border border-white/10 rounded-lg text-white placeholder-[#71717A] focus:outline-none focus:border-red-500 transition-colors font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-white flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Categories Pill Selector */}
          {playlist.categories.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-colors ${
                  selectedCategory === "all"
                    ? "bg-white text-black font-bold"
                    : "bg-white/5 text-[#A1A1AA] hover:bg-white/10 hover:text-white"
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
                      ? "bg-white text-black font-bold"
                      : "bg-white/5 text-[#A1A1AA] hover:bg-white/10 hover:text-white"
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
              {pagedChannels.map((channel) => (
                <IptvChannelRow
                  key={channel.id}
                  channel={channel}
                  isActive={channel.streamUrl === currentStreamUrl}
                  isFav={isFavorite(channel.streamUrl)}
                  onSelectChannel={onSelectChannel}
                  onToggleFavorite={toggleFavorite}
                  onClose={onClose}
                />
              ))}

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

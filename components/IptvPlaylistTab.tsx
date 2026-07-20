"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef } from "react";
import {
  Tv,
  Search,
  Plus,
  Upload,
  Star,
  Trash2,
  Play,
  Loader2,
  X,
  ListFilter,
  Globe,
  Film,
  Newspaper,
  Trophy,
  Music,
  Languages,
} from "lucide-react";
import { IptvChannel } from "@/utils/m3uParser";
import { useIptvStore } from "@/hooks/useIptvStore";

export const FEATURED_IPTV_PRESETS = [
  {
    name: "All Channels (12,000+)",
    url: "https://iptv-org.github.io/iptv/index.m3u",
    description: "Complete global IPTV channel index",
    tag: "12,000+ Ch",
    icon: Globe,
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  },
  {
    name: "Grouped by Category",
    url: "https://iptv-org.github.io/iptv/index.category.m3u",
    description: "Channels grouped into News, Sports, Movies, etc.",
    tag: "Categories",
    icon: ListFilter,
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
  {
    name: "News Channels (930+)",
    url: "https://iptv-org.github.io/iptv/categories/news.m3u",
    description: "Global 24/7 live news broadcasts",
    tag: "930 Ch",
    icon: Newspaper,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    name: "Sports Channels (320+)",
    url: "https://iptv-org.github.io/iptv/categories/sports.m3u",
    description: "Live sports, football, racing & athletics",
    tag: "320 Ch",
    icon: Trophy,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    name: "Movies & Cinema (350+)",
    url: "https://iptv-org.github.io/iptv/categories/movies.m3u",
    description: "Live movie channels & cinema streams",
    tag: "350 Ch",
    icon: Film,
    color: "text-red-400 bg-red-500/10 border-red-500/20",
  },
  {
    name: "Music & Hits (650+)",
    url: "https://iptv-org.github.io/iptv/categories/music.m3u",
    description: "Music video channels & radio broadcasts",
    tag: "650 Ch",
    icon: Music,
    color: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  },
  {
    name: "Grouped by Country",
    url: "https://iptv-org.github.io/iptv/index.country.m3u",
    description: "Channels organized by national country folders",
    tag: "By Country",
    icon: Globe,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    name: "Grouped by Language",
    url: "https://iptv-org.github.io/iptv/index.language.m3u",
    description: "Channels organized by spoken language folders",
    tag: "By Language",
    icon: Languages,
    color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  },
];

interface IptvPlaylistTabProps {
  onPlayChannel: (channel: IptvChannel) => void;
  currentStreamUrl: string;
}

export const IptvPlaylistTab: React.FC<IptvPlaylistTabProps> = ({
  onPlayChannel,
  currentStreamUrl,
}) => {
  const {
    playlists,
    activePlaylist,
    activePlaylistId,
    setActivePlaylistId,
    favorites,
    toggleFavorite,
    isFavorite,
    importPlaylistUrl,
    importPlaylistFile,
    deletePlaylist,
    isLoading,
  } = useIptvStore();

  const [inputUrl, setInputUrl] = useState("");
  const [customName, setCustomName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(100);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    const imported = await importPlaylistUrl(inputUrl.trim(), customName.trim() || undefined);
    if (imported) {
      setInputUrl("");
      setCustomName("");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await importPlaylistFile(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const channelsToDisplay = showFavoritesOnly
    ? favorites
    : activePlaylist
      ? activePlaylist.channels
      : [];

  const filteredChannels = channelsToDisplay.filter((ch) => {
    const matchesSearch =
      ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ch.group && ch.group.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" ||
      (ch.group && ch.group.toLowerCase().includes(selectedCategory.toLowerCase()));

    return matchesSearch && matchesCategory;
  });

  const pagedChannels = filteredChannels.slice(0, visibleCount);

  return (
    <div className="space-y-6">
      {/* Header & Playlist Import Section */}
      <div className="broadcast-card p-6 bg-[#141416] border border-white/10 rounded-[14px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                IPTV Channel Guide & Playlist Manager
              </h2>
              <p className="text-xs text-[#A1A1AA]">
                Import IPTV playlists (<code className="text-cyan-400">.m3u</code>), search
                thousands of live channels, and star favorites
              </p>
            </div>
          </div>

          {/* Disk File Upload Button */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".m3u,.m3u8,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="px-4 py-2 bg-[#1B1B1D] hover:bg-[#27272A] border border-white/10 rounded-[10px] text-xs font-semibold text-white flex items-center gap-2 transition-all"
            >
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Upload .M3U File</span>
            </button>
          </div>
        </div>

        {/* Remote M3U URL Form */}
        <form
          onSubmit={handleUrlSubmit}
          className="flex flex-col sm:flex-row items-center gap-2 mb-6"
        >
          <input
            type="text"
            placeholder="Enter remote M3U URL (e.g. https://iptv-org.github.io/iptv/categories/sports.m3u)"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="flex-1 bg-[#09090B] border border-white/10 rounded-[10px] px-3.5 py-2 text-xs text-white placeholder-[#555558] font-mono focus:outline-none focus:border-red-500 transition-colors w-full"
          />
          <button
            type="submit"
            disabled={isLoading || !inputUrl.trim()}
            className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs rounded-[10px] flex items-center justify-center gap-2 transition-all disabled:opacity-50 shrink-0 shadow-md"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Import Playlist</span>
              </>
            )}
          </button>
        </form>

        {/* Featured IPTV Presets Grid */}
        <div>
          <h3 className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider mb-2 flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-red-500" />
            <span>Curated IPTV Playlists (12,000+ Live Channels)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {FEATURED_IPTV_PRESETS.map((preset, idx) => {
              const IconComp = preset.icon;
              return (
                <button
                  key={idx}
                  onClick={() => importPlaylistUrl(preset.url, preset.name)}
                  disabled={isLoading}
                  className="p-3 bg-[#09090B] hover:bg-[#1C1C1E] border border-white/10 rounded-[10px] text-left transition-all group flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <IconComp className="w-4 h-4 text-white shrink-0" />
                      <span className="text-xs font-bold text-white group-hover:text-red-400 transition-colors truncate">
                        {preset.name}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 font-bold ${preset.color}`}
                    >
                      {preset.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#A1A1AA] line-clamp-1">{preset.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Saved Playlists & View Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#141416] p-4 border border-white/10 rounded-[14px]">
        {/* Saved Playlists Switcher */}
        <div className="flex items-center gap-3 overflow-x-auto">
          <button
            onClick={() => setShowFavoritesOnly(false)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              !showFavoritesOnly
                ? "bg-white text-black font-bold"
                : "bg-[#1B1B1D] text-[#A1A1AA] hover:text-white"
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>
              {activePlaylist ? activePlaylist.name : "No Playlist Selected"}
              {activePlaylist && ` (${activePlaylist.channels.length})`}
            </span>
          </button>

          <button
            onClick={() => setShowFavoritesOnly(true)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
              showFavoritesOnly
                ? "bg-yellow-500 text-black font-bold"
                : "bg-[#1B1B1D] text-[#A1A1AA] hover:text-white"
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current text-yellow-400" />
            <span>Starred Favorites ({favorites.length})</span>
          </button>

          {/* Playlist Dropdown */}
          {playlists.length > 1 && !showFavoritesOnly && (
            <select
              value={activePlaylistId || ""}
              onChange={(e) => setActivePlaylistId(e.target.value)}
              className="bg-[#09090B] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
            >
              {playlists.map((pl) => (
                <option key={pl.id} value={pl.id}>
                  {pl.name} ({pl.channels.length} ch)
                </option>
              ))}
            </select>
          )}

          {activePlaylist && !showFavoritesOnly && (
            <button
              onClick={() => deletePlaylist(activePlaylist.id)}
              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
              title="Delete Playlist"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72 flex items-center">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A] pointer-events-none" />
          <input
            type="text"
            placeholder="Search channel or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs bg-[#09090B] border border-white/10 rounded-lg text-white placeholder-[#71717A] focus:outline-none focus:border-red-500 transition-colors"
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
      </div>

      {/* Category Pills */}
      {activePlaylist && activePlaylist.categories.length > 0 && !showFavoritesOnly && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1 rounded-md text-xs font-mono whitespace-nowrap transition-colors ${
              selectedCategory === "all"
                ? "bg-white text-black font-bold"
                : "bg-[#18181B] text-[#A1A1AA] hover:bg-[#27272A] hover:text-white"
            }`}
          >
            All Categories ({activePlaylist.channels.length})
          </button>
          {activePlaylist.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md text-xs font-mono whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-white text-black font-bold"
                  : "bg-[#18181B] text-[#A1A1AA] hover:bg-[#27272A] hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Channels Grid View */}
      {filteredChannels.length === 0 ? (
        <div className="broadcast-card p-12 text-center text-[#7A7A7D] space-y-3 bg-[#141416] border border-white/10 rounded-[14px]">
          <Tv className="w-10 h-10 mx-auto opacity-40" />
          <p className="text-sm font-semibold text-white">No channels found</p>
          <p className="text-xs max-w-sm mx-auto">
            Click any of the curated IPTV playlists above, import an M3U URL, or upload a{" "}
            <code className="text-cyan-400">.m3u</code> file from your computer.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {pagedChannels.map((channel) => {
              const isActive = channel.streamUrl === currentStreamUrl;
              const fav = isFavorite(channel.streamUrl);
              return (
                <div
                  key={channel.id}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 group ${
                    isActive
                      ? "bg-red-600/15 border-red-500/50 shadow-lg"
                      : "bg-[#141416] hover:bg-[#1C1C1E] border-white/10"
                  }`}
                >
                  <div
                    onClick={() => onPlayChannel(channel)}
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                  >
                    {/* Logo */}
                    {channel.logo ? (
                      <img
                        src={channel.logo}
                        alt={channel.name}
                        className="w-9 h-9 object-contain rounded-lg bg-black/50 p-1 flex-shrink-0 border border-white/10"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-xs font-mono font-bold text-white flex-shrink-0">
                        {channel.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs font-bold text-white truncate group-hover:text-red-400 transition-colors">
                        {channel.name}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-[#A1A1AA] truncate">
                        {channel.group && <span className="truncate">{channel.group}</span>}
                        {channel.country && (
                          <span className="px-1 bg-white/10 rounded">{channel.country}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => toggleFavorite(channel)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        fav
                          ? "text-yellow-400 hover:text-yellow-300"
                          : "text-[#555558] hover:text-white"
                      }`}
                      title={fav ? "Remove from Favorites" : "Add to Favorites"}
                    >
                      <Star className={`w-4 h-4 ${fav ? "fill-current" : ""}`} />
                    </button>

                    <button
                      onClick={() => onPlayChannel(channel)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                        isActive
                          ? "bg-red-600 text-white"
                          : "bg-white/10 group-hover:bg-white text-white group-hover:text-black"
                      }`}
                      title="Play Channel"
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Load More Button */}
          {filteredChannels.length > visibleCount && (
            <div className="text-center pt-4">
              <button
                onClick={() => setVisibleCount((prev) => prev + 100)}
                className="px-6 py-2.5 bg-[#1B1B1D] hover:bg-[#27272A] border border-white/10 rounded-xl text-xs font-bold text-white transition-all shadow-md"
              >
                Load More Channels ({filteredChannels.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

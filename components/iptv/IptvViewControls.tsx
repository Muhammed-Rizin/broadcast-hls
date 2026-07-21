"use client";

import React, { memo } from "react";
import { ListFilter, Star, Trash2, Search, X } from "lucide-react";
import { IptvPlaylist } from "@/utils/m3uParser";

interface IptvViewControlsProps {
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (val: boolean) => void;
  activePlaylist: IptvPlaylist | null;
  favoritesCount: number;
  playlists: IptvPlaylist[];
  activePlaylistId: string | null;
  setActivePlaylistId: (id: string) => void;
  onDeletePlaylist: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const IptvViewControls: React.FC<IptvViewControlsProps> = memo(
  ({
    showFavoritesOnly,
    setShowFavoritesOnly,
    activePlaylist,
    favoritesCount,
    playlists,
    activePlaylistId,
    setActivePlaylistId,
    onDeletePlaylist,
    searchQuery,
    setSearchQuery,
  }) => {
    return (
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
            <span>Starred Favorites ({favoritesCount})</span>
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
              onClick={() => onDeletePlaylist(activePlaylist.id)}
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
    );
  }
);

IptvViewControls.displayName = "IptvViewControls";

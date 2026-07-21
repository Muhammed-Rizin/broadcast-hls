"use client";

import React, { useState, useRef, useMemo, useCallback } from "react";
import { Tv } from "lucide-react";
import { IptvChannel } from "@/utils/m3uParser";
import { useIptvStore } from "@/hooks/useIptvStore";
import { IptvPresetGrid } from "./iptv/IptvPresetGrid";
import { IptvImportBar } from "./iptv/IptvImportBar";
import { IptvViewControls } from "./iptv/IptvViewControls";
import { IptvCategoryPills } from "./iptv/IptvCategoryPills";
import { IptvChannelCard } from "./iptv/IptvChannelCard";

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

  const handleUrlSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!inputUrl.trim()) return;
      const imported = await importPlaylistUrl(inputUrl.trim(), customName.trim() || undefined);
      if (imported) {
        setInputUrl("");
        setCustomName("");
      }
    },
    [inputUrl, customName, importPlaylistUrl]
  );

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        await importPlaylistFile(file);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [importPlaylistFile]
  );

  const handleSelectPreset = useCallback(
    (url: string, name: string) => {
      importPlaylistUrl(url, name);
    },
    [importPlaylistUrl]
  );

  const channelsToDisplay = useMemo(() => {
    return showFavoritesOnly
      ? favorites
      : activePlaylist
      ? activePlaylist.channels
      : [];
  }, [showFavoritesOnly, favorites, activePlaylist]);

  const filteredChannels = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const cat = selectedCategory.toLowerCase();

    return channelsToDisplay.filter((ch) => {
      const matchesSearch =
        !query ||
        ch.name.toLowerCase().includes(query) ||
        (ch.group && ch.group.toLowerCase().includes(query));

      const matchesCategory =
        selectedCategory === "all" ||
        (ch.group && ch.group.toLowerCase().includes(cat));

      return matchesSearch && matchesCategory;
    });
  }, [channelsToDisplay, searchQuery, selectedCategory]);

  const pagedChannels = useMemo(() => {
    return filteredChannels.slice(0, visibleCount);
  }, [filteredChannels, visibleCount]);

  return (
    <div className="space-y-6">
      {/* Header & Playlist Import Section */}
      <div className="space-y-4">
        <IptvImportBar
          inputUrl={inputUrl}
          setInputUrl={setInputUrl}
          onSubmitUrl={handleUrlSubmit}
          onFileUpload={handleFileUpload}
          isLoading={isLoading}
          fileInputRef={fileInputRef}
        />

        <div className="broadcast-card p-6 bg-[#141416] border border-white/10 rounded-[14px]">
          <IptvPresetGrid onSelectPreset={handleSelectPreset} isLoading={isLoading} />
        </div>
      </div>

      {/* Saved Playlists & View Controls Bar */}
      <IptvViewControls
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        activePlaylist={activePlaylist}
        favoritesCount={favorites.length}
        playlists={playlists}
        activePlaylistId={activePlaylistId}
        setActivePlaylistId={setActivePlaylistId}
        onDeletePlaylist={deletePlaylist}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Category Pills */}
      {activePlaylist && !showFavoritesOnly && (
        <IptvCategoryPills
          categories={activePlaylist.categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          totalChannelsCount={activePlaylist.channels.length}
        />
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
            {pagedChannels.map((channel) => (
              <IptvChannelCard
                key={channel.id}
                channel={channel}
                isActive={channel.streamUrl === currentStreamUrl}
                isFav={isFavorite(channel.streamUrl)}
                onPlayChannel={onPlayChannel}
                onToggleFavorite={toggleFavorite}
              />
            ))}
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

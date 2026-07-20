'use client';

import { useState, useEffect, useCallback } from 'react';
import { IptvChannel, IptvPlaylist, parseM3uPlaylist } from '@/utils/m3uParser';

const PLAYLISTS_STORAGE_KEY = 'broadcast_hls_iptv_playlists';
const FAVORITES_STORAGE_KEY = 'broadcast_hls_iptv_favorites';
const ACTIVE_PLAYLIST_KEY = 'broadcast_hls_active_playlist_id';

export function useIptvStore() {
  const [playlists, setPlaylists] = useState<IptvPlaylist[]>([]);
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<IptvChannel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const storedPlaylists = localStorage.getItem(PLAYLISTS_STORAGE_KEY);
      if (storedPlaylists) {
        const parsed = JSON.parse(storedPlaylists);
        if (Array.isArray(parsed)) setPlaylists(parsed);
      }

      const storedFavs = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (storedFavs) {
        const parsedFavs = JSON.parse(storedFavs);
        if (Array.isArray(parsedFavs)) setFavorites(parsedFavs);
      }

      const activeId = localStorage.getItem(ACTIVE_PLAYLIST_KEY);
      if (activeId) setActivePlaylistId(activeId);
    } catch (err) {
      console.warn('Failed to load IPTV data from localStorage:', err);
    }
  }, []);

  // Save Playlists to LocalStorage
  const savePlaylists = useCallback((newList: IptvPlaylist[]) => {
    setPlaylists(newList);
    try {
      localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(newList));
    } catch (err) {
      console.warn('Failed to save IPTV playlists to localStorage:', err);
    }
  }, []);

  // Save Favorites to LocalStorage
  const saveFavorites = useCallback((newFavs: IptvChannel[]) => {
    setFavorites(newFavs);
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavs));
    } catch (err) {
      console.warn('Failed to save IPTV favorites to localStorage:', err);
    }
  }, []);

  // Add Remote URL Playlist
  const importPlaylistUrl = useCallback(
    async (url: string, customName?: string): Promise<IptvPlaylist | null> => {
      setIsLoading(true);
      try {
        const proxyUrl = `/api/stream/proxy?url=${encodeURIComponent(url)}`;
        const res = await fetch(proxyUrl);
        const text = await res.text();
        const playlistName = customName || url.split('/').pop() || 'IPTV Playlist';
        const parsed = parseM3uPlaylist(text, url, playlistName);

        if (parsed.channels.length > 0) {
          setPlaylists((prev) => {
            const filtered = prev.filter((p) => p.url !== url);
            const updated = [parsed, ...filtered];
            savePlaylists(updated);
            return updated;
          });
          setActivePlaylistId(parsed.id);
          localStorage.setItem(ACTIVE_PLAYLIST_KEY, parsed.id);
          return parsed;
        }
        return null;
      } catch (err) {
        console.error('Failed to import playlist URL:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [savePlaylists]
  );

  // Import Local M3U File from disk
  const importPlaylistFile = useCallback(
    async (file: File): Promise<IptvPlaylist | null> => {
      setIsLoading(true);
      try {
        const text = await file.text();
        const parsed = parseM3uPlaylist(text, undefined, file.name.replace(/\.[^/.]+$/, ''));

        if (parsed.channels.length > 0) {
          setPlaylists((prev) => {
            const updated = [parsed, ...prev];
            savePlaylists(updated);
            return updated;
          });
          setActivePlaylistId(parsed.id);
          localStorage.setItem(ACTIVE_PLAYLIST_KEY, parsed.id);
          return parsed;
        }
        return null;
      } catch (err) {
        console.error('Failed to parse local M3U file:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [savePlaylists]
  );

  // Delete Playlist
  const deletePlaylist = useCallback(
    (id: string) => {
      setPlaylists((prev) => {
        const updated = prev.filter((p) => p.id !== id);
        savePlaylists(updated);
        return updated;
      });
      if (activePlaylistId === id) {
        setActivePlaylistId(null);
        localStorage.removeItem(ACTIVE_PLAYLIST_KEY);
      }
    },
    [activePlaylistId, savePlaylists]
  );

  // Toggle Favorite Channel
  const toggleFavorite = useCallback(
    (channel: IptvChannel) => {
      setFavorites((prev) => {
        const exists = prev.some((f) => f.streamUrl === channel.streamUrl);
        const updated = exists
          ? prev.filter((f) => f.streamUrl !== channel.streamUrl)
          : [channel, ...prev];
        saveFavorites(updated);
        return updated;
      });
    },
    [saveFavorites]
  );

  const activePlaylist = playlists.find((p) => p.id === activePlaylistId) || playlists[0] || null;

  return {
    playlists,
    activePlaylist,
    activePlaylistId,
    setActivePlaylistId: (id: string) => {
      setActivePlaylistId(id);
      localStorage.setItem(ACTIVE_PLAYLIST_KEY, id);
    },
    favorites,
    toggleFavorite,
    isFavorite: (streamUrl: string) => favorites.some((f) => f.streamUrl === streamUrl),
    importPlaylistUrl,
    importPlaylistFile,
    deletePlaylist,
    isLoading,
  };
}

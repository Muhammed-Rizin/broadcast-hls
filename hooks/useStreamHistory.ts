'use client';

import { useState, useEffect } from 'react';
import { StreamHistoryItem } from '@/types/stream';

const STORAGE_KEY = 'live_hls_history_v1';

export function useStreamHistory() {
  const [history, setHistory] = useState<StreamHistoryItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (err) {
      console.warn('Failed to read history from localStorage', err);
    }
  }, []);

  const saveToHistory = (url: string, title?: string, resolution?: string) => {
    if (!url) return;

    setHistory((prev) => {
      const existingIdx = prev.findIndex((item) => item.url === url);
      const isFav = existingIdx !== -1 ? prev[existingIdx].isFavorite : false;

      const newItem: StreamHistoryItem = {
        id: `stream-${Date.now()}`,
        url,
        title: title || (url.includes('/') ? url.split('/').pop() || url : url),
        lastPlayed: Date.now(),
        resolution: resolution || '1080p',
        isFavorite: isFav,
      };

      const filtered = prev.filter((item) => item.url !== url);
      const updated = [newItem, ...filtered].slice(0, 50); // Keep top 50 recent streams

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to save history to localStorage', err);
      }

      return updated;
    });
  };

  const toggleFavorite = (url: string) => {
    setHistory((prev) => {
      const updated = prev.map((item) =>
        item.url === url ? { ...item, isFavorite: !item.isFavorite } : item
      );

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to toggle favorite in localStorage', err);
      }

      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn('Failed to clear history from localStorage', err);
    }
  };

  return {
    history,
    saveToHistory,
    toggleFavorite,
    clearHistory,
  };
}

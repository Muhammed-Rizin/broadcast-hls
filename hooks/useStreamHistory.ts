'use client';

import { useState, useEffect, useCallback } from 'react';
import { StreamHistoryItem } from '@/types/stream';

const STORAGE_KEY = 'live_hls_history_v1';

export function useStreamHistory() {
  const [history, setHistory] = useState<StreamHistoryItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
        }
      }
    } catch (err) {
      console.warn('Failed to read history from localStorage', err);
    }
  }, []);

  const saveToHistory = useCallback((url: string, title?: string, resolution?: string) => {
    if (!url) return;

    setHistory((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const existingIdx = safePrev.findIndex((item) => item.url === url);
      const isFav = existingIdx !== -1 ? safePrev[existingIdx].isFavorite : false;

      const newItem: StreamHistoryItem = {
        id: `stream-${Date.now()}`,
        url,
        title: title || (url.includes('/') ? url.split('/').pop() || url : url),
        lastPlayed: Date.now(),
        resolution: resolution || '1080p',
        isFavorite: isFav,
      };

      const filtered = safePrev.filter((item) => item.url !== url);
      const updated = [newItem, ...filtered].slice(0, 50);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to save history to localStorage', err);
      }

      return updated;
    });
  }, []);

  const toggleFavorite = useCallback((url: string) => {
    setHistory((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const updated = safePrev.map((item) =>
        item.url === url ? { ...item, isFavorite: !item.isFavorite } : item
      );

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to toggle favorite in localStorage', err);
      }

      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn('Failed to clear history from localStorage', err);
    }
  }, []);

  return {
    history,
    saveToHistory,
    toggleFavorite,
    clearHistory,
  };
}

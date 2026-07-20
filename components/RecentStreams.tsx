'use client';

import React, { useState } from 'react';
import { History, Star, Play, Trash2 } from 'lucide-react';
import { useStreamHistory } from '@/hooks/useStreamHistory';
import { StreamHistoryItem } from '@/types/stream';

interface RecentStreamsProps {
  onSelectStream: (url: string) => void;
}

export const RecentStreams: React.FC<RecentStreamsProps> = ({ onSelectStream }) => {
  const { history, toggleFavorite, clearHistory } = useStreamHistory();
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  const filteredHistory = history.filter((item) =>
    filter === 'favorites' ? item.isFavorite : true
  );

  return (
    <div className="broadcast-card p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 border-b border-[#2A2A2D] pb-3">
        <div>
          <h2 className="text-sm font-semibold text-white">Stream History & Bookmarks</h2>
          <p className="text-xs text-[#7A7A7D]">
            Saved streams cached locally in your browser
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-2.5 py-1 bg-[#141414] hover:bg-[#222326] border border-[#2A2A2D] text-[#7A7A7D] hover:text-[#EF4444] rounded-[6px] text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Clear stream history"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}

          <div className="flex items-center p-0.5 bg-[#141414] border border-[#2A2A2D] rounded-[8px]">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-[6px] text-xs font-semibold transition-all ${
                filter === 'all' ? 'bg-white text-black font-bold' : 'text-[#7A7A7D] hover:text-white'
              }`}
            >
              All ({history.length})
            </button>
            <button
              onClick={() => setFilter('favorites')}
              className={`px-3 py-1 rounded-[6px] text-xs font-semibold transition-all flex items-center gap-1 ${
                filter === 'favorites' ? 'bg-white text-black font-bold' : 'text-[#7A7A7D] hover:text-white'
              }`}
            >
              <Star className="w-3 h-3 fill-current" />
              <span>Favorites</span>
            </button>
          </div>
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="py-12 text-center text-xs text-[#7A7A7D] font-mono">
          No {filter === 'favorites' ? 'favorite' : 'recent'} streams found. Play a stream to save it here.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-[#141414] hover:bg-[#222326] border border-[#2A2A2D] rounded-[10px] transition-all flex items-center justify-between gap-3 group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <button
                    onClick={() => toggleFavorite(item.url)}
                    className="text-[#555558] hover:text-amber-400 transition-colors"
                  >
                    <Star className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                  <h4 className="text-xs font-semibold text-white group-hover:text-neutral-300 transition-colors truncate">
                    {item.title || item.url}
                  </h4>
                </div>

                <p className="text-[11px] font-mono text-[#7A7A7D] truncate mb-1.5">{item.url}</p>

                <div className="flex items-center gap-2 text-[10px] font-mono text-[#555558]">
                  <span>{new Date(item.lastPlayed).toLocaleTimeString()}</span>
                  {item.resolution && (
                    <span className="px-1.5 py-0.2 rounded bg-[#1B1B1D] border border-[#2A2A2D] text-[#B6B6B8]">
                      {item.resolution}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => onSelectStream(item.url)}
                className="px-3 py-1.5 bg-white hover:bg-neutral-200 text-black font-semibold text-xs rounded-[8px] flex items-center gap-1 shrink-0 shadow-sm"
              >
                <Play className="w-3 h-3 fill-black" />
                <span>Play</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

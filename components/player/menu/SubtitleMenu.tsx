'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { TrackInfo } from '@/types/stream';

interface SubtitleMenuProps {
  subtitleTracks: TrackInfo[];
  currentSubtitleTrack: number;
  onSelectSubtitleTrack: (id: number) => void;
  onClose: () => void;
}

export const SubtitleMenu: React.FC<SubtitleMenuProps> = ({
  subtitleTracks,
  currentSubtitleTrack,
  onSelectSubtitleTrack,
  onClose,
}) => {
  return (
    <div className="space-y-1 py-1">
      <button
        onClick={() => {
          onSelectSubtitleTrack(-1);
          onClose();
        }}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-[8px] font-mono text-xs transition-all ${
          currentSubtitleTrack === -1
            ? 'bg-white text-black font-bold shadow-md'
            : 'text-[#D4D4D8] hover:bg-[#27272A]'
        }`}
      >
        <span>Off</span>
        {currentSubtitleTrack === -1 && <Check className="w-4 h-4 text-black" />}
      </button>

      {subtitleTracks.map((t) => (
        <button
          key={t.id}
          onClick={() => {
            onSelectSubtitleTrack(t.id);
            onClose();
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-[8px] font-mono text-xs transition-all ${
            currentSubtitleTrack === t.id
              ? 'bg-white text-black font-bold shadow-md'
              : 'text-[#D4D4D8] hover:bg-[#27272A]'
          }`}
        >
          <span>{t.name}</span>
          {currentSubtitleTrack === t.id && <Check className="w-4 h-4 text-black" />}
        </button>
      ))}
    </div>
  );
};

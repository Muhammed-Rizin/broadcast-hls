'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { TrackInfo } from '@/types/stream';

interface AudioMenuProps {
  audioTracks: TrackInfo[];
  currentAudioTrack: number;
  onSelectAudioTrack: (id: number) => void;
  onClose: () => void;
}

export const AudioMenu: React.FC<AudioMenuProps> = ({
  audioTracks,
  currentAudioTrack,
  onSelectAudioTrack,
  onClose,
}) => {
  return (
    <div className="space-y-1 py-1">
      {audioTracks.map((t) => (
        <button
          key={t.id}
          onClick={() => {
            onSelectAudioTrack(t.id);
            onClose();
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-[8px] font-mono text-xs transition-all ${
            currentAudioTrack === t.id
              ? 'bg-white text-black font-bold shadow-md'
              : 'text-[#D4D4D8] hover:bg-[#27272A]'
          }`}
        >
          <span>{t.name}</span>
          {currentAudioTrack === t.id && <Check className="w-4 h-4 text-black" />}
        </button>
      ))}
    </div>
  );
};

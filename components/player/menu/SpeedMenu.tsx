'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface SpeedMenuProps {
  playbackSpeed: number;
  onSelectPlaybackSpeed: (speed: number) => void;
  onClose: () => void;
}

export const SpeedMenu: React.FC<SpeedMenuProps> = ({
  playbackSpeed,
  onSelectPlaybackSpeed,
  onClose,
}) => {
  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <div className="space-y-1 py-1">
      {speedOptions.map((s) => (
        <button
          key={s}
          onClick={() => {
            onSelectPlaybackSpeed(s);
            onClose();
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-[8px] font-mono text-xs transition-all ${
            playbackSpeed === s
              ? 'bg-white text-black font-bold shadow-md'
              : 'text-[#D4D4D8] hover:bg-[#27272A]'
          }`}
        >
          <span>{s === 1.0 ? 'Normal (1.0x)' : `${s}x`}</span>
          {playbackSpeed === s && <Check className="w-4 h-4 text-black" />}
        </button>
      ))}
    </div>
  );
};

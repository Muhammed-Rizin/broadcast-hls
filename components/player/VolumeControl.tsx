'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = () => {
    if (isMuted || volume === 0) {
      return <VolumeX className="w-4 h-4 text-[#EF4444]" />;
    }
    if (volume < 0.5) {
      return <Volume1 className="w-4 h-4 text-[#B6B6B8]" />;
    }
    return <Volume2 className="w-4 h-4 text-[#B6B6B8]" />;
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex items-center gap-2 relative"
    >
      <button
        onClick={onToggleMute}
        className="text-[#B6B6B8] hover:text-white transition-colors p-1 rounded-[6px]"
        title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
      >
        {getIcon()}
      </button>

      <div className={`flex items-center transition-all duration-200 overflow-hidden ${
        isHovered ? 'w-20 opacity-100' : 'w-0 opacity-0 pointer-events-none'
      }`}>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-16 accent-[#FF3B30]"
        />
      </div>
    </div>
  );
};

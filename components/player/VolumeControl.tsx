'use client';

import React, { useState, useRef } from 'react';
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
  const [showMobileSlider, setShowMobileSlider] = useState(false);
  const lastNonZeroVolumeRef = useRef<number>(1);

  if (volume > 0 && !isMuted) {
    lastNonZeroVolumeRef.current = volume;
  }

  const handleMuteClick = (e: React.MouseEvent) => {
    // If volume is 0 or muted, restore last non-zero volume on unmute
    if (isMuted || volume === 0) {
      const restoreVol = lastNonZeroVolumeRef.current > 0 ? lastNonZeroVolumeRef.current : 0.5;
      onVolumeChange(restoreVol);
    } else {
      onToggleMute();
    }
  };

  const getIcon = () => {
    if (isMuted || volume === 0) {
      return <VolumeX className="w-4.5 h-4.5 text-[#EF4444]" />;
    }
    if (volume < 0.5) {
      return <Volume1 className="w-4.5 h-4.5 text-[#B6B6B8]" />;
    }
    return <Volume2 className="w-4.5 h-4.5 text-[#B6B6B8]" />;
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMobileSlider(false);
      }}
      className="flex items-center gap-1.5 relative"
    >
      <button
        onClick={handleMuteClick}
        onTouchStart={() => setShowMobileSlider(!showMobileSlider)}
        className="text-[#B6B6B8] hover:text-white transition-colors p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-[8px] bg-[#141414]/90 border border-white/10"
        title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
      >
        {getIcon()}
      </button>

      <div className={`flex items-center transition-all duration-200 overflow-hidden ${
        isHovered || showMobileSlider ? 'w-20 opacity-100' : 'w-0 opacity-0 pointer-events-none'
      }`}>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            if (val > 0) lastNonZeroVolumeRef.current = val;
            onVolumeChange(val);
          }}
          className="w-16 accent-[#FF3B30] cursor-pointer"
        />
      </div>
    </div>
  );
};

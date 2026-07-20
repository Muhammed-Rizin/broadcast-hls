'use client';

import React, { useRef, useState } from 'react';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  bufferLength: number;
  onSeek: (time: number) => void;
  isLive?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  bufferLength,
  onSeek,
  isLive = true,
}) => {
  const barRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);

  // Calculate percentage ratios
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 100;
  const bufferPercent = duration > 0 ? Math.min(100, ((currentTime + bufferLength) / duration) * 100) : 100;

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current || duration <= 0) return;
    const rect = barRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(clickRatio * duration);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const moveX = e.clientX - rect.left;
    const moveRatio = Math.max(0, Math.min(1, moveX / rect.width));
    setHoverPosition(moveRatio * 100);
  };

  return (
    <div
      ref={barRef}
      onClick={handleSeekClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoverPosition(null);
      }}
      onMouseMove={handleMouseMove}
      className="relative w-full h-3 flex items-center cursor-pointer group py-1"
    >
      {/* Background Track */}
      <div className="w-full h-1 bg-[#2A2A2D] rounded-full overflow-hidden relative transition-all group-hover:h-1.5">
        {/* Buffered Range */}
        <div
          className="absolute top-0 bottom-0 left-0 bg-[#555558] transition-all duration-150"
          style={{ width: `${isLive ? 100 : bufferPercent}%` }}
        />

        {/* Played Progress Range (YouTube Red) */}
        <div
          className="absolute top-0 bottom-0 left-0 bg-[#FF3B30] transition-all duration-75"
          style={{ width: `${isLive ? 100 : progressPercent}%` }}
        />
      </div>

      {/* Hover Position Guide Line */}
      {isHovered && hoverPosition !== null && !isLive && (
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/60 pointer-events-none"
          style={{ left: `${hoverPosition}%` }}
        />
      )}

      {/* Seek Handle Thumb */}
      {!isLive && (
        <div
          className={`absolute w-3 h-3 bg-[#FF3B30] rounded-full shadow-md transition-transform duration-100 -translate-x-1/2 ${
            isHovered ? 'scale-125' : 'scale-0 group-hover:scale-100'
          }`}
          style={{ left: `${progressPercent}%` }}
        />
      )}
    </div>
  );
};

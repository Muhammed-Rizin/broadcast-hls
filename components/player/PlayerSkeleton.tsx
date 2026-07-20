'use client';

import React from 'react';
import { Play } from 'lucide-react';

export const PlayerSkeleton: React.FC = () => {
  return (
    <div className="w-full aspect-video rounded-[16px] border border-[#2A2A2D] bg-[#000000] overflow-hidden relative flex flex-col justify-between p-5">
      {/* Top Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-20 h-6 rounded-[6px] skeleton-shimmer" />
          <div className="w-28 h-5 rounded-[6px] skeleton-shimmer" />
        </div>
        <div className="w-16 h-6 rounded-[6px] skeleton-shimmer" />
      </div>

      {/* Center Icon Skeleton */}
      <div className="self-center flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-full bg-[#141414] border border-[#2A2A2D] flex items-center justify-center shadow-lg">
          <Play className="w-6 h-6 text-[#555558] ml-0.5" />
        </div>
        <span className="text-xs font-mono text-[#7A7A7D]">Initializing Stream Player...</span>
      </div>

      {/* Bottom Controls Skeleton */}
      <div className="flex flex-col gap-2">
        <div className="w-full h-1 rounded bg-[#2A2A2D] overflow-hidden">
          <div className="w-1/3 h-full skeleton-shimmer" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] skeleton-shimmer" />
            <div className="w-14 h-6 rounded-[6px] skeleton-shimmer" />
            <div className="w-24 h-4 rounded skeleton-shimmer" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-6 rounded-[6px] skeleton-shimmer" />
            <div className="w-7 h-7 rounded-[6px] skeleton-shimmer" />
            <div className="w-7 h-7 rounded-[6px] skeleton-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
};

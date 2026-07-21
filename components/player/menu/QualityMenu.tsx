'use client';

import React from 'react';
import { Check, ChevronLeft } from 'lucide-react';
import { QualityLevel } from '@/types/stream';

interface QualityMenuProps {
  qualities: QualityLevel[];
  currentQualityIndex: number;
  onSelectQuality: (index: number) => void;
  onClose: () => void;
}

export const QualityMenu: React.FC<QualityMenuProps> = ({
  qualities,
  currentQualityIndex,
  onSelectQuality,
  onClose,
}) => {
  return (
    <div className="space-y-1">
      <button
        onClick={() => {
          onSelectQuality(-1);
          onClose();
        }}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-[8px] font-mono text-xs transition-all ${
          currentQualityIndex === -1
            ? 'bg-white text-black font-bold shadow-md'
            : 'text-[#D4D4D8] hover:bg-[#27272A]'
        }`}
      >
        <span>Auto (Adaptive)</span>
        {currentQualityIndex === -1 && <Check className="w-4 h-4 text-black" />}
      </button>

      {qualities.map((q) => (
        <button
          key={q.id}
          onClick={() => {
            onSelectQuality(q.id);
            onClose();
          }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-[8px] font-mono text-xs transition-all ${
            currentQualityIndex === q.id
              ? 'bg-white text-black font-bold shadow-md'
              : 'text-[#D4D4D8] hover:bg-[#27272A]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{q.name}</span>
            {q.height && q.height >= 2160 ? (
              <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                4K UHD
              </span>
            ) : q.height && q.height >= 1080 ? (
              <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-[#22C55E]/20 text-[#22C55E] border border-emerald-500/30">
                HD
              </span>
            ) : null}
          </div>
          {currentQualityIndex === q.id && <Check className="w-4 h-4 text-black" />}
        </button>
      ))}
    </div>
  );
};

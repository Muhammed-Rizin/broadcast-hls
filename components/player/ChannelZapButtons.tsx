'use client';

import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ChannelZapButtonsProps {
  onNextChannel?: () => void;
  onPrevChannel?: () => void;
}

export const ChannelZapButtons: React.FC<ChannelZapButtonsProps> = ({
  onNextChannel,
  onPrevChannel,
}) => {
  if (!onNextChannel && !onPrevChannel) return null;

  return (
    <div className="flex items-center bg-[#141414]/90 border border-white/10 rounded-[8px] p-0.5 shrink-0">
      {onPrevChannel && (
        <button
          onClick={onPrevChannel}
          className="p-1.5 sm:p-2 hover:bg-[#27272A] rounded-[6px] text-[#B6B6B8] hover:text-white transition-colors flex items-center justify-center"
          title="Previous Channel (P)"
        >
          <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      )}

      {onNextChannel && (
        <button
          onClick={onNextChannel}
          className="p-1.5 sm:p-2 hover:bg-[#27272A] rounded-[6px] text-[#B6B6B8] hover:text-white transition-colors flex items-center justify-center"
          title="Next Channel (N)"
        >
          <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      )}
    </div>
  );
};

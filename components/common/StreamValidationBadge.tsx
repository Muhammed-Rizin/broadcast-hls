'use client';

import React, { memo } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { StreamValidationResult } from '@/types/stream';

interface StreamValidationBadgeProps {
  validation: StreamValidationResult | null;
}

export const StreamValidationBadge: React.FC<StreamValidationBadgeProps> = memo(({ validation }) => {
  if (!validation || !validation.valid) return null;

  return (
    <div className="mb-4 p-2.5 bg-[#09090B] border border-white/10 rounded-[10px] text-xs flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2 text-[#22C55E]">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span className="font-semibold">Stream Validated</span>
      </div>
      <div className="flex items-center gap-3 font-mono text-[11px] text-[#B6B6B8]">
        {validation.resolution && (
          <span className="bg-[#1B1B1D] px-2 py-0.5 rounded border border-white/10">
            {validation.resolution}
          </span>
        )}
        {validation.codecs && (
          <span className="bg-[#1B1B1D] px-2 py-0.5 rounded border border-white/10">
            {validation.codecs}
          </span>
        )}
        <span className="bg-[#1B1B1D] px-2 py-0.5 rounded border border-white/10">
          {validation.isMaster ? `${validation.variants.length} Variants` : 'Single Stream'}
        </span>
      </div>
    </div>
  );
});

StreamValidationBadge.displayName = 'StreamValidationBadge';

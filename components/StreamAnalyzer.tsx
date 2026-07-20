'use client';

import React from 'react';
import { StreamValidationResult } from '@/types/stream';

interface StreamAnalyzerProps {
  validation?: StreamValidationResult | null;
}

export const StreamAnalyzer: React.FC<StreamAnalyzerProps> = ({ validation }) => {
  if (!validation) {
    return (
      <div className="broadcast-card p-4 text-center text-[#7A7A7D] text-xs">
        Stream metadata will populate once URL is submitted
      </div>
    );
  }

  return (
    <div className="broadcast-card p-4 space-y-4">
      <div className="flex items-center justify-between gap-2 border-b border-[#2A2A2D] pb-3">
        <h3 className="text-sm font-semibold text-white">Stream Analyzer</h3>
        <span className="px-2 py-0.5 rounded-[6px] text-[10px] font-bold font-mono bg-[#141414] border border-[#2A2A2D] text-[#B6B6B8]">
          {validation.isMaster ? 'MASTER PLAYLIST' : 'MEDIA PLAYLIST'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 bg-[#141414] border border-[#2A2A2D] rounded-[10px]">
          <span className="text-[11px] text-[#7A7A7D] block mb-1">Resolution</span>
          <p className="text-xs font-bold font-mono text-white">
            {validation.resolution || 'Auto / Adaptive'}
          </p>
        </div>

        <div className="p-3 bg-[#141414] border border-[#2A2A2D] rounded-[10px]">
          <span className="text-[11px] text-[#7A7A7D] block mb-1">Codec</span>
          <p className="text-xs font-bold font-mono text-white truncate" title={validation.codecs || 'H.264 / AAC'}>
            {validation.codecs || 'H.264 / AAC'}
          </p>
        </div>

        <div className="p-3 bg-[#141414] border border-[#2A2A2D] rounded-[10px]">
          <span className="text-[11px] text-[#7A7A7D] block mb-1">Target Segment</span>
          <p className="text-xs font-bold font-mono text-white">
            {validation.segmentDuration ? `${validation.segmentDuration} sec` : 'Variable'}
          </p>
        </div>

        <div className="p-3 bg-[#141414] border border-[#2A2A2D] rounded-[10px]">
          <span className="text-[11px] text-[#7A7A7D] block mb-1">Variants</span>
          <p className="text-xs font-bold font-mono text-white">
            {validation.variants?.length || 1} Stream{validation.variants?.length === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      {validation.variants && validation.variants.length > 0 && (
        <div>
          <span className="text-[11px] font-semibold text-[#7A7A7D] uppercase tracking-wider block mb-2">
            Quality Variants ({validation.variants.length})
          </span>
          <div className="overflow-x-auto rounded-[10px] border border-[#2A2A2D]">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#141414] text-[#7A7A7D] border-b border-[#2A2A2D] uppercase text-[10px]">
                <tr>
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">Resolution</th>
                  <th className="px-3 py-2">Bitrate</th>
                  <th className="px-3 py-2">Codec</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A2D] bg-[#1B1B1D] text-[#B6B6B8]">
                {validation.variants.map((v, i) => (
                  <tr key={i} className="hover:bg-[#222326] transition-colors">
                    <td className="px-3.5 py-2 text-[#7A7A7D]">{i + 1}</td>
                    <td className="px-3.5 py-2 font-bold text-white">
                      {v.resolution || (v.height ? `${v.height}p` : 'Unknown')}
                    </td>
                    <td className="px-3.5 py-2">{Math.round(v.bandwidth / 1000)} kbps</td>
                    <td className="px-3.5 py-2 text-[#7A7A7D]">{v.codecs || 'avc1 / mp4a'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

'use client';

import React, { memo } from 'react';
import { PlaySquare } from 'lucide-react';
import { SampleStreamPreset } from '@/types/stream';

export const FEATURED_SAMPLE_STREAMS: SampleStreamPreset[] = [
  {
    name: 'Apple Advanced 4K UHD',
    url: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/adv_dv_atmos/main.m3u8',
    requiresProxy: false,
    tag: '2160p 4K',
  },
  {
    name: 'Big Buck Bunny 1080p',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    requiresProxy: false,
    tag: '1080p HD',
  },
  {
    name: 'All Channels (12,000+)',
    url: 'https://iptv-org.github.io/iptv/index.m3u',
    requiresProxy: true,
    tag: '12,000+ Ch',
    isIptv: true,
  },
  {
    name: 'Sports (320+ Channels)',
    url: 'https://iptv-org.github.io/iptv/categories/sports.m3u',
    requiresProxy: true,
    tag: '320 Sports',
    isIptv: true,
  },
  {
    name: 'News (930+ Channels)',
    url: 'https://iptv-org.github.io/iptv/categories/news.m3u',
    requiresProxy: true,
    tag: '930 News',
    isIptv: true,
  },
  {
    name: 'Movies (350+ Channels)',
    url: 'https://iptv-org.github.io/iptv/categories/movies.m3u',
    requiresProxy: true,
    tag: '350 Cinema',
    isIptv: true,
  },
  {
    name: 'Music (650+ Channels)',
    url: 'https://iptv-org.github.io/iptv/categories/music.m3u',
    requiresProxy: true,
    tag: '650 Music',
    isIptv: true,
  },
  {
    name: 'By Country Index',
    url: 'https://iptv-org.github.io/iptv/index.country.m3u',
    requiresProxy: true,
    tag: 'By Country',
    isIptv: true,
  },
];

interface StreamSamplePresetsProps {
  onSelectPreset: (preset: SampleStreamPreset) => void;
}

export const StreamSamplePresets: React.FC<StreamSamplePresetsProps> = memo(({ onSelectPreset }) => {
  return (
    <div>
      <div className="flex items-center justify-between gap-1.5 mb-2">
        <div className="flex items-center gap-1.5">
          <PlaySquare className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-[11px] font-semibold text-[#7A7A7D] uppercase tracking-wider block">
            Curated IPTV Categories & Sample Streams
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {FEATURED_SAMPLE_STREAMS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPreset(preset)}
            className="p-2.5 bg-[#09090B] hover:bg-[#222326] border border-white/10 rounded-[10px] text-left transition-all group flex items-center justify-between gap-2"
          >
            <div className="min-w-0">
              <span className="text-xs font-semibold text-white group-hover:text-neutral-300 transition-colors truncate block">
                {preset.name}
              </span>
              <span className="text-[11px] font-mono text-[#7A7A7D] truncate block">
                {preset.url}
              </span>
            </div>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${
                preset.isIptv
                  ? 'bg-red-500/10 text-red-400 border-red-500/20 font-bold'
                  : 'bg-[#1B1B1D] text-[#B6B6B8] border-white/10'
              }`}
            >
              {preset.tag}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
});

StreamSamplePresets.displayName = 'StreamSamplePresets';

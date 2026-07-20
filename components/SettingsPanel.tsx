'use client';

import React from 'react';
import { Settings, ShieldCheck, RefreshCw, Gauge, Cpu } from 'lucide-react';

interface SettingsPanelProps {
  useProxy: boolean;
  setUseProxy: (val: boolean) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ useProxy, setUseProxy }) => {
  return (
    <div className="broadcast-card p-5 max-w-4xl mx-auto space-y-5">
      <div className="border-b border-[#2A2A2D] pb-3">
        <h2 className="text-sm font-semibold text-white">Platform Settings & Proxy Engine</h2>
        <p className="text-xs text-[#7A7A7D]">
          Configure player behavior, proxy rewriter, buffer ceiling, and auto-reconnect retries
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-4 bg-[#141414] border border-[#2A2A2D] rounded-[10px] space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>CORS & Mixed-Content Proxy</span>
          </div>
          <p className="text-xs text-[#7A7A7D] leading-relaxed">
            Proxies <code className="text-[#B6B6B8]">.m3u8</code> manifests and media segments via <code className="text-[#B6B6B8]">/api/stream/proxy</code> to bypass browser CORS and HTTP mixed-content restrictions.
          </p>
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-[#B6B6B8]">Enable Backend Proxy</span>
            <button
              onClick={() => setUseProxy(!useProxy)}
              className={`w-11 h-5 rounded-full transition-colors p-0.5 relative ${
                useProxy ? 'bg-[#22C55E]' : 'bg-[#2A2A2D]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  useProxy ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="p-4 bg-[#141414] border border-[#2A2A2D] rounded-[10px] space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <RefreshCw className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>Exponential Reconnect Engine</span>
          </div>
          <p className="text-xs text-[#7A7A7D] leading-relaxed">
            Automatically recovers stream connection drops using an exponential backoff retry sequence (1s, 2s, 4s, 8s, 16s).
          </p>
          <div className="pt-2 flex items-center justify-between text-xs">
            <span className="text-[#B6B6B8] font-semibold">Max Retries:</span>
            <span className="font-mono font-bold text-[#22C55E]">
              5 Retries
            </span>
          </div>
        </div>

        <div className="p-4 bg-[#141414] border border-[#2A2A2D] rounded-[10px] space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Gauge className="w-3.5 h-3.5 text-white" />
            <span>Low Latency & Buffer Target</span>
          </div>
          <p className="text-xs text-[#7A7A7D] leading-relaxed">
            Configured with Hls.js Low-Latency HLS support, max 30s buffer ceiling, and live edge synchronization.
          </p>
          <div className="pt-2 flex items-center justify-between text-xs">
            <span className="text-[#B6B6B8] font-semibold">Max Buffer:</span>
            <span className="font-mono font-bold text-white">
              30 Seconds
            </span>
          </div>
        </div>

        <div className="p-4 bg-[#141414] border border-[#2A2A2D] rounded-[10px] space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Cpu className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Supported Formats</span>
          </div>
          <p className="text-xs text-[#7A7A7D] leading-relaxed">
            Supports HLS Master Playlists, Variant Playlists, Low-Latency HLS, H.264/AVC, H.265/HEVC, and AAC audio.
          </p>
          <div className="pt-2 flex items-center justify-between text-xs">
            <span className="text-[#B6B6B8] font-semibold">Parser:</span>
            <span className="font-mono font-bold text-[#F59E0B]">
              Native + Hls.js 1.5
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

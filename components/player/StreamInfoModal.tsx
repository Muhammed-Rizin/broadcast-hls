'use client';

import React from 'react';
import { X, Activity, Cpu, Gauge, Clock, ArrowDownCircle, AlertTriangle, Radio } from 'lucide-react';
import { HlsMetrics, StreamHealth } from '@/types/stream';

interface StreamInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: HlsMetrics;
  health: StreamHealth;
  url: string;
}

export const StreamInfoModal: React.FC<StreamInfoModalProps> = ({
  isOpen,
  onClose,
  metrics,
  health,
  url,
}) => {
  if (!isOpen) return null;

  const formattedBitrate = metrics.currentBitrate > 0
    ? (metrics.currentBitrate / 1000000).toFixed(2) + ' Mbps'
    : 'Auto Dynamic';

  const formattedDownloadSpeed = metrics.downloadSpeedBps > 0
    ? (metrics.downloadSpeedBps / 1000000).toFixed(2) + ' Mbps'
    : '0 Mbps';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#141414] border border-[#2A2A2D] rounded-[16px] max-w-lg w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2A2A2D] pb-4">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-white" />
            <div>
              <h3 className="text-base font-bold text-white">Stream Information & Diagnostics</h3>
              <p className="text-xs text-[#7A7A7D] font-mono truncate max-w-xs">{url}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[8px] bg-[#1B1B1D] hover:bg-[#222326] text-[#B6B6B8] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Diagnostics Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 bg-[#1B1B1D] border border-[#2A2A2D] rounded-[10px]">
            <span className="text-[11px] text-[#7A7A7D] block mb-1">Resolution & FPS</span>
            <span className="text-sm font-bold text-white">
              {metrics.currentResolution || '1080p'} @ {metrics.fps > 0 ? metrics.fps.toFixed(0) : '60'} FPS
            </span>
          </div>

          <div className="p-3 bg-[#1B1B1D] border border-[#2A2A2D] rounded-[10px]">
            <span className="text-[11px] text-[#7A7A7D] block mb-1">Current Bitrate</span>
            <span className="text-sm font-bold text-white">{formattedBitrate}</span>
          </div>

          <div className="p-3 bg-[#1B1B1D] border border-[#2A2A2D] rounded-[10px]">
            <span className="text-[11px] text-[#7A7A7D] block mb-1">Live Latency</span>
            <span className="text-sm font-bold text-white">
              {metrics.liveDelay > 0 ? `${metrics.liveDelay.toFixed(1)} s` : '< 2 s'}
            </span>
          </div>

          <div className="p-3 bg-[#1B1B1D] border border-[#2A2A2D] rounded-[10px]">
            <span className="text-[11px] text-[#7A7A7D] block mb-1">Buffer Size</span>
            <span className="text-sm font-bold text-white">{metrics.bufferLength.toFixed(1)} s</span>
          </div>

          <div className="p-3 bg-[#1B1B1D] border border-[#2A2A2D] rounded-[10px]">
            <span className="text-[11px] text-[#7A7A7D] block mb-1">Network Speed</span>
            <span className="text-sm font-bold text-white">{formattedDownloadSpeed}</span>
          </div>

          <div className="p-3 bg-[#1B1B1D] border border-[#2A2A2D] rounded-[10px]">
            <span className="text-[11px] text-[#7A7A7D] block mb-1">Dropped Frames</span>
            <span className={`text-sm font-bold ${metrics.droppedFrames > 0 ? 'text-[#EF4444]' : 'text-white'}`}>
              {metrics.droppedFrames}
            </span>
          </div>

          <div className="p-3 bg-[#1B1B1D] border border-[#2A2A2D] rounded-[10px]">
            <span className="text-[11px] text-[#7A7A7D] block mb-1">Segment Index</span>
            <span className="text-sm font-bold text-white">#{metrics.segmentNumber > 0 ? metrics.segmentNumber : 'LIVE'}</span>
          </div>

          <div className="p-3 bg-[#1B1B1D] border border-[#2A2A2D] rounded-[10px]">
            <span className="text-[11px] text-[#7A7A7D] block mb-1">Health Status</span>
            <span className={`text-xs font-bold uppercase ${
              health.status === 'healthy' ? 'text-[#22C55E]' : 'text-[#F59E0B]'
            }`}>
              {health.status}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-black font-semibold text-xs rounded-[10px] hover:bg-neutral-200 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

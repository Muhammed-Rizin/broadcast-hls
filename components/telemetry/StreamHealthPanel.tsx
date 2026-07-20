'use client';

import React from 'react';
import { HlsMetrics, StreamHealth } from '@/types/stream';

interface StreamHealthPanelProps {
  metrics: HlsMetrics;
  health: StreamHealth;
}

export const StreamHealthPanel: React.FC<StreamHealthPanelProps> = ({ metrics, health }) => {
  const formattedBitrate = metrics.currentBitrate > 0
    ? (metrics.currentBitrate / 1000000).toFixed(2) + ' Mbps'
    : 'Auto Dynamic';

  const formattedDownloadSpeed = metrics.downloadSpeedBps > 0
    ? (metrics.downloadSpeedBps / 1000000).toFixed(2) + ' Mbps'
    : '0 Mbps';

  return (
    <div className="broadcast-card p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-[#2A2A2D] pb-2.5">
        <h3 className="text-sm font-semibold text-white">Stream Health Diagnostics</h3>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
            health.status === 'healthy'
              ? 'bg-emerald-950/60 text-[#22C55E] border border-emerald-500/30'
              : health.status === 'buffering'
              ? 'bg-amber-950/60 text-[#F59E0B] border border-amber-500/30'
              : 'bg-red-950/60 text-[#EF4444] border border-red-500/30'
          }`}>
            {health.status}
          </span>
          <span className="text-[#7A7A7D]">1s Polling</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3 bg-[#141414] border border-[#2A2A2D] rounded-[10px]">
          <span className="text-[11px] text-[#7A7A7D] block mb-1">Current Bitrate</span>
          <p className="text-sm font-bold font-mono text-white">
            {formattedBitrate}
          </p>
        </div>

        <div className="p-3 bg-[#141414] border border-[#2A2A2D] rounded-[10px]">
          <span className="text-[11px] text-[#7A7A7D] block mb-1">Resolution & FPS</span>
          <p className="text-sm font-bold font-mono text-white">
            {metrics.currentResolution || '1080p'} @ {metrics.fps > 0 ? metrics.fps.toFixed(0) : '60'} FPS
          </p>
        </div>

        <div className="p-3 bg-[#141414] border border-[#2A2A2D] rounded-[10px]">
          <span className="text-[11px] text-[#7A7A7D] block mb-1">Buffered Seconds</span>
          <p className="text-sm font-bold font-mono text-white">
            {metrics.bufferLength.toFixed(1)} s
          </p>
        </div>

        <div className="p-3 bg-[#141414] border border-[#2A2A2D] rounded-[10px]">
          <span className="text-[11px] text-[#7A7A7D] block mb-1">Live Latency</span>
          <p className="text-sm font-bold font-mono text-white">
            {metrics.liveDelay > 0 ? `${metrics.liveDelay.toFixed(1)} s` : '< 2 s'}
          </p>
        </div>

        <div className="p-3 bg-[#141414] border border-[#2A2A2D] rounded-[10px]">
          <span className="text-[11px] text-[#7A7A7D] block mb-1">Dropped Frames</span>
          <p className={`text-sm font-bold font-mono ${metrics.droppedFrames > 0 ? 'text-[#EF4444]' : 'text-white'}`}>
            {metrics.droppedFrames}
          </p>
        </div>

        <div className="p-3 bg-[#141414] border border-[#2A2A2D] rounded-[10px]">
          <span className="text-[11px] text-[#7A7A7D] block mb-1">Network Speed</span>
          <p className="text-sm font-bold font-mono text-white">
            {formattedDownloadSpeed}
          </p>
        </div>

        <div className="p-3 bg-[#141414] border border-[#2A2A2D] rounded-[10px]">
          <span className="text-[11px] text-[#7A7A7D] block mb-1">Segment Sequence</span>
          <p className="text-sm font-bold font-mono text-white">
            #{metrics.segmentNumber > 0 ? metrics.segmentNumber : 'LIVE'}
          </p>
        </div>

        <div className="p-3 bg-[#141414] border border-[#2A2A2D] rounded-[10px]">
          <span className="text-[11px] text-[#7A7A7D] block mb-1">Reconnect Retries</span>
          <p className="text-sm font-bold font-mono text-white">
            {health.errorCount} / 5 Attempts
          </p>
        </div>
      </div>
    </div>
  );
};

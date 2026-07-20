'use client';

import React from 'react';
import { HlsMetrics } from '@/types/stream';

interface StatisticsPanelProps {
  metrics: HlsMetrics;
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ metrics }) => {
  const formattedBitrate = metrics.currentBitrate > 0
    ? (metrics.currentBitrate / 1000000).toFixed(2) + ' Mbps'
    : 'Auto Dynamic';

  const formattedDownloadSpeed = metrics.downloadSpeedBps > 0
    ? (metrics.downloadSpeedBps / 1000000).toFixed(2) + ' Mbps'
    : '0 Mbps';

  return (
    <div className="broadcast-card p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-[#2A2A2D] pb-2.5">
        <h3 className="text-sm font-semibold text-white">Playback Statistics</h3>
        <span className="text-[11px] font-mono text-[#7A7A7D]">Realtime Telemetry</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Bitrate */}
        <div className="p-3 bg-[#141414] border border-[#2A2A2D] rounded-[10px]">
          <span className="text-[11px] text-[#7A7A7D] block mb-1">Bitrate</span>
          <p className="text-sm font-bold font-mono text-white">
            {formattedBitrate}
          </p>
        </div>

        {/* FPS */}
        <div className="p-3 bg-[#141414] border border-[#2A2A2D] rounded-[10px]">
          <span className="text-[11px] text-[#7A7A7D] block mb-1">FPS</span>
          <p className="text-sm font-bold font-mono text-white">
            {metrics.fps > 0 ? metrics.fps.toFixed(1) : '60.0'}
          </p>
        </div>

        {/* Buffer Size */}
        <div className="p-3 bg-[#141414] border border-[#2A2A2D] rounded-[10px]">
          <span className="text-[11px] text-[#7A7A7D] block mb-1">Buffer Size</span>
          <p className="text-sm font-bold font-mono text-white">
            {metrics.bufferLength.toFixed(1)} s
          </p>
        </div>

        {/* Live Delay */}
        <div className="p-3 bg-[#141414] border border-[#2A2A2D] rounded-[10px]">
          <span className="text-[11px] text-[#7A7A7D] block mb-1">Live Latency</span>
          <p className="text-sm font-bold font-mono text-white">
            {metrics.liveDelay > 0 ? `${metrics.liveDelay.toFixed(1)} s` : '< 2 s'}
          </p>
        </div>

        {/* Dropped Frames */}
        <div className="p-3 bg-[#141414] border border-[#2A2A2D] rounded-[10px]">
          <span className="text-[11px] text-[#7A7A7D] block mb-1">Dropped Frames</span>
          <p className={`text-sm font-bold font-mono ${metrics.droppedFrames > 0 ? 'text-[#EF4444]' : 'text-white'}`}>
            {metrics.droppedFrames}
          </p>
        </div>

        {/* Bandwidth */}
        <div className="p-3 bg-[#141414] border border-[#2A2A2D] rounded-[10px]">
          <span className="text-[11px] text-[#7A7A7D] block mb-1">Bandwidth</span>
          <p className="text-sm font-bold font-mono text-white">
            {formattedDownloadSpeed}
          </p>
        </div>

        {/* Resolution */}
        <div className="p-3 bg-[#141414] border border-[#2A2A2D] rounded-[10px]">
          <span className="text-[11px] text-[#7A7A7D] block mb-1">Resolution</span>
          <p className="text-sm font-bold font-mono text-white">
            {metrics.currentResolution || '1920x1080'}
          </p>
        </div>

        {/* Current Segment */}
        <div className="p-3 bg-[#141414] border border-[#2A2A2D] rounded-[10px]">
          <span className="text-[11px] text-[#7A7A7D] block mb-1">Segment Index</span>
          <p className="text-sm font-bold font-mono text-white">
            #{metrics.segmentNumber > 0 ? metrics.segmentNumber : 'LIVE'}
          </p>
        </div>
      </div>
    </div>
  );
};

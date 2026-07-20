'use client';

import React from 'react';
import { ShieldAlert, FileQuestion, WifiOff, Cpu, RefreshCw, AlertOctagon } from 'lucide-react';
import { ErrorType, GranularStatus } from '@/hooks/useHlsPlayer';

interface PlayerOverlayMessagesProps {
  isBuffering: boolean;
  granularStatus: GranularStatus;
  errorCode: ErrorType;
  errorDetails: string | null;
  useProxy: boolean;
  setUseProxy: (val: boolean) => void;
  onRetry: () => void;
}

export const PlayerOverlayMessages: React.FC<PlayerOverlayMessagesProps> = ({
  isBuffering,
  granularStatus,
  errorCode,
  errorDetails,
  useProxy,
  setUseProxy,
  onRetry,
}) => {
  // Render Dedicated Error State Overlay if errorCode exists
  if (errorCode) {
    const getErrorConfig = () => {
      switch (errorCode) {
        case '403_FORBIDDEN':
          return {
            title: '403 Forbidden: Access Denied',
            icon: <ShieldAlert className="w-8 h-8 text-[#EF4444]" />,
            description: 'Origin server returned 403 Access Denied. Enabling Proxy Mode usually bypasses origin header restrictions.',
          };
        case '404_NOT_FOUND':
          return {
            title: '404 Not Found: Stream Missing',
            icon: <FileQuestion className="w-8 h-8 text-[#F59E0B]" />,
            description: 'The target .m3u8 playlist or media segment URL does not exist or has expired.',
          };
        case 'TIMEOUT':
          return {
            title: 'Connection Timed Out',
            icon: <WifiOff className="w-8 h-8 text-[#EF4444]" />,
            description: 'The streaming origin server took too long to respond (15s timeout limit).',
          };
        case 'UNSUPPORTED_CODEC':
          return {
            title: 'Unsupported Stream Codec',
            icon: <Cpu className="w-8 h-8 text-[#F59E0B]" />,
            description: 'Your browser or OS hardware does not support the video codec in this HLS manifest.',
          };
        case 'NETWORK_ERROR':
        default:
          return {
            title: 'Stream Disconnected',
            icon: <AlertOctagon className="w-8 h-8 text-[#EF4444]" />,
            description: errorDetails || 'Failed to download HLS segments from origin server.',
          };
      }
    };

    const config = getErrorConfig();

    return (
      <div className="absolute inset-0 bg-[#0B0B0C]/95 flex flex-col items-center justify-center gap-3.5 z-40 p-6 text-center border border-[#2A2A2D] rounded-[16px]">
        <div className="w-14 h-14 rounded-[14px] bg-[#141414] border border-[#2A2A2D] flex items-center justify-center shadow-lg">
          {config.icon}
        </div>
        <div>
          <h4 className="text-base font-bold text-white mb-1">{config.title}</h4>
          <p className="text-xs text-[#7A7A7D] max-w-md font-mono leading-relaxed">{config.description}</p>
        </div>

        <div className="flex items-center gap-2.5 pt-2">
          <button
            onClick={() => setUseProxy(!useProxy)}
            className="px-4 py-2 bg-[#222326] hover:bg-[#2A2A2D] text-white font-semibold text-xs rounded-[10px] border border-[#2A2A2D] transition-all"
          >
            Switch to {useProxy ? 'Direct Mode' : 'Proxy Mode'}
          </button>
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-white hover:bg-neutral-200 text-black font-semibold text-xs rounded-[10px] transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  // Render Granular Buffering Status Overlay
  if (isBuffering && granularStatus !== 'Ready') {
    return (
      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2.5 z-20 pointer-events-none">
        <div className="w-9 h-9 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <span className="text-xs font-mono font-semibold text-[#B6B6B8] tracking-wide">
          {granularStatus}
        </span>
      </div>
    );
  }

  return null;
};

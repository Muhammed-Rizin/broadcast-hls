'use client';

import React from 'react';
import { StreamHealth, HealthStatusType } from '@/types/stream';

interface HealthBadgeProps {
  health: StreamHealth;
  reconnectAttempt?: number;
  maxRetries?: number;
}

export const HealthBadge: React.FC<HealthBadgeProps> = ({
  health,
  reconnectAttempt = 0,
  maxRetries = 5,
}) => {
  if (health.status === 'healthy') {
    return (
      <div className="badge-live">
        <span className="badge-live-dot" />
        <span>LIVE</span>
        {health.delayMs > 0 && (
          <span className="text-[10px] opacity-80 font-normal pl-1 border-l border-white/30">
            {health.delayMs}ms
          </span>
        )}
      </div>
    );
  }

  const getStatusStyle = (status: HealthStatusType) => {
    switch (status) {
      case 'buffering':
        return 'bg-[#F59E0B] text-black';
      case 'high_latency':
        return 'bg-[#F59E0B] text-black';
      case 'reconnecting':
        return 'bg-[#2563EB] text-white';
      case 'offline':
      default:
        return 'bg-[#7F1D1D] text-white';
    }
  };

  const getStatusLabel = (status: HealthStatusType) => {
    switch (status) {
      case 'buffering':
        return 'BUFFERING';
      case 'high_latency':
        return 'HIGH LATENCY';
      case 'reconnecting':
        return `RECONNECTING (${reconnectAttempt}/${maxRetries})`;
      case 'offline':
      default:
        return 'OFFLINE';
    }
  };

  return (
    <div className={`px-2.5 py-1 rounded-[6px] text-[11px] font-bold tracking-wider font-mono flex items-center gap-1.5 ${getStatusStyle(health.status)}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      <span>{getStatusLabel(health.status)}</span>
    </div>
  );
};

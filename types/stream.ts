export interface VariantInfo {
  index: number;
  bandwidth: number;
  resolution?: string;
  width?: number;
  height?: number;
  codecs?: string;
  url: string;
}

export interface StreamValidationResult {
  valid: boolean;
  live: boolean;
  isMaster: boolean;
  url: string;
  originalUrl: string;
  proxiedUrl?: string;
  contentType?: string;
  resolution?: string;
  codecs?: string;
  bitrate?: number;
  variants: VariantInfo[];
  segmentDuration?: number;
  audioTracksCount?: number;
  subtitleTracksCount?: number;
  error?: string;
  serverHeader?: string;
}

export type HealthStatusType = 'healthy' | 'buffering' | 'high_latency' | 'offline' | 'reconnecting';

export interface StreamHealth {
  status: HealthStatusType;
  delayMs: number;
  bufferLength: number;
  errorCount: number;
  lastCheckTime: number;
  message: string;
}

export interface HlsMetrics {
  currentResolution: string;
  currentBitrate: number; // in bps
  droppedFrames: number;
  totalFrames: number;
  fps: number;
  latency: number; // in seconds
  bufferLength: number; // in seconds
  downloadSpeedBps: number;
  segmentNumber: number;
  liveDelay: number; // in seconds
}

export interface QualityLevel {
  id: number; // -1 for auto
  name: string;
  height?: number;
  width?: number;
  bitrate?: number;
}

export interface TrackInfo {
  id: number;
  name: string;
  lang?: string;
  default?: boolean;
}

export interface StreamHistoryItem {
  id: string;
  url: string;
  title?: string;
  lastPlayed: number;
  isFavorite?: boolean;
  status?: HealthStatusType;
  resolution?: string;
}

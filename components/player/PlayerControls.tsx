'use client';

import React, { memo } from 'react';
import {
  Play,
  Pause,
  PictureInPicture2,
  Maximize,
  Minimize,
  Share2,
  RotateCcw,
  RotateCw,
  Subtitles,
} from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { SettingsMenu } from './SettingsMenu';
import { ChannelZapButtons } from './ChannelZapButtons';
import { HlsMetrics, QualityLevel, StreamHealth, TrackInfo } from '@/types/stream';

interface PlayerControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  health: StreamHealth;
  metrics?: HlsMetrics;
  title?: string;
  useProxy: boolean;
  setUseProxy: (val: boolean) => void;
  qualities: QualityLevel[];
  currentQualityIndex: number;
  audioTracks: TrackInfo[];
  currentAudioTrack: number;
  subtitleTracks: TrackInfo[];
  currentSubtitleTrack: number;
  playbackSpeed: number;
  lowLatencyMode: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onVolumeChange: (vol: number) => void;
  onSeek: (time: number) => void;
  onSeekBackward10: () => void;
  onSeekForward10: () => void;
  onJumpToLive: () => void;
  onSelectQuality: (id: number) => void;
  onSelectAudioTrack: (id: number) => void;
  onSelectSubtitleTrack: (id: number) => void;
  onSelectPlaybackSpeed: (speed: number) => void;
  onToggleLowLatency: () => void;
  onTogglePiP: () => void;
  onToggleFullscreen: () => void;
  onOpenStreamInfo: () => void;
  onOpenShortcuts: () => void;
  onOpenShareModal: () => void;
  onNextChannel?: () => void;
  onPrevChannel?: () => void;
  isFullscreen: boolean;
  onSettingsOpenChange?: (isOpen: boolean) => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = memo(({
  isPlaying,
  isMuted,
  volume,
  health,
  metrics,
  qualities,
  currentQualityIndex,
  audioTracks,
  currentAudioTrack,
  subtitleTracks,
  currentSubtitleTrack,
  playbackSpeed,
  lowLatencyMode,
  onTogglePlay,
  onToggleMute,
  onVolumeChange,
  onSeek,
  onSeekBackward10,
  onSeekForward10,
  onSelectQuality,
  onSelectAudioTrack,
  onSelectSubtitleTrack,
  onSelectPlaybackSpeed,
  onToggleLowLatency,
  onTogglePiP,
  onToggleFullscreen,
  onOpenStreamInfo,
  onOpenShortcuts,
  onOpenShareModal,
  onNextChannel,
  onPrevChannel,
  isFullscreen,
  onSettingsOpenChange,
}) => {
  const currentTime = metrics?.currentTime || 0;
  const rawDuration = metrics?.duration || metrics?.seekableEnd || 0;
  const duration = isFinite(rawDuration) ? rawDuration : 0;
  const isVod = duration > 0 && duration < 86400;

  return (
    <div className={`player-controls-overlay ${!isPlaying ? 'show-always' : ''}`}>
      {/* Flush Bottom Controls Container (No overflow-hidden so popover extends above cleanly) */}
      <div className="w-full bg-gradient-to-t from-black/95 via-black/85 to-transparent px-2.5 sm:px-4 pb-2.5 sm:pb-3 pt-4 sm:pt-6 rounded-b-[16px] flex flex-col gap-2 pointer-events-auto">
        {/* Timeline Progress Bar */}
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          bufferLength={health.bufferLength}
          onSeek={onSeek}
          isLive={!isVod}
        />

        {/* Controls Action Row */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-3 pt-0.5 w-full">
          {/* Left Aligned Controls Group */}
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            {/* Play/Pause Button */}
            <button
              onClick={onTogglePlay}
              className="w-8 h-8 sm:w-10 sm:h-10 min-w-[32px] sm:min-w-[40px] min-h-[32px] sm:min-h-[40px] rounded-[8px] bg-white hover:bg-neutral-200 text-black flex items-center justify-center transition-all active:scale-95 shadow-md shrink-0"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
            </button>

            {/* 10s Seek Backward */}
            <button
              onClick={onSeekBackward10}
              className="p-1.5 sm:p-2.5 min-w-[32px] sm:min-w-[36px] min-h-[32px] sm:min-h-[36px] bg-[#141414]/90 hover:bg-[#27272A] border border-white/10 rounded-[8px] text-[#B6B6B8] hover:text-white transition-colors flex items-center justify-center shrink-0"
              title="Seek 10 seconds backward"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* 10s Seek Forward */}
            <button
              onClick={onSeekForward10}
              className="p-1.5 sm:p-2.5 min-w-[32px] sm:min-w-[36px] min-h-[32px] sm:min-h-[36px] bg-[#141414]/90 hover:bg-[#27272A] border border-white/10 rounded-[8px] text-[#B6B6B8] hover:text-white transition-colors flex items-center justify-center shrink-0"
              title="Seek 10 seconds forward"
            >
              <RotateCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* TV Playlist / Channel Zapping Group */}
            <ChannelZapButtons onNextChannel={onNextChannel} onPrevChannel={onPrevChannel} />

            {/* Volume Slider Control */}
            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={onVolumeChange}
              onToggleMute={onToggleMute}
            />
          </div>

          {/* Right Aligned Controls Group */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            {/* Subtitles CC Button */}
            {subtitleTracks.length > 0 && (
              <button
                onClick={() => {
                  if (currentSubtitleTrack !== -1) {
                    onSelectSubtitleTrack(-1);
                  } else if (subtitleTracks.length > 0) {
                    onSelectSubtitleTrack(subtitleTracks[0].id);
                  }
                }}
                className={`p-1.5 sm:p-2.5 min-w-[32px] sm:min-w-[36px] min-h-[32px] sm:min-h-[36px] border rounded-[8px] text-xs font-mono font-semibold transition-all flex items-center justify-center ${
                  currentSubtitleTrack !== -1
                    ? 'bg-white text-black border-white shadow-md'
                    : 'bg-[#141414]/90 hover:bg-[#27272A] border-white/10 text-[#B6B6B8] hover:text-white'
                }`}
                title={currentSubtitleTrack !== -1 ? 'Subtitles On' : 'Subtitles Off'}
              >
                <Subtitles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}

            {/* Share Link Modal Button */}
            <button
              onClick={onOpenShareModal}
              className="p-1.5 sm:p-2.5 min-w-[32px] sm:min-w-[36px] min-h-[32px] sm:min-h-[36px] bg-[#141414]/90 hover:bg-[#27272A] border border-white/10 rounded-[8px] text-[#B6B6B8] hover:text-white transition-colors flex items-center justify-center"
              title="Share Direct Watch Link"
            >
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Settings Gear Popover Menu */}
            <SettingsMenu
              qualities={qualities}
              currentQualityIndex={currentQualityIndex}
              onSelectQuality={onSelectQuality}
              audioTracks={audioTracks}
              currentAudioTrack={currentAudioTrack}
              onSelectAudioTrack={onSelectAudioTrack}
              onSelectSubtitleTrack={onSelectSubtitleTrack}
              subtitleTracks={subtitleTracks}
              currentSubtitleTrack={currentSubtitleTrack}
              playbackSpeed={playbackSpeed}
              onSelectPlaybackSpeed={onSelectPlaybackSpeed}
              lowLatencyMode={lowLatencyMode}
              onToggleLowLatency={onToggleLowLatency}
              onOpenStreamInfo={onOpenStreamInfo}
              onOpenShortcuts={onOpenShortcuts}
              onOpenChange={onSettingsOpenChange}
            />

            {/* Picture-in-Picture Button */}
            <button
              onClick={onTogglePiP}
              className="hidden sm:flex p-2.5 min-w-[36px] min-h-[36px] bg-[#141414]/90 hover:bg-[#27272A] border border-white/10 rounded-[8px] text-[#B6B6B8] hover:text-white transition-colors items-center justify-center"
              title="Picture-in-Picture"
            >
              <PictureInPicture2 className="w-4 h-4" />
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={onToggleFullscreen}
              className="p-1.5 sm:p-2.5 min-w-[32px] sm:min-w-[36px] min-h-[32px] sm:min-h-[36px] bg-[#141414]/90 hover:bg-[#27272A] border border-white/10 rounded-[8px] text-[#B6B6B8] hover:text-white transition-colors flex items-center justify-center"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

PlayerControls.displayName = 'PlayerControls';

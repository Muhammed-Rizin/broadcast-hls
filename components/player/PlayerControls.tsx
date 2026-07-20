'use client';

import React from 'react';
import { Play, Pause, PictureInPicture2, Maximize, Minimize, Share2, RotateCcw, RotateCw, Subtitles } from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';
import { SettingsMenu } from './SettingsMenu';
import { QualityLevel, StreamHealth, TrackInfo } from '@/types/stream';

interface PlayerControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  health: StreamHealth;
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
  isFullscreen: boolean;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  isMuted,
  volume,
  health,
  title,
  useProxy,
  setUseProxy,
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
  onJumpToLive,
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
  isFullscreen,
}) => {
  return (
    <div className={`player-controls-overlay ${!isPlaying ? 'show-always' : ''}`}>
      {/* Flush Bottom Controls Container */}
      <div className="w-full bg-gradient-to-t from-black/95 via-black/70 to-transparent px-4 pb-3 pt-6 rounded-b-[16px] flex flex-col gap-2 pointer-events-auto">
        {/* Timeline Progress Bar */}
        <ProgressBar
          currentTime={0}
          duration={0}
          bufferLength={health.bufferLength}
          onSeek={onSeek}
          isLive={true}
        />

        <div className="flex items-center justify-between gap-3 pt-0.5">
          {/* Left Controls: 10s Backward, Play/Pause, 10s Forward, Subtle LIVE dot, Volume */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSeekBackward10}
              className="p-1.5 bg-[#141414]/90 hover:bg-[#27272A] border border-white/10 rounded-[8px] text-[#B6B6B8] hover:text-white transition-colors"
              title="Seek 10 seconds backward (J / ←)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onTogglePlay}
              className="w-8 h-8 rounded-[8px] bg-white hover:bg-neutral-200 text-black flex items-center justify-center transition-all active:scale-95 shadow-md"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
            </button>

            <button
              onClick={onSeekForward10}
              className="p-1.5 bg-[#141414]/90 hover:bg-[#27272A] border border-white/10 rounded-[8px] text-[#B6B6B8] hover:text-white transition-colors"
              title="Seek 10 seconds forward (L / →)"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            {/* Subtle Live Dot */}
            <button
              onClick={onJumpToLive}
              className="flex items-center gap-1.5 px-2 py-1 rounded-[5px] bg-[#C62828] hover:bg-red-700 text-white text-[11px] font-bold font-mono transition-colors ml-1"
              title="Jump to Live edge"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>LIVE</span>
            </button>

            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={onVolumeChange}
              onToggleMute={onToggleMute}
            />
          </div>

          {/* Right Controls: Subtitles CC, Share, Settings Gear, PiP, Fullscreen */}
          <div className="flex items-center gap-1.5">
            {/* Quick Subtitle Toggle Button */}
            <button
              onClick={() => {
                if (currentSubtitleTrack !== -1) {
                  onSelectSubtitleTrack(-1);
                } else if (subtitleTracks.length > 0) {
                  onSelectSubtitleTrack(subtitleTracks[0].id);
                }
              }}
              className={`p-2 border rounded-[8px] text-xs font-mono font-semibold transition-all ${
                currentSubtitleTrack !== -1
                  ? 'bg-white text-black border-white shadow-md'
                  : 'bg-[#141414]/90 hover:bg-[#27272A] border-white/10 text-[#B6B6B8] hover:text-white'
              }`}
              title={currentSubtitleTrack !== -1 ? 'Subtitles On (Click to turn off)' : 'Subtitles Off (Click to turn on)'}
            >
              <Subtitles className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenShareModal}
              className="p-2 bg-[#141414]/90 hover:bg-[#27272A] border border-white/10 rounded-[8px] text-[#B6B6B8] hover:text-white transition-colors"
              title="Share Direct Watch Link"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <SettingsMenu
              qualities={qualities}
              currentQualityIndex={currentQualityIndex}
              onSelectQuality={onSelectQuality}
              audioTracks={audioTracks}
              currentAudioTrack={currentAudioTrack}
              onSelectSubtitleTrack={onSelectSubtitleTrack}
              subtitleTracks={subtitleTracks}
              currentSubtitleTrack={currentSubtitleTrack}
              playbackSpeed={playbackSpeed}
              onSelectPlaybackSpeed={onSelectPlaybackSpeed}
              lowLatencyMode={lowLatencyMode}
              onToggleLowLatency={onToggleLowLatency}
              onOpenStreamInfo={onOpenStreamInfo}
              onOpenShortcuts={onOpenShortcuts}
            />

            <button
              onClick={onTogglePiP}
              className="p-2 bg-[#141414]/90 hover:bg-[#27272A] border border-white/10 rounded-[8px] text-[#B6B6B8] hover:text-white transition-colors"
              title="Picture-in-Picture"
            >
              <PictureInPicture2 className="w-4 h-4" />
            </button>

            <button
              onClick={onToggleFullscreen}
              className="p-2 bg-[#141414]/90 hover:bg-[#27272A] border border-white/10 rounded-[8px] text-[#B6B6B8] hover:text-white transition-colors"
              title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Settings,
  Sliders,
  Music,
  Languages,
  Gauge,
  Activity,
  Keyboard,
  ChevronRight,
  ChevronLeft,
  Zap,
} from 'lucide-react';
import { QualityLevel, TrackInfo } from '@/types/stream';
import { QualityMenu } from './menu/QualityMenu';
import { AudioMenu } from './menu/AudioMenu';
import { SubtitleMenu } from './menu/SubtitleMenu';
import { SpeedMenu } from './menu/SpeedMenu';

interface SettingsMenuProps {
  qualities: QualityLevel[];
  currentQualityIndex: number;
  onSelectQuality: (id: number) => void;
  audioTracks: TrackInfo[];
  currentAudioTrack: number;
  onSelectAudioTrack: (id: number) => void;
  subtitleTracks: TrackInfo[];
  currentSubtitleTrack: number;
  onSelectSubtitleTrack: (id: number) => void;
  playbackSpeed: number;
  onSelectPlaybackSpeed: (speed: number) => void;
  lowLatencyMode: boolean;
  onToggleLowLatency: () => void;
  onOpenStreamInfo: () => void;
  onOpenShortcuts: () => void;
  onOpenChange?: (isOpen: boolean) => void;
}

type ViewMode = 'main' | 'quality' | 'audio' | 'subtitles' | 'speed';

export const SettingsMenu: React.FC<SettingsMenuProps> = ({
  qualities,
  currentQualityIndex,
  onSelectQuality,
  audioTracks,
  currentAudioTrack,
  onSelectAudioTrack,
  subtitleTracks,
  currentSubtitleTrack,
  onSelectSubtitleTrack,
  playbackSpeed,
  onSelectPlaybackSpeed,
  lowLatencyMode,
  onToggleLowLatency,
  onOpenStreamInfo,
  onOpenShortcuts,
  onOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('main');

  // Notify parent component when settings popover opens or closes
  useEffect(() => {
    if (onOpenChange) {
      onOpenChange(isOpen);
    }
  }, [isOpen, onOpenChange]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setViewMode('main');
  }, []);

  const sortedQualities = useMemo(() => {
    const uniqueQualitiesMap = new Map<number | string, QualityLevel>();
    qualities.forEach((q) => {
      const key = q.height || q.bitrate || q.id;
      const existing = uniqueQualitiesMap.get(key);
      if (!existing || (q.bitrate && q.bitrate > (existing.bitrate || 0))) {
        uniqueQualitiesMap.set(key, q);
      }
    });

    return Array.from(uniqueQualitiesMap.values()).sort((a, b) => {
      const heightA = a.height || 0;
      const heightB = b.height || 0;
      if (heightB !== heightA) return heightB - heightA;
      return (b.bitrate || 0) - (a.bitrate || 0);
    });
  }, [qualities]);

  const getActiveQualityName = () => {
    if (currentQualityIndex === -1) return 'Auto';
    const q = qualities.find((item) => item.id === currentQualityIndex);
    return q ? q.name : 'Auto';
  };

  const getActiveAudioName = () => {
    const track = audioTracks.find((t) => t.id === currentAudioTrack);
    return track ? track.name : 'Default';
  };

  const getActiveSubtitleName = () => {
    if (currentSubtitleTrack === -1) return 'Off';
    const track = subtitleTracks.find((t) => t.id === currentSubtitleTrack);
    return track ? track.name : 'Off';
  };

  return (
    <div className="relative">
      {/* Trigger Gear Icon */}
      <button
        onClick={() => {
          const nextState = !isOpen;
          setIsOpen(nextState);
          if (!nextState) setViewMode('main');
        }}
        className={`p-2 sm:p-2.5 min-w-[34px] min-h-[34px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center rounded-[8px] border transition-all ${
          isOpen
            ? 'bg-white text-black border-white shadow-lg'
            : 'bg-[#18181C]/90 hover:bg-[#27272A] border-white/10 text-[#B6B6B8] hover:text-white'
        }`}
        title="Playback Settings"
      >
        <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>

      {/* Touch-safe Mobile & Desktop Popover Container */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-72 max-w-[calc(100vw-1.5rem)] bg-[#18181C]/95 backdrop-blur-2xl border border-white/15 rounded-[14px] p-2 z-50 shadow-[0_16px_48px_rgba(0,0,0,0.85)] text-xs font-sans animate-fadeIn max-h-[75vh] overflow-y-auto">
          {viewMode === 'main' && (
            <div className="space-y-1">
              <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                  Settings
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white font-bold">
                  HLS .m3u8
                </span>
              </div>

              {/* Quality Submenu Trigger */}
              <button
                onClick={() => setViewMode('quality')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-[8px] text-[#D4D4D8] hover:bg-[#27272A] hover:text-white transition-all group text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-[#27272A] group-hover:bg-[#3F3F46] flex items-center justify-center transition-colors shrink-0">
                    <Sliders className="w-3.5 h-3.5 text-[#A1A1AA] group-hover:text-white" />
                  </div>
                  <span className="font-medium truncate">Quality</span>
                </div>
                <div className="flex items-center gap-1 text-[#A1A1AA] shrink-0">
                  <span className="font-mono text-[11px] font-semibold">{getActiveQualityName()}</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* Audio Submenu Trigger */}
              {audioTracks.length > 0 && (
                <button
                  onClick={() => setViewMode('audio')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-[8px] text-[#D4D4D8] hover:bg-[#27272A] hover:text-white transition-all group text-left"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-md bg-[#27272A] group-hover:bg-[#3F3F46] flex items-center justify-center transition-colors shrink-0">
                      <Music className="w-3.5 h-3.5 text-[#A1A1AA] group-hover:text-white" />
                    </div>
                    <span className="font-medium truncate">Audio Track</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#A1A1AA] shrink-0">
                    <span className="font-mono text-[11px] font-semibold">{getActiveAudioName()}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              )}

              {/* Subtitles Submenu Trigger */}
              {subtitleTracks.length > 0 && (
                <button
                  onClick={() => setViewMode('subtitles')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-[8px] text-[#D4D4D8] hover:bg-[#27272A] hover:text-white transition-all group text-left"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-6 h-6 rounded-md bg-[#27272A] group-hover:bg-[#3F3F46] flex items-center justify-center transition-colors shrink-0">
                      <Languages className="w-3.5 h-3.5 text-[#A1A1AA] group-hover:text-white" />
                    </div>
                    <span className="font-medium truncate">Subtitles</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#A1A1AA] shrink-0">
                    <span className="font-mono text-[11px] font-semibold">{getActiveSubtitleName()}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              )}

              {/* Speed Submenu Trigger */}
              <button
                onClick={() => setViewMode('speed')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-[8px] text-[#D4D4D8] hover:bg-[#27272A] hover:text-white transition-all group text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-[#27272A] group-hover:bg-[#3F3F46] flex items-center justify-center transition-colors shrink-0">
                    <Gauge className="w-3.5 h-3.5 text-[#A1A1AA] group-hover:text-white" />
                  </div>
                  <span className="font-medium truncate">Playback Speed</span>
                </div>
                <div className="flex items-center gap-1 text-[#A1A1AA] shrink-0">
                  <span className="font-mono text-[11px] font-semibold">
                    {playbackSpeed === 1.0 ? 'Normal' : `${playbackSpeed}x`}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* Low Latency Toggle */}
              <button
                onClick={onToggleLowLatency}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-[8px] text-[#D4D4D8] hover:bg-[#27272A] hover:text-white transition-all group text-left"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-[#27272A] group-hover:bg-[#3F3F46] flex items-center justify-center transition-colors shrink-0">
                    <Zap className="w-3.5 h-3.5 text-[#A1A1AA] group-hover:text-white" />
                  </div>
                  <span className="font-medium truncate">Low Latency</span>
                </div>
                <div className={`w-8 h-4.5 rounded-full p-0.5 transition-colors flex items-center shrink-0 ${
                  lowLatencyMode ? 'bg-[#22C55E]' : 'bg-[#3F3F46]'
                }`}>
                  <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                    lowLatencyMode ? 'translate-x-3.5' : 'translate-x-0'
                  }`} />
                </div>
              </button>

              <div className="border-t border-white/10 my-1" />

              {/* Stream Information Trigger */}
              <button
                onClick={() => {
                  closeMenu();
                  onOpenStreamInfo();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-[#D4D4D8] hover:bg-[#27272A] hover:text-white transition-all group text-left"
              >
                <div className="w-6 h-6 rounded-md bg-[#27272A] group-hover:bg-[#3F3F46] flex items-center justify-center transition-colors shrink-0">
                  <Activity className="w-3.5 h-3.5 text-[#A1A1AA] group-hover:text-white" />
                </div>
                <span className="font-medium truncate">Stream Information</span>
              </button>

              {/* Keyboard Shortcuts Trigger */}
              <button
                onClick={() => {
                  closeMenu();
                  onOpenShortcuts();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-[#D4D4D8] hover:bg-[#27272A] hover:text-white transition-all group text-left"
              >
                <div className="w-6 h-6 rounded-md bg-[#27272A] group-hover:bg-[#3F3F46] flex items-center justify-center transition-colors shrink-0">
                  <Keyboard className="w-3.5 h-3.5 text-[#A1A1AA] group-hover:text-white" />
                </div>
                <span className="font-medium truncate">Keyboard Shortcuts</span>
              </button>
            </div>
          )}

          {/* Submenu Header Helper */}
          {viewMode !== 'main' && (
            <button
              onClick={() => setViewMode('main')}
              className="w-full flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#A1A1AA] hover:text-white border-b border-white/10 mb-1 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Settings</span>
            </button>
          )}

          {viewMode === 'quality' && (
            <QualityMenu
              qualities={sortedQualities}
              currentQualityIndex={currentQualityIndex}
              onSelectQuality={onSelectQuality}
              onClose={closeMenu}
            />
          )}

          {viewMode === 'audio' && (
            <AudioMenu
              audioTracks={audioTracks}
              currentAudioTrack={currentAudioTrack}
              onSelectAudioTrack={onSelectAudioTrack}
              onClose={closeMenu}
            />
          )}

          {viewMode === 'subtitles' && (
            <SubtitleMenu
              subtitleTracks={subtitleTracks}
              currentSubtitleTrack={currentSubtitleTrack}
              onSelectSubtitleTrack={onSelectSubtitleTrack}
              onClose={closeMenu}
            />
          )}

          {viewMode === 'speed' && (
            <SpeedMenu
              playbackSpeed={playbackSpeed}
              onSelectPlaybackSpeed={onSelectPlaybackSpeed}
              onClose={closeMenu}
            />
          )}
        </div>
      )}
    </div>
  );
};

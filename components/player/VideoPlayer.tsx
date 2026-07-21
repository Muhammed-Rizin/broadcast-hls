'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, RotateCw } from 'lucide-react';
import { useHlsPlayer } from '@/hooks/useHlsPlayer';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { PlayerControls } from './PlayerControls';
import { PlayerOverlayMessages } from './PlayerOverlayMessages';
import { PlayerSkeleton } from './PlayerSkeleton';
import { StreamInfoModal } from './StreamInfoModal';
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal';
import { ShareLinkModal } from '@/components/ShareLinkModal';
import { HlsMetrics, StreamHealth } from '@/types/stream';

interface VideoPlayerProps {
  streamUrl: string;
  useProxy: boolean;
  setUseProxy: (use: boolean) => void;
  onMetricsUpdate?: (metrics: HlsMetrics) => void;
  onHealthUpdate?: (health: StreamHealth) => void;
  title?: string;
  autoPlay?: boolean;
  onNextChannel?: () => void;
  onPrevChannel?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  streamUrl,
  useProxy,
  setUseProxy,
  onMetricsUpdate,
  onHealthUpdate,
  title,
  autoPlay = true,
  onNextChannel,
  onPrevChannel,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [lowLatencyMode, setLowLatencyMode] = useState(true);

  // Popover & Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStreamInfoOpen, setIsStreamInfoOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Inactivity auto-hide controls state (2.5 seconds)
  const [showControls, setShowControls] = useState(true);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    videoRef,
    isPlaying,
    isBuffering,
    granularStatus,
    errorCode,
    errorDetails,
    health,
    metrics,
    qualities,
    currentQualityIndex,
    audioTracks,
    currentAudioTrack,
    subtitleTracks,
    currentSubtitleTrack,
    isMuted: hlsIsMuted,
    volume: hlsVolume,
    togglePlay,
    jumpToLive,
    seekBy,
    seekTo,
    selectQuality,
    selectAudioTrack,
    selectSubtitleTrack,
    retryStream,
  } = useHlsPlayer({ streamUrl, useProxy, autoPlay });

  // Check if any modal or settings popover is currently active
  const isAnyMenuOpen = isSettingsOpen || isStreamInfoOpen || isShortcutsOpen || isShareModalOpen;

  // Handle inactivity auto-hide controls timer
  const handleUserInteraction = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    // FREEZE auto-hide timer if Settings popover or any modal is open!
    if (isAnyMenuOpen) {
      return;
    }

    hideTimerRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2500);
  }, [isPlaying, isAnyMenuOpen]);

  // Reset or clear auto-hide timer whenever menu open state or isPlaying changes
  useEffect(() => {
    if (isAnyMenuOpen) {
      setShowControls(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    } else {
      handleUserInteraction();
    }
  }, [isAnyMenuOpen, handleUserInteraction]);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  // Handle telemetry updates
  useEffect(() => {
    if (onMetricsUpdate) onMetricsUpdate(metrics);
    if (onHealthUpdate) onHealthUpdate(health);
  }, [metrics, health, onMetricsUpdate, onHealthUpdate]);

  // Sync fullscreen state with document fullscreenchange event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle volume changes
  const handleVolumeChange = (newVol: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
  };

  // Playback speed change
  const handleSelectPlaybackSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };

  // PiP toggle
  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.warn('PiP failed', err);
    }
  };

  // Keyboard Shortcuts Hook
  useKeyboardShortcuts({
    onTogglePlay: togglePlay,
    onToggleFullscreen: toggleFullscreen,
    onToggleMute: toggleMute,
    onJumpToLive: jumpToLive,
    onSeekBackward10: () => seekBy(-10),
    onSeekForward10: () => seekBy(10),
    onNextChannel,
    onPrevChannel,
  });

  if (!streamUrl) {
    return <PlayerSkeleton />;
  }

  return (
    <div
      className="video-container group relative select-none"
      onMouseMove={handleUserInteraction}
      onTouchStart={handleUserInteraction}
      onDoubleClick={toggleFullscreen}
    >
      <video
        ref={videoRef}
        className="video-element"
        playsInline
        onClick={() => {
          if (!showControls && isPlaying) {
            setShowControls(true);
          } else {
            togglePlay();
          }
        }}
      />

      {/* Top Stage Header Overlay: Stream Title & Space-Saving LIVE Edge Badge */}
      <div
        className={`absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none transition-opacity duration-300 z-20 ${
          showControls || !isPlaying || isAnyMenuOpen ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-2 bg-[#141416]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 max-w-[85%] pointer-events-auto shadow-lg">
          {/* Top-Left LIVE Sync Button Badge */}
          <button
            onClick={jumpToLive}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#C62828] hover:bg-red-700 text-white text-[10px] font-bold font-mono transition-colors shrink-0 shadow-sm"
            title="Click to jump to Live edge"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span>LIVE</span>
          </button>

          {title && (
            <h2 className="text-xs sm:text-sm font-semibold text-white truncate font-sans tracking-tight">
              {title}
            </h2>
          )}
        </div>
      </div>

      {/* Centered Touch & Click Overlay Controls (Visible on mobile/tap or when controls active) */}
      <div
        className={`absolute inset-0 flex items-center justify-center gap-6 pointer-events-none transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            seekBy(-10);
            handleUserInteraction();
          }}
          className="pointer-events-auto p-3 sm:p-4 rounded-full bg-black/50 hover:bg-black/75 border border-white/20 text-white backdrop-blur-md transition-transform active:scale-95 shadow-xl sm:hidden"
          title="Seek 10s Backward"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
            handleUserInteraction();
          }}
          className="pointer-events-auto p-4 sm:p-5 rounded-full bg-white/90 hover:bg-white text-black transition-transform active:scale-95 shadow-2xl"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 sm:w-8 sm:h-8 fill-black" />
          ) : (
            <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-black ml-1" />
          )}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            seekBy(10);
            handleUserInteraction();
          }}
          className="pointer-events-auto p-3 sm:p-4 rounded-full bg-black/50 hover:bg-black/75 border border-white/20 text-white backdrop-blur-md transition-transform active:scale-95 shadow-xl sm:hidden"
          title="Seek 10s Forward"
        >
          <RotateCw className="w-5 h-5" />
        </button>
      </div>

      {/* Granular Loading Status & HTTP Error Overlay */}
      <PlayerOverlayMessages
        isBuffering={isBuffering}
        granularStatus={granularStatus}
        errorCode={errorCode}
        errorDetails={errorDetails}
        useProxy={useProxy}
        setUseProxy={setUseProxy}
        onRetry={retryStream}
      />

      {/* Single Bottom Controls Bar */}
      <div className={`transition-opacity duration-200 ease-out ${
        showControls || !isPlaying || isAnyMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <PlayerControls
          isPlaying={isPlaying}
          isMuted={hlsIsMuted}
          volume={hlsVolume}
          health={health}
          metrics={metrics}
          title={title}
          useProxy={useProxy}
          setUseProxy={setUseProxy}
          qualities={qualities}
          currentQualityIndex={currentQualityIndex}
          audioTracks={audioTracks}
          currentAudioTrack={currentAudioTrack}
          subtitleTracks={subtitleTracks}
          currentSubtitleTrack={currentSubtitleTrack}
          playbackSpeed={playbackSpeed}
          lowLatencyMode={lowLatencyMode}
          onTogglePlay={togglePlay}
          onToggleMute={toggleMute}
          onVolumeChange={handleVolumeChange}
          onSeek={seekTo}
          onSeekBackward10={() => seekBy(-10)}
          onSeekForward10={() => seekBy(10)}
          onJumpToLive={jumpToLive}
          onSelectQuality={selectQuality}
          onSelectAudioTrack={selectAudioTrack}
          onSelectSubtitleTrack={selectSubtitleTrack}
          onSelectPlaybackSpeed={handleSelectPlaybackSpeed}
          onToggleLowLatency={() => setLowLatencyMode(!lowLatencyMode)}
          onTogglePiP={togglePiP}
          onToggleFullscreen={toggleFullscreen}
          onOpenStreamInfo={() => setIsStreamInfoOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          onOpenShareModal={() => setIsShareModalOpen(true)}
          onNextChannel={onNextChannel}
          onPrevChannel={onPrevChannel}
          isFullscreen={isFullscreen}
          onSettingsOpenChange={setIsSettingsOpen}
        />
      </div>

      {/* Stream Information & Diagnostics Modal */}
      <StreamInfoModal
        isOpen={isStreamInfoOpen}
        onClose={() => setIsStreamInfoOpen(false)}
        metrics={metrics}
        health={health}
        url={streamUrl}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Share Direct Watch Link Modal */}
      <ShareLinkModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        streamUrl={streamUrl}
        useProxy={useProxy}
      />
    </div>
  );
};

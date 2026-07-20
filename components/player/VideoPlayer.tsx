'use client';

import React, { useState, useEffect, useRef } from 'react';
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
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  streamUrl,
  useProxy,
  setUseProxy,
  onMetricsUpdate,
  onHealthUpdate,
  title,
  autoPlay = true,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [lowLatencyMode, setLowLatencyMode] = useState(true);

  // Modals state
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
    togglePlay,
    jumpToLive,
    seekBy,
    selectQuality,
    selectAudioTrack,
    selectSubtitleTrack,
    retryStream,
  } = useHlsPlayer({ streamUrl, useProxy, autoPlay });

  // Handle telemetry updates
  useEffect(() => {
    if (onMetricsUpdate) onMetricsUpdate(metrics);
    if (onHealthUpdate) onHealthUpdate(health);
  }, [metrics, health, onMetricsUpdate, onHealthUpdate]);

  // Handle inactivity auto-hide controls timer
  const handleUserInteraction = () => {
    setShowControls(true);
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  // Handle volume changes
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      setIsMuted(newVol === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    videoRef.current.muted = nextMuted;
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
      container.requestFullscreen().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(console.error);
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
  });

  if (!streamUrl) {
    return <PlayerSkeleton />;
  }

  return (
    <div
      className="video-container group"
      onMouseMove={handleUserInteraction}
      onTouchStart={handleUserInteraction}
      onDoubleClick={toggleFullscreen}
    >
      <video
        ref={videoRef}
        className="video-element"
        playsInline
        onClick={togglePlay}
      />

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
        showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <PlayerControls
          isPlaying={isPlaying}
          isMuted={isMuted}
          volume={volume}
          health={health}
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
          onSeek={(time) => seekBy(time - (videoRef.current?.currentTime || 0))}
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
          isFullscreen={isFullscreen}
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

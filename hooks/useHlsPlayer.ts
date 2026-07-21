'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { HlsMetrics, QualityLevel, StreamHealth, TrackInfo, HTMLVideoElementWithQuality } from '@/types/stream';

export type GranularStatus =
  | 'Connecting...'
  | 'Loading playlist...'
  | 'Downloading segments...'
  | 'Synchronizing live edge...'
  | 'Recovering playback...'
  | 'Retrying...'
  | 'Stream offline'
  | 'Ready';

export type ErrorType =
  | '403_FORBIDDEN'
  | '404_NOT_FOUND'
  | 'TIMEOUT'
  | 'NETWORK_ERROR'
  | 'UNSUPPORTED_CODEC'
  | 'SEGMENT_MISSING'
  | null;

interface UseHlsPlayerOptions {
  streamUrl: string;
  useProxy: boolean;
  autoPlay?: boolean;
}

export function useHlsPlayer({ streamUrl, useProxy, autoPlay = true }: UseHlsPlayerOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const reconnectAttemptRef = useRef(0);
  const mediaErrorRetryCountRef = useRef(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [granularStatus, setGranularStatus] = useState<GranularStatus>('Connecting...');
  const [errorCode, setErrorCode] = useState<ErrorType>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const [qualities, setQualities] = useState<QualityLevel[]>([]);
  const [currentQualityIndex, setCurrentQualityIndex] = useState<number>(-1);
  const [audioTracks, setAudioTracks] = useState<TrackInfo[]>([]);
  const [currentAudioTrack, setCurrentAudioTrack] = useState<number>(-1);
  const [subtitleTracks, setSubtitleTracks] = useState<TrackInfo[]>([]);
  const [currentSubtitleTrack, setCurrentSubtitleTrack] = useState<number>(-1);

  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const [isReconnecting, setIsReconnecting] = useState(false);

  const maxRetries = 5;
  const reconnectDelays = [1000, 2000, 4000, 8000, 16000];

  const [health, setHealth] = useState<StreamHealth>({
    status: 'healthy',
    delayMs: 0,
    bufferLength: 0,
    errorCount: 0,
    lastCheckTime: Date.now(),
    message: 'Stream connected',
  });

  const [metrics, setMetrics] = useState<HlsMetrics>({
    currentResolution: '1080p',
    currentBitrate: 0,
    droppedFrames: 0,
    totalFrames: 0,
    fps: 60,
    latency: 0,
    bufferLength: 0,
    downloadSpeedBps: 0,
    segmentNumber: 0,
    liveDelay: 0,
    currentTime: 0,
    duration: 0,
    seekableStart: 0,
    seekableEnd: 0,
  });

  const activeUrl = useProxy
    ? `/api/stream/proxy?url=${encodeURIComponent(streamUrl)}`
    : streamUrl;

  const handleNetworkError = useCallback(() => {
    if (reconnectAttemptRef.current >= maxRetries) {
      setErrorCode('NETWORK_ERROR');
      setErrorDetails('Stream connection lost. Max reconnect retries reached.');
      setIsReconnecting(false);
      return;
    }

    reconnectAttemptRef.current += 1;
    const currentAttempt = reconnectAttemptRef.current;
    setReconnectAttempt(currentAttempt);
    setIsReconnecting(true);
    setGranularStatus('Retrying...');

    const delay = reconnectDelays[Math.min(currentAttempt - 1, reconnectDelays.length - 1)];

    setTimeout(() => {
      if (hlsRef.current) {
        hlsRef.current.startLoad();
        setIsReconnecting(false);
      }
    }, delay);
  }, []);

  const handleMediaError = useCallback(() => {
    mediaErrorRetryCountRef.current += 1;
    const count = mediaErrorRetryCountRef.current;

    if (!hlsRef.current) return;

    if (count === 1) {
      console.warn('Recovering from first media error...');
      setGranularStatus('Recovering playback...');
      hlsRef.current.recoverMediaError();
    } else if (count === 2) {
      console.warn('Recovering from second media error by swapping audio codec...');
      setGranularStatus('Recovering playback...');
      hlsRef.current.swapAudioCodec();
      hlsRef.current.recoverMediaError();
    } else {
      console.error('Fatal media error count exceeded. Resetting HLS engine...');
      setErrorCode('UNSUPPORTED_CODEC');
      setErrorDetails('Fatal media decoding error. Stream format could not be recovered.');
    }
  }, []);

  useEffect(() => {
    if (!streamUrl || !videoRef.current) return;

    setErrorCode(null);
    setErrorDetails(null);
    setIsBuffering(true);
    setGranularStatus('Loading playlist...');
    reconnectAttemptRef.current = 0;
    mediaErrorRetryCountRef.current = 0;
    setReconnectAttempt(0);

    if (hlsRef.current) {
      hlsRef.current.stopLoad();
      hlsRef.current.detachMedia();
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const video = videoRef.current;

    // Synchronize HTML5 video media & volume events with React state
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handlePlaying = () => {
      setIsPlaying(true);
      setIsBuffering(false);
      setGranularStatus('Ready');
    };
    const handleWaiting = () => setIsBuffering(true);
    const handleVolumeChange = () => {
      if (video) {
        setIsMuted(video.muted || video.volume === 0);
        setVolume(video.volume);
      }
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('volumechange', handleVolumeChange);

    const handleNativeMetadata = () => {
      setIsBuffering(false);
      setGranularStatus('Ready');
      if (autoPlay) {
        video.play().then(() => setIsPlaying(true)).catch(() => {
          video.muted = true;
          video.play().then(() => setIsPlaying(true)).catch(console.error);
        });
      }
    };

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
        maxLiveSyncPlaybackRate: 1.1,
        highBufferWatchdogPeriod: 2,
        manifestLoadingTimeOut: 10000,
        manifestLoadingMaxRetry: 4,
        levelLoadingTimeOut: 10000,
        fragLoadingTimeOut: 15000,
        fragLoadingMaxRetry: 5,
      });

      hlsRef.current = hls;

      hls.loadSource(activeUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_LOADING, () => {
        setGranularStatus('Loading playlist...');
      });

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setGranularStatus('Downloading segments...');

        const parsedQualities: QualityLevel[] = data.levels.map((level, idx) => ({
          id: idx,
          name: level.height ? `${level.height}p` : `${Math.round(level.bitrate / 1000)}k`,
          height: level.height,
          width: level.width,
          bitrate: level.bitrate,
        }));
        setQualities(parsedQualities);

        if (hls.audioTracks && hls.audioTracks.length > 0) {
          const parsedAudio: TrackInfo[] = hls.audioTracks.map((t, idx) => ({
            id: idx,
            name: t.name || t.lang || `Track ${idx + 1}`,
            lang: t.lang,
            default: t.default,
          }));
          setAudioTracks(parsedAudio);
          setCurrentAudioTrack(hls.audioTrack !== -1 ? hls.audioTrack : 0);
        }

        if (hls.subtitleTracks && hls.subtitleTracks.length > 0) {
          const parsedSubs: TrackInfo[] = hls.subtitleTracks.map((t, idx) => ({
            id: idx,
            name: t.name || t.lang || `Subtitle ${idx + 1}`,
            lang: t.lang,
            default: t.default,
          }));
          setSubtitleTracks(parsedSubs);
          setCurrentSubtitleTrack(hls.subtitleTrack);
        }

        if (autoPlay) {
          const promise = video.play();
          if (promise !== undefined) {
            promise
              .then(() => {
                setIsPlaying(true);
                setIsBuffering(false);
                setGranularStatus('Ready');
              })
              .catch((err) => {
                console.warn('Autoplay blocked by browser policy, muting video to enable play:', err);
                video.muted = true;
                video.play().then(() => {
                  setIsPlaying(true);
                  setIsBuffering(false);
                  setGranularStatus('Ready');
                }).catch(console.error);
              });
          }
        }
      });

      hls.on(Hls.Events.AUDIO_TRACK_SWITCHED, (_, data) => {
        setCurrentAudioTrack(data.id);
      });

      hls.on(Hls.Events.SUBTITLE_TRACK_SWITCH, (_, data) => {
        setCurrentSubtitleTrack(data.id);
      });

      hls.on(Hls.Events.FRAG_LOADING, () => {
        setGranularStatus('Downloading segments...');
      });

      hls.on(Hls.Events.FRAG_PARSED, () => {
        setGranularStatus('Synchronizing live edge...');
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        const level = hls.levels[data.level];
        if (level) {
          setMetrics((prev) => ({
            ...prev,
            currentResolution: level.height ? `${level.width}x${level.height}` : prev.currentResolution,
            currentBitrate: level.bitrate || prev.currentBitrate,
          }));
        }
      });

      hls.on(Hls.Events.FRAG_LOADED, (_, data) => {
        const stats = data.frag.stats;
        if (stats && stats.loading && stats.loading.end > stats.loading.start) {
          const durationSec = (stats.loading.end - stats.loading.start) / 1000;
          const loadedBytes = stats.total || 0;
          const speedBps = durationSec > 0 ? (loadedBytes * 8) / durationSec : 0;
          const fragSn = data.frag.sn || 0;

          setMetrics((prev) => ({
            ...prev,
            downloadSpeedBps: speedBps,
            segmentNumber: typeof fragSn === 'number' ? fragSn : prev.segmentNumber,
          }));
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        console.warn('HLS Event Error:', data);

        if (data.response && data.response.code) {
          if (data.response.code === 403) {
            setErrorCode('403_FORBIDDEN');
            setErrorDetails('403 Forbidden: Access denied by origin streaming server.');
            return;
          }
          if (data.response.code === 404) {
            setErrorCode('404_NOT_FOUND');
            setErrorDetails('404 Not Found: Playlist or media segment does not exist.');
            return;
          }
        }

        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setGranularStatus('Recovering playback...');
              handleNetworkError();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              handleMediaError();
              break;
            default:
              setErrorCode('NETWORK_ERROR');
              setErrorDetails(data.reason || 'Fatal connection failure.');
              break;
          }
        }
      });

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = activeUrl;
      video.addEventListener('loadedmetadata', handleNativeMetadata);
    } else {
      setErrorCode('UNSUPPORTED_CODEC');
      setErrorDetails('Your browser does not support native HLS playback.');
    }

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('volumechange', handleVolumeChange);
      video.removeEventListener('loadedmetadata', handleNativeMetadata);

      if (hlsRef.current) {
        hlsRef.current.stopLoad();
        hlsRef.current.detachMedia();
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      video.removeAttribute('src');
      video.load();
    };
  }, [streamUrl, useProxy, activeUrl, autoPlay, handleNetworkError, handleMediaError]);

  // Buffer gap jumping and telemetry monitoring interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (!videoRef.current) return;
      const video = videoRef.current;

      // Sync isPlaying state with actual video paused state
      if (!video.paused && !isPlaying) {
        setIsPlaying(true);
      } else if (video.paused && isPlaying) {
        setIsPlaying(false);
      }

      // Detect and jump buffer gaps
      if (video.readyState < 3 && isPlaying && video.buffered.length > 0) {
        for (let i = 0; i < video.buffered.length; i++) {
          if (video.currentTime < video.buffered.start(i) && video.buffered.start(i) - video.currentTime < 2) {
            console.log('Jumping buffer gap to:', video.buffered.start(i));
            video.currentTime = video.buffered.start(i) + 0.1;
            break;
          }
        }
      }

      // Buffer size calculation
      let currentBuffer = 0;
      if (video.buffered.length > 0) {
        for (let i = 0; i < video.buffered.length; i++) {
          if (video.buffered.start(i) <= video.currentTime && video.currentTime <= video.buffered.end(i)) {
            currentBuffer = video.buffered.end(i) - video.currentTime;
            break;
          }
        }
      }

      // Dropped frames
      let dropped = 0;
      let total = 0;
      if ('getVideoPlaybackQuality' in video && typeof video.getVideoPlaybackQuality === 'function') {
        const quality = video.getVideoPlaybackQuality();
        dropped = quality.droppedVideoFrames || 0;
        total = quality.totalVideoFrames || 0;
      }

      // Live latency estimation & seekable range calculation
      let liveDelaySec = 0;
      if (hlsRef.current && hlsRef.current.liveSyncPosition) {
        liveDelaySec = Math.max(0, hlsRef.current.liveSyncPosition - video.currentTime);
      }

      let seekStart = 0;
      let seekEnd = video.duration || 0;
      if (video.seekable && video.seekable.length > 0) {
        seekStart = video.seekable.start(0);
        seekEnd = video.seekable.end(video.seekable.length - 1);
      }

      let currentStatus: StreamHealth['status'] = 'healthy';
      if (errorCode) {
        currentStatus = 'offline';
      } else if (video.paused) {
        currentStatus = 'healthy';
      } else if (video.readyState < 3 || isBuffering) {
        currentStatus = 'buffering';
      } else if (liveDelaySec > 15) {
        currentStatus = 'high_latency';
      }

      setHealth({
        status: isReconnecting ? 'reconnecting' : currentStatus,
        delayMs: Math.round(liveDelaySec * 1000),
        bufferLength: currentBuffer,
        errorCount: reconnectAttemptRef.current,
        lastCheckTime: Date.now(),
        message: isReconnecting ? `Reconnecting (${reconnectAttemptRef.current}/${maxRetries})...` : 'Stream connected',
      });

      setMetrics((prev) => ({
        ...prev,
        bufferLength: currentBuffer,
        droppedFrames: dropped,
        totalFrames: total,
        fps: 60,
        liveDelay: liveDelaySec,
        currentTime: video.currentTime || 0,
        duration: isNaN(video.duration) ? 0 : video.duration,
        seekableStart: seekStart,
        seekableEnd: seekEnd,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, isBuffering, isReconnecting, errorCode]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    if (video.paused) {
      const promise = video.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            setIsPlaying(true);
            setIsBuffering(false);
          })
          .catch((err) => {
            console.warn('Playback blocked by browser policy, attempting muted play:', err);
            video.muted = true;
            video.play().then(() => {
              setIsPlaying(true);
              setIsBuffering(false);
            }).catch(console.error);
          });
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const jumpToLive = () => {
    if (!videoRef.current) return;
    if (hlsRef.current && hlsRef.current.liveSyncPosition) {
      videoRef.current.currentTime = hlsRef.current.liveSyncPosition;
    } else if (videoRef.current.seekable.length > 0) {
      videoRef.current.currentTime = videoRef.current.seekable.end(videoRef.current.seekable.length - 1);
    }
  };

  const seekBy = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime + seconds);
  };

  const seekTo = (time: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = time;
  };

  const selectQuality = (levelIndex: number) => {
    if (!hlsRef.current) return;
    hlsRef.current.currentLevel = levelIndex;
    setCurrentQualityIndex(levelIndex);
  };

  const selectAudioTrack = (trackId: number) => {
    if (!hlsRef.current) return;
    hlsRef.current.audioTrack = trackId;
    setCurrentAudioTrack(trackId);
  };

  const selectSubtitleTrack = (trackId: number) => {
    if (!hlsRef.current) return;
    hlsRef.current.subtitleTrack = trackId;
    if (trackId !== -1) {
      hlsRef.current.subtitleDisplay = true;
    }
    setCurrentSubtitleTrack(trackId);
  };

  const retryStream = () => {
    setErrorCode(null);
    setErrorDetails(null);
    reconnectAttemptRef.current = 0;
    setReconnectAttempt(0);
    if (hlsRef.current) {
      hlsRef.current.loadSource(activeUrl);
    }
  };

  return {
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
    isMuted,
    volume,
    reconnectAttempt,
    maxRetries,
    togglePlay,
    jumpToLive,
    seekBy,
    seekTo,
    selectQuality,
    selectAudioTrack,
    selectSubtitleTrack,
    retryStream,
  };
}

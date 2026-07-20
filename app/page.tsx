'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { StreamInput } from '@/components/StreamInput';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import { StreamAnalyzer } from '@/components/StreamAnalyzer';
import { StreamHealthPanel } from '@/components/telemetry/StreamHealthPanel';
import { MultiView } from '@/components/MultiView';
import { RecentStreams } from '@/components/RecentStreams';
import { SettingsPanel } from '@/components/SettingsPanel';
import { IptvChannelGuide } from '@/components/IptvChannelGuide';
import { IptvPlaylistTab } from '@/components/IptvPlaylistTab';
import { useStreamHistory } from '@/hooks/useStreamHistory';
import { useIptvStore } from '@/hooks/useIptvStore';
import { HlsMetrics, StreamHealth, StreamValidationResult } from '@/types/stream';
import { IptvChannel, IptvPlaylist, parseM3uPlaylist, cleanStreamUrl } from '@/utils/m3uParser';

const DEFAULT_SAMPLE_URL = 'https://devstreaming-cdn.apple.com/videos/streaming/examples/adv_dv_atmos/main.m3u8';

function MainAppContent() {
  const searchParams = useSearchParams();
  const { saveToHistory } = useStreamHistory();
  const { activePlaylist, importPlaylistUrl } = useIptvStore();

  const [activeTab, setActiveTab] = useState<'player' | 'iptv' | 'multiview' | 'history' | 'settings'>('player');
  const [currentUrl, setCurrentUrl] = useState(DEFAULT_SAMPLE_URL);
  const [currentTitle, setCurrentTitle] = useState('Apple Advanced 4K Channel');
  const [useProxy, setUseProxy] = useState(false);
  const [validation, setValidation] = useState<StreamValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // IPTV Guide Modal Drawer State
  const [isIptvGuideOpen, setIsIptvGuideOpen] = useState(false);
  const [guidePlaylist, setGuidePlaylist] = useState<IptvPlaylist | null>(null);

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

  const [health, setHealth] = useState<StreamHealth>({
    status: 'healthy',
    delayMs: 0,
    bufferLength: 0,
    errorCount: 0,
    lastCheckTime: Date.now(),
    message: 'Stream ready',
  });

  const handleMetricsUpdate = useCallback((newMetrics: HlsMetrics) => {
    setMetrics((prev) => {
      if (
        prev.currentBitrate === newMetrics.currentBitrate &&
        prev.currentResolution === newMetrics.currentResolution &&
        prev.segmentNumber === newMetrics.segmentNumber &&
        Math.abs(prev.bufferLength - newMetrics.bufferLength) < 0.2 &&
        Math.abs((prev.currentTime || 0) - (newMetrics.currentTime || 0)) < 0.5
      ) {
        return prev;
      }
      return newMetrics;
    });
  }, []);

  const handleHealthUpdate = useCallback((newHealth: StreamHealth) => {
    setHealth((prev) => {
      if (
        prev.status === newHealth.status &&
        prev.errorCount === newHealth.errorCount &&
        Math.abs(prev.bufferLength - newHealth.bufferLength) < 0.2
      ) {
        return prev;
      }
      return newHealth;
    });
  }, []);

  const handlePlayStream = useCallback(
    (rawUrl: string, validationResult?: StreamValidationResult, customTitle?: string) => {
      const cleanUrl = cleanStreamUrl(rawUrl);
      setCurrentUrl(cleanUrl);
      if (customTitle) {
        setCurrentTitle(customTitle);
      } else {
        setCurrentTitle(cleanUrl === DEFAULT_SAMPLE_URL ? 'Apple Advanced 4K Channel' : cleanUrl);
      }

      // Auto-enable CORS proxy for HTTP streams or non-Apple third-party streams to ensure successful playback
      if (cleanUrl.startsWith('http://') || (cleanUrl !== DEFAULT_SAMPLE_URL && !cleanUrl.includes('apple.com'))) {
        setUseProxy(true);
      }

      if (validationResult) {
        setValidation(validationResult);
      }
      setActiveTab('player');

      saveToHistory(
        cleanUrl,
        customTitle || (cleanUrl === DEFAULT_SAMPLE_URL ? 'Apple Advanced 4K Channel' : undefined),
        validationResult?.resolution || '1080p'
      );
    },
    [saveToHistory]
  );

  const handleLoadIptvPlaylist = useCallback(
    async (playlistUrl: string) => {
      setIsLoading(true);
      try {
        const imported = await importPlaylistUrl(playlistUrl);
        if (imported && imported.channels.length > 0) {
          setGuidePlaylist(imported);
          setIsIptvGuideOpen(true);
          const firstChan = imported.channels[0];
          handlePlayStream(firstChan.streamUrl, undefined, firstChan.name);
        }
      } catch (err) {
        console.warn('Failed to load IPTV playlist', err);
      } finally {
        setIsLoading(false);
      }
    },
    [importPlaylistUrl, handlePlayStream]
  );

  // TV Zapping: Channel Up / Channel Down
  const handleZapChannel = useCallback(
    (direction: 'next' | 'prev') => {
      const activeList = guidePlaylist || activePlaylist;
      if (!activeList || activeList.channels.length === 0) return;

      const currentIdx = activeList.channels.findIndex((c) => c.streamUrl === currentUrl);
      let nextIdx = 0;
      if (currentIdx !== -1) {
        if (direction === 'next') {
          nextIdx = (currentIdx + 1) % activeList.channels.length;
        } else {
          nextIdx = (currentIdx - 1 + activeList.channels.length) % activeList.channels.length;
        }
      }

      const nextChan = activeList.channels[nextIdx];
      if (nextChan) {
        handlePlayStream(nextChan.streamUrl, undefined, nextChan.name);
      }
    },
    [guidePlaylist, activePlaylist, currentUrl, handlePlayStream]
  );

  // Handle direct share link query parameters (?url=...&proxy=true)
  useEffect(() => {
    const urlParam = searchParams.get('url');
    const proxyParam = searchParams.get('proxy');

    if (urlParam) {
      const decodedUrl = decodeURIComponent(urlParam);
      const cleanUrl = cleanStreamUrl(decodedUrl);
      setCurrentUrl(cleanUrl);

      if (proxyParam === 'true' || cleanUrl.startsWith('http://')) {
        setUseProxy(true);
      } else if (proxyParam === 'false') {
        setUseProxy(false);
      }

      if (cleanUrl.endsWith('.m3u') || cleanUrl.includes('/iptv/')) {
        handleLoadIptvPlaylist(cleanUrl);
      } else {
        handlePlayStream(cleanUrl);
      }
    }
  }, [searchParams, handlePlayStream, handleLoadIptvPlaylist]);

  return (
    <div className="min-h-screen pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        useProxy={useProxy}
        setUseProxy={setUseProxy}
      />

      {activeTab === 'player' && (
        <main className="space-y-5">
          {/* Stream URL Input Bar */}
          <StreamInput
            currentUrl={currentUrl}
            onPlayStream={handlePlayStream}
            useProxy={useProxy}
            setUseProxy={setUseProxy}
            isLoading={isLoading}
            onLoadIptvPlaylist={handleLoadIptvPlaylist}
            isIptvActive={!!activePlaylist || !!guidePlaylist}
            onOpenIptvGuide={() => setIsIptvGuideOpen(true)}
          />

          {/* Main Hero Video Player Occupying Max Width */}
          <div className="w-full">
            <VideoPlayer
              streamUrl={currentUrl}
              useProxy={useProxy}
              setUseProxy={setUseProxy}
              onMetricsUpdate={handleMetricsUpdate}
              onHealthUpdate={handleHealthUpdate}
              title={currentTitle}
              onNextChannel={() => handleZapChannel('next')}
              onPrevChannel={() => handleZapChannel('prev')}
            />
          </div>

          {/* Technical Diagnostics & Stream Metadata Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <StreamHealthPanel metrics={metrics} health={health} />
            </div>

            <div>
              <StreamAnalyzer validation={validation} />
            </div>
          </div>
        </main>
      )}

      {activeTab === 'iptv' && (
        <IptvPlaylistTab
          onPlayChannel={(chan) => handlePlayStream(chan.streamUrl, undefined, chan.name)}
          currentStreamUrl={currentUrl}
        />
      )}

      {activeTab === 'multiview' && <MultiView />}

      {activeTab === 'history' && <RecentStreams onSelectStream={handlePlayStream} />}

      {activeTab === 'settings' && <SettingsPanel useProxy={useProxy} setUseProxy={setUseProxy} />}

      {/* IPTV Channel Guide Drawer */}
      <IptvChannelGuide
        isOpen={isIptvGuideOpen}
        onClose={() => setIsIptvGuideOpen(false)}
        playlist={guidePlaylist || activePlaylist}
        currentStreamUrl={currentUrl}
        onSelectChannel={(chan) => handlePlayStream(chan.streamUrl, undefined, chan.name)}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0B0C] text-[#F4F4F5] flex items-center justify-center font-mono text-xs">
          Loading Broadcast HLS...
        </div>
      }
    >
      <MainAppContent />
    </Suspense>
  );
}

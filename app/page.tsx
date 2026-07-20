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
import { useStreamHistory } from '@/hooks/useStreamHistory';
import { HlsMetrics, StreamHealth, StreamValidationResult } from '@/types/stream';

const DEFAULT_SAMPLE_URL = 'http://40.160.24.55/TSN_4/index.m3u8';

function MainAppContent() {
  const searchParams = useSearchParams();
  const { saveToHistory } = useStreamHistory();

  const [activeTab, setActiveTab] = useState<'player' | 'multiview' | 'history' | 'settings'>('player');
  const [currentUrl, setCurrentUrl] = useState(DEFAULT_SAMPLE_URL);
  const [useProxy, setUseProxy] = useState(true);
  const [validation, setValidation] = useState<StreamValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
  });

  const [health, setHealth] = useState<StreamHealth>({
    status: 'healthy',
    delayMs: 0,
    bufferLength: 0,
    errorCount: 0,
    lastCheckTime: Date.now(),
    message: 'Stream ready',
  });

  const handlePlayStream = useCallback((url: string, validationResult?: StreamValidationResult) => {
    setCurrentUrl(url);
    if (validationResult) {
      setValidation(validationResult);
    }
    setActiveTab('player');

    saveToHistory(url, url === DEFAULT_SAMPLE_URL ? 'TSN 4 Live Channel' : undefined, validationResult?.resolution || '1080p');
  }, [saveToHistory]);

  const validateDefaultStream = useCallback(async () => {
    try {
      const res = await fetch('/api/stream/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: DEFAULT_SAMPLE_URL }),
      });
      const data: StreamValidationResult = await res.json();
      if (data.valid) {
        setValidation(data);
      }
    } catch (err) {
      console.warn('Initial validation probe completed', err);
    }
  }, []);

  // Handle direct share link query parameters (?url=...&proxy=true)
  useEffect(() => {
    const urlParam = searchParams.get('url');
    const proxyParam = searchParams.get('proxy');

    if (urlParam) {
      const decodedUrl = decodeURIComponent(urlParam);
      setCurrentUrl(decodedUrl);

      if (proxyParam === 'true' || decodedUrl.startsWith('http://')) {
        setUseProxy(true);
      } else if (proxyParam === 'false') {
        setUseProxy(false);
      }

      handlePlayStream(decodedUrl);
    } else {
      validateDefaultStream();
    }
  }, [searchParams, handlePlayStream, validateDefaultStream]);

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
          />

          {/* Main Hero Video Player Occupying Max Width */}
          <div className="w-full">
            <VideoPlayer
              streamUrl={currentUrl}
              useProxy={useProxy}
              setUseProxy={setUseProxy}
              onMetricsUpdate={setMetrics}
              onHealthUpdate={setHealth}
              title={currentUrl === DEFAULT_SAMPLE_URL ? 'TSN 4 Live Channel' : currentUrl}
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

      {activeTab === 'multiview' && <MultiView />}

      {activeTab === 'history' && <RecentStreams onSelectStream={handlePlayStream} />}

      {activeTab === 'settings' && <SettingsPanel useProxy={useProxy} setUseProxy={setUseProxy} />}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0B0B0C] text-white flex items-center justify-center font-mono text-xs">
        Loading Live HLS Hub...
      </div>
    }>
      <MainAppContent />
    </Suspense>
  );
}

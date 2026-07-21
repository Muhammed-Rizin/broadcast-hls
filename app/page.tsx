'use client';

import React, { Suspense } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/common/Footer';
import { StreamInput } from '@/components/StreamInput';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import { StreamAnalyzer } from '@/components/StreamAnalyzer';
import { StreamHealthPanel } from '@/components/telemetry/StreamHealthPanel';
import { MultiView } from '@/components/MultiView';
import { RecentStreams } from '@/components/RecentStreams';
import { SettingsPanel } from '@/components/SettingsPanel';
import { IptvChannelGuide } from '@/components/IptvChannelGuide';
import { IptvPlaylistTab } from '@/components/IptvPlaylistTab';
import { useMainApp } from '@/hooks/useMainApp';

function MainAppContent() {
  const {
    activeTab,
    setActiveTab,
    currentUrl,
    currentTitle,
    useProxy,
    setUseProxy,
    validation,
    isLoading,
    isIptvGuideOpen,
    setIsIptvGuideOpen,
    guidePlaylist,
    activePlaylist,
    metrics,
    health,
    handleMetricsUpdate,
    handleHealthUpdate,
    handlePlayStream,
    handleLoadIptvPlaylist,
    zapChannel,
  } = useMainApp();

  return (
    <div className="min-h-screen flex flex-col justify-between w-full bg-[#0B0B0C] text-white">
      {/* Full-width Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        useProxy={useProxy}
        setUseProxy={setUseProxy}
      />

      {/* Main Page View Container (Constrained Max-Width) */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
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
                onNextChannel={() => zapChannel('next')}
                onPrevChannel={() => zapChannel('prev')}
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

      {/* Full-width Footer */}
      <Footer />
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

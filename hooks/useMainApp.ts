"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useStreamHistory } from "@/hooks/useStreamHistory";
import { useIptvStore } from "@/hooks/useIptvStore";
import { useChannelNavigation } from "@/hooks/useChannelNavigation";
import { HlsMetrics, StreamHealth, StreamValidationResult } from "@/types/stream";
import { IptvPlaylist, cleanStreamUrl } from "@/utils/m3uParser";

const DEFAULT_SAMPLE_URL = "https://devstreaming-cdn.apple.com/videos/streaming/examples/adv_dv_atmos/main.m3u8";

export function useMainApp() {
  const searchParams = useSearchParams();
  const { saveToHistory } = useStreamHistory();
  const { activePlaylist, importPlaylistUrl } = useIptvStore();

  const [activeTab, setActiveTab] = useState<"player" | "iptv" | "multiview" | "history" | "settings">("player");
  const [currentUrl, setCurrentUrl] = useState(DEFAULT_SAMPLE_URL);
  const [currentTitle, setCurrentTitle] = useState("Apple Advanced 4K Channel");
  const [useProxy, setUseProxy] = useState(false);
  const [validation, setValidation] = useState<StreamValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // IPTV Guide Modal Drawer State
  const [isIptvGuideOpen, setIsIptvGuideOpen] = useState(false);
  const [guidePlaylist, setGuidePlaylist] = useState<IptvPlaylist | null>(null);

  const [metrics, setMetrics] = useState<HlsMetrics>({
    currentResolution: "1080p",
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
    status: "healthy",
    delayMs: 0,
    bufferLength: 0,
    errorCount: 0,
    lastCheckTime: Date.now(),
    message: "Stream ready",
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
        setCurrentTitle(cleanUrl === DEFAULT_SAMPLE_URL ? "Apple Advanced 4K Channel" : cleanUrl);
      }

      // Auto-enable CORS proxy for HTTP streams or non-Apple third-party streams to ensure successful playback
      if (cleanUrl.startsWith("http://") || (cleanUrl !== DEFAULT_SAMPLE_URL && !cleanUrl.includes("apple.com"))) {
        setUseProxy(true);
      }

      if (validationResult) {
        setValidation(validationResult);
      }
      setActiveTab("player");

      saveToHistory(
        cleanUrl,
        customTitle || (cleanUrl === DEFAULT_SAMPLE_URL ? "Apple Advanced 4K Channel" : undefined),
        validationResult?.resolution || "1080p"
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
        console.warn("Failed to load IPTV playlist", err);
      } finally {
        setIsLoading(false);
      }
    },
    [importPlaylistUrl, handlePlayStream]
  );

  const { zapChannel } = useChannelNavigation({
    guidePlaylist,
    activePlaylist,
    currentUrl,
    onPlayStream: handlePlayStream,
  });

  // Handle direct share link query parameters (?url=...&proxy=true)
  useEffect(() => {
    const urlParam = searchParams.get("url");
    const proxyParam = searchParams.get("proxy");

    if (urlParam) {
      const decodedUrl = decodeURIComponent(urlParam);
      const cleanUrl = cleanStreamUrl(decodedUrl);
      setCurrentUrl(cleanUrl);

      if (proxyParam === "true" || cleanUrl.startsWith("http://")) {
        setUseProxy(true);
      } else if (proxyParam === "false") {
        setUseProxy(false);
      }

      if (cleanUrl.endsWith(".m3u") || cleanUrl.includes("/iptv/")) {
        handleLoadIptvPlaylist(cleanUrl);
      } else {
        handlePlayStream(cleanUrl);
      }
    }
  }, [searchParams, handlePlayStream, handleLoadIptvPlaylist]);

  return {
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
  };
}

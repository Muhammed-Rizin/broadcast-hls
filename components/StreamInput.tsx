'use client';

import React, { useState, useCallback } from 'react';
import { AlertCircle, Tv } from 'lucide-react';
import { StreamValidationResult, SampleStreamPreset } from '@/types/stream';
import { StreamUrlForm } from './common/StreamUrlForm';
import { StreamValidationBadge } from './common/StreamValidationBadge';
import { StreamSamplePresets } from './common/StreamSamplePresets';

interface StreamInputProps {
  currentUrl: string;
  onPlayStream: (url: string, validationResult?: StreamValidationResult) => void;
  useProxy: boolean;
  setUseProxy: (val: boolean) => void;
  isLoading: boolean;
  onLoadIptvPlaylist?: (url: string) => void;
  isIptvActive?: boolean;
  onOpenIptvGuide?: () => void;
}

export const StreamInput: React.FC<StreamInputProps> = ({
  currentUrl,
  onPlayStream,
  useProxy,
  setUseProxy,
  isLoading,
  onLoadIptvPlaylist,
  isIptvActive,
  onOpenIptvGuide,
}) => {
  const [urlInput, setUrlInput] = useState(currentUrl || '');
  const [validation, setValidation] = useState<StreamValidationResult | null>(null);
  const [validating, setValidating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleValidateAndPlay = useCallback(
    async (urlToPlay: string) => {
      const trimmed = urlToPlay.trim();
      if (!trimmed) return;

      if (trimmed.endsWith('.m3u') || trimmed.includes('/categories/') || trimmed.includes('/iptv/')) {
        if (onLoadIptvPlaylist) {
          onLoadIptvPlaylist(trimmed);
          return;
        }
      }

      if (trimmed.startsWith('http://') && !useProxy) {
        setUseProxy(true);
      }

      setValidating(true);
      setErrorMsg(null);

      try {
        const res = await fetch('/api/stream/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: trimmed }),
        });
        const data: StreamValidationResult = await res.json();
        setValidation(data);

        if (!data.valid) {
          setErrorMsg(data.error || 'Invalid or unreachable HLS stream URL');
        } else {
          onPlayStream(trimmed, data);
        }
      } catch {
        setErrorMsg('Validation request failed. Proceeding with direct play.');
        onPlayStream(trimmed);
      } finally {
        setValidating(false);
      }
    },
    [useProxy, setUseProxy, onLoadIptvPlaylist, onPlayStream]
  );

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrlInput(text.trim());
        handleValidateAndPlay(text.trim());
      }
    } catch (err) {
      console.warn('Clipboard read failed', err);
    }
  }, [handleValidateAndPlay]);

  const handleSelectPreset = useCallback(
    (preset: SampleStreamPreset) => {
      setUrlInput(preset.url);
      if (preset.requiresProxy) setUseProxy(true);
      if (preset.isIptv && onLoadIptvPlaylist) {
        onLoadIptvPlaylist(preset.url);
      } else {
        handleValidateAndPlay(preset.url);
      }
    },
    [setUseProxy, onLoadIptvPlaylist, handleValidateAndPlay]
  );

  return (
    <div className="broadcast-card p-5 mb-6 bg-[#141416] border border-white/10 rounded-[14px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-white">Stream URL or IPTV Playlist</h2>
          {isIptvActive && (
            <button
              onClick={onOpenIptvGuide}
              className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30 text-[11px] font-mono font-bold flex items-center gap-1.5 hover:bg-red-600/30 transition-colors"
            >
              <Tv className="w-3 h-3" />
              <span>IPTV Channel Guide</span>
            </button>
          )}
        </div>
        <span className="text-xs text-[#7A7A7D]">
          Supports HLS (<code className="text-[#B6B6B8]">.m3u8</code>) streams & IPTV (<code className="text-[#B6B6B8]">.m3u</code>) playlists
        </span>
      </div>

      {/* URL Input Form */}
      <StreamUrlForm
        urlInput={urlInput}
        setUrlInput={(val) => {
          setUrlInput(val);
          setErrorMsg(null);
        }}
        onSubmit={handleValidateAndPlay}
        onPaste={handlePaste}
        validating={validating}
        isLoading={isLoading}
      />

      {/* Error Alert */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-[#1B1B1D] border border-red-500/40 rounded-[10px] text-[#EF4444] text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#EF4444]" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => handleValidateAndPlay(urlInput)}
            className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-white rounded-[6px] text-[11px] font-semibold"
          >
            Force Play
          </button>
        </div>
      )}

      {/* Validation Metadata Pill */}
      <StreamValidationBadge validation={validation} />

      {/* Sample Channels Grid */}
      <StreamSamplePresets onSelectPreset={handleSelectPreset} />
    </div>
  );
};

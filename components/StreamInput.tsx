'use client';

import React, { useState } from 'react';
import { Play, AlertCircle, CheckCircle2, Clipboard, Loader2, PlaySquare } from 'lucide-react';
import { StreamValidationResult } from '@/types/stream';

interface StreamInputProps {
  currentUrl: string;
  onPlayStream: (url: string, validationResult?: StreamValidationResult) => void;
  useProxy: boolean;
  setUseProxy: (val: boolean) => void;
  isLoading: boolean;
}

const VERIFIED_SAMPLE_STREAMS = [
  {
    name: 'Apple Advanced 4K UHD',
    url: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/adv_dv_atmos/main.m3u8',
    requiresProxy: false,
    tag: '2160p 4K',
  },
  {
    name: 'Big Buck Bunny 1080p',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    requiresProxy: false,
    tag: '1080p HD',
  },
];

export const StreamInput: React.FC<StreamInputProps> = ({
  currentUrl,
  onPlayStream,
  useProxy,
  setUseProxy,
  isLoading,
}) => {
  const [urlInput, setUrlInput] = useState(currentUrl || '');
  const [validation, setValidation] = useState<StreamValidationResult | null>(null);
  const [validating, setValidating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleValidateAndPlay = async (urlToPlay: string) => {
    const trimmed = urlToPlay.trim();
    if (!trimmed) return;

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
    } catch (err: any) {
      setErrorMsg('Validation request failed. Proceeding with direct play.');
      onPlayStream(trimmed);
    } finally {
      setValidating(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrlInput(text.trim());
        handleValidateAndPlay(text.trim());
      }
    } catch (err) {
      console.warn('Clipboard read failed', err);
    }
  };

  return (
    <div className="broadcast-card p-5 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <h2 className="text-sm font-semibold text-white">Stream URL</h2>
        <span className="text-xs text-[#7A7A7D]">
          Paste any HTTP/HTTPS live HLS (<code className="text-[#B6B6B8]">.m3u8</code>) stream link
        </span>
      </div>

      {/* URL Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleValidateAndPlay(urlInput);
        }}
        className="flex flex-col sm:flex-row items-center gap-2.5 mb-4"
      >
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => {
              setUrlInput(e.target.value);
              setErrorMsg(null);
            }}
            placeholder="http://domain/live/index.m3u8 or https://domain/live.m3u8"
            className="w-full bg-[#141414] border border-[#2A2A2D] focus:border-white rounded-[10px] px-3.5 py-2.5 text-xs text-white placeholder-[#555558] font-mono pr-20"
          />
          <button
            type="button"
            onClick={handlePaste}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#1B1B1D] hover:bg-[#222326] text-[#B6B6B8] text-[11px] font-semibold rounded-[6px] border border-[#2A2A2D] flex items-center gap-1 transition-all"
            title="Paste from clipboard"
          >
            <Clipboard className="w-3 h-3" />
            <span>Paste</span>
          </button>
        </div>

        <button
          type="submit"
          disabled={validating || isLoading}
          className="w-full sm:w-auto px-5 py-2.5 bg-white hover:bg-neutral-200 text-black font-semibold text-xs rounded-[10px] flex items-center justify-center gap-2 transition-all disabled:opacity-50 shrink-0 shadow-md"
        >
          {validating || isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
              <span>Validating...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Play Stream</span>
            </>
          )}
        </button>
      </form>

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
      {validation && validation.valid && (
        <div className="mb-4 p-2.5 bg-[#141414] border border-[#2A2A2D] rounded-[10px] text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[#22C55E]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="font-semibold">Stream Validated</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-[#B6B6B8]">
            {validation.resolution && (
              <span className="bg-[#1B1B1D] px-2 py-0.5 rounded border border-[#2A2A2D]">
                {validation.resolution}
              </span>
            )}
            {validation.codecs && (
              <span className="bg-[#1B1B1D] px-2 py-0.5 rounded border border-[#2A2A2D]">
                {validation.codecs}
              </span>
            )}
            <span className="bg-[#1B1B1D] px-2 py-0.5 rounded border border-[#2A2A2D]">
              {validation.isMaster ? `${validation.variants.length} Variants` : 'Single Stream'}
            </span>
          </div>
        </div>
      )}

      {/* Sample Channels Row */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <PlaySquare className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-[11px] font-semibold text-[#7A7A7D] uppercase tracking-wider block">
            Featured Sample Streams
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {VERIFIED_SAMPLE_STREAMS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setUrlInput(preset.url);
                if (preset.requiresProxy) setUseProxy(true);
                handleValidateAndPlay(preset.url);
              }}
              className="p-2.5 bg-[#141414] hover:bg-[#222326] border border-[#2A2A2D] rounded-[10px] text-left transition-all group flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white group-hover:text-neutral-300 transition-colors truncate block">
                  {preset.name}
                </span>
                <span className="text-[11px] font-mono text-[#7A7A7D] truncate block">
                  {preset.url}
                </span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1B1B1D] text-[#B6B6B8] border border-[#2A2A2D] shrink-0">
                {preset.tag}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

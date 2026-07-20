'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, X, ExternalLink, ShieldCheck } from 'lucide-react';

interface ShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  streamUrl: string;
  useProxy: boolean;
}

export const ShareLinkModal: React.FC<ShareLinkModalProps> = ({
  isOpen,
  onClose,
  streamUrl,
  useProxy,
}) => {
  const [copied, setCopied] = useState(false);
  const [includeProxy, setIncludeProxy] = useState(useProxy);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://live-hls.vercel.app';
  const directWatchUrl = `${origin}/?url=${encodeURIComponent(streamUrl)}${includeProxy ? '&proxy=true' : ''}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(directWatchUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Copy failed', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#141414] border border-[#2A2A2D] rounded-[16px] max-w-md w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2A2A2D] pb-4">
          <div className="flex items-center gap-2.5">
            <Share2 className="w-5 h-5 text-white" />
            <div>
              <h3 className="text-base font-bold text-white">Share Direct Stream</h3>
              <p className="text-xs text-[#7A7A7D]">Deep-link URL for instant stream playback</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[8px] bg-[#1B1B1D] hover:bg-[#222326] text-[#B6B6B8] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Link Box */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-[#B6B6B8] block">
            Direct Watch URL
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              readOnly
              value={directWatchUrl}
              className="w-full bg-[#1B1B1D] border border-[#2A2A2D] rounded-[10px] px-3.5 py-2.5 text-xs text-white font-mono pr-20 select-all focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="absolute right-1.5 px-3 py-1.5 bg-white text-black hover:bg-neutral-200 font-semibold text-xs rounded-[8px] flex items-center gap-1 transition-all shadow-md"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Proxy Option Toggle */}
          <div className="flex items-center justify-between p-3 bg-[#1B1B1D] border border-[#2A2A2D] rounded-[10px] text-xs">
            <div className="flex items-center gap-2 text-[#B6B6B8]">
              <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
              <span>Include Backend Proxy Parameter</span>
            </div>
            <button
              onClick={() => setIncludeProxy(!includeProxy)}
              className={`w-9 h-5 rounded-full transition-colors p-0.5 relative ${
                includeProxy ? 'bg-[#22C55E]' : 'bg-[#2A2A2D]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  includeProxy ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <a
            href={directWatchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-[#1B1B1D] hover:bg-[#222326] text-white rounded-[10px] text-xs font-semibold border border-[#2A2A2D] flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Link in New Tab</span>
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-black font-semibold text-xs rounded-[10px] hover:bg-neutral-200 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

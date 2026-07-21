'use client';

import React, { memo } from 'react';
import { Play, Clipboard, Loader2 } from 'lucide-react';

interface StreamUrlFormProps {
  urlInput: string;
  setUrlInput: (val: string) => void;
  onSubmit: (url: string) => void;
  onPaste: () => void;
  validating: boolean;
  isLoading: boolean;
}

export const StreamUrlForm: React.FC<StreamUrlFormProps> = memo(
  ({ urlInput, setUrlInput, onSubmit, onPaste, validating, isLoading }) => {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(urlInput);
        }}
        className="flex flex-col sm:flex-row items-center gap-2.5 mb-4"
      >
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="http://domain/live/index.m3u8 or https://iptv-org.github.io/iptv/categories/sports.m3u"
            className="w-full bg-[#09090B] border border-white/10 focus:border-white rounded-[10px] px-3.5 py-2.5 text-xs text-white placeholder-[#555558] font-mono pr-20"
          />
          <button
            type="button"
            onClick={onPaste}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#1B1B1D] hover:bg-[#222326] text-[#B6B6B8] text-[11px] font-semibold rounded-[6px] border border-white/10 flex items-center gap-1 transition-all"
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
              <span>Loading...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Play Stream</span>
            </>
          )}
        </button>
      </form>
    );
  }
);

StreamUrlForm.displayName = 'StreamUrlForm';

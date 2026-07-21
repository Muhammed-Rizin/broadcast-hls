"use client";

import React, { memo } from "react";
import { Tv, Upload, Plus, Loader2 } from "lucide-react";

interface IptvImportBarProps {
  inputUrl: string;
  setInputUrl: (val: string) => void;
  onSubmitUrl: (e: React.FormEvent<HTMLFormElement>) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const IptvImportBar: React.FC<IptvImportBarProps> = memo(
  ({
    inputUrl,
    setInputUrl,
    onSubmitUrl,
    onFileUpload,
    isLoading,
    fileInputRef,
  }) => {
    return (
      <div className="broadcast-card p-6 bg-[#141416] border border-white/10 rounded-[14px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                IPTV Channel Guide & Playlist Manager
              </h2>
              <p className="text-xs text-[#A1A1AA]">
                Import IPTV playlists (<code className="text-cyan-400">.m3u</code>), search
                thousands of live channels, and star favorites
              </p>
            </div>
          </div>

          {/* Disk File Upload Button */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".m3u,.m3u8,.txt"
              onChange={onFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="px-4 py-2 bg-[#1B1B1D] hover:bg-[#27272A] border border-white/10 rounded-[10px] text-xs font-semibold text-white flex items-center gap-2 transition-all"
            >
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Upload .M3U File</span>
            </button>
          </div>
        </div>

        {/* Remote M3U URL Form */}
        <form onSubmit={onSubmitUrl} className="flex flex-col sm:flex-row items-center gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter remote M3U URL (e.g. https://iptv-org.github.io/iptv/categories/sports.m3u)"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="flex-1 bg-[#09090B] border border-white/10 rounded-[10px] px-3.5 py-2 text-xs text-white placeholder-[#555558] font-mono focus:outline-none focus:border-red-500 transition-colors w-full"
          />
          <button
            type="submit"
            disabled={isLoading || !inputUrl.trim()}
            className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs rounded-[10px] flex items-center justify-center gap-2 transition-all disabled:opacity-50 shrink-0 shadow-md"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Import Playlist</span>
              </>
            )}
          </button>
        </form>
      </div>
    );
  }
);

IptvImportBar.displayName = "IptvImportBar";

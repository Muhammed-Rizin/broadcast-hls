'use client';

import React from 'react';
import { PlayCircle, Grid, History, Settings, ShieldCheck, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  activeTab: 'player' | 'multiview' | 'history' | 'settings';
  setActiveTab: (tab: 'player' | 'multiview' | 'history' | 'settings') => void;
  useProxy: boolean;
  setUseProxy: (val: boolean) => void;
  activeStreamCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  useProxy,
  setUseProxy,
  activeStreamCount = 0,
}) => {
  return (
    <header className="w-full bg-[#141414] border-b border-[#2A2A2D] px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-50 mb-6">
      {/* Text-Only Brand Title */}
      <div
        className="cursor-pointer select-none"
        onClick={() => setActiveTab('player')}
      >
        <h1 className="text-xl font-bold tracking-tight text-white font-sans">
          Live HLS
        </h1>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex items-center p-1 bg-[#0B0B0C] border border-[#2A2A2D] rounded-[10px]">
        <button
          onClick={() => setActiveTab('player')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] text-xs font-semibold transition-all ${
            activeTab === 'player'
              ? 'bg-white text-black shadow-sm'
              : 'text-[#B6B6B8] hover:text-white hover:bg-[#1B1B1D]'
          }`}
        >
          <PlayCircle className="w-3.5 h-3.5" />
          <span>Player</span>
        </button>

        <button
          onClick={() => setActiveTab('multiview')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] text-xs font-semibold transition-all ${
            activeTab === 'multiview'
              ? 'bg-white text-black shadow-sm'
              : 'text-[#B6B6B8] hover:text-white hover:bg-[#1B1B1D]'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Multi-View</span>
          {activeStreamCount > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] bg-black/20 text-black rounded-full">
              {activeStreamCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] text-xs font-semibold transition-all ${
            activeTab === 'history'
              ? 'bg-white text-black shadow-sm'
              : 'text-[#B6B6B8] hover:text-white hover:bg-[#1B1B1D]'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>History</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] text-xs font-semibold transition-all ${
            activeTab === 'settings'
              ? 'bg-white text-black shadow-sm'
              : 'text-[#B6B6B8] hover:text-white hover:bg-[#1B1B1D]'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>
      </nav>

      {/* Proxy Toggle Pill */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setUseProxy(!useProxy)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-[10px] text-xs font-semibold border transition-all ${
            useProxy
              ? 'bg-[#222326] border-[#2A2A2D] text-white'
              : 'bg-[#141414] border-[#2A2A2D] text-[#7A7A7D] hover:text-white'
          }`}
          title="Toggle Backend Proxy mode to bypass CORS & Mixed-Content HTTP/HTTPS restrictions"
        >
          {useProxy ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>Proxy Active</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-[#7A7A7D]" />
              <span>Direct Mode</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};

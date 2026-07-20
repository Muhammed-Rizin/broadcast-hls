'use client';

import React, { useState } from 'react';
import { PlayCircle, Grid, History, Settings, ShieldCheck, ShieldAlert, Tv, Menu, X } from 'lucide-react';

interface NavbarProps {
  activeTab: 'player' | 'iptv' | 'multiview' | 'history' | 'settings';
  setActiveTab: (tab: 'player' | 'iptv' | 'multiview' | 'history' | 'settings') => void;
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: 'player' | 'iptv' | 'multiview' | 'history' | 'settings') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-[#141414] border-b border-[#2A2A2D] px-4 sm:px-6 py-3 sticky top-0 z-50 mb-6">
      <div className="flex items-center justify-between gap-3">
        {/* Brand Title */}
        <div
          className="cursor-pointer select-none flex items-center gap-2"
          onClick={() => handleTabClick('player')}
        >
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white font-sans">
            Live HLS
          </h1>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center p-1 bg-[#0B0B0C] border border-[#2A2A2D] rounded-[10px]">
          <button
            onClick={() => handleTabClick('player')}
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
            onClick={() => handleTabClick('iptv')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] text-xs font-semibold transition-all ${
              activeTab === 'iptv'
                ? 'bg-white text-black shadow-sm'
                : 'text-[#B6B6B8] hover:text-white hover:bg-[#1B1B1D]'
            }`}
          >
            <Tv className="w-3.5 h-3.5 text-red-500" />
            <span>IPTV Guide</span>
          </button>

          <button
            onClick={() => handleTabClick('multiview')}
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
            onClick={() => handleTabClick('history')}
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
            onClick={() => handleTabClick('settings')}
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

        {/* Right Action Bar: Proxy Toggle Pill & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setUseProxy(!useProxy)}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-[10px] text-[11px] sm:text-xs font-semibold border transition-all ${
              useProxy
                ? 'bg-[#222326] border-[#2A2A2D] text-white'
                : 'bg-[#141414] border-[#2A2A2D] text-[#7A7A7D] hover:text-white'
            }`}
            title="Toggle Backend Proxy mode to bypass CORS & Mixed-Content HTTP/HTTPS restrictions"
          >
            {useProxy ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
                <span className="hidden sm:inline">Proxy Active</span>
                <span className="sm:hidden">Proxy</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3.5 h-3.5 text-[#7A7A7D]" />
                <span className="hidden sm:inline">Direct Mode</span>
                <span className="sm:hidden">Direct</span>
              </>
            )}
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-[#1B1B1D] hover:bg-[#27272A] text-white border border-white/10 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Expandable Navigation Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-3 mt-3 border-t border-white/10 flex flex-col gap-1.5 animate-fadeIn">
          <button
            onClick={() => handleTabClick('player')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'player'
                ? 'bg-white text-black shadow-md'
                : 'bg-[#1B1B1D] text-[#D4D4D8] hover:text-white'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            <span>Player</span>
          </button>

          <button
            onClick={() => handleTabClick('iptv')}
            className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'iptv'
                ? 'bg-white text-black shadow-md'
                : 'bg-[#1B1B1D] text-[#D4D4D8] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Tv className="w-4 h-4 text-red-500" />
              <span>IPTV Guide</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-bold">
              12,000+ Ch
            </span>
          </button>

          <button
            onClick={() => handleTabClick('multiview')}
            className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'multiview'
                ? 'bg-white text-black shadow-md'
                : 'bg-[#1B1B1D] text-[#D4D4D8] hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Grid className="w-4 h-4" />
              <span>Multi-View</span>
            </div>
            {activeStreamCount > 0 && (
              <span className="px-2 py-0.5 text-[10px] bg-black/20 text-black rounded-full font-bold">
                {activeStreamCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleTabClick('history')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-white text-black shadow-md'
                : 'bg-[#1B1B1D] text-[#D4D4D8] hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            <span>History</span>
          </button>

          <button
            onClick={() => handleTabClick('settings')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-white text-black shadow-md'
                : 'bg-[#1B1B1D] text-[#D4D4D8] hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      )}
    </header>
  );
};

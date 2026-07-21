"use client";

import React, { useState, useCallback } from "react";
import {
  PlayCircle,
  Grid,
  History,
  Settings,
  Tv,
  Menu,
  X,
  Github,
} from "lucide-react";
import { NavTabs, NavTabType } from "./common/NavTabs";
import { ProxyToggle } from "./common/ProxyToggle";

interface NavbarProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
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

  const handleTabClick = useCallback(
    (tab: NavTabType) => {
      setActiveTab(tab);
      setMobileMenuOpen(false);
    },
    [setActiveTab]
  );

  const handleToggleProxy = useCallback(() => {
    setUseProxy(!useProxy);
  }, [useProxy, setUseProxy]);

  return (
    <header className="w-full bg-[#141414] border-b border-[#2A2A2D] sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Title */}
        <div
          className="cursor-pointer select-none flex items-center gap-2"
          onClick={() => handleTabClick("player")}
        >
          <h1 className="text-base sm:text-xl font-bold tracking-tight text-white font-sans">
            Live HLS
          </h1>
        </div>

        {/* Desktop Navigation Tabs */}
        <NavTabs
          activeTab={activeTab}
          onSelectTab={handleTabClick}
          activeStreamCount={activeStreamCount}
        />

        {/* Right Action Bar: Proxy Toggle & GitHub Redirect Icon */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ProxyToggle useProxy={useProxy} onToggleProxy={handleToggleProxy} />

          {/* GitHub Icon Button Redirect */}
          <a
            href="https://github.com/Muhammed-Rizin/broadcast-hls"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 sm:p-2 rounded-lg bg-[#1B1B1D] hover:bg-[#27272A] border border-white/10 text-white transition-colors flex items-center justify-center"
            title="Redirect to GitHub Repository (Muhammed-Rizin/broadcast-hls)"
          >
            <Github className="w-4 h-4 text-white" />
          </a>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 sm:p-2 rounded-lg bg-[#1B1B1D] hover:bg-[#27272A] text-white border border-white/10 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Expandable Navigation Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-3 pt-2 border-t border-white/10 flex flex-col gap-1.5 animate-fadeIn bg-[#141414]">
          <button
            onClick={() => handleTabClick("player")}
            className={`flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "player"
                ? "bg-white text-black shadow-md"
                : "bg-[#1B1B1D] text-[#D4D4D8] hover:text-white"
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            <span>Player</span>
          </button>

          <button
            onClick={() => handleTabClick("iptv")}
            className={`flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "iptv"
                ? "bg-white text-black shadow-md"
                : "bg-[#1B1B1D] text-[#D4D4D8] hover:text-white"
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
            onClick={() => handleTabClick("multiview")}
            className={`flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "multiview"
                ? "bg-white text-black shadow-md"
                : "bg-[#1B1B1D] text-[#D4D4D8] hover:text-white"
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
            onClick={() => handleTabClick("history")}
            className={`flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "history"
                ? "bg-white text-black shadow-md"
                : "bg-[#1B1B1D] text-[#D4D4D8] hover:text-white"
            }`}
          >
            <History className="w-4 h-4" />
            <span>History</span>
          </button>

          <button
            onClick={() => handleTabClick("settings")}
            className={`flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "settings"
                ? "bg-white text-black shadow-md"
                : "bg-[#1B1B1D] text-[#D4D4D8] hover:text-white"
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

"use client";

import React, { memo } from "react";
import { PlayCircle, Tv, Grid, History, Settings } from "lucide-react";

export type NavTabType = "player" | "iptv" | "multiview" | "history" | "settings";

interface NavTabsProps {
  activeTab: NavTabType;
  onSelectTab: (tab: NavTabType) => void;
  activeStreamCount?: number;
}

export const NavTabs: React.FC<NavTabsProps> = memo(
  ({ activeTab, onSelectTab, activeStreamCount = 0 }) => {
    return (
      <nav className="hidden md:flex items-center p-1 bg-[#0B0B0C] border border-[#2A2A2D] rounded-[10px]">
        <button
          onClick={() => onSelectTab("player")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] text-xs font-semibold transition-all ${
            activeTab === "player"
              ? "bg-white text-black shadow-sm"
              : "text-[#B6B6B8] hover:text-white hover:bg-[#1B1B1D]"
          }`}
        >
          <PlayCircle className="w-3.5 h-3.5" />
          <span>Player</span>
        </button>

        <button
          onClick={() => onSelectTab("iptv")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] text-xs font-semibold transition-all ${
            activeTab === "iptv"
              ? "bg-white text-black shadow-sm"
              : "text-[#B6B6B8] hover:text-white hover:bg-[#1B1B1D]"
          }`}
        >
          <Tv className="w-3.5 h-3.5 text-red-500" />
          <span>IPTV Guide</span>
        </button>

        <button
          onClick={() => onSelectTab("multiview")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] text-xs font-semibold transition-all ${
            activeTab === "multiview"
              ? "bg-white text-black shadow-sm"
              : "text-[#B6B6B8] hover:text-white hover:bg-[#1B1B1D]"
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
          onClick={() => onSelectTab("history")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] text-xs font-semibold transition-all ${
            activeTab === "history"
              ? "bg-white text-black shadow-sm"
              : "text-[#B6B6B8] hover:text-white hover:bg-[#1B1B1D]"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>History</span>
        </button>

        <button
          onClick={() => onSelectTab("settings")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-[8px] text-xs font-semibold transition-all ${
            activeTab === "settings"
              ? "bg-white text-black shadow-sm"
              : "text-[#B6B6B8] hover:text-white hover:bg-[#1B1B1D]"
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>
      </nav>
    );
  }
);

NavTabs.displayName = "NavTabs";

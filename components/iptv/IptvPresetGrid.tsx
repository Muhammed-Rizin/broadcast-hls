"use client";

import React, { memo } from "react";
import {
  Globe,
  ListFilter,
  Newspaper,
  Trophy,
  Film,
  Music,
  Languages,
} from "lucide-react";
import { IptvPreset } from "@/types/stream";

export const FEATURED_IPTV_PRESETS: IptvPreset[] = [
  {
    name: "All Channels (12,000+)",
    url: "https://iptv-org.github.io/iptv/index.m3u",
    description: "Complete global IPTV channel index",
    tag: "12,000+ Ch",
    icon: Globe,
    color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  },
  {
    name: "Grouped by Category",
    url: "https://iptv-org.github.io/iptv/index.category.m3u",
    description: "Channels grouped into News, Sports, Movies, etc.",
    tag: "Categories",
    icon: ListFilter,
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
  {
    name: "News Channels (930+)",
    url: "https://iptv-org.github.io/iptv/categories/news.m3u",
    description: "Global 24/7 live news broadcasts",
    tag: "930 Ch",
    icon: Newspaper,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    name: "Sports Channels (320+)",
    url: "https://iptv-org.github.io/iptv/categories/sports.m3u",
    description: "Live sports, football, racing & athletics",
    tag: "320 Ch",
    icon: Trophy,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    name: "Movies & Cinema (350+)",
    url: "https://iptv-org.github.io/iptv/categories/movies.m3u",
    description: "Live movie channels & cinema streams",
    tag: "350 Ch",
    icon: Film,
    color: "text-red-400 bg-red-500/10 border-red-500/20",
  },
  {
    name: "Music & Hits (650+)",
    url: "https://iptv-org.github.io/iptv/categories/music.m3u",
    description: "Music video channels & radio broadcasts",
    tag: "650 Ch",
    icon: Music,
    color: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  },
  {
    name: "Grouped by Country",
    url: "https://iptv-org.github.io/iptv/index.country.m3u",
    description: "Channels organized by national country folders",
    tag: "By Country",
    icon: Globe,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    name: "Grouped by Language",
    url: "https://iptv-org.github.io/iptv/index.language.m3u",
    description: "Channels organized by spoken language folders",
    tag: "By Language",
    icon: Languages,
    color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  },
];

interface IptvPresetGridProps {
  onSelectPreset: (url: string, name: string) => void;
  isLoading: boolean;
}

export const IptvPresetGrid: React.FC<IptvPresetGridProps> = memo(
  ({ onSelectPreset, isLoading }) => {
    return (
      <div>
        <h3 className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider mb-2 flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-red-500" />
          <span>Curated IPTV Playlists (12,000+ Live Channels)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {FEATURED_IPTV_PRESETS.map((preset, idx) => {
            const IconComp = preset.icon;
            return (
              <button
                key={idx}
                onClick={() => onSelectPreset(preset.url, preset.name)}
                disabled={isLoading}
                className="p-3 bg-[#09090B] hover:bg-[#1C1C1E] border border-white/10 rounded-[10px] text-left transition-all group flex flex-col justify-between gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <IconComp className="w-4 h-4 text-white shrink-0" />
                    <span className="text-xs font-bold text-white group-hover:text-red-400 transition-colors truncate">
                      {preset.name}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 font-bold ${preset.color}`}
                  >
                    {preset.tag}
                  </span>
                </div>
                <p className="text-[11px] text-[#A1A1AA] line-clamp-1">{preset.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);

IptvPresetGrid.displayName = "IptvPresetGrid";

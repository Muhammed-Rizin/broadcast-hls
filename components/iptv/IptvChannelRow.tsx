"use client";

/* eslint-disable @next/next/no-img-element */
import React, { memo } from "react";
import { Star, Play } from "lucide-react";
import { IptvChannel } from "@/utils/m3uParser";

interface IptvChannelRowProps {
  channel: IptvChannel;
  isActive: boolean;
  isFav: boolean;
  onSelectChannel: (channel: IptvChannel) => void;
  onToggleFavorite: (channel: IptvChannel) => void;
  onClose: () => void;
}

export const IptvChannelRow: React.FC<IptvChannelRowProps> = memo(
  ({ channel, isActive, isFav, onSelectChannel, onToggleFavorite, onClose }) => {
    return (
      <div
        className={`w-full flex items-center justify-between p-2.5 rounded-lg border transition-all text-left group ${
          isActive
            ? "bg-red-600/15 border-red-500/50 text-white shadow-md"
            : "bg-[#18181B]/60 hover:bg-[#27272A] border-white/5 text-[#D4D4D8]"
        }`}
      >
        <div
          onClick={() => {
            onSelectChannel(channel);
            onClose();
          }}
          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
        >
          {/* Logo / Thumbnail */}
          {channel.logo ? (
            <img
              src={channel.logo}
              alt={channel.name}
              className="w-7 h-7 object-contain rounded bg-black/40 p-0.5 flex-shrink-0 border border-white/10"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-7 h-7 rounded bg-white/10 flex items-center justify-center text-[10px] font-mono font-bold text-[#A1A1AA] flex-shrink-0">
              {channel.name.substring(0, 2).toUpperCase()}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-semibold truncate group-hover:text-white transition-colors">
              {channel.name}
            </h3>
            {channel.group && (
              <span className="text-[10px] font-mono text-[#A1A1AA] block truncate">
                {channel.group}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => onToggleFavorite(channel)}
            className={`p-1 rounded transition-colors ${
              isFav ? "text-yellow-400" : "text-[#555558] hover:text-white"
            }`}
            title={isFav ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Star className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`} />
          </button>

          {isActive ? (
            <span className="flex items-center gap-1 text-[10px] font-bold font-mono text-red-500 px-1.5 py-0.5 rounded bg-red-500/10">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            </span>
          ) : (
            <button
              onClick={() => {
                onSelectChannel(channel);
                onClose();
              }}
              className="w-6 h-6 rounded bg-white/10 group-hover:bg-white text-black flex items-center justify-center transition-all"
            >
              <Play className="w-3 h-3 fill-black ml-0.5" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

IptvChannelRow.displayName = "IptvChannelRow";

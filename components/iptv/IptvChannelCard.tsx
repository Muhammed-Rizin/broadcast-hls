"use client";

/* eslint-disable @next/next/no-img-element */
import React, { memo } from "react";
import { Star, Play } from "lucide-react";
import { IptvChannel } from "@/utils/m3uParser";

interface IptvChannelCardProps {
  channel: IptvChannel;
  isActive: boolean;
  isFav: boolean;
  onPlayChannel: (channel: IptvChannel) => void;
  onToggleFavorite: (channel: IptvChannel) => void;
}

export const IptvChannelCard: React.FC<IptvChannelCardProps> = memo(
  ({ channel, isActive, isFav, onPlayChannel, onToggleFavorite }) => {
    return (
      <div
        className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 group ${
          isActive
            ? "bg-red-600/15 border-red-500/50 shadow-lg"
            : "bg-[#141416] hover:bg-[#1C1C1E] border-white/10"
        }`}
      >
        <div
          onClick={() => onPlayChannel(channel)}
          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
        >
          {/* Logo */}
          {channel.logo ? (
            <img
              src={channel.logo}
              alt={channel.name}
              className="w-9 h-9 object-contain rounded-lg bg-black/50 p-1 flex-shrink-0 border border-white/10"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-xs font-mono font-bold text-white flex-shrink-0">
              {channel.name.substring(0, 2).toUpperCase()}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-bold text-white truncate group-hover:text-red-400 transition-colors">
              {channel.name}
            </h3>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#A1A1AA] truncate">
              {channel.group && <span className="truncate">{channel.group}</span>}
              {channel.country && (
                <span className="px-1 bg-white/10 rounded">{channel.country}</span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => onToggleFavorite(channel)}
            className={`p-1.5 rounded-lg transition-colors ${
              isFav
                ? "text-yellow-400 hover:text-yellow-300"
                : "text-[#555558] hover:text-white"
            }`}
            title={isFav ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Star className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
          </button>

          <button
            onClick={() => onPlayChannel(channel)}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
              isActive
                ? "bg-red-600 text-white"
                : "bg-white/10 group-hover:bg-white text-white group-hover:text-black"
            }`}
            title="Play Channel"
          >
            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
          </button>
        </div>
      </div>
    );
  }
);

IptvChannelCard.displayName = "IptvChannelCard";

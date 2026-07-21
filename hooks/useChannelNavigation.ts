"use client";

import { useCallback } from "react";
import { IptvPlaylist } from "@/utils/m3uParser";

interface UseChannelNavigationOptions {
  guidePlaylist: IptvPlaylist | null;
  activePlaylist: IptvPlaylist | null;
  currentUrl: string;
  onPlayStream: (url: string, validationResult?: undefined, title?: string) => void;
}

export function useChannelNavigation({
  guidePlaylist,
  activePlaylist,
  currentUrl,
  onPlayStream,
}: UseChannelNavigationOptions) {
  const zapChannel = useCallback(
    (direction: "next" | "prev") => {
      const activeList = guidePlaylist || activePlaylist;
      if (!activeList || activeList.channels.length === 0) return;

      const currentIdx = activeList.channels.findIndex((c) => c.streamUrl === currentUrl);
      let nextIdx = 0;
      if (currentIdx !== -1) {
        if (direction === "next") {
          nextIdx = (currentIdx + 1) % activeList.channels.length;
        } else {
          nextIdx = (currentIdx - 1 + activeList.channels.length) % activeList.channels.length;
        }
      }

      const nextChan = activeList.channels[nextIdx];
      if (nextChan) {
        onPlayStream(nextChan.streamUrl, undefined, nextChan.name);
      }
    },
    [guidePlaylist, activePlaylist, currentUrl, onPlayStream]
  );

  return { zapChannel };
}

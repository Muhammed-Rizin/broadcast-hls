"use client";

import React, { memo } from "react";
import { ShieldCheck, ShieldAlert } from "lucide-react";

interface ProxyToggleProps {
  useProxy: boolean;
  onToggleProxy: () => void;
}

export const ProxyToggle: React.FC<ProxyToggleProps> = memo(({ useProxy, onToggleProxy }) => {
  return (
    <button
      onClick={onToggleProxy}
      className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-[8px] sm:rounded-[10px] text-[11px] sm:text-xs font-semibold border transition-all ${
        useProxy
          ? "bg-[#222326] border-[#2A2A2D] text-white"
          : "bg-[#141414] border-[#2A2A2D] text-[#7A7A7D] hover:text-white"
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
  );
});

ProxyToggle.displayName = "ProxyToggle";

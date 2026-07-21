'use client';

import React, { memo } from 'react';
import { Github, Heart } from 'lucide-react';

export const Footer: React.FC = memo(() => {
  return (
    <footer className="w-full bg-[#141416] border-t border-white/10 mt-6 sm:mt-8 py-2.5 sm:py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-row items-center justify-between gap-2 text-xs text-[#A1A1AA]">
        {/* Compact Made with Love Credit */}
        <div className="flex items-center gap-1.5 text-[11px] font-medium">
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
          <span>by</span>
          <a
            href="https://github.com/Muhammed-Rizin"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-bold hover:underline"
          >
            Muhammed Rizin
          </a>
        </div>

        {/* GitHub Repository Link */}
        <a
          href="https://github.com/Muhammed-Rizin/broadcast-hls"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1B1B1D] hover:bg-[#27272A] text-white border border-white/10 transition-colors text-[11px] font-mono shrink-0"
          title="Redirect to GitHub Repository"
        >
          <Github className="w-3.5 h-3.5 text-white" />
          <span className="hidden sm:inline">Muhammed-Rizin/broadcast-hls</span>
        </a>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

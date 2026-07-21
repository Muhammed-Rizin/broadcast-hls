'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F4F4F5] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="broadcast-card p-8 max-w-md w-full space-y-4 bg-[#141416] border border-white/10 rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-bold text-red-500 font-mono">404</h1>
        <h2 className="text-lg font-semibold text-white">Page Not Found</h2>
        <p className="text-xs text-[#A1A1AA]">
          The requested page or stream endpoint does not exist on this server.
        </p>
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-white text-black font-semibold text-xs rounded-xl hover:bg-neutral-200 transition-colors"
        >
          Return to Broadcast Player
        </Link>
      </div>
    </div>
  );
}

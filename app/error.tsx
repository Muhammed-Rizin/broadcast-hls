'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F4F4F5] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="broadcast-card p-8 max-w-md w-full space-y-4 bg-[#141416] border border-white/10 rounded-2xl shadow-2xl">
        <h1 className="text-2xl font-bold text-red-500 font-mono">Application Error</h1>
        <p className="text-xs text-[#A1A1AA]">
          {error.message || 'An unexpected error occurred during playback orchestration.'}
        </p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-white text-black font-semibold text-xs rounded-xl hover:bg-neutral-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

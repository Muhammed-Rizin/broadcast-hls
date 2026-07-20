'use client';

import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space / K', action: 'Play / Pause stream' },
    { key: 'F', action: 'Toggle Fullscreen mode' },
    { key: 'M', action: 'Mute / Unmute audio' },
    { key: 'L', action: 'Sync to Live edge' },
    { key: '← / →', action: 'Seek 5 seconds backward / forward' },
    { key: 'Double Click', action: 'Toggle Fullscreen' },
    { key: 'ESC', action: 'Exit Fullscreen / Close Settings' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#141414] border border-[#2A2A2D] rounded-[16px] max-w-md w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-[#2A2A2D] pb-4">
          <div className="flex items-center gap-2.5">
            <Keyboard className="w-5 h-5 text-white" />
            <h3 className="text-base font-bold text-white">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[8px] bg-[#1B1B1D] hover:bg-[#222326] text-[#B6B6B8] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 text-xs font-mono">
          {shortcuts.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2.5 bg-[#1B1B1D] border border-[#2A2A2D] rounded-[8px]"
            >
              <span className="text-white font-bold bg-[#222326] px-2 py-0.5 rounded border border-[#2A2A2D]">
                {s.key}
              </span>
              <span className="text-[#B6B6B8]">{s.action}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white text-black font-semibold text-xs rounded-[10px] hover:bg-neutral-200 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

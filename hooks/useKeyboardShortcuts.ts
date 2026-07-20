'use client';

import { useEffect } from 'react';

interface KeyboardShortcutsOptions {
  onTogglePlay?: () => void;
  onToggleFullscreen?: () => void;
  onToggleMute?: () => void;
  onJumpToLive?: () => void;
  onSeekBackward10?: () => void;
  onSeekForward10?: () => void;
  onNextChannel?: () => void;
  onPrevChannel?: () => void;
}

export function useKeyboardShortcuts({
  onTogglePlay,
  onToggleFullscreen,
  onToggleMute,
  onJumpToLive,
  onSeekBackward10,
  onSeekForward10,
  onNextChannel,
  onPrevChannel,
}: KeyboardShortcutsOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcut keys when typing inside input or textarea
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
        case 'KeyK':
          e.preventDefault();
          if (onTogglePlay) onTogglePlay();
          break;
        case 'KeyF':
          e.preventDefault();
          if (onToggleFullscreen) onToggleFullscreen();
          break;
        case 'KeyM':
          e.preventDefault();
          if (onToggleMute) onToggleMute();
          break;
        case 'KeyJ':
        case 'ArrowLeft':
          e.preventDefault();
          if (onSeekBackward10) onSeekBackward10();
          break;
        case 'KeyL':
        case 'ArrowRight':
          e.preventDefault();
          if (onSeekForward10) onSeekForward10();
          break;
        case 'KeyN':
        case 'PageDown':
          e.preventDefault();
          if (onNextChannel) onNextChannel();
          break;
        case 'KeyP':
        case 'PageUp':
          e.preventDefault();
          if (onPrevChannel) onPrevChannel();
          break;
        case 'Digit0':
          e.preventDefault();
          if (onJumpToLive) onJumpToLive();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    onTogglePlay,
    onToggleFullscreen,
    onToggleMute,
    onJumpToLive,
    onSeekBackward10,
    onSeekForward10,
    onNextChannel,
    onPrevChannel,
  ]);
}

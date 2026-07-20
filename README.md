# broadcast-hls

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org)
[![HLS.js](https://img.shields.io/badge/HLS.js-1.5-orange)](https://github.com/video-dev/hls.js)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)

> **broadcast-hls** is a professional HTTP Live Streaming (HLS `.m3u8`) and IPTV (`.m3u`) web platform engineered for live stream playback, real-time telemetry analytics, multi-stream monitoring, IPTV playlist management, and zero-copy CORS/Mixed-Content proxying.

---

## Table of Contents

- [Application Purpose](#application-purpose)
- [Audit & Architectural Improvements](#audit--architectural-improvements)
  - [1. Media Engine Resilience & Auto-Recovery](#1-media-engine-resilience--auto-recovery)
  - [2. High-Throughput Zero-Copy Stream Proxy](#2-high-throughput-zero-copy-stream-proxy)
  - [3. IPTV Playlist Engine & Local Storage Persistence](#3-iptv-playlist-engine--local-storage-persistence)
  - [4. Mobile-First Responsive Design](#4-mobile-first-responsive-design)
  - [5. Framework Alignment & CSS Architecture](#5-framework-alignment--css-architecture)
- [Understanding HLS & IPTV Playlists](#understanding-hls--iptv-playlists)
  - [What is HLS?](#what-is-hls)
  - [What is an IPTV M3U Playlist?](#what-is-an-iptv-m3u-playlist)
  - [Curated IPTV Categories Included](#curated-iptv-categories-included)
- [Why Proxy HLS? (CORS & Mixed Content)](#why-proxy-hls-cors--mixed-content)
- [Key Features](#key-features)
- [Project Architecture](#project-architecture)
- [API Endpoints](#api-endpoints)
- [Quick Start & Local Setup](#quick-start--local-setup)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [License](#license)

---

## Application Purpose

Testing, monitoring, and playing live HLS streams over the open web introduces technical challenges:

1. **CORS Restrictions**: Many IPTV, sports, and live broadcast streams block browser playback due to missing Cross-Origin Resource Sharing (`Access-Control-Allow-Origin`) response headers.
2. **Mixed Content Blocking**: Web Browsers block unencrypted `http://` streams when hosted on secure `https://` origins.
3. **Lack of Diagnostics**: Default HTML5 video elements do not expose real-time metrics such as buffer length, latency to live edge, dropped frames, or active ABR variant bitrates.
4. **IPTV Playlist Parsing**: Public and commercial IPTV playlists (`.m3u`) contain thousands of channels with logos, categories, and custom HTTP headers (`#EXTVLCOPT:http-user-agent`).
5. **Multi-View Requirements**: Broadcast engineers and sports operators often need to monitor multiple live feeds simultaneously in a synchronized layout.

**broadcast-hls** resolves these challenges in a unified web application styled after modern broadcast software and developer dashboards.

---

## Audit & Architectural Improvements

Following an in-depth codebase audit, the following technical enhancements were implemented across the architecture:

### 1. Media Engine Resilience & Auto-Recovery
- **2-Stage Media Error Handling**: Implemented multi-tier media error recovery inside `hooks/useHlsPlayer.ts`. On first media error, the engine executes `recoverMediaError()`. On second consecutive failure, it calls `swapAudioCodec()` to switch audio demuxers before retrying media decoding.
- **Exponential Backoff Reconnecting**: Added retry attempt tracking with exponential delays (`1s`, `2s`, `4s`, `8s`, `16s`) for non-fatal network interruptions before raising a fatal offline error state.
- **Memory Leak Protection**: Enhanced component unmount logic by detaching media (`hls.detachMedia()`), stopping segment loading (`hls.stopLoad()`), destroying instances (`hls.destroy()`), and resetting video source attributes (`video.removeAttribute('src'); video.load()`).

### 2. High-Throughput Zero-Copy Stream Proxy
- **Zero-Copy Streaming**: Refactored `/api/stream/proxy` to pipe binary media chunks (`.ts`, `.m4s`, `.mp4`, `.aac`) directly using Web `ReadableStream` instead of buffering payloads into server RAM via `ArrayBuffer`.
- **Custom Header Passthrough**: Added support for `ua` (User-Agent) and `referer` search parameters to forward custom headers required by strict IPTV servers.
- **Proxy Unwrapping Helper**: Added `cleanStreamUrl` to unwrap nested proxy paths and extract clean target stream URLs.

### 3. IPTV Playlist Engine & Local Storage Persistence
- **M3U Parser (`utils/m3uParser.ts`)**: Parses `#EXTINF` metadata (`tvg-logo`, `group-title`, `tvg-country`, `tvg-language`) and `#EXTVLCOPT` custom headers.
- **Local Storage State Store (`hooks/useIptvStore.ts`)**: Saves imported playlists, active selection, and starred favorite channels (⭐) across browser sessions.
- **Disk File Upload**: Users can upload local `.m3u` / `.m3u8` playlist files directly from their device storage.
- **TV Zapping**: Flipping channels via control bar buttons or keyboard shortcuts (`N` / `P` and `PageUp` / `PageDown`).

### 4. Mobile-First Responsive Design
- **Responsive Navbar**: Designed a collapsible mobile navigation drawer with touch-optimized buttons and hamburger toggle (`Menu` / `X`).
- **Touch-Friendly Controls**: Responsive control bars, gesture support, and touch-optimized sliders.

### 5. Framework Alignment & CSS Architecture
- **Next.js Font Optimization**: Configured Google Fonts (`Inter` and `JetBrains Mono`) using `next/font/google` in `app/layout.tsx` for zero Cumulative Layout Shift (CLS).
- **Tailwind CSS Directive Ordering**: Cleaned `app/globals.css` to begin directly with `@tailwind base; @tailwind components; @tailwind utilities;` in accordance with Next.js framework setup guides.

---

## Understanding HLS & IPTV Playlists

### What is HLS?
Developed by Apple Inc. in 2009 (IETF RFC 8216), **HTTP Live Streaming (HLS)** is an HTTP-based adaptive bitrate streaming protocol. It splits video content into small media segments (`.ts`, `.m4s`, or `.aac`) and delivers them over standard HTTP web servers.

### What is an IPTV M3U Playlist?
An **IPTV M3U Playlist** is a text file listing channels, logos, categories, and stream URIs:
```m3u
#EXTM3U
#EXTINF:-1 tvg-id="ESPN.us" tvg-logo="https://..." group-title="Sports", ESPN HD
http://example.com/live/espn.m3u8
```

### Curated IPTV Categories Included

The application includes 8 pre-configured global IPTV playlist presets:
1. **All Channels (12,000+)**: `https://iptv-org.github.io/iptv/index.m3u`
2. **Grouped by Category**: `https://iptv-org.github.io/iptv/index.category.m3u`
3. **News Channels (930+)**: `https://iptv-org.github.io/iptv/categories/news.m3u`
4. **Sports Channels (320+)**: `https://iptv-org.github.io/iptv/categories/sports.m3u`
5. **Movies & Cinema (350+)**: `https://iptv-org.github.io/iptv/categories/movies.m3u`
6. **Music & Hits (650+)**: `https://iptv-org.github.io/iptv/categories/music.m3u`
7. **Grouped by Country**: `https://iptv-org.github.io/iptv/index.country.m3u`
8. **Grouped by Language**: `https://iptv-org.github.io/iptv/index.language.m3u`

---

## Why Proxy HLS? (CORS & Mixed Content)

Loading a remote `.m3u8` link from a third-party server directly in a client browser can trigger:

- **CORS Errors**: Browsers reject cross-origin requests if the remote server omits `Access-Control-Allow-Origin: *`.
- **Mixed Content Errors**: Attempting to load `http://stream.m3u8` from an `https://` origin triggers security blocks.

### The `broadcast-hls` Proxy Architecture
The serverless proxy route ([/api/stream/proxy](file:///d:/development/projects/2026/live-hls/app/api/stream/proxy/route.ts)):
1. Requests the remote `.m3u8` playlist server-side.
2. Rewrites relative segment URIs into fully-qualified proxied endpoints.
3. Streams segment byte data back to the browser with explicit `Access-Control-Allow-Origin: *` headers and zero-copy streaming.

---

## Key Features

- **Hero Video Player**: Built on `hls.js` with auto-hiding controls after 2.5 seconds of inactivity.
- **IPTV Playlist Manager**: Full IPTV tab with LocalStorage persistence, file disk upload, and search.
- **TV Zapping**: Next/Previous channel flipping via player buttons or `N` / `P` keyboard keys.
- **Starred Favorites**: Star favorite channels for instant access across sessions.
- **4K UHD & Multi-Quality Selector**: Supports adaptive Auto mode or forced quality levels (4K 2160p, 1440p, 1080p, 720p).
- **10s Seek Controls & Live Edge Sync**: Quick -10s and +10s seek buttons alongside a one-click LIVE edge synchronization button.
- **Multi-Audio Track & WebVTT Subtitles**: Switch multi-language audio tracks and toggle closed captions.
- **CORS & HTTP Proxy Engine**: Toggleable proxying for seamless playback of restricted or HTTP streams.
- **Real-time Telemetry & Health Panel**: Live monitoring of buffer length, latency to live edge, FPS, dropped frames, and download speed.
- **Multi-Stream Grid**: View up to 4 concurrent live streams in a 2x2 multi-view layout with independent volume and fullscreen controls.
- **Stream History**: Persists recent stream URLs in browser `localStorage`.
- **Shareable Direct Links**: Share links pre-configured with query parameters (`/?url=...&proxy=true`).
- **Mobile & Touch Optimization**: Responsive layouts tailored for smartphones, tablets, and desktop displays.

---

## Project Architecture

```text
broadcast-hls/
├── app/
│   ├── api/stream/
│   │   ├── proxy/route.ts        # Serverless zero-copy CORS & HTTP proxy
│   │   ├── validate/route.ts     # Stream manifest & header validator
│   │   ├── health/route.ts       # Latency & ping health probe
│   │   └── history/route.ts      # Server-side history endpoint
│   ├── globals.css               # CSS design system tokens & utilities
│   ├── layout.tsx                # Root layout, next/font optimization & meta tags
│   └── page.tsx                  # Main app container & tab router
├── components/
│   ├── player/
│   │   ├── VideoPlayer.tsx       # Core video player & lifecycle
│   │   ├── PlayerControls.tsx    # Mobile & desktop playback bar with TV zapping
│   │   ├── SettingsMenu.tsx      # Quality, audio, speed flyout menu
│   │   ├── ProgressBar.tsx       # Buffer progress indicator
│   │   ├── VolumeControl.tsx     # Volume slider & mute toggle
│   │   └── StreamInfoModal.tsx   # Stream telemetry modal
│   ├── telemetry/
│   │   └── StreamHealthPanel.tsx # Telemetry gauge & health dashboard
│   ├── IptvPlaylistTab.tsx       # Full IPTV channel guide & playlist manager tab
│   ├── IptvChannelGuide.tsx      # Responsive IPTV channel drawer
│   ├── MultiView.tsx             # 2x2 multi-stream grid player
│   ├── Navbar.tsx                # Responsive navigation header with mobile menu
│   ├── RecentStreams.tsx         # Stream history list
│   └── StreamInput.tsx           # Stream URL input bar & presets
├── hooks/
│   ├── useHlsPlayer.ts           # hls.js player lifecycle & auto-recovery hook
│   ├── useIptvStore.ts           # LocalStorage IPTV playlist & favorites store
│   ├── useKeyboardShortcuts.ts   # Keyboard event listeners with TV zapping
│   └── useStreamHistory.ts       # LocalStorage state persistence
├── utils/
│   └── m3uParser.ts              # M3U IPTV parser & URL unwrapper utility
├── types/
│   └── stream.ts                 # TypeScript types for metrics & tracks
├── package.json
└── README.md
```

---

## API Endpoints

### 1. CORS Stream Proxy
`GET /api/stream/proxy?url=<ENCODED_M3U8_URL>&ua=<USER_AGENT>&referer=<REFERER>`
- Fetches target `.m3u8` manifest or segment byte data.
- Forwards optional custom `User-Agent` and `Referer` headers.
- Rewrites internal segment URIs to route through the proxy.
- Returns payload with `Access-Control-Allow-Origin: *` and zero-copy streaming.

### 2. Stream Validator
`POST /api/stream/validate`
- **Body**: `{ "url": "https://example.com/stream.m3u8" }`
- **Response**: Returns stream validity, content-type (`application/x-mpegURL`), resolution, and codecs.

---

## Quick Start & Local Setup

### Prerequisites
- Node.js 18.x or higher
- npm or pnpm

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Muhammed-Rizin/broadcast-hls.git
cd broadcast-hls
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 3. Linting & Production Build
```bash
# Run ESLint check & auto-fix
npm run format

# Compile Next.js production build
npm run build

# Start production server
npm run start
```

---

## Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Space` / `K` | Toggle Play / Pause |
| `F` | Toggle Fullscreen |
| `M` | Toggle Mute |
| `J` / `←` | Seek 10 seconds backward |
| `L` / `→` | Seek 10 seconds forward |
| `N` / `PageDown` | Next IPTV Channel |
| `P` / `PageUp` | Previous IPTV Channel |
| `0` | Jump to Live edge |

---

## License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for details.

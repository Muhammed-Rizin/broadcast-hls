# broadcast-hls 📡

> A high-performance, broadcast-grade Live HLS (`.m3u8`) streaming dashboard built with Next.js 15, HLS.js, and Vanilla CSS. Inspired by the design aesthetics of Apple TV, Vercel Dashboard, and Linear.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![HLS.js](https://img.shields.io/badge/HLS.js-1.5-orange)

---

## ✨ Key Features

- 🎬 **Hero Video Experience**: Zero permanent overlays during watching. Controls automatically fade after 2.5s mouse/keyboard inactivity.
- ⚡ **Direct Link Deep-Linking (`/?url=...`)**: Share direct watch links for any HTTP/HTTPS live `.m3u8` stream. Automatically validates, proxies, and plays on any device.
- 🛡️ **Zero-CORS Proxy Engine**: Dynamic server-side API proxy (`/api/stream/proxy`) bypassing CORS and mixed-content (HTTP/HTTPS) restrictions.
- 📊 **Real-Time Telemetry & Health Monitoring**: Live bitrate ladder, buffer length metrics, dropped frame counter, and live edge latency tracking.
- 🏆 **4K UHD & Adaptive ABR Support**: Automatic quality switching from 4K UHD (2160p), 1440p (2K), 1080p HD down to 270p.
- ⏩ **Interactive Seek & Hotkeys**: Dedicated `-10s` and `+10s` skip controls, native WebVTT subtitle tracks, and full keyboard shortcuts (`Space`, `F`, `M`, `J`, `L`).
- 💾 **Client-Side History & Favorites**: Zero-database state persistence powered by browser `localStorage`.
- 📱 **Progressive Web App (PWA)**: Installable standalone app for Smart TVs, desktop, and mobile home screens.

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/Muhammed-Rizin/broadcast-hls.git
cd broadcast-hls
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 🛠️ Built With

- **Framework**: Next.js 15 (App Router & React Server Components)
- **Video Engine**: `hls.js` & HTML5 Video Media API
- **Styling**: Vanilla CSS & Tailwind CSS utilities
- **Icons**: Lucide React
- **Deployment**: Optimized for Vercel

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

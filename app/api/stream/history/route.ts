import { NextRequest, NextResponse } from 'next/server';
import { StreamHistoryItem } from '@/types/stream';

// In-memory store fallback with initial default test streams
let recentStreams: StreamHistoryItem[] = [
  {
    id: 'stream-sample-1',
    url: 'http://40.160.24.55/TSN_4/index.m3u8',
    title: 'User Sample Stream (TSN 4 Live)',
    lastPlayed: Date.now() - 3600000,
    isFavorite: true,
    resolution: '1080p',
    status: 'healthy',
  },
  {
    id: 'stream-sample-2',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    title: 'Big Buck Bunny (Mux HLS Test)',
    lastPlayed: Date.now() - 7200000,
    isFavorite: false,
    resolution: '1080p',
    status: 'healthy',
  },
  {
    id: 'stream-sample-3',
    url: 'https://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8',
    title: 'JWPlayer BipBop Live Test',
    lastPlayed: Date.now() - 14400000,
    isFavorite: false,
    resolution: '720p',
    status: 'healthy',
  },
  {
    id: 'stream-sample-4',
    url: 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
    title: 'Akamai Live Test Stream',
    lastPlayed: Date.now() - 86400000,
    isFavorite: false,
    resolution: '1080p',
    status: 'healthy',
  },
];

export async function GET() {
  return NextResponse.json({ history: recentStreams });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, title, isFavorite, resolution, status } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const existingIndex = recentStreams.findIndex((item) => item.url === url);

    if (existingIndex >= 0) {
      recentStreams[existingIndex] = {
        ...recentStreams[existingIndex],
        title: title || recentStreams[existingIndex].title || url,
        lastPlayed: Date.now(),
        isFavorite: isFavorite !== undefined ? isFavorite : recentStreams[existingIndex].isFavorite,
        resolution: resolution || recentStreams[existingIndex].resolution,
        status: status || recentStreams[existingIndex].status,
      };
    } else {
      const newItem: StreamHistoryItem = {
        id: `stream-${Date.now()}`,
        url,
        title: title || url,
        lastPlayed: Date.now(),
        isFavorite: !!isFavorite,
        resolution,
        status: status || 'healthy',
      };
      recentStreams.unshift(newItem);
    }

    // Keep max 25 items
    if (recentStreams.length > 25) {
      recentStreams = recentStreams.slice(0, 25);
    }

    return NextResponse.json({ success: true, history: recentStreams });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update history' }, { status: 500 });
  }
}

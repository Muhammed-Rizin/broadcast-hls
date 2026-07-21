import { NextRequest, NextResponse } from 'next/server';
import { StreamHistoryItem } from '@/types/stream';

export const dynamic = 'force-dynamic';

// In-memory store fallback with initial default test streams
let recentStreams: StreamHistoryItem[] = [
  {
    id: '1',
    url: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/adv_dv_atmos/main.m3u8',
    title: 'Apple Advanced 4K UHD',
    resolution: '2160p',
    lastPlayed: Date.now() - 3600000,
  },
  {
    id: '2',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    title: 'Big Buck Bunny 1080p',
    resolution: '1080p',
    lastPlayed: Date.now() - 86400000,
  },
];

export async function GET() {
  return NextResponse.json({ history: recentStreams });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, title, resolution } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const newItem: StreamHistoryItem = {
      id: Date.now().toString(),
      url: url.trim(),
      title: title || url.trim(),
      resolution: resolution || '1080p',
      lastPlayed: Date.now(),
    };

    // Deduplicate history
    recentStreams = [newItem, ...recentStreams.filter((item) => item.url !== newItem.url)].slice(0, 20);

    return NextResponse.json({ success: true, item: newItem, history: recentStreams });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save history' }, { status: 500 });
  }
}

export async function DELETE() {
  recentStreams = [];
  return NextResponse.json({ success: true, history: [] });
}

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 LiveHLSHub HealthProbe/1.0',
      },
      cache: 'no-store',
    }).catch(async () => {
      // Fallback to GET with Range if HEAD fails
      return fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Range': 'bytes=0-100',
          'User-Agent': 'Mozilla/5.0 LiveHLSHub HealthProbe/1.0',
        },
        cache: 'no-store',
      });
    });

    clearTimeout(timeout);

    const latencyMs = Date.now() - startTime;
    const ok = response.ok;

    let status = 'healthy';
    if (!ok) {
      status = 'offline';
    } else if (latencyMs > 1500) {
      status = 'high_latency';
    }

    return NextResponse.json({
      status,
      latencyMs,
      statusCode: response.status,
      timestamp: Date.now(),
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'offline',
      latencyMs: Date.now() - startTime,
      error: error.message || 'Stream probe unreachable',
      timestamp: Date.now(),
    });
  }
}

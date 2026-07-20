import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return new NextResponse('Missing target "url" query parameter', { status: 400 });
  }

  let parsedTarget: URL;
  try {
    parsedTarget = new URL(targetUrl);
  } catch {
    return new NextResponse('Invalid target URL', { status: 400 });
  }

  try {
    const upstreamResponse = await fetch(parsedTarget.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) LiveHLSHub/1.0',
        'Accept': '*/*',
      },
      cache: 'no-store',
    });

    if (!upstreamResponse.ok) {
      return new NextResponse(`Upstream Error: ${upstreamResponse.status} ${upstreamResponse.statusText}`, {
        status: upstreamResponse.status,
      });
    }

    const contentType = upstreamResponse.headers.get('content-type') || '';
    const isPlaylist = targetUrl.endsWith('.m3u8') || contentType.includes('mpegurl') || contentType.includes('apple');

    if (isPlaylist) {
      const text = await upstreamResponse.text();
      
      // Rewrite playlist lines to route segments & sub-playlists through proxy
      const lines = text.split('\n');
      const rewrittenLines = lines.map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return line;

        // Rewrite URIs inside tags like #EXT-X-KEY:METHOD=AES-128,URI="http..."
        if (trimmed.startsWith('#') && trimmed.includes('URI="')) {
          return trimmed.replace(/URI="([^"]+)"/g, (_, uri) => {
            try {
              const absUrl = new URL(uri, parsedTarget.toString()).toString();
              return `URI="/api/stream/proxy?url=${encodeURIComponent(absUrl)}"`;
            } catch {
              return _;
            }
          });
        }

        // If it's a comment or tag, keep as is
        if (trimmed.startsWith('#')) {
          return line;
        }

        // Resolve relative or absolute segment/playlist URL
        try {
          const resolvedUrl = new URL(trimmed, parsedTarget.toString()).toString();
          return `/api/stream/proxy?url=${encodeURIComponent(resolvedUrl)}`;
        } catch {
          return line;
        }
      });

      const rewrittenBody = rewrittenLines.join('\n');

      return new NextResponse(rewrittenBody, {
        status: 200,
        headers: {
          'Content-Type': 'application/x-mpegURL',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }

    // For video/audio segments (.ts, .m4s, .mp4, .aac)
    const arrayBuffer = await upstreamResponse.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType || 'video/mp2t',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error: any) {
    return new NextResponse(`Proxy failed: ${error.message || 'Network error'}`, { status: 502 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Range, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}

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
    const rangeHeader = req.headers.get('range');
    const customUa = searchParams.get('ua');
    const customReferer = searchParams.get('referer');

    const fetchHeaders: Record<string, string> = {
      'User-Agent': customUa || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) LiveHLSHub/1.0',
      'Accept': '*/*',
    };

    if (customReferer) {
      fetchHeaders['Referer'] = customReferer;
    }

    if (rangeHeader) {
      fetchHeaders['Range'] = rangeHeader;
    }

    const upstreamResponse = await fetch(parsedTarget.toString(), {
      headers: fetchHeaders,
      cache: 'no-store',
    });

    if (!upstreamResponse.ok) {
      return new NextResponse(`Upstream Error: ${upstreamResponse.status} ${upstreamResponse.statusText}`, {
        status: upstreamResponse.status,
      });
    }

    const contentType = (upstreamResponse.headers.get('content-type') || '').toLowerCase();
    const pathnameLower = parsedTarget.pathname.toLowerCase();

    const isM3u8Extension = pathnameLower.endsWith('.m3u8') || pathnameLower.endsWith('.m3u');
    const isM3u8ContentType =
      contentType.includes('mpegurl') ||
      contentType.includes('apple') ||
      contentType.includes('application/x-mpegurl') ||
      contentType.includes('audio/mpegurl') ||
      contentType.includes('vnd.apple.mpegurl');

    const isPlaylist = isM3u8Extension || isM3u8ContentType;

    if (isPlaylist) {
      const bodyText = await upstreamResponse.text();

      // Build extra query params string to append to sub-resources
      let extraParams = '';
      if (customUa) extraParams += `&ua=${encodeURIComponent(customUa)}`;
      if (customReferer) extraParams += `&referer=${encodeURIComponent(customReferer)}`;

      // Rewrite playlist lines to route segments & sub-playlists through proxy
      const lines = bodyText.split('\n');
      const rewrittenLines = lines.map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return line;

        // Rewrite URIs inside tags like #EXT-X-KEY:METHOD=AES-128,URI="http...", #EXT-X-MEDIA, #EXT-X-MAP, #EXT-X-PART
        if (trimmed.startsWith('#') && trimmed.includes('URI="')) {
          return trimmed.replace(/URI="([^"]+)"/g, (_, uri) => {
            try {
              const absUrl = new URL(uri, parsedTarget.toString()).toString();
              return `URI="/api/stream/proxy?url=${encodeURIComponent(absUrl)}${extraParams}"`;
            } catch {
              return _;
            }
          });
        }

        // If it's a comment or tag, keep as is
        if (trimmed.startsWith('#')) {
          return line;
        }

        // If already proxied, do not double-wrap
        if (trimmed.startsWith('/api/stream/proxy')) {
          return line;
        }

        // Resolve relative or absolute segment/playlist URL
        try {
          const resolvedUrl = new URL(trimmed, parsedTarget.toString()).toString();
          return `/api/stream/proxy?url=${encodeURIComponent(resolvedUrl)}${extraParams}`;
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

    // Zero-copy streaming for video/audio media chunks (.ts, .m4s, .mp4, .aac)
    const contentRange = upstreamResponse.headers.get('content-range');
    const contentLength = upstreamResponse.headers.get('content-length');

    const responseHeaders: Record<string, string> = {
      'Content-Type': contentType || 'video/mp2t',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Range',
      'Cache-Control': 'public, max-age=3600',
      'Accept-Ranges': 'bytes',
    };

    if (contentRange) responseHeaders['Content-Range'] = contentRange;
    if (contentLength) responseHeaders['Content-Length'] = contentLength;

    return new NextResponse(upstreamResponse.body as any, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  } catch (error: any) {
    return new NextResponse(`Proxy failed: ${error.message || 'Network error'}`, { status: 502 });
  }
}

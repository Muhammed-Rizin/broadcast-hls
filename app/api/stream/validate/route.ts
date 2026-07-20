import { NextRequest, NextResponse } from 'next/server';
import { StreamValidationResult, VariantInfo } from '@/types/stream';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'Stream URL is required' },
        { status: 400 }
      );
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.trim());
    } catch {
      return NextResponse.json({
        valid: false,
        live: false,
        isMaster: false,
        url,
        originalUrl: url,
        variants: [],
        error: 'Invalid URL format. Must start with http:// or https://',
      } as StreamValidationResult);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    let response: Response;
    try {
      response = await fetch(parsedUrl.toString(), {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) LiveHLSHub/1.0',
          'Accept': '*/*',
        },
        cache: 'no-store',
      });
    } catch (err: any) {
      clearTimeout(timeout);
      const isTimeout = err.name === 'AbortError';
      return NextResponse.json({
        valid: false,
        live: false,
        isMaster: false,
        url: parsedUrl.toString(),
        originalUrl: url,
        variants: [],
        error: isTimeout ? 'Stream connection timed out (8s limit)' : `Unreachable stream: ${err.message || 'Network error'}`,
      } as StreamValidationResult);
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      return NextResponse.json({
        valid: false,
        live: false,
        isMaster: false,
        url: parsedUrl.toString(),
        originalUrl: url,
        variants: [],
        error: `HTTP ${response.status} ${response.statusText}`,
        serverHeader: response.headers.get('server') || '',
      } as StreamValidationResult);
    }

    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();

    if (!text.includes('#EXTM3U')) {
      return NextResponse.json({
        valid: false,
        live: false,
        isMaster: false,
        url: parsedUrl.toString(),
        originalUrl: url,
        variants: [],
        contentType,
        error: 'Target URL does not return a valid HLS (#EXTM3U) playlist',
      } as StreamValidationResult);
    }

    const isMaster = text.includes('#EXT-X-STREAM-INF');
    const isEndList = text.includes('#EXT-X-ENDLIST');
    const isLive = !isEndList;

    const variants: VariantInfo[] = [];
    let topResolution = '';
    let topCodecs = '';
    let topBitrate = 0;

    if (isMaster) {
      const lines = text.split('\n');
      let currentVariant: Partial<VariantInfo> = {};

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('#EXT-X-STREAM-INF:')) {
          const attributes = line.substring(18);
          
          const bwMatch = attributes.match(/BANDWIDTH=(\d+)/);
          if (bwMatch) {
            currentVariant.bandwidth = parseInt(bwMatch[1], 10);
          }

          const resMatch = attributes.match(/RESOLUTION=(\d+x\d+)/);
          if (resMatch) {
            currentVariant.resolution = resMatch[1];
            const [w, h] = resMatch[1].split('x').map(Number);
            currentVariant.width = w;
            currentVariant.height = h;
          }

          const codecMatch = attributes.match(/CODECS="([^"]+)"/);
          if (codecMatch) {
            currentVariant.codecs = codecMatch[1];
          }
        } else if (line && !line.startsWith('#')) {
          let variantUrl = line;
          try {
            variantUrl = new URL(line, parsedUrl.toString()).toString();
          } catch {
            // keep raw
          }

          variants.push({
            index: variants.length,
            bandwidth: currentVariant.bandwidth || 0,
            resolution: currentVariant.resolution || '',
            width: currentVariant.width || 0,
            height: currentVariant.height || 0,
            codecs: currentVariant.codecs || '',
            url: variantUrl,
          });

          currentVariant = {};
        }
      }

      variants.sort((a, b) => b.bandwidth - a.bandwidth);

      if (variants.length > 0) {
        topResolution = variants[0].resolution || '';
        topCodecs = variants[0].codecs || '';
        topBitrate = variants[0].bandwidth || 0;
      }
    }

    let segmentDuration = 0;
    const targetDurMatch = text.match(/#EXT-X-TARGETDURATION:(\d+)/);
    if (targetDurMatch) {
      segmentDuration = parseInt(targetDurMatch[1], 10);
    }

    const proxiedUrl = `/api/stream/proxy?url=${encodeURIComponent(parsedUrl.toString())}`;

    const result: StreamValidationResult = {
      valid: true,
      live: isLive,
      isMaster,
      url: parsedUrl.toString(),
      originalUrl: url,
      proxiedUrl,
      contentType,
      resolution: topResolution,
      codecs: topCodecs,
      bitrate: topBitrate,
      variants,
      segmentDuration,
      serverHeader: response.headers.get('server') || '',
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Validation API Error:', error);
    return NextResponse.json(
      { valid: false, error: error.message || 'Stream validation failed' },
      { status: 200 } // Return 200 with valid: false to present friendly UI error
    );
  }
}

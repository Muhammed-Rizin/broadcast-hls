export interface IptvChannel {
  id: string;
  name: string;
  logo?: string;
  group?: string;
  country?: string;
  language?: string;
  streamUrl: string;
  userAgent?: string;
  referer?: string;
}

export interface IptvPlaylist {
  id: string;
  name: string;
  url?: string;
  channels: IptvChannel[];
  categories: string[];
  updatedAt: number;
}

export function cleanStreamUrl(rawUrl: string, baseUrl?: string): string {
  if (!rawUrl) return '';
  let url = rawUrl.trim();

  // Unwrap any proxied URLs (e.g. https://domain/api/stream/proxy?url=http%3A%2F%2Ftarget...)
  if (url.includes('/api/stream/proxy?url=')) {
    try {
      const dummy = url.startsWith('http://') || url.startsWith('https://') ? url : `http://localhost${url}`;
      const parsed = new URL(dummy);
      const targetParam = parsed.searchParams.get('url');
      if (targetParam) {
        url = decodeURIComponent(targetParam);
      }
    } catch {
      const match = url.match(/proxy\?url=([^&]+)/);
      if (match) {
        url = decodeURIComponent(match[1]);
      }
    }
  }

  // Resolve relative URLs against baseUrl if provided
  if (!url.startsWith('http://') && !url.startsWith('https://') && baseUrl) {
    try {
      const cleanBase = cleanStreamUrl(baseUrl);
      url = new URL(url, cleanBase).toString();
    } catch {
      // Keep as is
    }
  }

  return url;
}

export function isIptvPlaylist(content: string): boolean {
  if (!content) return false;
  return (
    content.includes('#EXTINF:') ||
    content.includes('tvg-name=') ||
    content.includes('tvg-logo=') ||
    content.includes('group-title=')
  );
}

export function parseM3uPlaylist(content: string, baseUrl?: string, playlistName?: string): IptvPlaylist {
  const lines = content.split('\n');
  const channels: IptvChannel[] = [];
  const categoriesSet = new Set<string>();

  let currentChannel: Partial<IptvChannel> = {};
  let currentHeaderUserAgent: string | undefined;
  let currentHeaderReferer: string | undefined;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse VLCOPT headers (#EXTVLCOPT:http-user-agent=... or #EXTVLCOPT:http-referrer=...)
    if (line.startsWith('#EXTVLCOPT:')) {
      const option = line.substring(11).trim();
      if (option.toLowerCase().startsWith('http-user-agent=')) {
        currentHeaderUserAgent = option.substring(16).trim();
      } else if (option.toLowerCase().startsWith('http-referrer=')) {
        currentHeaderReferer = option.substring(14).trim();
      }
      continue;
    }

    if (line.startsWith('#EXTINF:')) {
      currentChannel = {};

      // Extract User Agent inside #EXTINF if present (http-user-agent="...")
      const uaMatch = line.match(/http-user-agent="([^"]+)"/i);
      if (uaMatch) {
        currentChannel.userAgent = uaMatch[1];
      } else if (currentHeaderUserAgent) {
        currentChannel.userAgent = currentHeaderUserAgent;
      }

      // Extract tvg-logo="http..."
      const logoMatch = line.match(/tvg-logo="([^"]+)"/i);
      if (logoMatch) {
        currentChannel.logo = logoMatch[1];
      }

      // Extract group-title="..."
      const groupMatch = line.match(/group-title="([^"]+)"/i);
      if (groupMatch) {
        currentChannel.group = groupMatch[1];
        groupMatch[1].split(';').forEach((cat) => {
          const trimmedCat = cat.trim();
          if (trimmedCat) categoriesSet.add(trimmedCat);
        });
      }

      // Extract tvg-country="..."
      const countryMatch = line.match(/tvg-country="([^"]+)"/i);
      if (countryMatch) {
        currentChannel.country = countryMatch[1];
      }

      // Extract tvg-language="..."
      const langMatch = line.match(/tvg-language="([^"]+)"/i);
      if (langMatch) {
        currentChannel.language = langMatch[1];
      }

      // Extract Channel Name after the last comma
      const commaIdx = line.lastIndexOf(',');
      if (commaIdx !== -1) {
        currentChannel.name = line.substring(commaIdx + 1).trim();
      } else {
        currentChannel.name = 'Unnamed Channel';
      }

      currentChannel.id = `channel-${channels.length + 1}-${Date.now()}`;
      continue;
    }

    // Skip comment lines
    if (line.startsWith('#')) continue;

    // Line is a stream URI (relative or absolute)
    if (line.startsWith('http://') || line.startsWith('https://') || line.includes('/api/stream/proxy') || (baseUrl && line.length > 3)) {
      const resolvedUrl = cleanStreamUrl(line, baseUrl);

      currentChannel.streamUrl = resolvedUrl;
      if (currentHeaderReferer && !currentChannel.referer) {
        currentChannel.referer = currentHeaderReferer;
      }

      if (currentChannel.name && currentChannel.streamUrl) {
        channels.push(currentChannel as IptvChannel);
      }

      // Reset for next entry
      currentChannel = {};
      currentHeaderUserAgent = undefined;
      currentHeaderReferer = undefined;
    }
  }

  return {
    id: `playlist-${Date.now()}`,
    name: playlistName || 'IPTV Playlist',
    url: baseUrl,
    channels,
    categories: Array.from(categoriesSet).sort(),
    updatedAt: Date.now(),
  };
}

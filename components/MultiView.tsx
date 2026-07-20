'use client';

import React, { useState } from 'react';
import { Grid, Plus, Trash2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { VideoPlayer } from './player/VideoPlayer';

interface MultiStreamItem {
  id: string;
  url: string;
  title: string;
  useProxy: boolean;
}

const DEFAULT_STREAMS: MultiStreamItem[] = [
  {
    id: 'stream-1',
    url: 'http://40.160.24.55/TSN_4/index.m3u8',
    title: 'Stream 1 (TSN 4)',
    useProxy: true,
  },
  {
    id: 'stream-2',
    url: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    title: 'Stream 2 (Big Buck Bunny)',
    useProxy: false,
  },
  {
    id: 'stream-3',
    url: 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8',
    title: 'Stream 3 (Akamai Test)',
    useProxy: false,
  },
  {
    id: 'stream-4',
    url: 'https://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8',
    title: 'Stream 4 (JWPlayer BipBop)',
    useProxy: false,
  },
];

export const MultiView: React.FC = () => {
  const [streams, setStreams] = useState<MultiStreamItem[]>(DEFAULT_STREAMS);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const addStream = () => {
    if (!newUrl.trim()) return;
    if (streams.length >= 4) return;

    const newItem: MultiStreamItem = {
      id: `stream-${Date.now()}`,
      url: newUrl.trim(),
      title: newTitle.trim() || `Stream ${streams.length + 1}`,
      useProxy: newUrl.trim().startsWith('http://'),
    };

    setStreams([...streams, newItem]);
    setNewUrl('');
    setNewTitle('');
  };

  const removeStream = (id: string) => {
    setStreams(streams.filter((s) => s.id !== id));
  };

  const toggleProxyForStream = (id: string) => {
    setStreams(
      streams.map((s) => (s.id === id ? { ...s, useProxy: !s.useProxy } : s))
    );
  };

  return (
    <div className="space-y-4">
      <div className="broadcast-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-white">Multi-View Broadcast Grid</h2>
          <p className="text-xs text-[#7A7A7D]">
            Monitor up to 4 live HLS feeds concurrently
          </p>
        </div>

        {streams.length < 4 && (
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Stream URL (.m3u8)"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="bg-[#141414] border border-[#2A2A2D] focus:border-white rounded-[8px] px-3 py-1.5 text-xs text-white placeholder-[#555558] font-mono w-full sm:w-56"
            />
            <button
              onClick={addStream}
              className="px-3.5 py-1.5 bg-white hover:bg-neutral-200 text-black font-semibold text-xs rounded-[8px] flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Stream</span>
            </button>
          </div>
        )}
      </div>

      <div className={`grid gap-4 ${
        streams.length === 1
          ? 'grid-cols-1'
          : streams.length === 2
          ? 'grid-cols-1 md:grid-cols-2'
          : 'grid-cols-1 md:grid-cols-2'
      }`}>
        {streams.map((stream, idx) => (
          <div key={stream.id} className="broadcast-card p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 border-b border-[#2A2A2D] pb-2">
              <div className="flex items-center gap-2 truncate">
                <span className="w-4 h-4 rounded-full bg-[#141414] text-[#B6B6B8] text-[10px] font-bold font-mono flex items-center justify-center border border-[#2A2A2D]">
                  {idx + 1}
                </span>
                <h4 className="text-xs font-semibold text-white truncate">{stream.title}</h4>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleProxyForStream(stream.id)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold flex items-center gap-1 ${
                    stream.useProxy ? 'bg-[#222326] text-white border border-[#2A2A2D]' : 'bg-[#141414] text-[#7A7A7D] border border-[#2A2A2D]'
                  }`}
                >
                  {stream.useProxy ? <ShieldCheck className="w-3 h-3 text-[#22C55E]" /> : <ShieldAlert className="w-3 h-3" />}
                  <span>{stream.useProxy ? 'PROXY' : 'DIRECT'}</span>
                </button>

                <button
                  onClick={() => removeStream(stream.id)}
                  className="p-1 text-[#7A7A7D] hover:text-[#EF4444] rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <VideoPlayer
              streamUrl={stream.url}
              useProxy={stream.useProxy}
              setUseProxy={(val) =>
                setStreams(
                  streams.map((s) => (s.id === stream.id ? { ...s, useProxy: val } : s))
                )
              }
              title={stream.title}
              autoPlay={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

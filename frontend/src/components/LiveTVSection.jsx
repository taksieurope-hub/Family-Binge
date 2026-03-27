import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { Tv, Radio, Globe } from 'lucide-react';

const channels = [
  { id: 1, name: 'Al Jazeera English', category: 'News', region: 'International', stream: 'https://live-hls-aje-ak.getaj.net/AJE/01.m3u8', color: 'from-yellow-600 to-orange-600' },
  { id: 2, name: 'NASA TV', category: 'Science', region: 'International', stream: 'https://nasa-i.akamaihd.net/hls/live/253565/NASA-NTV1-HLS/master.m3u8', color: 'from-blue-600 to-indigo-600' },
  { id: 3, name: 'DW English', category: 'News', region: 'International', stream: 'https://dwamdstream102.akamaized.net/hls/live/2015529/dwstream102/index.m3u8', color: 'from-red-600 to-pink-600' },
  { id: 4, name: 'France 24 English', category: 'News', region: 'International', stream: 'https://stream.france24.com/hls/live/2037163/F24_EN_HI_HLS/master.m3u8', color: 'from-blue-500 to-cyan-600' },
  { id: 5, name: 'Bloomberg TV', category: 'Business', region: 'International', stream: 'https://bloomenglish-i.akamaihd.net/hls/live/571308/bloom_english/master.m3u8', color: 'from-purple-600 to-violet-600' },
  { id: 6, name: 'RT News', category: 'News', region: 'International', stream: 'https://rt-glb.rttv.com/live/rtnews/playlist.m3u8', color: 'from-green-600 to-emerald-600' },
];

const categories = ['All', 'News', 'Business', 'Science'];

const LiveTVSection = ({ accessStatus, onExpiredClick }) => {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const filtered = activeCategory === 'All' ? channels : channels.filter(c => c.category === activeCategory);

  const loadChannel = (channel) => {
    if (accessStatus === 'expired') { onExpiredClick && onExpiredClick(); return; }
    setSelectedChannel(channel);
    setError(false);
    setLoading(true);
  };

  useEffect(() => {
    if (!selectedChannel || !videoRef.current) return;
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
    const video = videoRef.current;
    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hlsRef.current = hls;
      hls.loadSource(selectedChannel.stream);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => { setLoading(false); video.play().catch(() => {}); });
      hls.on(Hls.Events.ERROR, (e, data) => { if (data.fatal) { setLoading(false); setError(true); } });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = selectedChannel.stream;
      video.addEventListener('loadedmetadata', () => { setLoading(false); video.play().catch(() => {}); });
    } else {
      setLoading(false);
      setError(true);
    }
    return () => { if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; } };
  }, [selectedChannel]);

  return (
    <div className="min-h-screen bg-black py-20 px-4">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gradient-to-br from-purple-600 to-pink-500 p-2.5 rounded-xl">
            <Radio className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">Live TV</h2>
            <p className="text-gray-400 text-sm">Watch live channels from around the world</p>
          </div>
          <div className="ml-auto flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-3 py-1">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-xs font-bold">LIVE</span>
          </div>
        </div>

        {selectedChannel && (
          <div className="mb-8 rounded-2xl overflow-hidden bg-zinc-900 border border-white/10">
            <div className="relative aspect-video bg-black">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-3">
                  <Tv className="w-12 h-12 text-gray-600" />
                  <p className="text-gray-400">Stream unavailable. Try another channel.</p>
                </div>
              )}
              <video ref={videoRef} className="w-full h-full" controls playsInline />
            </div>
            <div className="px-5 py-3 flex items-center gap-3 border-t border-white/10">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${selectedChannel.color} flex items-center justify-center flex-shrink-0`}>
                <Tv className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">{selectedChannel.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{selectedChannel.category}</span>
                  <span className="text-gray-600 text-xs">|</span>
                  <Globe className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-400">{selectedChannel.region}</span>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-1.5 bg-red-500/20 border border-red-500/30 rounded-full px-2.5 py-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-red-400 text-xs font-bold">LIVE</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 ${activeCategory === cat ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-gray-400 hover:text-white hover:bg-zinc-700'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filtered.map(channel => (
            <button
              key={channel.id}
              onClick={() => loadChannel(channel)}
              className={`relative rounded-2xl overflow-hidden border transition-all duration-200 text-left group ${selectedChannel?.id === channel.id ? 'border-purple-500 ring-2 ring-purple-500/50' : 'border-white/10 hover:border-white/30'}`}
            >
              <div className={`aspect-video bg-gradient-to-br ${channel.color} flex items-center justify-center relative`}>
                <Tv className="w-8 h-8 text-white/80" />
                {selectedChannel?.id === channel.id && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="flex items-center gap-1.5 bg-red-500/90 rounded-full px-2 py-1">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      <span className="text-white text-xs font-bold">LIVE</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3 bg-zinc-900">
                <p className="text-white text-xs font-semibold truncate">{channel.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">{channel.category}</p>
              </div>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

export default LiveTVSection;

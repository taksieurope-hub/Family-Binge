import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';

const CATEGORY_URLS = {
  news:          'https://iptv-org.github.io/iptv/categories/news.m3u',
  sports:        'https://iptv-org.github.io/iptv/categories/sports.m3u',
  entertainment: 'https://iptv-org.github.io/iptv/categories/entertainment.m3u',
  kids:          'https://iptv-org.github.io/iptv/categories/kids.m3u',
};

const parseM3U = (text) => {
  const lines = text.split('\n');
  const channels = [];
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('#EXTINF')) {
      const nameMatch = lines[i].match(/,(.+)$/);
      const logoMatch = lines[i].match(/tvg-logo="([^"]+)"/);
      const url = lines[i + 1]?.trim();
      if (nameMatch && url && url.startsWith('http')) {
        channels.push({
          name: nameMatch[1].trim(),
          logo: logoMatch ? logoMatch[1] : null,
          url,
        });
      }
    }
  }
  return channels;
};

const LiveTVSection = () => {
  const [category, setCategory] = useState('news');
  const [channels, setChannels] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError('');
    setChannels([]);
    setSelected(null);
    fetch(`https://corsproxy.io/?${encodeURIComponent(CATEGORY_URLS[category])}`)
      .then(r => r.text())
      .then(text => {
        const parsed = parseM3U(text).slice(0, 50);
        setChannels(parsed);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load channels. Try again.');
        setLoading(false);
      });
  }, [category]);

  useEffect(() => {
    if (!selected || !videoRef.current) return;
    if (hlsRef.current) hlsRef.current.destroy();
    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(selected.url);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => videoRef.current.play().catch(() => {}));
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = selected.url;
      videoRef.current.play().catch(() => {});
    }
  }, [selected]);

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <h2 className="text-3xl font-bold mb-6">📺 Live TV</h2>

      {/* Category Tabs */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {Object.keys(CATEGORY_URLS).map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2 rounded-full capitalize font-semibold transition ${
              category === cat ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-gray-400 hover:bg-zinc-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Player */}
      {selected && (
        <div className="mb-6">
          <p className="text-purple-400 font-semibold mb-2">▶ Now Playing: {selected.name}</p>
          <video
            ref={videoRef}
            controls
            className="w-full max-w-3xl rounded-2xl bg-zinc-900"
            style={{ maxHeight: '420px' }}
          />
        </div>
      )}

      {/* Channel Grid */}
      {loading && <p className="text-gray-400">Loading channels...</p>}
      {error && <p className="text-red-400">{error}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {channels.map((ch, i) => (
          <button
            key={i}
            onClick={() => setSelected(ch)}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition ${
              selected?.url === ch.url ? 'bg-purple-700' : 'bg-zinc-800 hover:bg-zinc-700'
            }`}
          >
            {ch.logo ? (
              <img src={ch.logo} alt={ch.name} className="w-10 h-10 object-contain" onError={e => e.target.style.display='none'} />
            ) : (
              <div className="w-10 h-10 bg-zinc-600 rounded-full flex items-center justify-center text-lg">📡</div>
            )}
            <span className="text-xs text-center text-gray-300 line-clamp-2">{ch.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LiveTVSection;
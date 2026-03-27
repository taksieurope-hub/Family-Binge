import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronUp, ChevronDown, Tv, Search, X } from 'lucide-react';

// -- Pull channel list from LiveTVSection --------------------------------------
import { channels } from './LiveTVSection';

const LiveTVPage = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const sidebarRef = useRef(null);

  const [activeChannel, setActiveChannel] = useState(channels[0]);
  const [streamIndex, setStreamIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const categories = ['All', ...Array.from(new Set(channels.map(c => c.category))).sort()];

  const filtered = channels.filter(ch => {
    const matchCat = selectedCategory === 'All' || ch.category === selectedCategory;
    const matchSearch = ch.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const loadStream = (channel, idx = 0) => {
    setLoading(true);
    setError(false);
    setStreamIndex(idx);

    const url = channel.streams[idx];
    if (!url) { setError(true); setLoading(false); return; }

    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }

    if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(videoRef.current);
      hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        videoRef.current?.play().catch(() => {});
      });
      hls.on(window.Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          const next = idx + 1;
          if (next < channel.streams.length) {
            loadStream(channel, next);
          } else {
            setError(true);
            setLoading(false);
          }
        }
      });
    } else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = url;
      videoRef.current.onloadedmetadata = () => {
        setLoading(false);
        videoRef.current?.play().catch(() => {});
      };
      videoRef.current.onerror = () => {
        const next = idx + 1;
        if (next < channel.streams.length) loadStream(channel, next);
        else { setError(true); setLoading(false); }
      };
    } else {
      setError(true);
      setLoading(false);
    }
  };

  const selectChannel = (ch) => {
    setActiveChannel(ch);
    loadStream(ch, 0);
    // Scroll sidebar to selected
    setTimeout(() => {
      const el = document.getElementById(`ch-${ch.id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  };

  const stepChannel = (dir) => {
    const idx = filtered.findIndex(c => c.id === activeChannel.id);
    const next = filtered[idx + dir];
    if (next) selectChannel(next);
  };

  useEffect(() => {
    // Load HLS.js if not present
    if (!window.Hls) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js';
      script.onload = () => loadStream(channels[0], 0);
      document.head.appendChild(script);
    } else {
      loadStream(channels[0], 0);
    }
    return () => { hlsRef.current?.destroy(); };
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex flex-col overflow-hidden">

      {/* -- Top bar -- */}
      <div className="flex items-center gap-3 px-4 py-2 bg-black/80 backdrop-blur border-b border-white/10 z-50 shrink-0">
        <button
          onClick={() => navigate('/app')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mr-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:inline">Back</span>
        </button>

        {/* Active channel info */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xs text-gray-500 font-mono shrink-0">CH {activeChannel.id}</span>
          <span className="text-white font-semibold text-sm truncate">{activeChannel.name}</span>
          <span className="text-xs text-gray-400 hidden sm:inline shrink-0">{activeChannel.category}</span>
          {!error && (
            <span className="flex items-center gap-1 text-xs text-red-400 shrink-0">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" />
              LIVE
            </span>
          )}
        </div>

        {/* Channel up/down */}
        <div className="flex gap-1 shrink-0">
          <button onClick={() => stepChannel(-1)} className="p-1 text-gray-400 hover:text-white transition-colors">
            <ChevronUp className="w-5 h-5" />
          </button>
          <button onClick={() => stepChannel(1)} className="p-1 text-gray-400 hover:text-white transition-colors">
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>

        {/* Toggle sidebar */}
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors shrink-0 border border-white/20 rounded px-2 py-1"
        >
          <Tv className="w-3 h-3" />
          <span className="hidden sm:inline">{sidebarOpen ? 'Hide' : 'Channels'}</span>
        </button>
      </div>

      {/* -- Main area -- */}
      <div className="flex flex-1 overflow-hidden">

        {/* -- Player -- */}
        <div className="relative flex-1 bg-black flex items-center justify-center">
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            controls
            playsInline
            autoPlay
          />

          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-3">
              <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <p className="text-gray-400 text-sm">Loading {activeChannel.name}...</p>
            </div>
          )}

          {/* Error overlay */}
          {error && !loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 gap-4">
              <Tv className="w-16 h-16 text-gray-600" />
              <p className="text-white font-semibold text-lg">Stream Unavailable</p>
              <p className="text-gray-400 text-sm">All streams for {activeChannel.name} are currently offline</p>
              <button
                onClick={() => loadStream(activeChannel, 0)}
                className="mt-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* -- Sidebar -- */}
        {sidebarOpen && (
          <div className="w-72 flex flex-col bg-zinc-950 border-l border-white/10 shrink-0" ref={sidebarRef}>

            {/* Search + filter */}
            <div className="p-3 space-y-2 border-b border-white/10 shrink-0">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search channels..."
                  className="w-full bg-white/5 border border-white/10 rounded pl-7 pr-7 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="flex gap-1 flex-wrap">
                {categories.slice(0, 6).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                      selectedCategory === cat
                        ? 'bg-white text-black border-white'
                        : 'border-white/20 text-gray-400 hover:text-white hover:border-white/40'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Channel list */}
            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 && (
                <p className="text-gray-500 text-sm text-center mt-8">No channels found</p>
              )}
              {filtered.map(ch => {
                const isActive = ch.id === activeChannel.id;
                return (
                  <button
                    id={`ch-${ch.id}`}
                    key={ch.id}
                    onClick={() => selectChannel(ch)}
                    className={`w-full text-left px-3 py-3 flex items-start gap-3 border-b border-white/5 transition-colors ${
                      isActive
                        ? 'bg-white/10 border-l-2 border-l-white'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    {/* Channel number */}
                    <span className="text-xs font-mono text-gray-500 w-7 shrink-0 mt-0.5">{ch.id}</span>

                    {/* Logo or placeholder */}
                    <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded bg-white/5 overflow-hidden">
                      {ch.logo ? (
                        <img
                          src={ch.logo}
                          alt={ch.name}
                          className="w-full h-full object-contain p-0.5"
                          onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                        />
                      ) : null}
                      <Tv className="w-4 h-4 text-gray-600" style={{ display: ch.logo ? 'none' : 'block' }} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isActive ? 'text-white' : 'text-gray-300'}`}>
                        {ch.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-gray-500">{ch.category}</span>
                        {isActive && (
                          <span className="flex items-center gap-1 text-xs text-red-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
                            LIVE
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer count */}
            <div className="px-3 py-2 border-t border-white/10 shrink-0">
              <p className="text-xs text-gray-600">{filtered.length} of {channels.length} channels</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveTVPage;

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Tv, ChevronRight, ChevronDown } from 'lucide-react';
import { channels } from './LiveTVSection';

const LiveTVPage = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [openGenre, setOpenGenre] = useState(null);

  const genreMap = {};
  channels.forEach(ch => {
    const g = ch.category || 'General';
    if (!genreMap[g]) genreMap[g] = [];
    genreMap[g].push(ch);
  });
  const genres = Object.keys(genreMap).sort();

  const loadStream = (channel, idx = 0) => {
    setLoading(true);
    setError(false);
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
          if (next < channel.streams.length) loadStream(channel, next);
          else { setError(true); setLoading(false); }
        }
      });
    } else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = url;
      videoRef.current.onloadedmetadata = () => { setLoading(false); videoRef.current?.play().catch(() => {}); };
      videoRef.current.onerror = () => {
        const next = idx + 1;
        if (next < channel.streams.length) loadStream(channel, next);
        else { setError(true); setLoading(false); }
      };
    } else { setError(true); setLoading(false); }
  };

  const selectChannel = (ch) => { setActiveChannel(ch); loadStream(ch, 0); };

  useEffect(() => {
    if (!window.Hls) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js';
      document.head.appendChild(script);
    }
    return () => { hlsRef.current?.destroy(); };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'sans-serif', overflow: 'hidden' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid #222', background: '#111', flexShrink: 0 }}>
        <button onClick={() => navigate('/app')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: 14 }}>
          <ArrowLeft size={16} /> Back
        </button>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>Live TV</span>
        {activeChannel && (
          <span style={{ marginLeft: 8, color: '#aaa', fontSize: 13 }}>
            CH {activeChannel.id} - {activeChannel.name}
            <span style={{ marginLeft: 8, color: '#ef4444', fontSize: 11 }}> LIVE</span>
          </span>
        )}
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        <div style={{ width: 260, background: '#111', borderRight: '1px solid #222', overflowY: 'auto', flexShrink: 0 }}>
          {genres.map(genre => {
            const isOpen = openGenre === genre;
            const chs = genreMap[genre];
            return (
              <div key={genre}>
                <button
                  onClick={() => setOpenGenre(isOpen ? null : genre)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: isOpen ? '#1a1a1a' : 'transparent', border: 'none', borderBottom: '1px solid #1e1e1e', color: isOpen ? '#fff' : '#999', cursor: 'pointer', fontSize: 12, fontWeight: 700, textAlign: 'left', textTransform: 'uppercase', letterSpacing: '0.06em' }}
                >
                  <span>{genre} <span style={{ color: '#444', fontWeight: 400, fontSize: 10 }}>({chs.length})</span></span>
                  {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                </button>
                {isOpen && chs.map(ch => {
                  const isActive = activeChannel?.id === ch.id;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => selectChannel(ch)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px 10px 24px', background: isActive ? '#1a2744' : 'transparent', border: 'none', borderBottom: '1px solid #161616', borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent', color: isActive ? '#fff' : '#bbb', cursor: 'pointer', textAlign: 'left' }}
                    >
                      <Tv size={12} color={isActive ? '#3b82f6' : '#444'} style={{ flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ch.name}</div>
                        <div style={{ fontSize: 10, color: '#555', marginTop: 1 }}>CH {ch.id}</div>
                      </div>
                      {isActive && <span style={{ fontSize: 8, color: '#ef4444', flexShrink: 0 }}>LIVE</span>}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', position: 'relative' }}>
          {!activeChannel && (
            <div style={{ textAlign: 'center' }}>
              <Tv size={56} color='#2a2a2a' />
              <p style={{ fontSize: 16, color: '#555', marginTop: 16, fontWeight: 600 }}>Select a channel to watch</p>
              <p style={{ fontSize: 12, color: '#333', marginTop: 6 }}>Pick a genre on the left, then choose a channel</p>
            </div>
          )}
          {activeChannel && (
            <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'contain' }} controls playsInline autoPlay />
          )}
          {loading && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', gap: 12 }}>
              <div style={{ width: 32, height: 32, border: '2px solid #333', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <p style={{ color: '#aaa', fontSize: 13 }}>Loading {activeChannel?.name}...</p>
            </div>
          )}
          {error && !loading && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.9)', gap: 10 }}>
              <Tv size={44} color='#333' />
              <p style={{ color: '#fff', fontSize: 15, fontWeight: 600 }}>Stream Unavailable</p>
              <p style={{ color: '#666', fontSize: 12 }}>All streams offline for {activeChannel?.name}</p>
              <button onClick={() => loadStream(activeChannel, 0)} style={{ marginTop: 8, padding: '7px 18px', background: '#1f2937', border: '1px solid #374151', color: '#fff', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Try Again</button>
            </div>
          )}
        </div>
      </div>
      <style>{'@keyframes spin { to { transform: rotate(360deg); } } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }'}</style>
    </div>
  );
};

export default LiveTVPage;
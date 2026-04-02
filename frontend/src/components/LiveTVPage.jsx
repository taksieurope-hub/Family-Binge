import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Tv, Menu, X, Search, Trash2 } from 'lucide-react';
import { channels } from './LiveTVSection';
import { useAuth } from '../services/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const LiveTVPage = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [activeChannel, setActiveChannel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [deleteMode, setDeleteMode] = useState(false);
  const { user } = useAuth();
  const [accessBlocked, setAccessBlocked] = useState(false);
  const [deletedIds, setDeletedIds] = useState([]);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const checkAccess = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (!snap.exists()) { setAccessBlocked(true); return; }
        const data = snap.data();
        const status = data.subscriptionStatus;
        const trialEnd = data.trialEndsAt?.toDate ? data.trialEndsAt.toDate() : new Date(data.trialEndsAt);
        const subEnd = data.subscriptionEndsAt?.toDate ? data.subscriptionEndsAt.toDate() : new Date(data.subscriptionEndsAt);
        const now = new Date();
        const trialActive = data.trialEndsAt && trialEnd > now;
        const subActive = status === 'active' && data.subscriptionEndsAt && subEnd > now;
        if (!trialActive && !subActive) setAccessBlocked(true);
      } catch(e) { console.error(e); }
    };
    checkAccess();
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'hidden_channels', user.uid));
        if (snap.exists()) setDeletedIds(snap.data().ids || []);
      } catch(e) {}
    };
    load();
  }, [user]);

  if (accessBlocked) return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-6 text-center">
      <div className="text-6xl mb-4">??</div>
      <h2 className="text-white text-2xl font-bold mb-2">Subscription Required</h2>
      <p className="text-gray-400 mb-6">Your free trial has ended. Subscribe to keep watching Live TV.</p>
      <button onClick={() => navigate('/app#pricing')} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors">
        View Plans
      </button>
      <button onClick={() => navigate('/app')} className="mt-3 text-gray-500 hover:text-white text-sm transition-colors">
        Go Back
      </button>
    </div>
  );

  const visibleChannels = channels.filter(c => !deletedIds.includes(c.id));
  const categories = ['All', ...Array.from(new Set(visibleChannels.map(c => c.category))).sort()];
  const filtered = visibleChannels.filter(c => {
    const matchCat = activeCategory === 'All' || c.category === activeCategory;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Hide this channel?')) return;
    const next = [...deletedIds, id];
    setDeletedIds(next);
    if (user) setDoc(doc(db, 'hidden_channels', user.uid), { ids: next });
  };

  const handleRestoreAll = () => {
    setDeletedIds([]);
    if (user) setDoc(doc(db, 'hidden_channels', user.uid), { ids: [] });
  };

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
      hls.on(window.Hls.Events.MANIFEST_PARSED, () => { setLoading(false); videoRef.current?.play().catch(() => {}); });
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

  const selectChannel = (ch) => {
    setActiveChannel(ch);
    loadStream(ch, 0);
    if (isMobile) setSidebarOpen(false);
  };

  useEffect(() => {
    if (!window.Hls) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js';
      document.head.appendChild(script);
    }
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    setSidebarOpen(!mobile);
    const handleResize = () => {
      const m = window.innerWidth < 768;
      setIsMobile(m);
      if (!m) setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => { hlsRef.current?.destroy(); window.removeEventListener('resize', handleResize); };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'sans-serif', overflow: 'hidden' }}>

      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderBottom: '1px solid #222', background: '#111', flexShrink: 0, zIndex: 10 }}>
        <button onClick={() => navigate('/app')} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: 13, padding: '4px 8px' }}>
          <ArrowLeft size={15} /> Back
        </button>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 16, flex: 1 }}>Live TV</span>
        {activeChannel && (
          <span style={{ color: '#aaa', fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>
            CH {activeChannel.id} - {activeChannel.name}
            <span style={{ marginLeft: 6, color: '#ef4444', fontSize: 10 }}>LIVE</span>
          </span>
        )}
        <button onClick={() => setSidebarOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 5, background: sidebarOpen ? '#1f2937' : '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: 12, padding: '6px 10px', flexShrink: 0 }}>
          {sidebarOpen ? <X size={14} /> : <Menu size={14} />}
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

        {sidebarOpen && isMobile && (
          <div onClick={() => setSidebarOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 20 }} />
        )}

        {sidebarOpen && (
          <div style={{ position: isMobile ? 'absolute' : 'relative', top: 0, left: 0, height: '100%', width: 280, background: '#111', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column', flexShrink: 0, zIndex: 30 }}>

            {/* Sidebar header */}
            <div style={{ padding: '10px 14px', borderBottom: '1px solid #1e1e1e', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#888', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                  {filtered.length} Channels
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => setDeleteMode(d => !d)}
                    style={{ background: deleteMode ? '#dc2626' : '#1f2937', border: '1px solid ' + (deleteMode ? '#dc2626' : '#374151'), borderRadius: 6, color: '#fff', cursor: 'pointer', fontSize: 11, padding: '4px 8px' }}>
                    {deleteMode ? 'Done' : 'Manage'}
                  </button>
                  {deletedIds.length > 0 && (
                    <button onClick={handleRestoreAll} style={{ background: '#166534', border: '1px solid #166534', borderRadius: 6, color: '#fff', cursor: 'pointer', fontSize: 11, padding: '4px 8px' }}>
                      Restore {deletedIds.length}
                    </button>
                  )}
                </div>
              </div>
              {/* Search */}
              <div style={{ position: 'relative' }}>
                <Search size={12} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                <input
                  type="text"
                  placeholder="Search channels..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 6, color: '#fff', fontSize: 12, padding: '6px 8px 6px 26px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Category tabs */}
            <div style={{ display: 'flex', gap: 6, padding: '8px 10px', overflowX: 'auto', flexShrink: 0, borderBottom: '1px solid #1e1e1e' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{ background: activeCategory === cat ? '#7c3aed' : '#1a1a1a', border: '1px solid ' + (activeCategory === cat ? '#7c3aed' : '#2a2a2a'), borderRadius: 20, color: activeCategory === cat ? '#fff' : '#888', cursor: 'pointer', fontSize: 11, padding: '4px 10px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Channel list */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filtered.map(ch => {
                const isActive = activeChannel?.id === ch.id;
                return (
                  <div key={ch.id} style={{ position: 'relative' }}>
                    <button
                      onClick={() => selectChannel(ch)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: isActive ? '#1a2744' : 'transparent', border: 'none', borderBottom: '1px solid #161616', borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent', color: isActive ? '#fff' : '#bbb', cursor: 'pointer', textAlign: 'left' }}>
                      <Tv size={12} color={isActive ? '#3b82f6' : '#444'} style={{ flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ch.name}</div>
                        <div style={{ fontSize: 10, color: '#555', marginTop: 1 }}>CH {ch.id} Â· {ch.category}</div>
                      </div>
                      {isActive && <span style={{ fontSize: 9, color: '#ef4444', flexShrink: 0 }}>LIVE</span>}
                    </button>
                    {deleteMode && (
                      <button
                        onClick={(e) => handleDelete(e, ch.id)}
                        style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: '#dc2626', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', fontSize: 11, padding: '3px 7px', zIndex: 10 }}>
                        Hide
                      </button>
                    )}
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: 30, color: '#444', fontSize: 13 }}>No channels found</div>
              )}
            </div>
          </div>
        )}

        {/* Video area */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', position: 'relative', minWidth: 0 }}>
          {!activeChannel && (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <Tv size={48} color='#2a2a2a' />
              <p style={{ fontSize: 15, color: '#555', marginTop: 14, fontWeight: 600 }}>Select a channel</p>
              <p style={{ fontSize: 12, color: '#333', marginTop: 6 }}>Browse {visibleChannels.length} channels in the sidebar</p>
            </div>
          )}
          {activeChannel && (
            <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'contain' }} controls playsInline autoPlay />
          )}
          {loading && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.85)', gap: 12 }}>
              <div style={{ width: 30, height: 30, border: '2px solid #333', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <p style={{ color: '#aaa', fontSize: 13 }}>Loading {activeChannel?.name}...</p>
            </div>
          )}
          {error && !loading && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.9)', gap: 10 }}>
              <Tv size={40} color='#333' />
              <p style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>Stream Unavailable</p>
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




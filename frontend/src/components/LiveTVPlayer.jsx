import React, { useEffect, useRef, useState } from 'react';
import { X, Radio, Maximize, RefreshCw, AlertTriangle } from 'lucide-react';

const LiveTVPlayer = ({ channel, onClose }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const containerRef = useRef(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!channel?.stream_url || !videoRef.current) return;
    const video = videoRef.current;
    const url = channel.stream_url;
    setError(false);
    setLoading(true);
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }

    const loadStream = async () => {
      if (!window.Hls) {
        await new Promise((resolve, reject) => {
          if (document.querySelector('script[src*="hls.min.js"]')) { resolve(); return; }
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest/dist/hls.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      const Hls = window.Hls;
      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true, lowLatencyMode: true, backBufferLength: 30 });
        hls.loadSource(url);
        hls.attachMedia(video);
        hlsRef.current = hls;
        hls.on(Hls.Events.MANIFEST_PARSED, () => { setLoading(false); video.play().catch(() => {}); });
        hls.on(Hls.Events.ERROR, (event, data) => { if (data.fatal) { setError(true); setLoading(false); } });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
        video.oncanplay = () => setLoading(false);
        video.onerror = () => { setError(true); setLoading(false); };
        video.play().catch(() => {});
      } else {
        setError(true); setLoading(false);
      }
    };

    loadStream().catch(() => { setError(true); setLoading(false); });
    return () => { if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; } };
  }, [channel]);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else containerRef.current?.requestFullscreen();
  };

  const retry = () => {
    setError(false); setLoading(true);
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
    const video = videoRef.current;
    if (!video || !window.Hls) return;
    const hls = new window.Hls({ lowLatencyMode: true });
    hls.loadSource(channel.stream_url);
    hls.attachMedia(video);
    hlsRef.current = hls;
    hls.on(window.Hls.Events.MANIFEST_PARSED, () => { setLoading(false); video.play().catch(() => {}); });
    hls.on(window.Hls.Events.ERROR, (e, data) => { if (data.fatal) { setError(true); setLoading(false); } });
  };

  if (!channel) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] bg-black flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/95 to-transparent absolute top-0 left-0 right-0 z-20">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-red-600 rounded-lg"><Radio className="w-4 h-4 text-white" /></div>
          <div>
            <h2 className="text-white font-semibold">{channel.name}</h2>
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />LIVE</span>
              <span>·</span><span>{channel.country}</span><span>·</span><span>CH {channel.number}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={retry} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"><RefreshCw className="w-4 h-4 text-white" /></button>
          <button onClick={toggleFullscreen} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"><Maximize className="w-4 h-4 text-white" /></button>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-red-500/80 rounded-lg transition-colors"><X className="w-4 h-4 text-white" /></button>
        </div>
      </div>
      <div className="flex-1 relative bg-black flex items-center justify-center">
        {loading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black">
            <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mb-4" />
            <p className="text-gray-400">Loading {channel.name}...</p>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center gap-6 text-center px-8 max-w-lg">
            <AlertTriangle className="w-16 h-16 text-yellow-500" />
            <div>
              <h3 className="text-white text-xl font-bold mb-2">Stream Unavailable</h3>
              <p className="text-gray-400 mb-6">{channel.name} may be geo-restricted or temporarily offline.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={retry} className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors"><RefreshCw className="w-4 h-4" /> Retry</button>
              <button onClick={onClose} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors">Close</button>
            </div>
          </div>
        )}
        <video ref={videoRef} className={`w-full h-full ${error ? 'hidden' : ''}`} controls autoPlay playsInline style={{ maxHeight: '100vh' }} />
      </div>
    </div>
  );
};

export default LiveTVPlayer;

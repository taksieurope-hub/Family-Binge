import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
const SERVERS = [
  { name: 'VidSrc',   movie: (id) => `https://vidsrc.cc/v2/embed/movie/${id}`,   tv: (id, s, e) => `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}` },
  { name: 'Server 2', movie: (id) => `https://vidsrc.xyz/embed/movie/${id}`,     tv: (id, s, e) => `https://vidsrc.xyz/embed/tv/${id}/${s}/${e}` },
  { name: 'Server 3', movie: (id) => `https://vidsrc.to/embed/movie/${id}`,      tv: (id, s, e) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}` },
  { name: 'Server 4', movie: (id) => `https://vidsrc.me/embed/movie?tmdb=${id}`, tv: (id, s, e) => `https://vidsrc.me/embed/tv?tmdb=${id}&season=${s}&episode=${e}` },
  { name: 'Server 5', movie: (id) => `https://autoembed.cc/movie/tmdb/${id}`,    tv: (id, s, e) => `https://autoembed.cc/tv/tmdb/${id}-${s}-${e}` },
];
const VideoPlayer = ({ videoId, onClose, season, episode, isTV }) => {
  const [serverIndex, setServerIndex] = useState(0);
  const [status, setStatus] = useState('loading');
  const iframeRef = useRef(null);
  const errorTimer = useRef(null);
  if (!videoId) return null;
  const isYouTube = videoId && !/^\d+$/.test(videoId);
  const src = isYouTube
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
    : isTV
      ? SERVERS[serverIndex].tv(videoId, season || 1, episode || 1)
      : SERVERS[serverIndex].movie(videoId);

  useEffect(() => {
    setStatus('loading');
    // If iframe hasnt signalled anything after 12s, auto-advance to next server
    errorTimer.current = setTimeout(() => {
      if (status === 'loading' && serverIndex < SERVERS.length - 1) {
        setServerIndex(i => i + 1);
      } else {
        setStatus('ready');
      }
    }, 12000);
    return () => clearTimeout(errorTimer.current);
  }, [serverIndex]);

  const handleLoad = () => {
    clearTimeout(errorTimer.current);
    setStatus('ready');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
        <X className="w-6 h-6 text-white" />
      </button>
      <div className="w-full max-w-5xl flex flex-col gap-3" onClick={(e) => e.stopPropagation()}>
        {!isYouTube && (
          <div className="flex gap-2 flex-wrap justify-center items-center">
            {SERVERS.map((s, i) => (
              <button key={i} onClick={() => { setServerIndex(i); }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${i === serverIndex ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                {s.name}
              </button>
            ))}
            {status === 'loading' && (
              <span className="text-xs text-gray-400 ml-2 animate-pulse">Finding best stream...</span>
            )}
          </div>
        )}
        <div className="aspect-video rounded-xl overflow-hidden shadow-2xl relative">
          <iframe ref={iframeRef} key={src} src={src} title="Video Player" className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
            allowFullScreen onLoad={handleLoad} />
          {status === 'loading' && (
            <div className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-3 pointer-events-none">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <p className="text-white/60 text-sm">Loading {SERVERS[serverIndex].name}...</p>
            </div>
          )}
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 text-sm">If video doesn't load, try another server</div>
    </div>
  );
};
export default VideoPlayer;
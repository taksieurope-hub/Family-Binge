import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Plus, ThumbsUp, ChevronDown, ChevronLeft, Loader2, SkipForward, Maximize2, Star } from 'lucide-react';
import { movieAPI, seriesAPI } from '../services/api';

const WATCH_HISTORY_KEY = 'familybinge_watch_history';

export const getWatchHistory = () => {
  try { return JSON.parse(localStorage.getItem(WATCH_HISTORY_KEY) || '[]'); }
  catch { return []; }
};

export const saveToWatchHistory = (content, season = 1, episode = 1, progress = 0) => {
  try {
    const history = getWatchHistory();
    const idx = history.findIndex(h => h.id === content.id && h.type === content.type);
    const item = { id: content.id, title: content.title, poster: content.poster, backdrop: content.backdrop, type: content.type, year: content.year, rating: content.rating, season, episode, progress, lastWatched: Date.now() };
    if (idx >= 0) history[idx] = item; else history.unshift(item);
    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
  } catch (e) {}
};

export const removeFromWatchHistory = (id, type) => {
  try {
    const h = getWatchHistory().filter(h => !(h.id === id && h.type === type));
    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(h));
  } catch (e) {}
};

const SOURCES = [
  (type, id, s, e) => type === 'series' ? `https://vidsrc.xyz/embed/tv/${id}/${s}/${e}` : `https://vidsrc.xyz/embed/movie/${id}`,
  (type, id, s, e) => type === 'series' ? `https://vidsrc.pro/embed/tv/${id}/${s}/${e}` : `https://vidsrc.pro/embed/movie/${id}`,
  (type, id, s, e) => type === 'series' ? `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}` : `https://vidsrc.cc/v2/embed/movie/${id}`,
  (type, id, s, e) => type === 'series' ? `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${s}&e=${e}` : `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`,
  (type, id, s, e) => type === 'series' ? `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}` : `https://www.2embed.cc/embed/${id}`,
];

const ContentDetailModal = ({ content, onClose, onPlayVideo }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [srcIdx, setSrcIdx] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const [showSeasonMenu, setShowSeasonMenu] = useState(false);
  const [showEpMenu, setShowEpMenu] = useState(false);
  const autoRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!content) return;
    setLoading(true); setIsPlaying(false); setDetails(null); setSrcIdx(0); setPlayerReady(false);
    const api = content.type === 'series' ? seriesAPI : movieAPI;
    api.getDetails(content.id).then(res => {
      const data = res.data;
      setDetails(data);
      const saved = getWatchHistory().find(h => h.id === content.id && h.type === content.type);
      if (saved) { setSelectedSeason(saved.season || 1); setSelectedEpisode(saved.episode || 1); }
      saveToWatchHistory(data, saved?.season || 1, saved?.episode || 1, 0);
      window.dispatchEvent(new Event('watchHistoryUpdated'));
    }).catch(console.error).finally(() => setLoading(false));
    return () => { if (autoRef.current) clearTimeout(autoRef.current); };
  }, [content]);

  useEffect(() => {
    if (isPlaying && !playerReady) {
      autoRef.current = setTimeout(() => {
        if (!playerReady && srcIdx < SOURCES.length - 1) { setSrcIdx(p => p + 1); setPlayerReady(false); }
      }, 7000);
    }
    return () => { if (autoRef.current) clearTimeout(autoRef.current); };
  }, [isPlaying, srcIdx, playerReady]);

  const handlePlay = () => { setSrcIdx(0); setPlayerReady(false); setIsPlaying(true); };

  const handleNext = () => {
    if (!details) return;
    if (details.type === 'series') {
      const next = selectedEpisode + 1;
      setSelectedEpisode(next); setSrcIdx(0); setPlayerReady(false);
      saveToWatchHistory(details, selectedSeason, next, 0);
      window.dispatchEvent(new Event('watchHistoryUpdated'));
    } else if (details.similar?.length > 0) {
      onClose();
      setTimeout(() => window.dispatchEvent(new CustomEvent('selectContent', { detail: details.similar[0] })), 100);
    }
  };

  const changeSeason = (s) => {
    setSelectedSeason(s); setSelectedEpisode(1); setSrcIdx(0); setPlayerReady(false); setShowSeasonMenu(false);
    if (details) { saveToWatchHistory(details, s, 1, 0); window.dispatchEvent(new Event('watchHistoryUpdated')); }
  };

  const changeEpisode = (ep) => {
    setSelectedEpisode(ep); setSrcIdx(0); setPlayerReady(false); setShowEpMenu(false);
    if (details) { saveToWatchHistory(details, selectedSeason, ep, 0); window.dispatchEvent(new Event('watchHistoryUpdated')); }
  };

  const handleFullscreen = () => {
    const el = wrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.() || el.webkitRequestFullscreen?.() || el.mozRequestFullScreen?.();
  };

  if (!content) return null;

  // PLAYER
  if (isPlaying && details) {
    const isSeries = details.type === 'series';
    return (
      <div className="fixed inset-0 z-[100] flex flex-col" style={{ background: '#000' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 flex-shrink-0" style={{ background: 'rgba(10,10,15,0.95)', borderBottom: '1px solid rgba(168,85,247,0.15)' }}>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button onClick={() => setIsPlaying(false)} className="p-1.5 rounded-lg transition-colors hover:bg-purple-500/10">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{details.title}</p>
              <p className="text-[#8b8aa0] text-xs">
                {isSeries ? `Season ${selectedSeason} · Episode ${selectedEpisode}` : details.year}
                {!playerReady && <span className="text-yellow-400 ml-2">● Connecting...</span>}
                {playerReady && <span className="text-green-400 ml-2">● Live</span>}
              </p>
            </div>
          </div>

          {isSeries && (
            <div className="hidden sm:flex items-center gap-2 mx-3">
              {/* Season picker */}
              <div className="relative">
                <button
                  onClick={() => { setShowSeasonMenu(!showSeasonMenu); setShowEpMenu(false); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors"
                  style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)' }}
                >
                  Season {selectedSeason} <ChevronDown className="w-3 h-3" />
                </button>
                {showSeasonMenu && (
                  <div className="absolute top-full mt-1 left-0 rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto min-w-[120px]" style={{ background: '#111118', border: '1px solid rgba(168,85,247,0.2)' }}>
                    {Array.from({ length: details.seasons || 5 }, (_, i) => i + 1).map(s => (
                      <button key={s} onClick={() => changeSeason(s)} className="w-full text-left px-3 py-2 text-sm transition-colors hover:bg-purple-500/10" style={{ color: s === selectedSeason ? '#a855f7' : '#8b8aa0' }}>
                        Season {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Episode picker */}
              <div className="relative">
                <button
                  onClick={() => { setShowEpMenu(!showEpMenu); setShowSeasonMenu(false); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors"
                  style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)' }}
                >
                  Episode {selectedEpisode} <ChevronDown className="w-3 h-3" />
                </button>
                {showEpMenu && (
                  <div className="absolute top-full mt-1 left-0 rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto min-w-[120px]" style={{ background: '#111118', border: '1px solid rgba(168,85,247,0.2)' }}>
                    {Array.from({ length: 50 }, (_, i) => i + 1).map(ep => (
                      <button key={ep} onClick={() => changeEpisode(ep)} className="w-full text-left px-3 py-2 text-sm transition-colors hover:bg-purple-500/10" style={{ color: ep === selectedEpisode ? '#a855f7' : '#8b8aa0' }}>
                        Episode {ep}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all btn-grad"
              >
                <SkipForward className="w-3.5 h-3.5" /> Next
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={handleFullscreen} className="p-2 rounded-lg hover:bg-purple-500/10 transition-colors" title="Fullscreen (or double-click)">
              <Maximize2 className="w-4 h-4 text-white" />
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-pink-500/10 transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* iframe */}
        <div ref={wrapRef} className="flex-1 relative" style={{ background: '#000' }} onDoubleClick={handleFullscreen}>
          {!playerReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none" style={{ background: '#000' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(236,72,153,0.2))', border: '1px solid rgba(168,85,247,0.3)' }}>
                <Loader2 className="w-7 h-7 animate-spin" style={{ color: '#a855f7' }} />
              </div>
              <p className="text-white text-sm font-medium">Loading...</p>
              <p className="text-[#8b8aa0] text-xs mt-1">Double-click to fullscreen</p>
            </div>
          )}
          <iframe
            key={`${details.id}-${selectedSeason}-${selectedEpisode}-${srcIdx}`}
            src={SOURCES[srcIdx](details.type, details.id, selectedSeason, selectedEpisode)}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-fullscreen"
            referrerPolicy="no-referrer"
            title={details.title}
            onLoad={() => { setPlayerReady(true); if (autoRef.current) clearTimeout(autoRef.current); }}
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-[90] flex items-center justify-center" style={{ background: 'rgba(10,10,15,0.85)' }} onClick={onClose}>
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: '#a855f7' }} />
      </div>
    );
  }

  // INFO MODAL
  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto" style={{ background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div
        className="relative max-w-3xl mx-auto my-8 rounded-2xl overflow-hidden fade-up"
        style={{ background: '#111118', border: '1px solid rgba(168,85,247,0.2)', boxShadow: '0 0 60px rgba(168,85,247,0.15), 0 30px 80px rgba(0,0,0,0.8)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{ background: 'rgba(10,10,15,0.8)', border: '1px solid rgba(168,85,247,0.2)' }}
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Hero */}
        <div className="relative h-[280px] sm:h-[360px]">
          {details?.backdrop || details?.poster ? (
            <img src={details.backdrop || details.poster} alt={details?.title} className="w-full h-full object-cover" />
          ) : <div className="w-full h-full" style={{ background: '#1a1a24' }} />}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #111118 0%, rgba(17,17,24,0.3) 50%, transparent 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(17,17,24,0.7) 0%, transparent 60%)' }} />

          <div className="absolute bottom-6 left-6 right-10">
            {/* Genre badges */}
            {details?.genres?.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-3">
                {details.genres.slice(0, 3).map((g, i) => (
                  <span key={i} className={`badge ${i === 0 ? 'badge-grad' : 'badge-outline'}`}>{g}</span>
                ))}
              </div>
            )}
            <h2 className="text-white font-black text-2xl sm:text-4xl mb-2 leading-tight text-glow">{details?.title}</h2>
            {details?.tagline && <p className="text-purple-300 italic text-sm mb-4">"{details.tagline}"</p>}

            <div className="flex items-center gap-3 mb-5 text-sm flex-wrap">
              {details?.rating > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: 'rgba(250,204,21,0.1)', border: '1px solid rgba(250,204,21,0.2)' }}>
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-yellow-300 font-bold">{details.rating}</span>
                </div>
              )}
              <span className="text-[#8b8aa0]">{details?.year}</span>
              {details?.runtime && <span className="text-[#8b8aa0]">{Math.floor(details.runtime / 60)}h {details.runtime % 60}m</span>}
              {details?.seasons && <span className="text-[#8b8aa0]">{details.seasons} Seasons</span>}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button onClick={handlePlay} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white btn-grad">
                <Play className="w-4 h-4 fill-white" /> Play
              </button>
              {details?.youtube_id && (
                <button
                  onClick={() => onPlayVideo(details.youtube_id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white transition-all hover:bg-purple-500/20"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  Watch Trailer
                </button>
              )}
              <button
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-purple-500/20"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="px-6 pb-6">
          <p className="text-[#8b8aa0] text-sm leading-relaxed mb-6 line-clamp-3">{details?.overview}</p>

          {details?.cast?.length > 0 && (
            <p className="text-sm mb-6" style={{ color: '#8b8aa0' }}>
              Cast: <span className="text-[#f1f0ff]">{details.cast.slice(0, 4).map(c => c.name).join(', ')}</span>
            </p>
          )}

          {details?.similar?.length > 0 && (
            <div>
              <h3 className="text-white font-bold text-base mb-4">More Like This</h3>
              <div className="grid grid-cols-3 gap-3">
                {details.similar.slice(0, 6).map(item => (
                  <div
                    key={item.id}
                    onClick={() => { onClose(); setTimeout(() => window.dispatchEvent(new CustomEvent('selectContent', { detail: item })), 100); }}
                    className="cursor-pointer group"
                  >
                    <div className="rounded-xl overflow-hidden relative" style={{ border: '1px solid rgba(168,85,247,0.1)' }}>
                      {item.poster ? (
                        <img src={item.poster} alt={item.title} className="w-full object-cover group-hover:scale-105 transition-transform" style={{ height: '130px' }} />
                      ) : <div className="flex items-center justify-center" style={{ height: '130px', background: '#1a1a24' }}><Play className="w-8 h-8 text-[#8b8aa0]" /></div>}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(10,10,15,0.5)' }}>
                        <Play className="w-8 h-8 text-white fill-white" />
                      </div>
                    </div>
                    <p className="text-[#8b8aa0] text-xs mt-1.5 truncate group-hover:text-white transition-colors">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentDetailModal;

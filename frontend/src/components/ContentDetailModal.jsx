import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Plus, ThumbsUp, ChevronDown, ChevronLeft, Loader2, SkipForward, Maximize2 } from 'lucide-react';
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
    const item = {
      id: content.id, title: content.title, poster: content.poster,
      backdrop: content.backdrop, type: content.type, year: content.year,
      rating: content.rating, season, episode, progress, lastWatched: Date.now()
    };
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

// Only vidsrc sources — no server buttons shown to user
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
  const iframeWrapRef = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!content) return;
    setLoading(true);
    setIsPlaying(false);
    setDetails(null);
    setSrcIdx(0);
    setPlayerReady(false);

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

  // Auto-switch source after 7s if not loaded
  useEffect(() => {
    if (isPlaying && !playerReady) {
      autoRef.current = setTimeout(() => {
        if (!playerReady && srcIdx < SOURCES.length - 1) {
          setSrcIdx(p => p + 1);
          setPlayerReady(false);
        }
      }, 7000);
    }
    return () => { if (autoRef.current) clearTimeout(autoRef.current); };
  }, [isPlaying, srcIdx, playerReady]);

  const handlePlay = () => { setSrcIdx(0); setPlayerReady(false); setIsPlaying(true); };

  const handleNext = () => {
    if (!details) return;
    if (details.type === 'series') {
      const next = selectedEpisode + 1;
      setSelectedEpisode(next);
      setSrcIdx(0); setPlayerReady(false);
      saveToWatchHistory(details, selectedSeason, next, 0);
      window.dispatchEvent(new Event('watchHistoryUpdated'));
    } else if (details.similar?.length > 0) {
      onClose();
      setTimeout(() => window.dispatchEvent(new CustomEvent('selectContent', { detail: details.similar[0] })), 100);
    }
  };

  const changeSeason = (s) => {
    setSelectedSeason(s); setSelectedEpisode(1);
    setSrcIdx(0); setPlayerReady(false); setShowSeasonMenu(false);
    if (details) { saveToWatchHistory(details, s, 1, 0); window.dispatchEvent(new Event('watchHistoryUpdated')); }
  };

  const changeEpisode = (ep) => {
    setSelectedEpisode(ep);
    setSrcIdx(0); setPlayerReady(false); setShowEpMenu(false);
    if (details) { saveToWatchHistory(details, selectedSeason, ep, 0); window.dispatchEvent(new Event('watchHistoryUpdated')); }
  };

  // Double-click fullscreen
  const handleDoubleClick = () => {
    const el = iframeWrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.() || el.webkitRequestFullscreen?.() || el.mozRequestFullScreen?.();
    }
  };

  // Fullscreen button
  const handleFullscreen = () => handleDoubleClick();

  if (!content) return null;

  // PLAYER VIEW
  if (isPlaying && details) {
    const isSeries = details.type === 'series';
    const streamUrl = SOURCES[srcIdx](details.type, details.id, selectedSeason, selectedEpisode);

    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-black/95 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button onClick={() => setIsPlaying(false)} className="p-1.5 hover:bg-white/10 rounded transition-colors flex-shrink-0">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div className="min-w-0">
              <p className="text-white font-medium text-sm truncate">{details.title}</p>
              <p className="text-[#757575] text-xs">
                {isSeries ? `Season ${selectedSeason} · Episode ${selectedEpisode}` : details.year}
                {!playerReady && <span className="text-yellow-400 ml-2">● Connecting...</span>}
                {playerReady && <span className="text-[#46d369] ml-2">● Live</span>}
              </p>
            </div>
          </div>

          {/* Series controls */}
          {isSeries && (
            <div className="hidden sm:flex items-center gap-2 mx-3">
              {/* Season picker */}
              <div className="relative">
                <button
                  onClick={() => { setShowSeasonMenu(!showSeasonMenu); setShowEpMenu(false); }}
                  className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                >
                  Season {selectedSeason} <ChevronDown className="w-3 h-3" />
                </button>
                {showSeasonMenu && (
                  <div className="absolute top-full mt-1 left-0 bg-[#181818] border border-white/10 rounded shadow-2xl z-50 max-h-48 overflow-y-auto min-w-[120px]">
                    {Array.from({ length: details.seasons || 5 }, (_, i) => i + 1).map(s => (
                      <button key={s} onClick={() => changeSeason(s)} className={`w-full text-left px-3 py-2 text-sm transition-colors ${s === selectedSeason ? 'bg-[#e50914] text-white' : 'text-[#e5e5e5] hover:bg-white/10'}`}>
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
                  className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                >
                  Episode {selectedEpisode} <ChevronDown className="w-3 h-3" />
                </button>
                {showEpMenu && (
                  <div className="absolute top-full mt-1 left-0 bg-[#181818] border border-white/10 rounded shadow-2xl z-50 max-h-48 overflow-y-auto min-w-[120px]">
                    {Array.from({ length: 50 }, (_, i) => i + 1).map(ep => (
                      <button key={ep} onClick={() => changeEpisode(ep)} className={`w-full text-left px-3 py-2 text-sm transition-colors ${ep === selectedEpisode ? 'bg-[#e50914] text-white' : 'text-[#e5e5e5] hover:bg-white/10'}`}>
                        Episode {ep}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={handleNext} className="flex items-center gap-1.5 bg-[#e50914] hover:bg-[#f40612] text-white px-3 py-1.5 rounded text-xs font-medium transition-colors">
                <SkipForward className="w-3.5 h-3.5" /> Next
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={handleFullscreen} className="p-2 hover:bg-white/10 rounded transition-colors" title="Fullscreen">
              <Maximize2 className="w-4 h-4 text-white" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Player area */}
        <div
          ref={iframeWrapRef}
          className="flex-1 relative bg-black"
          onDoubleClick={handleDoubleClick}
        >
          {!playerReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10 pointer-events-none">
              <Loader2 className="w-10 h-10 text-[#e50914] animate-spin" />
              <p className="text-white mt-3 text-sm">Loading...</p>
              <p className="text-[#757575] text-xs mt-1">Double-click to fullscreen</p>
            </div>
          )}
          <iframe
            ref={iframeRef}
            key={`${details.id}-${selectedSeason}-${selectedEpisode}-${srcIdx}`}
            src={streamUrl}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-fullscreen"
            referrerPolicy="no-referrer"
            title={details.title}
            onLoad={() => {
              setPlayerReady(true);
              if (autoRef.current) clearTimeout(autoRef.current);
            }}
          />
        </div>
      </div>
    );
  }

  // LOADING
  if (loading) {
    return (
      <div className="fixed inset-0 z-[90] bg-black/80 flex items-center justify-center" onClick={onClose}>
        <Loader2 className="w-10 h-10 text-[#e50914] animate-spin" />
      </div>
    );
  }

  // INFO MODAL
  return (
    <div className="fixed inset-0 z-[90] bg-black/75 overflow-y-auto" onClick={onClose}>
      <div
        className="relative bg-[#181818] rounded-md max-w-3xl mx-auto my-8 overflow-hidden shadow-2xl"
        style={{ animation: 'fadeIn 0.25s ease' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 bg-[#181818] rounded-full flex items-center justify-center hover:bg-[#2f2f2f] transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Hero */}
        <div className="relative h-[280px] sm:h-[360px]">
          {details?.backdrop || details?.poster ? (
            <img src={details.backdrop || details.poster} alt={details?.title} className="w-full h-full object-cover" />
          ) : <div className="w-full h-full bg-[#2f2f2f]" />}
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#181818]/60 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-white font-bold text-2xl sm:text-3xl mb-4 drop-shadow-lg">{details?.title}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handlePlay}
                className="flex items-center gap-2 bg-white hover:bg-white/90 text-black font-bold px-6 py-2 rounded transition-colors text-sm"
              >
                <Play className="w-5 h-5 fill-black" /> Play
              </button>
              {details?.youtube_id && (
                <button
                  onClick={() => onPlayVideo(details.youtube_id)}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-medium px-5 py-2 rounded transition-colors text-sm border border-white/20"
                >
                  Trailer
                </button>
              )}
              <button className="w-9 h-9 bg-[#2f2f2f]/80 hover:bg-[#2f2f2f] border border-white/40 rounded-full flex items-center justify-center transition-colors">
                <Plus className="w-5 h-5 text-white" />
              </button>
              <button className="w-9 h-9 bg-[#2f2f2f]/80 hover:bg-[#2f2f2f] border border-white/40 rounded-full flex items-center justify-center transition-colors">
                <ThumbsUp className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="px-6 pb-6">
          <div className="flex items-center gap-3 mb-4 text-sm flex-wrap">
            {details?.rating > 0 && <span className="text-[#46d369] font-bold">{Math.round(details.rating * 10)}% Match</span>}
            <span className="text-[#bcbcbc]">{details?.year}</span>
            {details?.runtime && <span className="text-[#bcbcbc]">{Math.floor(details.runtime / 60)}h {details.runtime % 60}m</span>}
            {details?.seasons && <span className="text-[#bcbcbc]">{details.seasons} Seasons</span>}
            <span className="border border-[#757575] text-[#757575] px-1 text-xs rounded">HD</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="sm:col-span-2">
              {details?.tagline && <p className="text-[#757575] italic mb-2 text-sm">"{details.tagline}"</p>}
              <p className="text-[#bcbcbc] text-sm leading-relaxed line-clamp-4">{details?.overview}</p>
            </div>
            <div className="text-sm space-y-2">
              {details?.genres?.length > 0 && (
                <p className="text-[#757575]">Genres: <span className="text-[#bcbcbc]">{details.genres.slice(0, 3).join(', ')}</span></p>
              )}
              {details?.cast?.length > 0 && (
                <p className="text-[#757575]">Cast: <span className="text-[#bcbcbc]">{details.cast.slice(0, 3).map(c => c.name).join(', ')}</span></p>
              )}
            </div>
          </div>

          {details?.similar?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-white font-bold text-lg mb-4">More Like This</h3>
              <div className="grid grid-cols-3 gap-3">
                {details.similar.slice(0, 6).map(item => (
                  <div
                    key={item.id}
                    onClick={() => { onClose(); setTimeout(() => window.dispatchEvent(new CustomEvent('selectContent', { detail: item })), 100); }}
                    className="cursor-pointer group"
                  >
                    <div className="rounded overflow-hidden relative">
                      {item.poster ? (
                        <img src={item.poster} alt={item.title} className="w-full object-cover group-hover:scale-105 transition-transform" style={{ height: '140px' }} />
                      ) : <div className="bg-[#2f2f2f] flex items-center justify-center" style={{ height: '140px' }}><Play className="w-8 h-8 text-[#757575]" /></div>}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="w-8 h-8 text-white fill-white" />
                      </div>
                    </div>
                    <p className="text-[#bcbcbc] text-xs mt-1.5 truncate group-hover:text-white transition-colors">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </div>
  );
};

export default ContentDetailModal;

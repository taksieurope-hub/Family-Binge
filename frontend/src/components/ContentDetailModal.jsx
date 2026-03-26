import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Star, Clock, Calendar, Users, ChevronRight, ChevronLeft, ChevronDown, Loader2, Tv, Film, RefreshCw, SkipForward } from 'lucide-react';
import { Button } from './ui/button';
import { movieAPI, seriesAPI } from '../services/api';

const WATCH_HISTORY_KEY = 'familybinge_watch_history';

export const getWatchHistory = () => {
  try {
    const history = localStorage.getItem(WATCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch { return []; }
};

export const saveToWatchHistory = (content, season = 1, episode = 1, progress = 0) => {
  try {
    const history = getWatchHistory();
    const existingIndex = history.findIndex(h => h.id === content.id && h.type === content.type);
    const historyItem = {
      id: content.id, title: content.title, poster: content.poster,
      backdrop: content.backdrop, type: content.type, year: content.year,
      rating: content.rating, season, episode, progress, lastWatched: Date.now(),
    };
    if (existingIndex >= 0) { history[existingIndex] = historyItem; } else { history.unshift(historyItem); }
    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
  } catch (e) { console.error('Error saving watch history:', e); }
};

export const removeFromWatchHistory = (id, type) => {
  try {
    const history = getWatchHistory().filter(h => !(h.id === id && h.type === type));
    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(history));
  } catch (e) { console.error('Error removing from watch history:', e); }
};

// Video sources - popup blocker friendly order
const VIDEO_SOURCES = [
  { name: 'Server 1', getUrl: (type, id, s, e) => type === 'series' ? `https://vidsrc.xyz/embed/tv/${id}/${s}/${e}` : `https://vidsrc.xyz/embed/movie/${id}` },
  { name: 'Server 2', getUrl: (type, id, s, e) => type === 'series' ? `https://vidsrc.pro/embed/tv/${id}/${s}/${e}` : `https://vidsrc.pro/embed/movie/${id}` },
  { name: 'Server 3', getUrl: (type, id, s, e) => type === 'series' ? `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}` : `https://vidsrc.cc/v2/embed/movie/${id}` },
  { name: 'Server 4', getUrl: (type, id, s, e) => type === 'series' ? `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${s}&e=${e}` : `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1` },
  { name: 'Server 5', getUrl: (type, id, s, e) => type === 'series' ? `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}` : `https://www.2embed.cc/embed/${id}` },
  { name: 'Server 6', getUrl: (type, id, s, e) => type === 'series' ? `https://moviesapi.club/tv/${id}-${s}-${e}` : `https://moviesapi.club/movie/${id}` },
];

const ContentDetailModal = ({ content, onClose, onPlayVideo }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const [showSeasonPicker, setShowSeasonPicker] = useState(false);
  const [showEpisodePicker, setShowEpisodePicker] = useState(false);
  const autoSwitchRef = useRef(null);
  const seasonPickerRef = useRef(null);
  const episodePickerRef = useRef(null);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!content) return;
      setLoading(true);
      try {
        const api = content.type === 'series' ? seriesAPI : movieAPI;
        const res = await api.getDetails(content.id);
        const data = res.data;
        setDetails(data);

        const history = getWatchHistory();
        const saved = history.find(h => h.id === content.id && h.type === content.type);
        if (saved) {
          setSelectedSeason(saved.season || 1);
          setSelectedEpisode(saved.episode || 1);
        }

        saveToWatchHistory(data, saved?.season || 1, saved?.episode || 1, 0);
        window.dispatchEvent(new Event('watchHistoryUpdated'));
        // Show info page - user clicks Watch Now to play
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
    return () => { if (autoSwitchRef.current) clearTimeout(autoSwitchRef.current); };
  }, [content]);

  // Auto-switch server if not loaded in 6 seconds
  useEffect(() => {
    if (isPlaying && !playerReady) {
      autoSwitchRef.current = setTimeout(() => {
        if (!playerReady && currentSourceIndex < VIDEO_SOURCES.length - 1) {
          setCurrentSourceIndex(prev => prev + 1);
          setPlayerReady(false);
        }
      }, 6000);
    }
    return () => { if (autoSwitchRef.current) clearTimeout(autoSwitchRef.current); };
  }, [isPlaying, currentSourceIndex, playerReady]);

  // Close pickers on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (seasonPickerRef.current && !seasonPickerRef.current.contains(e.target)) setShowSeasonPicker(false);
      if (episodePickerRef.current && !episodePickerRef.current.contains(e.target)) setShowEpisodePicker(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleNext = () => {
    if (!details) return;
    if (details.type === 'series') {
      const nextEp = selectedEpisode + 1;
      setSelectedEpisode(nextEp);
      setCurrentSourceIndex(0);
      setPlayerReady(false);
      saveToWatchHistory(details, selectedSeason, nextEp, 0);
      window.dispatchEvent(new Event('watchHistoryUpdated'));
    } else if (details.similar?.length > 0) {
      onClose();
      setTimeout(() => window.dispatchEvent(new CustomEvent('selectContent', { detail: details.similar[0] })), 100);
    }
  };

  const handlePrevEpisode = () => {
    if (selectedEpisode > 1) {
      const prevEp = selectedEpisode - 1;
      setSelectedEpisode(prevEp);
      setCurrentSourceIndex(0);
      setPlayerReady(false);
      saveToWatchHistory(details, selectedSeason, prevEp, 0);
    }
  };

  const handleSeasonChange = (season) => {
    setSelectedSeason(season);
    setSelectedEpisode(1);
    setCurrentSourceIndex(0);
    setPlayerReady(false);
    setShowSeasonPicker(false);
    saveToWatchHistory(details, season, 1, 0);
    window.dispatchEvent(new Event('watchHistoryUpdated'));
  };

  const handleEpisodeChange = (ep) => {
    setSelectedEpisode(ep);
    setCurrentSourceIndex(0);
    setPlayerReady(false);
    setShowEpisodePicker(false);
    saveToWatchHistory(details, selectedSeason, ep, 0);
    window.dispatchEvent(new Event('watchHistoryUpdated'));
  };

  const getStreamUrl = () => {
    if (!details) return null;
    return VIDEO_SOURCES[currentSourceIndex].getUrl(details.type, details.id, selectedSeason, selectedEpisode);
  };

  if (!content) return null;

  // Full screen player
  if (isPlaying && details) {
    const totalSeasons = details.seasons || 1;
    const isSeries = details.type === 'series';

    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col">
        {/* Header bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-black/90 border-b border-white/10 flex-shrink-0">
          {/* Left: title + info */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button onClick={() => setIsPlaying(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0">
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{details.title}</p>
              <p className="text-gray-400 text-xs">
                {isSeries ? `S${selectedSeason} · E${selectedEpisode}` : details.year}
                <span className="text-purple-400 ml-2">{VIDEO_SOURCES[currentSourceIndex].name}</span>
                {!playerReady && <span className="text-yellow-400 ml-2">● Connecting...</span>}
                {playerReady && <span className="text-green-400 ml-2">● Live</span>}
              </p>
            </div>
          </div>

          {/* Centre: Series navigation */}
          {isSeries && (
            <div className="flex items-center gap-1.5 mx-2">
              {/* Prev episode */}
              <button
                onClick={handlePrevEpisode}
                disabled={selectedEpisode <= 1}
                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-30"
                title="Previous episode"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>

              {/* Season picker */}
              <div ref={seasonPickerRef} className="relative">
                <button
                  onClick={() => { setShowSeasonPicker(!showSeasonPicker); setShowEpisodePicker(false); }}
                  className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                >
                  S{selectedSeason} <ChevronDown className="w-3 h-3" />
                </button>
                {showSeasonPicker && (
                  <div className="absolute top-full mt-1 left-0 bg-gray-900 border border-white/20 rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto min-w-[80px]">
                    {Array.from({ length: totalSeasons }, (_, i) => i + 1).map(s => (
                      <button
                        key={s}
                        onClick={() => handleSeasonChange(s)}
                        className={`w-full text-left px-3 py-2 text-sm transition-colors ${s === selectedSeason ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-white/10'}`}
                      >
                        Season {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Episode picker */}
              <div ref={episodePickerRef} className="relative">
                <button
                  onClick={() => { setShowEpisodePicker(!showEpisodePicker); setShowSeasonPicker(false); }}
                  className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                >
                  E{selectedEpisode} <ChevronDown className="w-3 h-3" />
                </button>
                {showEpisodePicker && (
                  <div className="absolute top-full mt-1 left-0 bg-gray-900 border border-white/20 rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto min-w-[80px]">
                    {Array.from({ length: 50 }, (_, i) => i + 1).map(ep => (
                      <button
                        key={ep}
                        onClick={() => handleEpisodeChange(ep)}
                        className={`w-full text-left px-3 py-2 text-sm transition-colors ${ep === selectedEpisode ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-white/10'}`}
                      >
                        Episode {ep}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Next episode */}
              <button
                onClick={handleNext}
                className="flex items-center gap-1 bg-purple-600 hover:bg-purple-500 text-white px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                title="Next episode"
              >
                <SkipForward className="w-3.5 h-3.5" />
                Next
              </button>
            </div>
          )}

          {/* Right: Server selector + close */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
              {VIDEO_SOURCES.map((src, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentSourceIndex(i); setPlayerReady(false); }}
                  title={src.name}
                  className={`px-2 py-1 rounded text-xs font-medium transition-all ${i === currentSourceIndex ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                >
                  S{i + 1}
                </button>
              ))}
              <button
                onClick={() => { if (currentSourceIndex < VIDEO_SOURCES.length - 1) { setCurrentSourceIndex(p => p + 1); setPlayerReady(false); } }}
                disabled={currentSourceIndex >= VIDEO_SOURCES.length - 1}
                className="px-2 py-1 text-gray-400 hover:text-white hover:bg-white/10 rounded text-xs transition-colors disabled:opacity-30"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
            <button onClick={onClose} className="p-2 bg-white/10 hover:bg-red-500/80 rounded-lg transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Player */}
        <div className="flex-1 relative bg-black">
          {!playerReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10 pointer-events-none">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
              <p className="text-white mt-4 font-medium">Loading {VIDEO_SOURCES[currentSourceIndex].name}...</p>
              <div className="flex gap-2 mt-4">
                {VIDEO_SOURCES.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-all ${i < currentSourceIndex ? 'bg-gray-600' : i === currentSourceIndex ? 'bg-purple-500 scale-125' : 'bg-white/20'}`} />
                ))}
              </div>
            </div>
          )}
          <iframe
            key={`${details.id}-${selectedSeason}-${selectedEpisode}-${currentSourceIndex}`}
            src={getStreamUrl()}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            referrerPolicy="no-referrer"
            title={details.title}
            onLoad={() => { setPlayerReady(true); if (autoSwitchRef.current) clearTimeout(autoSwitchRef.current); }}
          />
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 z-[90] bg-black/95 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  // Details view (shown briefly before auto-play kicks in)
  return (
    <div className="fixed inset-0 z-[90] bg-black/95 overflow-y-auto" onClick={onClose}>
      <div className="min-h-screen">
        <button onClick={onClose} className="fixed top-4 right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
          <X className="w-6 h-6 text-white" />
        </button>
        {details && (
          <div onClick={e => e.stopPropagation()}>
            <div className="relative h-[50vh] sm:h-[60vh]">
              {details.backdrop ? (
                <img src={details.backdrop} alt={details.title} className="w-full h-full object-cover" />
              ) : <div className="w-full h-full bg-gray-900" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12">
                <div className="max-w-4xl">
                  <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">{details.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      <span className="font-medium">{details.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{details.year}</span>
                    </div>
                    {details.runtime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{Math.floor(details.runtime / 60)}h {details.runtime % 60}m</span>
                      </div>
                    )}
                    {details.seasons && (
                      <div className="flex items-center gap-1">
                        <Tv className="w-4 h-4" />
                        <span>{details.seasons} Seasons</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {details.genres?.map((genre, i) => (
                      <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-sm text-white">{genre}</span>
                    ))}
                  </div>
                  <Button
                    onClick={() => { setCurrentSourceIndex(0); setPlayerReady(false); setIsPlaying(true); }}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-lg"
                  >
                    <Play className="w-6 h-6 fill-white" />
                    Watch Now
                  </Button>
                </div>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 sm:px-12 py-8">
              <p className="text-gray-300 leading-relaxed mb-8">{details.overview}</p>
              {details.cast?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">Cast</h3>
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {details.cast.map((actor, i) => (
                      <div key={i} className="flex-shrink-0 w-20 text-center">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-800 mb-2">
                          {actor.profile ? <img src={actor.profile} alt={actor.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Users className="w-8 h-8 text-gray-600" /></div>}
                        </div>
                        <p className="text-white text-xs font-medium truncate">{actor.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {details.similar?.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">More Like This <ChevronRight className="w-5 h-5" /></h3>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                    {details.similar.map(item => (
                      <div key={item.id} className="cursor-pointer transition-transform hover:scale-105" onClick={() => { onClose(); setTimeout(() => window.dispatchEvent(new CustomEvent('selectContent', { detail: item })), 100); }}>
                        {item.poster && <img src={item.poster} alt={item.title} className="w-full rounded-lg" />}
                        <p className="text-white text-xs mt-1 truncate">{item.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentDetailModal;

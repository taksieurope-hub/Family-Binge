import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Play, Star, Clock, Calendar, Users, ChevronRight, Loader2, Tv, Film, AlertCircle, RefreshCw, SkipForward, Captions } from 'lucide-react';
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

// Video sources - Reordered: VidSrc CC is now FIRST (Index 0)
const VIDEO_SOURCES = [
  { name: 'VidSrc CC', getUrl: (type, id, s, e) => type === 'series' ? `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}` : `https://vidsrc.cc/v2/embed/movie/${id}` },
  { name: 'VidSrc XYZ', getUrl: (type, id, s, e) => type === 'series' ? `https://vidsrc.xyz/embed/tv/${id}/${s}/${e}` : `https://vidsrc.xyz/embed/movie/${id}` },
  { name: 'VidSrc Pro', getUrl: (type, id, s, e) => type === 'series' ? `https://vidsrc.pro/embed/tv/${id}/${s}/${e}` : `https://vidsrc.pro/embed/movie/${id}` },
  { name: 'VidSrc ICU', getUrl: (type, id, s, e) => type === 'series' ? `https://vidsrc.icu/embed/tv/${id}/${s}/${e}` : `https://vidsrc.icu/embed/movie/${id}` },
  { name: '2Embed', getUrl: (type, id, s, e) => type === 'series' ? `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}` : `https://www.2embed.cc/embed/${id}` },
  { name: 'SuperEmbed', getUrl: (type, id, s, e) => type === 'series' ? `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${s}&e=${e}` : `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1` },
  { name: 'Smashy', getUrl: (type, id, s, e) => type === 'series' ? `https://player.smashy.stream/tv/${id}?s=${s}&e=${e}` : `https://player.smashy.stream/movie/${id}` },
  { name: 'MoviesAPI', getUrl: (type, id, s, e) => type === 'series' ? `https://moviesapi.club/tv/${id}-${s}-${e}` : `https://moviesapi.club/movie/${id}` },
];



const ContentDetailModal = ({ content, onClose, onPlayVideo }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [isAutoSwitching, setIsAutoSwitching] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const iframeRef = useRef(null);
  const autoSwitchTimeoutRef = useRef(null);
  const shouldAutoPlayRef = useRef(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!content) return;
      setLoading(true);
      try {
        const api = content.type === 'series' ? seriesAPI : movieAPI;
        const res = await api.getDetails(content.id);
        const data = res.data;
        setDetails(data);
        
        // Check history
        const history = getWatchHistory();
        const saved = history.find(h => h.id === content.id && h.type === content.type);
        
        let initialSeason = 1;
        let initialEpisode = 1;

        if (saved) {
          initialSeason = saved.season || 1;
          initialEpisode = saved.episode || 1;
          setSelectedSeason(initialSeason);
          setSelectedEpisode(initialEpisode);
        }

        saveToWatchHistory(data, initialSeason, initialEpisode, 0);
        window.dispatchEvent(new Event('watchHistoryUpdated'));
        shouldAutoPlayRef.current = true;

      } catch (error) {
        console.error('Error fetching details:', error);
        shouldAutoPlayRef.current = false;
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
    
    return () => {
      if (autoSwitchTimeoutRef.current) {
        clearTimeout(autoSwitchTimeoutRef.current);
      }
    };
  }, [content]);

  // Auto-play: fires after details state is committed to DOM
  useEffect(() => {
    if (details && shouldAutoPlayRef.current) {
      shouldAutoPlayRef.current = false;
      setCurrentSourceIndex(0);
      setPlayerReady(false);
      setIsAutoSwitching(true);
      setIsPlaying(true);
    }
  }, [details]);

  // Auto-switch to next server logic
  useEffect(() => {
    if (isPlaying && isAutoSwitching && !playerReady) {
      autoSwitchTimeoutRef.current = setTimeout(() => {
        if (!playerReady && currentSourceIndex < VIDEO_SOURCES.length - 1) {
          console.log(`${VIDEO_SOURCES[currentSourceIndex].name} not responding, trying ${VIDEO_SOURCES[currentSourceIndex + 1].name}...`);
          setCurrentSourceIndex(prev => prev + 1);
        }
      }, 5000); 
    }
    
    return () => {
      if (autoSwitchTimeoutRef.current) {
        clearTimeout(autoSwitchTimeoutRef.current);
      }
    };
  }, [isPlaying, currentSourceIndex, isAutoSwitching, playerReady]);

  // --- NEW: HANDLE NEXT LOGIC ---
  const handleNext = () => {
    if (!details) return;

    if (details.type === 'series') {
      const nextEpisode = selectedEpisode + 1;
      setSelectedEpisode(nextEpisode);
      
      setCurrentSourceIndex(0); // Reset to VidSrc CC
      setPlayerReady(false);
      setIsAutoSwitching(true);
      
      saveToWatchHistory(details, selectedSeason, nextEpisode, 0);
      window.dispatchEvent(new Event('watchHistoryUpdated'));
    } else {
      // Movie: Select first similar
      if (details.similar && details.similar.length > 0) {
        const nextMovie = details.similar[0];
        onClose();
        setTimeout(() => {
           window.dispatchEvent(new CustomEvent('selectContent', { detail: nextMovie }));
        }, 100);
      }
    }
  };

  const handleToggleSubtitles = () => {
    setSubtitlesEnabled(!subtitlesEnabled);
    // Toggling this will force a re-render of the iframe due to the 'key' prop update
  };

  if (!content) return null;

  const handlePlayTrailer = () => {
    if (details?.youtube_id) {
      onPlayVideo(details.youtube_id);
    }
  };

  const handleWatchNow = () => {
    setIsPlaying(true);
    setCurrentSourceIndex(0);
    setPlayerReady(false);
    setIsAutoSwitching(true);
    
    if (details) {
      saveToWatchHistory(details, selectedSeason, selectedEpisode, 0);
      window.dispatchEvent(new Event('watchHistoryUpdated'));
    }
  };

  const handleIframeLoad = () => {
    setPlayerReady(true);
    setIsAutoSwitching(false);
    if (autoSwitchTimeoutRef.current) {
      clearTimeout(autoSwitchTimeoutRef.current);
    }
  };

  const tryNextServer = () => {
    if (currentSourceIndex < VIDEO_SOURCES.length - 1) {
      setCurrentSourceIndex(prev => prev + 1);
      setPlayerReady(false);
    }
  };

  const getStreamUrl = () => {
    if (!details) return null;
    const source = VIDEO_SOURCES[currentSourceIndex];
    let url = source.getUrl(details.type, details.id, selectedSeason, selectedEpisode);
    
    // Attempt to append subtitle param if supported (generic approach)
    // Note: Most embeds handle this internally via their own UI, 
    // but this ensures the React state is tracked.
    if (!subtitlesEnabled) {
      // Some players accept ?caption=false or similar, 
      // primarily this state update forces the key refresh below
    }
    
    return url;
  };

  // Full screen player view
  if (isPlaying) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/95 to-transparent border-b border-white/5">
          {/* Left: Title */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-1.5 bg-purple-600/80 rounded-lg flex-shrink-0">
              {details?.type === 'series' ? <Tv className="w-4 h-4 text-white" /> : <Film className="w-4 h-4 text-white" />}
            </div>
            <div className="min-w-0">
              <h2 className="text-white font-semibold text-sm truncate">{details?.title}</h2>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{details?.type === 'series' ? `Season ${selectedSeason} · Episode ${selectedEpisode}` : details?.year}</span>
                <span className="text-gray-600">·</span>
                <span className="text-purple-400 font-medium">{VIDEO_SOURCES[currentSourceIndex].name}</span>
                {!playerReady && isAutoSwitching && (
                  <span className="flex items-center gap-1 text-yellow-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Connecting...
                  </span>
                )}
                {playerReady && <span className="text-green-400">● Live</span>}
              </div>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Episode selector for series */}
            {details?.type === 'series' && (
              <div className="hidden sm:flex items-center gap-1.5">
                <select
                  value={selectedSeason}
                  onChange={(e) => {
                    const newSeason = Number(e.target.value);
                    setSelectedSeason(newSeason);
                    setCurrentSourceIndex(0);
                    setPlayerReady(false);
                    setIsAutoSwitching(true);
                    saveToWatchHistory(details, newSeason, selectedEpisode, 0);
                    window.dispatchEvent(new Event('watchHistoryUpdated'));
                  }}
                  className="bg-white/10 text-white px-2.5 py-1.5 rounded-lg border border-white/15 text-xs font-medium cursor-pointer hover:bg-white/20 transition-colors"
                >
                  {Array.from({ length: details?.seasons || 1 }, (_, i) => (
                    <option key={i + 1} value={i + 1} className="bg-gray-900">Season {i + 1}</option>
                  ))}
                </select>
                <select
                  value={selectedEpisode}
                  onChange={(e) => {
                    const newEpisode = Number(e.target.value);
                    setSelectedEpisode(newEpisode);
                    setCurrentSourceIndex(0);
                    setPlayerReady(false);
                    setIsAutoSwitching(true);
                    saveToWatchHistory(details, selectedSeason, newEpisode, 0);
                    window.dispatchEvent(new Event('watchHistoryUpdated'));
                  }}
                  className="bg-white/10 text-white px-2.5 py-1.5 rounded-lg border border-white/15 text-xs font-medium cursor-pointer hover:bg-white/20 transition-colors"
                >
                  {Array.from({ length: 50 }, (_, i) => (
                    <option key={i + 1} value={i + 1} className="bg-gray-900">Ep {i + 1}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Next episode/movie */}
            <Button
              onClick={handleNext}
              className="hidden sm:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border-0 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
            >
              <SkipForward className="w-3.5 h-3.5" />
              Next
            </Button>

            {/* Subtitle toggle */}
            <button
              onClick={handleToggleSubtitles}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                subtitlesEnabled
                  ? 'bg-purple-600/50 border border-purple-500/40 text-white'
                  : 'bg-white/10 border border-white/10 text-gray-400 hover:text-white hover:bg-white/20'
              }`}
            >
              <Captions className="w-3.5 h-3.5" />
              CC
            </button>

            {/* Server switcher - compact pill buttons */}
            <div className="hidden sm:flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
              {VIDEO_SOURCES.slice(0, 4).map((src, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentSourceIndex(i);
                    setPlayerReady(false);
                    setIsAutoSwitching(false);
                  }}
                  title={src.name}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    i === currentSourceIndex
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  S{i + 1}
                </button>
              ))}
              {currentSourceIndex >= 4 && (
                <span className="px-2.5 py-1 bg-purple-600 text-white rounded text-xs font-medium">
                  S{currentSourceIndex + 1}
                </span>
              )}
              <button
                onClick={tryNextServer}
                disabled={currentSourceIndex >= VIDEO_SOURCES.length - 1}
                title="Try next server"
                className="px-2 py-1 text-gray-400 hover:text-white hover:bg-white/10 rounded text-xs transition-colors disabled:opacity-30"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={() => setIsPlaying(false)}
              className="p-2 bg-white/10 hover:bg-red-500/80 rounded-lg transition-colors"
              title="Close player"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Player */}
        <div className="flex-1 bg-black relative">
          {!playerReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10">
              <div className="relative">
                <Loader2 className="w-14 h-14 text-purple-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-purple-600/20" />
                </div>
              </div>
              <p className="text-white mt-5 font-medium">
                {isAutoSwitching ? `Trying ${VIDEO_SOURCES[currentSourceIndex].name}...` : `Loading ${VIDEO_SOURCES[currentSourceIndex].name}...`}
              </p>
              {isAutoSwitching && currentSourceIndex < VIDEO_SOURCES.length - 1 && (
                <p className="text-gray-500 text-sm mt-1">Auto-switching servers if needed</p>
              )}
              {/* Server dots */}
              <div className="flex gap-2 mt-5">
                {VIDEO_SOURCES.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i < currentSourceIndex ? 'bg-gray-600' : i === currentSourceIndex ? 'bg-purple-500 scale-125' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
          <iframe
            ref={iframeRef}
            key={`${details?.id}-${selectedSeason}-${selectedEpisode}-${currentSourceIndex}-${subtitlesEnabled}`}
            src={getStreamUrl()}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture"
            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
            title={details?.title}
            onLoad={handleIframeLoad}
          />
        </div>
      </div>
    );
  }

  // --- DETAILS VIEW (Fallback) ---
  return (
    <div 
      className="fixed inset-0 z-[90] bg-black/95 overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-screen">
        <button
          onClick={onClose}
          className="fixed top-4 right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {loading && (
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
          </div>
        )}

        {!loading && details && (
          <div onClick={(e) => e.stopPropagation()}>
             <div className="relative h-[50vh] sm:h-[60vh]">
              {details.backdrop ? (
                <img src={details.backdrop} alt={details.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-900" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12">
                <div className="max-w-4xl">
                  <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">{details.title}</h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-6">
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
                        <Users className="w-4 h-4" />
                        <span>{details.seasons} Seasons</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {details.genres?.map((genre, index) => (
                      <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-sm text-white">{genre}</span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <Button
                      onClick={handleWatchNow}
                      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-lg"
                    >
                      <Play className="w-6 h-6 fill-white" />
                      Resume
                    </Button>
                    <Button
                      onClick={handlePlayTrailer}
                      disabled={!details.youtube_id}
                      variant="outline"
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30 px-8 py-6 text-lg rounded-lg disabled:opacity-50"
                    >
                      <Play className="w-6 h-6" />
                      Trailer
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-12 py-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  {details.tagline && (
                    <p className="text-purple-400 italic text-lg mb-4">"{details.tagline}"</p>
                  )}
                  <h3 className="text-xl font-bold text-white mb-4">Overview</h3>
                  <p className="text-gray-300 leading-relaxed">{details.overview}</p>

                  {details.cast && details.cast.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-bold text-white mb-4">Cast</h3>
                      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {details.cast.map((actor, index) => (
                          <div key={index} className="flex-shrink-0 w-24 text-center">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-800 mb-2">
                              {actor.profile ? (
                                <img src={actor.profile} alt={actor.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                  <Users className="w-8 h-8" />
                                </div>
                              )}
                            </div>
                            <p className="text-white text-sm font-medium truncate">{actor.name}</p>
                            <p className="text-gray-500 text-xs truncate">{actor.character}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="hidden md:block">
                  {details.poster && <img src={details.poster} alt={details.title} className="w-full rounded-xl shadow-2xl" />}
                </div>
              </div>

              {details.similar && details.similar.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    More Like This <ChevronRight className="w-5 h-5" />
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                    {details.similar.map((item) => (
                      <div
                        key={item.id}
                        className="cursor-pointer transition-transform hover:scale-105"
                        onClick={() => {
                          onClose();
                          setTimeout(() => {
                            window.dispatchEvent(new CustomEvent('selectContent', { detail: item }));
                          }, 100);
                        }}
                      >
                        {item.poster && <img src={item.poster} alt={item.title} className="w-full rounded-lg" />}
                        <p className="text-white text-sm mt-2 truncate">{item.title}</p>
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
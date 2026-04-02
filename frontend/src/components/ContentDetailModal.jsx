import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Play, Star, Clock, Calendar, Users, ChevronRight, Loader2, Tv, Film, AlertCircle, RefreshCw, SkipForward, Captions, Share2, Check } from 'lucide-react';
import { Button } from './ui/button';
import { movieAPI, seriesAPI } from '../services/api';
import { auth } from '../services/firebase';

const getWatchHistoryKey = () => {
  const uid = auth.currentUser?.uid || 'guest';
  return "familybinge_watch_history_" + uid;
};

export const getWatchHistory = () => {
  try {
    const history = localStorage.getItem(getWatchHistoryKey());
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
    localStorage.setItem(getWatchHistoryKey(), JSON.stringify(history.slice(0, 20)));
  } catch (e) { console.error('Error saving watch history:', e); }
};

export const removeFromWatchHistory = (id, type) => {
  try {
    const history = getWatchHistory().filter(h => !(h.id === id && h.type === type));
    localStorage.setItem(getWatchHistoryKey(), JSON.stringify(history));
  } catch (e) { console.error('Error removing from watch history:', e); }
};

const VIDEO_SOURCES = [
  { name: 'VidSrc CC',     getUrl: (type, id, s, e) => type === 'series' ? `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}` : `https://vidsrc.cc/v2/embed/movie/${id}` },
  { name: 'VidSrc Pro',    getUrl: (type, id, s, e) => type === 'series' ? `https://vidsrc.pro/embed/tv/${id}/${s}/${e}` : `https://vidsrc.pro/embed/movie/${id}` },
  { name: 'Embed.su',      getUrl: (type, id, s, e) => type === 'series' ? `https://embed.su/embed/tv/${id}/${s}/${e}` : `https://embed.su/embed/movie/${id}` },
  { name: 'VidSrc XYZ',    getUrl: (type, id, s, e) => type === 'series' ? `https://vidsrc.xyz/embed/tv/${id}/${s}/${e}` : `https://vidsrc.xyz/embed/movie/${id}` },
  { name: 'Smashy',        getUrl: (type, id, s, e) => type === 'series' ? `https://player.smashy.stream/tv/${id}?s=${s}&e=${e}` : `https://player.smashy.stream/movie/${id}` },
  { name: 'MultiEmbed',    getUrl: (type, id, s, e) => type === 'series' ? `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${s}&e=${e}` : `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1` },
  { name: 'NontonGo',      getUrl: (type, id, s, e) => type === 'series' ? `https://www.NontonGo.net/embed/tv/${id}/${s}/${e}` : `https://www.NontonGo.net/embed/movie/${id}` },
  { name: 'VidSrc NL',     getUrl: (type, id, s, e) => type === 'series' ? `https://vidsrc.nl/embed/tv/${id}/${s}/${e}` : `https://vidsrc.nl/embed/movie/${id}` },
  { name: '2Embed',        getUrl: (type, id, s, e) => type === 'series' ? `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}` : `https://www.2embed.cc/embed/${id}` },
  { name: 'AutoEmbed',     getUrl: (type, id, s, e) => type === 'series' ? `https://player.autoembed.cc/embed/tv/${id}/${s}/${e}` : `https://player.autoembed.cc/embed/movie/${id}` },
  { name: 'MoviesAPI',     getUrl: (type, id, s, e) => type === 'series' ? `https://moviesapi.club/tv/${id}-${s}-${e}` : `https://moviesapi.club/movie/${id}` },
  { name: 'SuperEmbed',    getUrl: (type, id, s, e) => type === 'series' ? `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}` : `https://multiembed.mov/?video_id=${id}&tmdb=1` },
];


const ContentDetailModal = ({ content, onClose, onPlayVideo, accessStatus, onExpiredClick }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [isAutoSwitching, setIsAutoSwitching] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const [watchCountdown, setWatchCountdown] = useState(null);
  const watchCountdownRef = useRef(null);
  const [shareCopied, setShareCopied] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const iframeRef = useRef(null);
  const playerContainerRef = useRef(null);
  const autoSwitchTimeoutRef = useRef(null);
  const shouldAutoPlayRef = useRef(false);

  // Fullscreen helper
  const enterFullscreen = useCallback(() => {
    const el = playerContainerRef.current;
    if (!el) return;
    try {
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
    } catch (e) { console.log('Fullscreen not available'); }
  }, []);



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
        shouldAutoPlayRef.current = false;

      } catch (error) {
        console.error('Error fetching details:', error);
        shouldAutoPlayRef.current = false;
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();

    return () => {
      if (autoSwitchTimeoutRef.current) clearTimeout(autoSwitchTimeoutRef.current);
    };
  }, [content]);



  const handleWatchNow = () => {
  if (accessStatus === 'expired') {
    onClose();
    if (onExpiredClick) onExpiredClick();
    return;
  }
  setIsPlaying(true);
  setCurrentSourceIndex(0);
  setPlayerReady(false);
  setIsAutoSwitching(true);
  if (details) {
    saveToWatchHistory(details, selectedSeason, selectedEpisode, 0);
    window.dispatchEvent(new Event('watchHistoryUpdated'));
  }
  setWatchCountdown(5);
  let count = 5;
  watchCountdownRef.current = setInterval(() => {
    count -= 1;
    setWatchCountdown(count);
    if (count <= 0) {
      clearInterval(watchCountdownRef.current);
      setWatchCountdown(null);
    }
  }, 1000);
};

  const handleShare = async () => {
    const text = `Check out ${details?.title} on Family Binge! Watch it here: https://familybinge.co.za`;
    if (navigator.share) {
      try {
        await navigator.share({ title: details?.title, text, url: `https://familybinge.co.za` });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(text);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  const handlePlayTrailer = () => {
    if (details?.youtube_id) onPlayVideo(details.youtube_id);
  };


  const getStreamUrl = () => {
    if (!details) return null;
    const source = VIDEO_SOURCES[currentSourceIndex];
    return source.getUrl(details.type, details.id, selectedSeason, selectedEpisode);
  };

  const handleIframeLoad = () => {
    if (autoSwitchTimeoutRef.current) clearTimeout(autoSwitchTimeoutRef.current);
    setPlayerReady(true);
    setIsAutoSwitching(false);
    setTimeout(() => enterFullscreen(), 300);  };

  // Auto-switch to next source after 8 seconds if not ready
  useEffect(() => {
    if (!isPlaying) return;
    if (playerReady) return;
    if (autoSwitchTimeoutRef.current) clearTimeout(autoSwitchTimeoutRef.current);
    autoSwitchTimeoutRef.current = setTimeout(() => {
      if (!playerReady) {
        const next = currentSourceIndex + 1;
        if (next < VIDEO_SOURCES.length) {
          setCurrentSourceIndex(next);
          setPlayerReady(false);
          setIsAutoSwitching(true);
        } else {
          setIsAutoSwitching(false);
          setPlayerReady(false);
          setCurrentSourceIndex(-1);
        }
      }
    }, 8000);
    return () => { if (autoSwitchTimeoutRef.current) clearTimeout(autoSwitchTimeoutRef.current); };
  }, [isPlaying, currentSourceIndex, playerReady]);


  if (isPlaying) {
    return (
      <div ref={playerContainerRef} className="fixed inset-0 z-[100] bg-black flex flex-col">
        {/* Minimal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/95 to-transparent border-b border-white/5">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-1.5 bg-purple-600/80 rounded-lg flex-shrink-0">
              {details?.type === 'series' ? <Tv className="w-4 h-4 text-white" /> : <Film className="w-4 h-4 text-white" />}
            </div>
            <div className="min-w-0">
              <h2 className="text-white font-semibold text-sm truncate">{details?.title}</h2>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{details?.type === 'series' ? `Season ${selectedSeason} Â· Episode ${selectedEpisode}` : details?.year}</span>
                <span className="text-gray-600">Â·</span>
                <span className="text-purple-400 font-medium">Auto</span>
                {!playerReady && (
                  <span className="flex items-center gap-1 text-yellow-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Finding best server...
                  </span>
                )}
                {playerReady && <span className="text-green-400">â— Playing</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {details?.type === 'series' && (
              <div className="hidden sm:flex items-center gap-1.5">
                <select value={selectedSeason} onChange={(e) => {
                  const ns = Number(e.target.value);
                  setSelectedSeason(ns);
                  setCurrentSourceIndex(0);
                  setPlayerReady(false);
                  setIsAutoSwitching(true);
                              saveToWatchHistory(details, ns, selectedEpisode, 0);
                  window.dispatchEvent(new Event('watchHistoryUpdated'));
                }} className="bg-white/10 text-white px-2.5 py-1.5 rounded-lg border border-white/15 text-xs font-medium cursor-pointer hover:bg-white/20">
                  {Array.from({ length: details?.seasons || 1 }, (_, i) => <option key={i+1} value={i+1} className="bg-gray-900">Season {i+1}</option>)}
                </select>
                <select value={selectedEpisode} onChange={(e) => {
                  const ne = Number(e.target.value);
                  setSelectedEpisode(ne);
                  setCurrentSourceIndex(0);
                  setPlayerReady(false);
                  setIsAutoSwitching(true);
                              saveToWatchHistory(details, selectedSeason, ne, 0);
                  window.dispatchEvent(new Event('watchHistoryUpdated'));
                }} className="bg-white/10 text-white px-2.5 py-1.5 rounded-lg border border-white/15 text-xs font-medium cursor-pointer hover:bg-white/20">
                  {Array.from({ length: 50 }, (_, i) => <option key={i+1} value={i+1} className="bg-gray-900">Ep {i+1}</option>)}
                </select>
              </div>
            )}

            <button onClick={() => { setIsPlaying(false); }} className="p-2 bg-white/10 hover:bg-red-500/80 rounded-lg transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Player Area */}
        <div className="flex-1 bg-black relative">
          {!playerReady && currentSourceIndex !== -1 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10">
              <Loader2 className="w-14 h-14 text-purple-500 animate-spin" />
              <p className="text-white mt-5 font-medium">Connecting to best server...</p>
            </div>
          )}
          {currentSourceIndex === -1 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10 text-center px-6">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <Film className="w-10 h-10 text-gray-500" />
              </div>
              <h2 className="text-white text-2xl font-bold mb-3">Content Not Available</h2>
              <p className="text-gray-400 text-sm max-w-md">This title is not yet available on our database. We are working on adding it in the near future.</p>
              <button onClick={() => { setIsPlaying(false); }} className="mt-8 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors">
                Go Back
              </button>
            </div>
          )}

          <iframe
            ref={iframeRef}
            key={`${details?.id}-${selectedSeason}-${selectedEpisode}-${currentSourceIndex}`}
            src={getStreamUrl()}
            className="w-full h-full border-0"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture"
            sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
            title={details?.title}
            onLoad={handleIframeLoad}
          />

          {/* Auto Next Episode Overlay */}
          {showNextOverlay && details?.type === 'series' && (
            <div className="absolute bottom-8 right-8 z-20 bg-black/90 border border-white/10 rounded-2xl p-5 flex flex-col gap-3 min-w-[260px] shadow-2xl">
              <p className="text-gray-400 text-xs uppercase tracking-widest">Up Next</p>
              <p className="text-white font-semibold">
                {details?.title} â€” Episode {selectedEpisode + 1}
              </p>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div
                  className="bg-purple-500 h-1.5 rounded-full transition-all duration-1000"
                  style={{ width: `${((AUTO_NEXT_COUNTDOWN - nextCountdown) / AUTO_NEXT_COUNTDOWN) * 100}%` }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleNext}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold py-2 px-4 rounded-xl transition-colors"
                >
                  Play Now
                </button>
                <button
                  onClick={handleDismissNext}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm py-2 px-4 rounded-xl transition-colors"
                >
                  Cancel ({nextCountdown}s)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- DETAILS VIEW ---
  return (
    <div className="fixed inset-0 z-[90] bg-black/95 overflow-y-auto" onClick={onClose}>
      <div className="min-h-screen">
        <button onClick={onClose} className="fixed top-4 right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
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
                    <Button onClick={handleWatchNow} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-lg">
  <Play className="w-6 h-6 fill-white" />
  Watch Now
</Button>
                    <Button onClick={handlePlayTrailer} disabled={!details.youtube_id} variant="outline" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30 px-8 py-6 text-lg rounded-lg disabled:opacity-50">
                      <Play className="w-6 h-6" />
                      Trailer
                    </Button>
                    <Button onClick={handleShare} variant="outline" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30 px-8 py-6 text-lg rounded-lg">
                      {shareCopied ? <Check className="w-6 h-6 text-green-400" /> : <Share2 className="w-6 h-6" />}
                      {shareCopied ? "Copied!" : "Share"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-12 py-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  {details.tagline && <p className="text-purple-400 italic text-lg mb-4">"{details.tagline}"</p>}
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
                      <div key={item.id} className="cursor-pointer transition-transform hover:scale-105" onClick={() => {
                        onClose();
                        setTimeout(() => { window.dispatchEvent(new CustomEvent('selectContent', { detail: item })); }, 100);
                      }}>
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




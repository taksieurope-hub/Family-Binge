import React, { useState, useEffect } from 'react';
import { X, Play, Loader2, Tv, Film } from 'lucide-react';
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
    if (existingIndex >= 0) history[existingIndex] = historyItem;
    else history.unshift(historyItem);
    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
  } catch (e) { console.error('Error saving watch history:', e); }
};

// Add this missing export so other files don't break
export const removeFromWatchHistory = (id, type) => {
  try {
    const history = getWatchHistory().filter(h => !(h.id === id && h.type === type));
    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(history));
  } catch (e) { console.error('Error removing from watch history:', e); }
};

const ContentDetailModal = ({ content, onClose, onPlayVideo }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

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

        saveToWatchHistory(data, selectedSeason, selectedEpisode, 0);
        window.dispatchEvent(new Event('watchHistoryUpdated'));
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [content]);

  const handleWatchNow = () => {
    setIsPlaying(true);
    if (details) {
      saveToWatchHistory(details, selectedSeason, selectedEpisode, 0);
      window.dispatchEvent(new Event('watchHistoryUpdated'));
    }
  };

  const handleNext = () => {
    if (!details) return;
    if (details.type === 'series') {
      const nextEpisode = selectedEpisode + 1;
      setSelectedEpisode(nextEpisode);
      saveToWatchHistory(details, selectedSeason, nextEpisode, 0);
      window.dispatchEvent(new Event('watchHistoryUpdated'));
    } else if (details.similar && details.similar.length > 0) {
      onClose();
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('selectContent', { detail: details.similar[0] }));
      }, 100);
    }
  };

  if (isPlaying && details) {
    const streamUrl = details.type === 'series'
      ? `https://vidsrc.cc/v2/embed/tv/${details.id}/${selectedSeason}/${selectedEpisode}`
      : `https://vidsrc.cc/v2/embed/movie/${details.id}`;

    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/95 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-purple-600 rounded-lg">
              {details.type === 'series' ? <Tv className="w-4 h-4 text-white" /> : <Film className="w-4 h-4 text-white" />}
            </div>
            <div>
              <h2 className="text-white font-semibold">{details.title}</h2>
              <p className="text-gray-400 text-xs">
                {details.type === 'series' ? `S${selectedSeason} E${selectedEpisode}` : details.year}
              </p>
            </div>
          </div>
          <button onClick={() => setIsPlaying(false)} className="p-2 bg-white/10 hover:bg-red-500 rounded-lg">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="flex-1 bg-black relative">
          <iframe
            src={streamUrl}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen"
            title={details.title}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[90] bg-black/95 overflow-y-auto" onClick={onClose}>
      <div className="min-h-screen" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="fixed top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full">
          <X className="w-6 h-6 text-white" />
        </button>

        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
          </div>
        ) : details && (
          <div>
            <div className="relative h-[50vh] sm:h-[60vh]">
              {details.backdrop && <img src={details.backdrop} alt={details.title} className="w-full h-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h1 className="text-4xl md:text-6xl font-bold text-white">{details.title}</h1>
                <div className="flex gap-4 mt-4">
                  <Button onClick={handleWatchNow} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg">
                    <Play className="w-6 h-6 mr-2 fill-white" /> Watch Now
                  </Button>
                  {details.youtube_id && (
                    <Button onClick={() => onPlayVideo(details.youtube_id)} variant="outline">
                      Trailer
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentDetailModal;

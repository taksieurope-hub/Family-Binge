import React, { useState, useEffect } from 'react';
import { X, Play, Loader2 } from 'lucide-react';
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
      id: content.id,
      title: content.title,
      poster: content.poster,
      backdrop: content.backdrop,
      type: content.type,
      year: content.year,
      rating: content.rating || 0,
      season,
      episode,
      progress,
      lastWatched: Date.now(),
    };
    if (existingIndex >= 0) history[existingIndex] = historyItem;
    else history.unshift(historyItem);
    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
  } catch (e) { console.error('Error saving watch history:', e); }
};

export const removeFromWatchHistory = (id, type) => {
  try {
    const history = getWatchHistory().filter(h => !(h.id === id && h.type === type));
    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(history));
  } catch (e) { console.error('Error removing from watch history:', e); }
};

const ContentDetailModal = ({ content, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!content) return;
      setLoading(true);
      try {
        let data = content;
        if (content.id) {
          const api = content.type === 'series' ? seriesAPI : movieAPI;
          const res = await api.getDetails(content.id);
          data = { ...content, ...(res?.data || res) };
        }
        setDetails(data);
        saveToWatchHistory(data);
      } catch (error) {
        console.error('Error fetching details:', error);
        setDetails(content);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [content]);

  const handleWatchNow = () => {
    if (!details?.id) return;
    setIsPlaying(true);
  };

  if (isPlaying && details) {
    const streamUrl = details.type === 'series'
      ? `https://vidsrc.cc/v2/embed/tv/${details.id}/1/1`
      : `https://vidsrc.cc/v2/embed/movie/${details.id}`;

    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 bg-black/90">
          <h2 className="text-white font-semibold truncate">{details.title}</h2>
          <button onClick={() => setIsPlaying(false)} className="p-2 hover:bg-red-600 rounded">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="flex-1 bg-black">
          <iframe
            src={streamUrl}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen"
            sandbox="allow-scripts allow-same-origin"
            referrerPolicy="no-referrer"
            title={details.title}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-zinc-900 rounded-2xl max-w-4xl w-full overflow-hidden" onClick={e => e.stopPropagation()}>
        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
          </div>
        ) : details ? (
          <div>
            <div className="relative h-80 bg-black">
              {details.backdrop && <img src={details.backdrop} alt={details.title} className="w-full h-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
              <button onClick={onClose} className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-black rounded-full">
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="p-8">
              <h1 className="text-4xl font-bold text-white mb-4">{details.title}</h1>
              <div className="flex gap-4 text-sm text-gray-400 mb-6">
                {details.year && <span>{details.year}</span>}
                {details.rating > 0 && <span>? {details.rating}</span>}
              </div>

              <Button 
                onClick={handleWatchNow}
                className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-6 text-lg mb-8"
              >
                <Play className="w-6 h-6 mr-2 fill-white" /> Watch Now
              </Button>

              {details.overview && <p className="text-gray-300 leading-relaxed">{details.overview}</p>}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-red-400">Could not load details</div>
        )}
      </div>
    </div>
  );
};

export default ContentDetailModal;

import React, { useState, useEffect } from 'react';
import { X, Loader2, Play } from 'lucide-react';
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
    const historyItem = {
      id: content.id,
      title: content.title || content.name,
      poster: content.poster,
      backdrop: content.backdrop,
      type: content.type || 'movie',
      season,
      episode,
      progress,
      timestamp: Date.now()
    };
    const existingIndex = history.findIndex(h => h.id === content.id && h.type === content.type);
    if (existingIndex > -1) history[existingIndex] = historyItem;
    else history.unshift(historyItem);
    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
  } catch (e) {}
};

export const removeFromWatchHistory = (id, type) => {
  try {
    const history = getWatchHistory().filter(h => !(h.id === id && h.type === type));
    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(history));
  } catch (e) {}
};

const ContentDetailModal = ({ content, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!content?.id) return;
      setLoading(true);
      try {
        let data;
        if (content.type === 'series' || content.media_type === 'tv') {
          data = await seriesAPI.getDetails(content.id);
        } else {
          data = await movieAPI.getDetails(content.id);
        }
        setDetails(data);
      } catch (err) {
        console.error(err);
        setDetails(content);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [content]);

  const streamUrl = details ? (
    (details.type === 'series' || details.media_type === 'tv')
      ? `https://vidsrc.cc/v2/embed/tv/${details.id}/1/1`
      : `https://vidsrc.cc/v2/embed/movie/${details.id}`
  ) : '';

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-white" />
      </div>
    );
  }

  if (isPlaying && details) {
    return (
      <div className="fixed inset-0 bg-black z-[10000] flex flex-col">
        <div className="flex justify-end p-4 bg-black">
          <button 
            onClick={() => { setIsPlaying(false); onClose(); }}
            className="text-white hover:text-red-500"
          >
            <X className="w-8 h-8" />
          </button>
        </div>
        <iframe
          src={streamUrl}
          className="flex-1 w-full border-0"
          allowFullScreen
          allow="autoplay; encrypted-media"
          sandbox="allow-scripts allow-same-origin"
          referrerPolicy="no-referrer"
          title="Family Binge Player"
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-zinc-900 rounded-3xl overflow-hidden">
        <button onClick={onClose} className="absolute top-6 right-6 text-white z-10">
          <X className="w-8 h-8" />
        </button>
        {details && (
          <>
            {details.backdrop && <img src={details.backdrop} className="w-full h-96 object-cover" alt={details.title} />}
            <div className="p-8">
              <h1 className="text-5xl font-bold text-white">{details.title || details.name}</h1>
              <p className="text-white/80 mt-2">{details.overview}</p>
              <button 
                onClick={() => setIsPlaying(true)}
                className="mt-8 bg-purple-600 hover:bg-purple-700 px-10 py-4 rounded-2xl text-white font-semibold flex items-center gap-3 text-lg"
              >
                <Play className="w-6 h-6" /> Play Now (VidSrc CC)
              </button>
              <p className="text-xs text-white/50 mt-6">Some titles may not be available on VidSrc CC right now — try another show if you see 404.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContentDetailModal;

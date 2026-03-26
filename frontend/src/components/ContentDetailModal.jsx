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
      id: content.id,
      title: content.title,
      poster: content.poster,
      backdrop: content.backdrop,
      type: content.type,
      season,
      episode,
      progress,
      timestamp: Date.now()
    };
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

const ContentDetailModal = ({ content, onClose, onPlayVideo }) => {
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
        console.error("Detail fetch failed, using fallback", err);
        setDetails(content); // fallback to what we have
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [content]);

  // AUTO full-screen play the moment modal opens (exactly what you asked for)
  useEffect(() => {
    if (!loading && details && !isPlaying) {
      setIsPlaying(true);
      const streamUrl = details.type === 'series' || details.media_type === 'tv'
        ? `https://vidsrc.cc/v2/embed/tv/${details.id}/1/1`
        : `https://vidsrc.cc/v2/embed/movie/${details.id}`;
      
      const playerWindow = window.open(streamUrl, '_blank', 'fullscreen=yes,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=1920,height=1080');
      if (playerWindow) {
        playerWindow.focus();
      }
      // close modal after opening player
      setTimeout(onClose, 800);
    }
  }, [loading, details, isPlaying, onClose]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999]">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[9999] p-4">
      <div className="max-w-4xl w-full bg-zinc-900 rounded-3xl overflow-hidden">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-6 right-6 text-white z-10">
          <X className="w-8 h-8" />
        </button>

        {details && (
          <div className="relative">
            {/* Backdrop */}
            {details.backdrop && (
              <img 
                src={details.backdrop} 
                alt={details.title}
                className="w-full h-96 object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-5xl font-bold text-white mb-2">{details.title || details.name}</h1>
              <div className="flex gap-4 text-white/80 mb-6">
                <span>{details.year || new Date(details.release_date || details.first_air_date).getFullYear()}</span>
                <span>? {details.rating || details.vote_average}</span>
              </div>
              <p className="text-white/90 max-w-2xl text-lg leading-relaxed">{details.overview}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentDetailModal;

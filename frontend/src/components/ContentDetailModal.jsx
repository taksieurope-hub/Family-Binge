import React, { useState, useEffect } from 'react';
import { X, Loader2, Play, ChevronLeft, ChevronRight } from 'lucide-react';
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
    const historyItem = { id: content.id, title: content.title || content.name, poster: content.poster, backdrop: content.backdrop, type: content.type || 'movie', season, episode, progress, timestamp: Date.now() };
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
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!content?.id) return;
      setLoading(true);
      try {
        const data = content.type === 'series' || content.media_type === 'tv' 
          ? await seriesAPI.getDetails(content.id) 
          : await movieAPI.getDetails(content.id);
        setDetails(data);
        if (data.seasons && data.seasons.length > 0) setSelectedSeason(data.seasons[0].season_number || 1);
      } catch (err) {
        setDetails(content);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [content]);

  const streamUrl = details ? (
    (details.type === 'series' || details.media_type === 'tv')
      ? `https://vidsrc.cc/v2/embed/tv/${details.id}/${selectedSeason}/${selectedEpisode}`
      : `https://vidsrc.cc/v2/embed/movie/${details.id}`
  ) : '';

  if (loading) return <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-white" /></div>;

  if (isPlaying && details) {
    return (
      <div className="fixed inset-0 bg-black z-[10000] flex flex-col">
        <div className="flex justify-end p-4 bg-black">
          <button onClick={() => { setIsPlaying(false); onClose(); }} className="text-white hover:text-red-500"><X className="w-8 h-8" /></button>
        </div>
        {(details.type === 'series' || details.media_type === 'tv') && (
          <div className="bg-zinc-900 p-3 flex items-center gap-4 justify-center border-b">
            <select value={selectedSeason} onChange={e => { setSelectedSeason(Number(e.target.value)); setSelectedEpisode(1); }} className="bg-zinc-800 text-white px-4 py-2 rounded-lg">
              {details.seasons?.map(s => <option key={s.season_number} value={s.season_number}>S{s.season_number}</option>) || <option>S1</option>}
            </select>
            <select value={selectedEpisode} onChange={e => setSelectedEpisode(Number(e.target.value))} className="bg-zinc-800 text-white px-4 py-2 rounded-lg">
              {Array.from({length: 30}, (_,i) => i+1).map(ep => <option key={ep} value={ep}>E{ep}</option>)}
            </select>
            <button onClick={() => selectedEpisode > 1 && setSelectedEpisode(prev => prev-1)}><ChevronLeft className="w-6 h-6 text-white" /></button>
            <button onClick={() => setSelectedEpisode(prev => prev+1)}><ChevronRight className="w-6 h-6 text-white" /></button>
          </div>
        )}
        <iframe src={streamUrl} className="flex-1 w-full border-0" allowFullScreen allow="autoplay; encrypted-media" sandbox="allow-scripts allow-same-origin" referrerPolicy="no-referrer" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-zinc-900 rounded-3xl overflow-hidden">
        <button onClick={onClose} className="absolute top-6 right-6 text-white z-10"><X className="w-8 h-8" /></button>
        {details && (
          <>
            {details.backdrop && <img src={details.backdrop} className="w-full h-96 object-cover" alt="" />}
            <div className="p-8">
              <h1 className="text-5xl font-bold text-white">{details.title || details.name}</h1>
              <p className="text-white/80 mt-2">{details.overview}</p>
              <button onClick={() => setIsPlaying(true)} className="mt-8 bg-purple-600 hover:bg-purple-700 px-10 py-4 rounded-2xl text-white font-semibold flex items-center gap-3 text-lg"><Play className="w-6 h-6" /> Play Now</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContentDetailModal;

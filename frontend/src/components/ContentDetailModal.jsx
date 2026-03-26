import React, { useState, useEffect } from 'react';
import { X, Play, Loader2, Tv, Film } from 'lucide-react';
import { Button } from './ui/button';
import { movieAPI, seriesAPI } from '../services/api';

const ContentDetailModal = ({ content, onClose, onPlayVideo }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!content) return;
      setLoading(true);
      try {
        const api = content.type === 'series' ? seriesAPI : movieAPI;
        const res = await api.getDetails(content.id);
        setDetails(res);
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
  };

  if (isPlaying && details) {
    const streamUrl = details.type === 'series' 
      ? `https://vidsrc.cc/v2/embed/tv/${details.id}/1/1`
      : `https://vidsrc.cc/v2/embed/movie/${details.id}`;

    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 bg-black/90">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-purple-600 rounded">
              {details.type === 'series' ? <Tv className="w-4 h-4" /> : <Film className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-white font-semibold">{details.title || details.name}</h2>
            </div>
          </div>
          <button onClick={() => setIsPlaying(false)} className="p-2 hover:bg-red-500 rounded">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="flex-1 bg-black">
          <iframe
            src={streamUrl}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen"
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-zinc-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        {loading ? (
          <div className="h-96 flex items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
          </div>
        ) : details && (
          <>
            <div className="relative h-80">
              {details.backdrop && <img src={details.backdrop} alt={details.title} className="w-full h-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
              <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black">
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="p-8">
              <h1 className="text-4xl font-bold text-white mb-2">{details.title || details.name}</h1>
              <div className="flex gap-4 text-sm text-gray-400 mb-6">
                <span>{details.year}</span>
                <span>? {details.rating}</span>
                <span>{details.genres?.join(", ") || ""}</span>
              </div>

              <div className="flex gap-4 mb-8">
                <Button onClick={handleWatchNow} className="bg-white text-black px-8 py-3 flex items-center gap-2 hover:bg-white/90">
                  <Play className="w-5 h-5 fill-black" /> Watch Now
                </Button>
                {details.youtube_id && (
                  <Button onClick={() => onPlayVideo(details.youtube_id)} variant="outline" className="px-8 py-3">
                    Trailer
                  </Button>
                )}
              </div>

              <p className="text-gray-300 leading-relaxed mb-8">{details.overview}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContentDetailModal;

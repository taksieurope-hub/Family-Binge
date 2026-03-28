import React from 'react';
import { X } from 'lucide-react';

const VideoPlayer = ({ videoId, onClose }) => {
  if (!videoId) return null;

  // YouTube IDs are 11 chars, movie IDs from TMDB are numeric
  const isYouTube = videoId && !/^\d+$/.test(videoId);
  const src = isYouTube
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
    : `https://vidsrc.xyz/embed/movie/${videoId}`;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>
      <div
        className="w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <iframe
          src={src}
          title="Video Player"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 text-sm">
        Press ESC or click outside to close
      </div>
    </div>
  );
};

export default VideoPlayer;

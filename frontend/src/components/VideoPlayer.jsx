import React from 'react';
import { X } from 'lucide-react';

const VideoPlayer = ({ videoId, onClose }) => {
  if (!videoId) return null;

  return (
    <div
      className="fixed inset-0 z-[110] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-[#181818] rounded-full flex items-center justify-center hover:bg-[#2f2f2f] transition-colors"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      <div
        className="w-full max-w-5xl aspect-video rounded overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title="Trailer"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#757575] text-xs">
        Press ESC or click outside to close
      </p>
    </div>
  );
};

export default VideoPlayer;

import React, { useState, useEffect } from 'react';
import { Play, X, Clock, Film, Tv } from 'lucide-react';
import { getWatchHistory, removeFromWatchHistory } from './ContentDetailModal';

const ContinueWatchingSection = ({ onSelectContent }) => {
  const [watchHistory, setWatchHistory] = useState([]);

  useEffect(() => {
    const loadHistory = () => {
      const history = getWatchHistory();
      setWatchHistory(history);
    };

    loadHistory();
    
    // Listen for storage changes (from other tabs or components)
    const handleStorageChange = () => loadHistory();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('watchHistoryUpdated', handleStorageChange);
    
    // Poll for updates when component is visible
    const interval = setInterval(loadHistory, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('watchHistoryUpdated', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleRemove = (e, id, type) => {
    e.stopPropagation();
    removeFromWatchHistory(id, type);
    setWatchHistory(prev => prev.filter(h => !(h.id === id && h.type === type)));
  };

  const handleClick = (item) => {
    onSelectContent({
      id: item.id,
      title: item.title,
      poster: item.poster,
      backdrop: item.backdrop,
      type: item.type,
      year: item.year,
      rating: item.rating,
    });
  };

  const formatTimeAgo = (timestamp) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (watchHistory.length === 0) return null;

  return (
    <section className="py-8 px-4 sm:px-8 lg:px-16">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-purple-500" />
        <h2 className="text-2xl font-bold text-white">Continue Watching</h2>
        <span className="text-gray-500 text-sm">({watchHistory.length})</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {watchHistory.map((item) => (
          <div
            key={`${item.type}-${item.id}`}
            data-testid={`continue-watching-${item.id}`}
            className="group relative bg-gray-900 rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-purple-500"
            onClick={() => handleClick(item)}
          >
            {/* Poster */}
            <div className="relative aspect-[2/3]">
              {item.poster ? (
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  {item.type === 'series' ? (
                    <Tv className="w-12 h-12 text-gray-600" />
                  ) : (
                    <Film className="w-12 h-12 text-gray-600" />
                  )}
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center shadow-lg">
                  <Play className="w-7 h-7 text-white fill-white ml-1" />
                </div>
              </div>

              {/* Remove button */}
              <button
                onClick={(e) => handleRemove(e, item.id, item.type)}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                data-testid={`remove-${item.id}`}
              >
                <X className="w-4 h-4 text-white" />
              </button>

              {/* Type badge */}
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-purple-600/90 rounded text-xs font-medium text-white">
                {item.type === 'series' ? 'Series' : 'Movie'}
              </div>

              {/* Progress bar placeholder - visual only */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                <div 
                  className="h-full bg-purple-500" 
                  style={{ width: `${Math.random() * 60 + 20}%` }}
                />
              </div>
            </div>

            {/* Info */}
            <div className="p-3">
              <h3 className="text-white font-medium text-sm truncate">{item.title}</h3>
              <div className="flex items-center justify-between mt-1">
                <span className="text-gray-400 text-xs">
                  {item.type === 'series' 
                    ? `S${item.season} E${item.episode}`
                    : item.year
                  }
                </span>
                <span className="text-gray-500 text-xs">{formatTimeAgo(item.lastWatched)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ContinueWatchingSection;
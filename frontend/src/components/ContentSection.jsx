import React, { useState, useEffect, useRef } from 'react';
import { Play, Star, ChevronLeft, ChevronRight, Film, Tv, Loader2, X, Clock } from 'lucide-react';
import { movieAPI, seriesAPI } from '../services/api';
import { getWatchHistory, removeFromWatchHistory } from './ContentDetailModal';

const ContentRow = ({ title, icon: Icon, items, onSelectContent, loading }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-600/30 rounded-lg">
            <Icon className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">{title}</h3>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600/30 rounded-lg">
            <Icon className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">{title}</h3>
        </div>
        <div className="hidden sm:flex gap-2">
          <button onClick={() => scroll('left')} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button onClick={() => scroll('right')} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4">
        {items.map((item) => (
          <div
            key={`${item.type}-${item.id}`}
            onClick={() => onSelectContent(item)}
            className="flex-shrink-0 w-40 sm:w-48 group cursor-pointer"
          >
            <div className="relative rounded-xl overflow-hidden mb-3 transition-transform duration-300 group-hover:scale-105">
              {item.poster ? (
                <img src={item.poster} alt={item.title} className="w-full h-60 sm:h-72 object-cover bg-gray-800" loading="lazy" />
              ) : (
                <div className="w-full h-60 sm:h-72 bg-gray-800 flex items-center justify-center">
                  <Film className="w-12 h-12 text-gray-600" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform shadow-lg shadow-purple-500/50">
                  <Play className="w-7 h-7 text-white fill-white ml-1" />
                </div>
              </div>

              {item.rating > 0 && (
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/60 rounded-lg">
                  <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                  <span className="text-white text-xs font-medium">{item.rating}</span>
                </div>
              )}

              <div className="absolute bottom-2 left-2 px-2 py-1 bg-purple-600/80 rounded text-xs text-white font-medium">
                {item.type === 'series' ? 'TV' : 'Movie'}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold text-sm truncate group-hover:text-purple-400 transition-colors">{item.title}</h4>
              <p className="text-gray-400 text-xs mt-1">{item.year}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Continue Watching Row - Newest first + easy permanent delete
const ContinueWatchingRow = ({ onSelectContent }) => {
  const [history, setHistory] = useState([]);

  const loadHistory = () => {
    let items = getWatchHistory();
    // Sort by last watched (newest first)
    items.sort((a, b) => b.lastWatched - a.lastWatched);
    setHistory(items);
  };

  useEffect(() => {
    loadHistory();

    const handleUpdate = () => loadHistory();
    window.addEventListener('watchHistoryUpdated', handleUpdate);
    return () => window.removeEventListener('watchHistoryUpdated', handleUpdate);
  }, []);

  const handleRemove = (e, item) => {
    e.stopPropagation();
    removeFromWatchHistory(item.id, item.type);
    loadHistory(); // refresh list immediately
  };

  if (history.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-600/30 rounded-lg">
            <Clock className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">Continue Watching</h3>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4">
        {history.map((item) => (
          <div
            key={`continue-${item.type}-${item.id}`}
            onClick={() => onSelectContent(item)}
            className="flex-shrink-0 w-64 sm:w-80 group cursor-pointer relative"
          >
            <div className="relative rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-105">
              {item.backdrop || item.poster ? (
                <img
                  src={item.backdrop || item.poster}
                  alt={item.title}
                  className="w-full h-36 sm:h-44 object-cover bg-gray-800"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-36 sm:h-44 bg-gray-800 flex items-center justify-center">
                  <Film className="w-12 h-12 text-gray-600" />
                </div>
              )}

              {/* Remove Button - Always visible */}
              <button
                onClick={(e) => handleRemove(e, item)}
                className="absolute top-3 right-3 p-2 bg-black/80 hover:bg-red-600 rounded-full transition-colors z-20 shadow-lg"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                  <Play className="w-6 h-6 text-black fill-black ml-0.5" />
                </div>
              </div>

              {/* Info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                <h4 className="text-white font-semibold truncate text-sm">{item.title}</h4>
                <p className="text-gray-300 text-xs">
                  {item.type === 'series' 
                    ? `S${item.season} E${item.episode}` 
                    : item.year}
                </p>
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                <div
                  className="h-full bg-purple-600 transition-all"
                  style={{ width: `${item.progress || 30}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
const ContentSection = ({ type = 'movies', onSelectContent }) => {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);

  const Icon = type === 'movies' ? Film : Tv;

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const api = type === 'movies' ? movieAPI : seriesAPI;
        
        const [trendingRes, popularRes, topRatedRes] = await Promise.all([
          api.getTrending(1),
          api.getPopular(1),
          api.getTopRated(1),
        ]);

        setTrending(trendingRes.data.items || []);
        setPopular(popularRes.data.items || []);
        setTopRated(topRatedRes.data.items || []);
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [type]);

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Continue Watching - only show on movies section */}
        {type === 'movies' && <ContinueWatchingRow onSelectContent={onSelectContent} />}

        <ContentRow
          title={type === 'movies' ? 'Trending Movies' : 'Trending Series'}
          icon={Icon}
          items={trending}
          onSelectContent={onSelectContent}
          loading={loading}
        />

        <ContentRow
          title={type === 'movies' ? 'Popular Movies' : 'Popular Series'}
          icon={Icon}
          items={popular}
          onSelectContent={onSelectContent}
          loading={loading}
        />

        <ContentRow
          title={type === 'movies' ? 'Top Rated Movies' : 'Top Rated Series'}
          icon={Icon}
          items={topRated}
          onSelectContent={onSelectContent}
          loading={loading}
        />
      </div>
    </section>
  );
};

export default ContentSection;
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Star, ChevronLeft, ChevronRight, Film, Tv, Loader2, X, Clock } from 'lucide-react';
import { movieAPI, seriesAPI, bollywoodAPI } from '../services/api';
import { getWatchHistory, removeFromWatchHistory } from './ContentDetailModal';

const ContentCard = ({ item, onSelectContent }) => (
  <div
    key={`${item.type}-${item.id}`}
    onClick={() => onSelectContent(item)}
    className="group cursor-pointer"
  >
    <div className="relative rounded-xl overflow-hidden mb-2 transition-transform duration-300 group-hover:scale-105">
      {item.poster ? (
        <img src={item.poster} alt={item.title} className="w-full h-60 object-cover bg-gray-800" loading="lazy" />
      ) : (
        <div className="w-full h-60 bg-gray-800 flex items-center justify-center">
          <Film className="w-12 h-12 text-gray-600" />
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/30">
        <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
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
    <h4 className="text-white font-semibold text-sm truncate group-hover:text-purple-400 transition-colors">{item.title}</h4>
    <p className="text-gray-400 text-xs mt-1">{item.year}</p>
  </div>
);

const ContinueWatchingRow = ({ onSelectContent }) => {
  const [history, setHistory] = useState([]);
  const scrollRef = useRef(null);

  const loadHistory = () => {
    let items = getWatchHistory();
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
    loadHistory();
  };

  if (history.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-green-600/30 rounded-lg">
          <Clock className="w-5 h-5 text-green-400" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white">Continue Watching</h3>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4">
        {history.map((item) => (
          <div
            key={`continue-${item.type}-${item.id}`}
            onClick={() => onSelectContent(item)}
            className="flex-shrink-0 w-64 sm:w-80 group cursor-pointer relative"
          >
            <div className="relative rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-105">
              {item.backdrop || item.poster ? (
                <img src={item.backdrop || item.poster} alt={item.title} className="w-full h-36 sm:h-44 object-cover bg-gray-800" loading="lazy" />
              ) : (
                <div className="w-full h-36 sm:h-44 bg-gray-800 flex items-center justify-center">
                  <Film className="w-12 h-12 text-gray-600" />
                </div>
              )}
              <button onClick={(e) => handleRemove(e, item)} className="absolute top-3 right-3 p-2 bg-black/80 hover:bg-red-600 rounded-full transition-colors z-20 shadow-lg">
                <X className="w-5 h-5 text-white" />
              </button>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                  <Play className="w-6 h-6 text-black fill-black ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                <h4 className="text-white font-semibold truncate text-sm">{item.title}</h4>
                <p className="text-gray-300 text-xs">{item.type === 'series' ? `S${item.season} E${item.episode}` : item.year}</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                <div className="h-full bg-purple-600 transition-all" style={{ width: `${item.progress || 30}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContentSection = ({ type = 'movies', onSelectContent, filterMode }) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState('trending');
  const seenIds = useRef(new Set());
  const Icon = type === 'movies' ? Film : Tv;
  const targetTotal = type === 'movies' ? 1000 : 500;

  const getAPI = useCallback(() => {
    if (filterMode === 'bollywood') return bollywoodAPI;
    return type === 'movies' ? movieAPI : seriesAPI;
  }, [type, filterMode]);

  const fetchPage = useCallback(async (pageNum, tab, reset = false) => {
    const api = getAPI();
    try {
      let res;
      if (filterMode === 'bollywood' && type === 'movies') res = await api.getTrending(pageNum);
      else if (filterMode === 'hindi') res = await bollywoodAPI.getHindiSeries(pageNum);
      else if (tab === 'trending') res = await api.getTrending(pageNum);
      else if (tab === 'popular') res = await api.getPopular(pageNum);
      else res = await api.getTopRated(pageNum);

      const newItems = (res.data.items || []).filter(item => {
        const key = `${item.type}-${item.id}`;
        if (seenIds.current.has(key)) return false;
        seenIds.current.add(key);
        return true;
      });

      const totalPages = res.data.total_pages || 1;

      if (reset) {
        setItems(newItems);
      } else {
        setItems(prev => {
          const combined = [...prev, ...newItems];
          if (combined.length >= targetTotal) setHasMore(false);
          return combined;
        });
      }

      if (pageNum >= totalPages) setHasMore(false);
    } catch (e) {
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [getAPI, filterMode, type, targetTotal]);

  useEffect(() => {
    seenIds.current = new Set();
    setItems([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    fetchPage(1, activeTab, true);
  }, [type, filterMode, activeTab]);

  const loadMore = () => {
    if (loadingMore || !hasMore || items.length >= targetTotal) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPage(nextPage, activeTab);
  };

  const tabs = filterMode === 'bollywood' || filterMode === 'hindi'
    ? []
    : [
        { key: 'trending', label: 'Trending' },
        { key: 'popular', label: 'Popular' },
        { key: 'toprated', label: 'Top Rated' },
      ];

  const sectionTitle = filterMode === 'bollywood' ? 'Bollywood Movies'
    : filterMode === 'hindi' ? 'Hindi Series'
    : type === 'movies' ? 'Movies' : 'Series';

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {type === 'movies' && <ContinueWatchingRow onSelectContent={onSelectContent} />}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600/30 rounded-lg">
              <Icon className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">{sectionTitle}</h2>
            {items.length > 0 && (
              <span className="text-gray-400 text-sm">({items.length})</span>
            )}
          </div>
          {tabs.length > 0 && (
            <div className="flex gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {items.map(item => (
                <ContentCard key={`${item.type}-${item.id}`} item={item} onSelectContent={onSelectContent} />
              ))}
            </div>

            {hasMore && items.length < targetTotal && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
                >
                  {loadingMore ? <><Loader2 className="w-5 h-5 animate-spin" /> Loading...</> : 'Load More'}
                </button>
              </div>
            )}

            {!hasMore && items.length > 0 && (
              <p className="text-center text-gray-500 mt-10 text-sm">{items.length} titles loaded</p>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ContentSection;

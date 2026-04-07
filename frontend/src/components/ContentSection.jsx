import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, Star, Film, Tv, Loader2, X, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { getWatchHistory, removeFromWatchHistory } from "./ContentDetailModal";
import * as api from "../api";

const ContentCard = ({ item, onSelectContent }) => (
  <div onClick={() => onSelectContent(item)} className="group cursor-pointer">
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
        {item.type === "series" ? "TV" : "Movie"}
      </div>
    </div>
    <h4 className="text-white font-semibold text-sm truncate group-hover:text-purple-400 transition-colors">{item.title}</h4>
    <p className="text-gray-400 text-xs mt-1">{item.year}</p>
  </div>
);

const ContinueWatchingRow = ({ onSelectContent }) => {
  const [history, setHistory] = useState([]);

  const loadHistory = () => {
    let items = getWatchHistory();
    items.sort((a, b) => b.lastWatched - a.lastWatched);
    setHistory(items);
  };

  useEffect(() => {
    loadHistory();
    const handleUpdate = () => loadHistory();
    window.addEventListener("watchHistoryUpdated", handleUpdate);
    return () => window.removeEventListener("watchHistoryUpdated", handleUpdate);
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
      <div className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4">
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
                <p className="text-gray-300 text-xs">{item.type === "series" ? `S${item.season} E${item.episode}` : item.year}</p>
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

// Wraps an api.js call and forces every item to have the correct type
const makeTypedFetch = (apiFn, forcedType) => async (page) => {
  const res = await apiFn(page);
  const items = (res.data.items || res.data.results || []).map(item => ({
    ...item,
    type: forcedType,
    title: item.title || item.name || "Untitled",
  }));
  return { data: { items, total_pages: res.data.total_pages || 1 } };
};

const CategoryRow = ({ title, fetchFn, onSelectContent, icon }) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const seenIds = useRef(new Set());

  useEffect(() => {
    setLoading(true);
    fetchFn(1)
      .then(res => {
        const allItems = [];
        (res.data.items || []).forEach(item => {
          const key = `${item.type}-${item.id}`;
          if (!seenIds.current.has(key)) {
            seenIds.current.add(key);
            allItems.push(item);
          }
        });
        setItems(allItems);
        setHasMore((res.data.total_pages || 1) > 1);
      })
      .catch(() => setHasMore(false))
      .finally(() => setLoading(false));
  }, []);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFn(nextPage)
      .then(res => {
        const newItems = (res.data.items || []).filter(item => {
          const key = `${item.type}-${item.id}`;
          if (seenIds.current.has(key)) return false;
          seenIds.current.add(key);
          return true;
        });
        setItems(prev => [...prev, ...newItems]);
        if (nextPage >= (res.data.total_pages || 1)) setHasMore(false);
      })
      .catch(() => setHasMore(false))
      .finally(() => setLoadingMore(false));
  }, [loadingMore, hasMore, page, fetchFn]);

  const handleShowAll = () => {
    setExpanded(true);
    if (hasMore) loadMore();
  };

  const displayed = expanded ? items : items.slice(0, 12);

  if (!loading && items.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && <div className="p-2 bg-purple-600/30 rounded-lg">{icon}</div>}
          <h3 className="text-xl sm:text-2xl font-bold text-white">{title}</h3>
          {items.length > 0 && <span className="text-gray-400 text-sm">({items.length})</span>}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {displayed.map(item => (
              <ContentCard key={`${item.type}-${item.id}`} item={item} onSelectContent={onSelectContent} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 mt-6">
            {!expanded && items.length > 12 && (
              <button
                onClick={handleShowAll}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-2"
              >
                <ChevronDown className="w-4 h-4" /> Show All ({items.length})
              </button>
            )}
            {expanded && hasMore && (
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2"
              >
                {loadingMore ? <><Loader2 className="w-4 h-4 animate-spin" /> Loading...</> : "Load More"}
              </button>
            )}
            {expanded && (
              <button
                onClick={() => setExpanded(false)}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-2"
              >
                <ChevronUp className="w-4 h-4" /> Collapse
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const MOVIE_CATEGORIES = [
  { key: "popular",     title: "Top Popular",        fn: makeTypedFetch(api.getPopularMovies,    "movie") },
  { key: "oscars",      title: "The Oscars 2026",    fn: makeTypedFetch(api.getMoviesOscars,     "movie") },
  { key: "action",      title: "Action",             fn: makeTypedFetch(api.getMoviesAction,     "movie") },
  { key: "animation",   title: "Animation",          fn: makeTypedFetch(api.getMoviesAnimation,  "movie") },
  { key: "horror",      title: "Horror",             fn: makeTypedFetch(api.getMoviesHorror,     "movie") },
  { key: "newly",       title: "Just Released",      fn: makeTypedFetch(api.getMoviesNewlyAdded, "movie") },
  { key: "southafrica", title: "South Africa",       fn: makeTypedFetch(api.getMoviesSouthAfrica,"movie") },
  { key: "africa",      title: "Africa's Homegrown", fn: makeTypedFetch(api.getMoviesAfrica,     "movie") },
  { key: "netflix",     title: "Netflix",            fn: makeTypedFetch(api.getMoviesNetflix,    "movie") },
  { key: "hbo",         title: "HBO",                fn: makeTypedFetch(api.getMoviesHBO,        "movie") },
  { key: "prime",       title: "Prime Video",        fn: makeTypedFetch(api.getMoviesPrime,      "movie") },
  { key: "disney",      title: "Disney+",            fn: makeTypedFetch(api.getMoviesDisney,     "movie") },
  { key: "korea",       title: "K-Cinema",           fn: makeTypedFetch(api.getMoviesKorea,      "movie") },
  { key: "tyler",       title: "Tyler Perry",        fn: makeTypedFetch(api.getMoviesTylerPerry, "movie") },
  { key: "documentary", title: "Documentary",        fn: makeTypedFetch(api.getMoviesDocumentary,"movie") },
  { key: "anime",       title: "Anime",              fn: makeTypedFetch(api.getMoviesAnime,      "movie") },
  { key: "romance",     title: "Romance",            fn: makeTypedFetch(api.getMoviesRomance,    "movie") },
  { key: "nollywood",   title: "Nollywood",          fn: makeTypedFetch(api.getMoviesNollywood,  "movie") },
  { key: "hollywood",   title: "Hollywood",          fn: makeTypedFetch(api.getMoviesHollywood,  "movie") },
  { key: "classics",    title: "Classic",            fn: makeTypedFetch(api.getMoviesClassics,   "movie") },
  { key: "franchise",   title: "Franchise",          fn: makeTypedFetch(api.getMoviesFranchise,  "movie") },
];

const SERIES_CATEGORIES = [
  { key: "popular",     title: "Top Popular",        fn: makeTypedFetch(api.getPopularSeries,    "series") },
  { key: "action",      title: "Action",             fn: makeTypedFetch(api.getSeriesAction,     "series") },
  { key: "animation",   title: "Animation",          fn: makeTypedFetch(api.getSeriesAnimation,  "series") },
  { key: "horror",      title: "Horror",             fn: makeTypedFetch(api.getSeriesHorror,     "series") },
  { key: "newly",       title: "Just Released",      fn: makeTypedFetch(api.getSeriesNewlyAdded, "series") },
  { key: "southafrica", title: "South Africa",       fn: makeTypedFetch(api.getSeriesSouthAfrica,"series") },
  { key: "africa",      title: "Africa's Homegrown", fn: makeTypedFetch(api.getSeriesAfrica,     "series") },
  { key: "netflix",     title: "Netflix",            fn: makeTypedFetch(api.getSeriesNetflix,    "series") },
  { key: "hbo",         title: "HBO",                fn: makeTypedFetch(api.getSeriesHBO,        "series") },
  { key: "prime",       title: "Prime Video",        fn: makeTypedFetch(api.getSeriesPrime,      "series") },
  { key: "disney",      title: "Disney+",            fn: makeTypedFetch(api.getSeriesDisney,     "series") },
  { key: "korea",       title: "K-Cinema",           fn: makeTypedFetch(api.getSeriesKorea,      "series") },
  { key: "tyler",       title: "Tyler Perry",        fn: makeTypedFetch(api.getSeriesTylerPerry, "series") },
  { key: "documentary", title: "Documentary",        fn: makeTypedFetch(api.getSeriesDocumentary,"series") },
  { key: "anime",       title: "Anime",              fn: makeTypedFetch(api.getSeriesAnime,      "series") },
  { key: "romance",     title: "Romance",            fn: makeTypedFetch(api.getSeriesRomance,    "series") },
  { key: "nollywood",   title: "Nollywood",          fn: makeTypedFetch(api.getSeriesNollywood,  "series") },
  { key: "hollywood",   title: "Hollywood",          fn: makeTypedFetch(api.getSeriesHollywood,  "series") },
  { key: "classics",    title: "Classic",            fn: makeTypedFetch(api.getSeriesClassics,   "series") },
  { key: "franchise",   title: "Franchise",          fn: makeTypedFetch(api.getSeriesFranchise,  "series") },
];

const ContentSection = ({ type = "movies", onSelectContent, filterMode }) => {
  const categories = type === "movies" ? MOVIE_CATEGORIES : SERIES_CATEGORIES;

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {type === "movies" && <ContinueWatchingRow onSelectContent={onSelectContent} />}
        {categories.map(cat => (
          <CategoryRow
            key={cat.key}
            title={cat.title}
            fetchFn={cat.fn}
            onSelectContent={onSelectContent}
          />
        ))}
      </div>
    </section>
  );
};

export default ContentSection;

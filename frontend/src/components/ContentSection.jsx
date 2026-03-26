import React, { useState, useEffect, useRef } from 'react';
import { Play, Info, Star, ChevronLeft, ChevronRight, Film, Tv, Loader2, X, Clock, Plus, ThumbsUp } from 'lucide-react';
import { movieAPI, seriesAPI } from '../services/api';
import { getWatchHistory, removeFromWatchHistory } from './ContentDetailModal';

const GENRE_MAP_IDS = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 27: "Horror",
  9648: "Mystery", 10749: "Romance", 878: "Science Fiction", 53: "Thriller",
  10752: "War", 37: "Western", 10759: "Action & Adventure", 10765: "Sci-Fi & Fantasy"
};

// Netflix-style card with hover expansion
const NetflixCard = ({ item, onSelectContent }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex-shrink-0 relative cursor-pointer group"
      style={{ width: '160px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelectContent(item)}
    >
      {/* Poster */}
      <div className="relative rounded-sm overflow-hidden transition-transform duration-200 group-hover:scale-105 group-hover:z-10 shadow-lg">
        {item.poster ? (
          <img
            src={item.poster}
            alt={item.title}
            className="w-full object-cover bg-[#2f2f2f]"
            style={{ height: '240px' }}
            loading="lazy"
          />
        ) : (
          <div className="w-full bg-[#2f2f2f] flex items-center justify-center" style={{ height: '240px' }}>
            <Film className="w-10 h-10 text-[#757575]" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

        {/* Play button on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Play className="w-6 h-6 text-black fill-black ml-0.5" />
          </div>
        </div>

        {/* Rating badge */}
        {item.rating > 0 && (
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[#46d369] text-xs font-bold">{Math.round(item.rating * 10)}% Match</span>
          </div>
        )}
      </div>

      {/* Title below card */}
      <p className="text-[#e5e5e5] text-xs mt-2 truncate px-0.5 group-hover:text-white transition-colors">{item.title}</p>
      <p className="text-[#757575] text-xs px-0.5">{item.year}</p>
    </div>
  );
};

// Horizontal scrollable row
const ContentRow = ({ title, items, onSelectContent, loading }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    if (scrollRef.current) {
      setCanScrollLeft(scrollRef.current.scrollLeft > 0);
      setCanScrollRight(scrollRef.current.scrollLeft < scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 10);
    }
  };

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -500 : 500, behavior: 'smooth' });
      setTimeout(updateScrollState, 300);
    }
  };

  if (loading) {
    return (
      <div className="mb-8">
        <div className="h-6 w-48 shimmer rounded mb-4" />
        <div className="flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 rounded-sm shimmer" style={{ width: '160px', height: '240px' }} />
          ))}
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <div className="mb-8 group/row">
      <h2 className="text-white text-lg font-semibold mb-3 px-4 md:px-12">{title}</h2>
      <div className="relative">
        {/* Left arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-20 w-12 bg-black/50 hover:bg-black/70 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
        )}

        {/* Right arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-20 w-12 bg-black/50 hover:bg-black/70 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        )}

        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-4 md:px-12 pb-2"
        >
          {items.map(item => (
            <NetflixCard key={`${item.type}-${item.id}`} item={item} onSelectContent={onSelectContent} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Continue Watching row
const ContinueWatchingRow = ({ onSelectContent }) => {
  const [history, setHistory] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    setHistory(getWatchHistory());
    const handler = () => setHistory(getWatchHistory());
    window.addEventListener('watchHistoryUpdated', handler);
    return () => window.removeEventListener('watchHistoryUpdated', handler);
  }, []);

  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir === 'left' ? -500 : 500, behavior: 'smooth' });

  if (history.length === 0) return null;

  return (
    <div className="mb-8 group/row">
      <h2 className="text-white text-lg font-semibold mb-3 px-4 md:px-12">Continue Watching</h2>
      <div className="relative">
        <div ref={scrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide px-4 md:px-12 pb-2">
          {history.map(item => (
            <div
              key={`continue-${item.id}`}
              onClick={() => onSelectContent(item)}
              className="flex-shrink-0 cursor-pointer group"
              style={{ width: '280px' }}
            >
              <div className="relative rounded-sm overflow-hidden transition-transform duration-200 group-hover:scale-105">
                {item.backdrop || item.poster ? (
                  <img
                    src={item.backdrop || item.poster}
                    alt={item.title}
                    className="w-full object-cover bg-[#2f2f2f]"
                    style={{ height: '158px' }}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full bg-[#2f2f2f] flex items-center justify-center" style={{ height: '158px' }}>
                    <Film className="w-10 h-10 text-[#757575]" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                  </div>
                </div>
                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#757575]">
                  <div className="h-full bg-[#e50914]" style={{ width: `${item.progress || 15}%` }} />
                </div>
                <button
                  onClick={e => { e.stopPropagation(); removeFromWatchHistory(item.id, item.type); setHistory(getWatchHistory()); }}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
              <div className="mt-2 px-0.5">
                <p className="text-white text-sm font-medium truncate">{item.title}</p>
                <p className="text-[#757575] text-xs">{item.type === 'series' ? `S${item.season} · E${item.episode}` : item.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Genre filter tabs
const GENRES = [
  { id: 'all', label: 'All' },
  { id: 28, label: 'Action' },
  { id: 35, label: 'Comedy' },
  { id: 18, label: 'Drama' },
  { id: 27, label: 'Horror' },
  { id: 878, label: 'Sci-Fi' },
  { id: 53, label: 'Thriller' },
  { id: 10749, label: 'Romance' },
  { id: 16, label: 'Animation' },
  { id: 99, label: 'Documentary' },
  { id: 14, label: 'Fantasy' },
  { id: 80, label: 'Crime' },
  { id: 12, label: 'Adventure' },
  { id: 10751, label: 'Family' },
];

const ContentSection = ({ type = 'movies', onSelectContent }) => {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState('all');
  const genreRef = useRef(null);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const api = type === 'movies' ? movieAPI : seriesAPI;
        const [r1, r2, r3] = await Promise.all([api.getPopular(1), api.getPopular(2), api.getPopular(3)]);
        const combined = [...(r1.data.items || []), ...(r2.data.items || []), ...(r3.data.items || [])];
        const seen = new Set();
        setAllItems(combined.filter(item => { if (seen.has(item.id)) return false; seen.add(item.id); return true; }));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [type]);

  const filteredItems = activeGenre === 'all'
    ? allItems
    : allItems.filter(item =>
        item.genre_ids?.includes(activeGenre) ||
        item.genres?.includes(GENRE_MAP_IDS[activeGenre])
      );

  // Group into rows of 20
  const rows = [];
  for (let i = 0; i < filteredItems.length; i += 20) {
    rows.push(filteredItems.slice(i, i + 20));
  }

  const rowTitles = type === 'movies'
    ? ['Popular Movies', 'Top Picks', 'More to Watch']
    : ['Popular Shows', 'Trending Series', 'More to Binge'];

  return (
    <section className="py-8 bg-[#141414]">
      {/* Genre tabs */}
      <div className="flex items-center gap-2 px-4 md:px-12 mb-6 overflow-x-auto scrollbar-hide pb-2" ref={genreRef}>
        {GENRES.map(genre => (
          <button
            key={genre.id}
            onClick={() => setActiveGenre(genre.id)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-sm text-sm font-medium transition-all border ${
              activeGenre === genre.id
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-white border-white/30 hover:border-white hover:bg-white/10'
            }`}
          >
            {genre.label}
          </button>
        ))}
      </div>

      {/* Continue Watching */}
      {type === 'movies' && <ContinueWatchingRow onSelectContent={onSelectContent} />}

      {loading ? (
        <>
          <ContentRow title="" items={[]} onSelectContent={onSelectContent} loading={true} />
          <ContentRow title="" items={[]} onSelectContent={onSelectContent} loading={true} />
        </>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20 px-4">
          <p className="text-[#757575] text-lg">No {type} found in this genre</p>
          <button onClick={() => setActiveGenre('all')} className="mt-4 px-6 py-2 bg-white text-black font-medium rounded hover:bg-white/90 transition-colors">
            Show All
          </button>
        </div>
      ) : (
        rows.map((row, i) => (
          <ContentRow
            key={i}
            title={rowTitles[i] || `More ${type === 'movies' ? 'Movies' : 'Shows'}`}
            items={row}
            onSelectContent={onSelectContent}
            loading={false}
          />
        ))
      )}
    </section>
  );
};

export default ContentSection;

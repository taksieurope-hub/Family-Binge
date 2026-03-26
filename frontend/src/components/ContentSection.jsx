import React, { useState, useEffect, useRef } from 'react';
import { Play, Star, ChevronLeft, ChevronRight, Film, Tv, Loader2, X, Clock } from 'lucide-react';
import { movieAPI, seriesAPI } from '../services/api';
import { getWatchHistory, removeFromWatchHistory } from './ContentDetailModal';

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
  { id: 9648, label: 'Mystery' },
  { id: 36, label: 'History' },
];

// Netflix-style card
const ContentCard = ({ item, onSelectContent }) => (
  <div
    className="flex-shrink-0 cursor-pointer group"
    style={{ width: '154px' }}
    onClick={() => onSelectContent(item)}
  >
    <div className="relative rounded overflow-hidden transition-transform duration-200 group-hover:scale-105 group-hover:z-10">
      {item.poster ? (
        <img src={item.poster} alt={item.title} className="w-full object-cover bg-[#2f2f2f]" style={{ height: '230px' }} loading="lazy" />
      ) : (
        <div className="w-full bg-[#2f2f2f] flex items-center justify-center" style={{ height: '230px' }}>
          <Film className="w-10 h-10 text-[#757575]" />
        </div>
      )}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center">
          <Play className="w-5 h-5 text-black fill-black ml-0.5" />
        </div>
      </div>
      {item.rating > 0 && (
        <div className="absolute top-1.5 right-1.5 bg-black/70 rounded px-1.5 py-0.5 flex items-center gap-1">
          <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
          <span className="text-white text-xs">{item.rating}</span>
        </div>
      )}
    </div>
    <p className="text-[#e5e5e5] text-xs mt-1.5 truncate group-hover:text-white transition-colors px-0.5">{item.title}</p>
    <p className="text-[#757575] text-xs px-0.5">{item.year}</p>
  </div>
);

// Scrollable row
const ContentRow = ({ title, items, onSelectContent, loading }) => {
  const scrollRef = useRef(null);
  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir === 'left' ? -480 : 480, behavior: 'smooth' });

  if (loading) {
    return (
      <div className="mb-10">
        <div className="h-5 w-40 bg-[#2f2f2f] rounded mb-3 px-4 md:px-12" style={{ marginLeft: '3rem' }} />
        <div className="flex gap-2 px-4 md:px-12">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 rounded bg-[#2f2f2f]" style={{ width: '154px', height: '230px' }} />
          ))}
        </div>
      </div>
    );
  }

  if (!items?.length) return null;

  return (
    <div className="mb-10 group/row">
      <h2 className="text-white text-base font-semibold mb-3 px-4 md:px-12">{title}</h2>
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-4 z-20 w-10 bg-black/60 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-4 z-20 w-10 bg-black/60 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
        <div ref={scrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 px-4 md:px-12">
          {items.map(item => (
            <ContentCard key={`${item.type}-${item.id}`} item={item} onSelectContent={onSelectContent} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Continue Watching
const ContinueWatchingRow = ({ onSelectContent }) => {
  const [history, setHistory] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    setHistory(getWatchHistory());
    const handler = () => setHistory(getWatchHistory());
    window.addEventListener('watchHistoryUpdated', handler);
    return () => window.removeEventListener('watchHistoryUpdated', handler);
  }, []);

  if (!history.length) return null;

  return (
    <div className="mb-10 group/row">
      <h2 className="text-white text-base font-semibold mb-3 px-4 md:px-12 flex items-center gap-2">
        <Clock className="w-4 h-4 text-[#46d369]" /> Continue Watching
      </h2>
      <div className="relative">
        <div ref={scrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 px-4 md:px-12">
          {history.map(item => (
            <div
              key={`cw-${item.id}`}
              onClick={() => onSelectContent(item)}
              className="flex-shrink-0 cursor-pointer group"
              style={{ width: '260px' }}
            >
              <div className="relative rounded overflow-hidden transition-transform duration-200 group-hover:scale-105">
                {item.backdrop || item.poster ? (
                  <img src={item.backdrop || item.poster} alt={item.title} className="w-full object-cover bg-[#2f2f2f]" style={{ height: '146px' }} loading="lazy" />
                ) : (
                  <div className="w-full bg-[#2f2f2f] flex items-center justify-center" style={{ height: '146px' }}><Film className="w-10 h-10 text-[#757575]" /></div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); removeFromWatchHistory(item.id, item.type); setHistory(getWatchHistory()); }}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#757575]">
                  <div className="h-full bg-[#e50914]" style={{ width: `${item.progress || 15}%` }} />
                </div>
              </div>
              <p className="text-white text-xs font-medium mt-1.5 truncate">{item.title}</p>
              <p className="text-[#757575] text-xs">{item.type === 'series' ? `S${item.season} · E${item.episode}` : item.year}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

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
        // Fetch 5 pages = ~100 items
        const pages = await Promise.all([1,2,3,4,5].map(p => api.getPopular(p)));
        const combined = pages.flatMap(r => r.data.items || []);
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

  // Genre filter using genre_ids (now preserved in formatItem)
  const filtered = activeGenre === 'all'
    ? allItems
    : allItems.filter(item => item.genre_ids?.includes(activeGenre));

  const scrollGenres = (dir) => genreRef.current?.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });

  // Split into rows
  const rows = [];
  for (let i = 0; i < filtered.length; i += 20) rows.push(filtered.slice(i, i + 20));

  const rowTitles = type === 'movies'
    ? ['Popular Movies', 'Top Picks For You', 'New Releases', 'More Movies', 'Keep Watching']
    : ['Popular Series', 'Trending Now', 'Critically Acclaimed', 'More to Binge', 'Hidden Gems'];

  return (
    <section className="py-8 bg-[#141414]">
      {/* Genre tabs */}
      <div className="flex items-center gap-2 px-4 md:px-12 mb-6">
        <button onClick={() => scrollGenres('left')} className="flex-shrink-0 p-1 hover:bg-white/10 rounded-full transition-colors">
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>
        <div ref={genreRef} className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
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
        <button onClick={() => scrollGenres('right')} className="flex-shrink-0 p-1 hover:bg-white/10 rounded-full transition-colors">
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>

      {type === 'movies' && <ContinueWatchingRow onSelectContent={onSelectContent} />}

      {loading ? (
        <>
          <ContentRow title="" items={[]} onSelectContent={onSelectContent} loading={true} />
          <ContentRow title="" items={[]} onSelectContent={onSelectContent} loading={true} />
          <ContentRow title="" items={[]} onSelectContent={onSelectContent} loading={true} />
        </>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 px-4">
          <p className="text-[#757575] text-base">No {type} found in this genre</p>
          <button onClick={() => setActiveGenre('all')} className="mt-4 px-6 py-2 bg-white text-black font-medium rounded hover:bg-white/90 transition-colors text-sm">
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

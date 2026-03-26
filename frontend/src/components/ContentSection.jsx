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

const ContentCard = ({ item, onSelectContent }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="flex-shrink-0 cursor-pointer"
      style={{ width: '154px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelectContent(item)}
    >
      <div
        className="relative rounded-xl overflow-hidden transition-all duration-300"
        style={{
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          boxShadow: hovered ? '0 0 20px rgba(168,85,247,0.3), 0 8px 30px rgba(0,0,0,0.5)' : '0 2px 10px rgba(0,0,0,0.3)',
          border: hovered ? '1px solid rgba(168,85,247,0.4)' : '1px solid transparent',
        }}
      >
        {item.poster ? (
          <img src={item.poster} alt={item.title} className="w-full object-cover" style={{ height: '230px', background: '#1a1a24' }} loading="lazy" />
        ) : (
          <div className="w-full flex items-center justify-center" style={{ height: '230px', background: '#1a1a24' }}>
            <Film className="w-10 h-10 text-[#8b8aa0]" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 transition-opacity duration-300 flex items-center justify-center" style={{ opacity: hovered ? 1 : 0, background: 'rgba(10,10,15,0.5)' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}>
            <Play className="w-6 h-6 text-white fill-white ml-0.5" />
          </div>
        </div>

        {/* Rating */}
        {item.rating > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: 'rgba(10,10,15,0.85)' }}>
            <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
            <span className="text-white text-xs font-medium">{item.rating}</span>
          </div>
        )}

        {/* Type badge */}
        <div className="absolute bottom-2 left-2">
          <span className="badge badge-grad text-[9px] px-1.5 py-0.5">{item.type === 'series' ? 'TV' : 'Movie'}</span>
        </div>
      </div>
      <p className="text-[#f1f0ff] text-xs mt-2 truncate font-medium px-0.5">{item.title}</p>
      <p className="text-[#8b8aa0] text-xs px-0.5">{item.year}</p>
    </div>
  );
};

const ContentRow = ({ title, items, onSelectContent, loading }) => {
  const scrollRef = useRef(null);
  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir === 'left' ? -500 : 500, behavior: 'smooth' });

  if (loading) {
    return (
      <div className="mb-10">
        <div className="h-5 w-48 rounded-lg shimmer mb-4 mx-4 md:mx-12" />
        <div className="flex gap-3 px-4 md:px-12">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 rounded-xl shimmer" style={{ width: '154px', height: '230px' }} />
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
          className="absolute left-0 top-0 bottom-3 z-20 w-10 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity rounded-r-xl"
          style={{ background: 'linear-gradient(to right, rgba(10,10,15,0.9), transparent)' }}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-3 z-20 w-10 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity rounded-l-xl"
          style={{ background: 'linear-gradient(to left, rgba(10,10,15,0.9), transparent)' }}
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 px-4 md:px-12">
          {items.map(item => (
            <ContentCard key={`${item.type}-${item.id}`} item={item} onSelectContent={onSelectContent} />
          ))}
        </div>
      </div>
    </div>
  );
};

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
        <Clock className="w-4 h-4 text-purple-400" /> Continue Watching
      </h2>
      <div className="relative">
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 px-4 md:px-12">
          {history.map(item => (
            <div
              key={`cw-${item.id}`}
              onClick={() => onSelectContent(item)}
              className="flex-shrink-0 cursor-pointer group"
              style={{ width: '260px' }}
            >
              <div
                className="relative rounded-xl overflow-hidden transition-all duration-300 group-hover:scale-105"
                style={{ border: '1px solid rgba(168,85,247,0.1)' }}
              >
                {item.backdrop || item.poster ? (
                  <img src={item.backdrop || item.poster} alt={item.title} className="w-full object-cover" style={{ height: '146px', background: '#1a1a24' }} loading="lazy" />
                ) : (
                  <div className="w-full flex items-center justify-center" style={{ height: '146px', background: '#1a1a24' }}>
                    <Film className="w-10 h-10 text-[#8b8aa0]" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(10,10,15,0.5)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}>
                    <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                  </div>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); removeFromWatchHistory(item.id, item.type); setHistory(getWatchHistory()); }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(10,10,15,0.8)' }}
                >
                  <X className="w-3 h-3 text-white" />
                </button>
                {/* Progress */}
                <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className="h-full rounded-full" style={{ width: `${item.progress || 15}%`, background: 'linear-gradient(90deg, #a855f7, #ec4899)' }} />
                </div>
              </div>
              <p className="text-white text-xs font-semibold mt-2 truncate">{item.title}</p>
              <p className="text-[#8b8aa0] text-xs">{item.type === 'series' ? `S${item.season} · E${item.episode}` : item.year}</p>
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
        const pages = await Promise.all([1,2,3,4,5].map(p => api.getPopular(p)));
        const combined = pages.flatMap(r => r.data.items || []);
        const seen = new Set();
        setAllItems(combined.filter(item => { if (seen.has(item.id)) return false; seen.add(item.id); return true; }));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchContent();
  }, [type]);

  const filtered = activeGenre === 'all'
    ? allItems
    : allItems.filter(item => item.genre_ids?.includes(activeGenre));

  const scrollGenres = (dir) => genreRef.current?.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });

  const rows = [];
  for (let i = 0; i < filtered.length; i += 20) rows.push(filtered.slice(i, i + 20));

  const rowTitles = type === 'movies'
    ? ['Popular Movies', 'Top Picks For You', 'New Releases', 'More Movies', 'Hidden Gems']
    : ['Popular Series', 'Trending Now', 'Critically Acclaimed', 'More to Binge', 'Hidden Gems'];

  return (
    <section className="py-8" style={{ background: 'var(--bg)' }}>
      {/* Genre filter */}
      <div className="flex items-center gap-2 px-4 md:px-12 mb-6">
        <button onClick={() => scrollGenres('left')} className="flex-shrink-0 p-1.5 rounded-lg hover:bg-purple-500/10 transition-colors">
          <ChevronLeft className="w-4 h-4 text-[#8b8aa0]" />
        </button>
        <div ref={genreRef} className="flex gap-2 overflow-x-auto scrollbar-hide flex-1">
          {GENRES.map(genre => (
            <button
              key={genre.id}
              onClick={() => setActiveGenre(genre.id)}
              className="flex-shrink-0 px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={
                activeGenre === genre.id
                  ? { background: 'linear-gradient(135deg, #a855f7, #ec4899)', color: 'white', boxShadow: '0 0 15px rgba(168,85,247,0.3)' }
                  : { background: 'rgba(26,26,36,0.8)', color: '#8b8aa0', border: '1px solid rgba(168,85,247,0.15)' }
              }
            >
              {genre.label}
            </button>
          ))}
        </div>
        <button onClick={() => scrollGenres('right')} className="flex-shrink-0 p-1.5 rounded-lg hover:bg-purple-500/10 transition-colors">
          <ChevronRight className="w-4 h-4 text-[#8b8aa0]" />
        </button>
      </div>

      {type === 'movies' && <ContinueWatchingRow onSelectContent={onSelectContent} />}

      {loading ? (
        <>{[1,2,3].map(i => <ContentRow key={i} title="" items={[]} onSelectContent={onSelectContent} loading={true} />)}</>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#8b8aa0] text-base">No {type} found in this genre</p>
          <button
            onClick={() => setActiveGenre('all')}
            className="mt-4 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all btn-grad"
          >
            Show All
          </button>
        </div>
      ) : (
        rows.map((row, i) => (
          <ContentRow key={i} title={rowTitles[i] || `More ${type === 'movies' ? 'Movies' : 'Shows'}`} items={row} onSelectContent={onSelectContent} loading={false} />
        ))
      )}
    </section>
  );
};

export default ContentSection;

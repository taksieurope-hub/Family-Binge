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
];

const ContentRow = ({ title, icon: Icon, items, onSelectContent, loading }) => {
  const scrollRef = useRef(null);
  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });

  if (loading) return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-600/30 rounded-lg"><Icon className="w-5 h-5 text-purple-400" /></div>
        <h3 className="text-xl sm:text-2xl font-bold text-white">{title}</h3>
      </div>
      <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 text-purple-500 animate-spin" /></div>
    </div>
  );

  if (!items || items.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600/30 rounded-lg"><Icon className="w-5 h-5 text-purple-400" /></div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">{title}</h3>
        </div>
        <div className="hidden sm:flex gap-2">
          <button onClick={() => scroll('left')} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><ChevronLeft className="w-5 h-5 text-white" /></button>
          <button onClick={() => scroll('right')} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><ChevronRight className="w-5 h-5 text-white" /></button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4">
        {items.map(item => (
          <div key={`${item.type}-${item.id}`} onClick={() => onSelectContent(item)} className="flex-shrink-0 w-40 sm:w-48 group cursor-pointer">
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
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/70 rounded-lg">
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

const ContinueWatchingRow = ({ onSelectContent }) => {
  const [history, setHistory] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    setHistory(getWatchHistory());
    const handler = () => setHistory(getWatchHistory());
    window.addEventListener('watchHistoryUpdated', handler);
    return () => window.removeEventListener('watchHistoryUpdated', handler);
  }, []);

  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });

  const handleRemove = (e, item) => {
    e.stopPropagation();
    removeFromWatchHistory(item.id, item.type);
    setHistory(getWatchHistory());
  };

  if (history.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-600/30 rounded-lg"><Clock className="w-5 h-5 text-green-400" /></div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">Continue Watching</h3>
        </div>
        <div className="hidden sm:flex gap-2">
          <button onClick={() => scroll('left')} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><ChevronLeft className="w-5 h-5 text-white" /></button>
          <button onClick={() => scroll('right')} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><ChevronRight className="w-5 h-5 text-white" /></button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4">
        {history.map(item => (
          <div key={`continue-${item.type}-${item.id}`} onClick={() => onSelectContent(item)} className="flex-shrink-0 w-64 sm:w-80 group cursor-pointer">
            <div className="relative rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-105">
              {item.backdrop || item.poster ? (
                <img src={item.backdrop || item.poster} alt={item.title} className="w-full h-36 sm:h-44 object-cover bg-gray-800" loading="lazy" />
              ) : (
                <div className="w-full h-36 sm:h-44 bg-gray-800 flex items-center justify-center"><Film className="w-12 h-12 text-gray-600" /></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <button onClick={e => handleRemove(e, item)} className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 rounded-full transition-colors opacity-0 group-hover:opacity-100">
                <X className="w-4 h-4 text-white" />
              </button>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform">
                  <Play className="w-6 h-6 text-black fill-black ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h4 className="text-white font-semibold truncate">{item.title}</h4>
                <p className="text-gray-300 text-sm">{item.type === 'series' ? `S${item.season} E${item.episode}` : item.year}</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                <div className="h-full bg-purple-600" style={{ width: `${item.progress || 10}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContentSection = ({ type = 'movies', onSelectContent }) => {
  const [allItems, setAllItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState('all');
  const genreScrollRef = useRef(null);

  const Icon = type === 'movies' ? Film : Tv;

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const api = type === 'movies' ? movieAPI : seriesAPI;
        const [r1, r2, r3] = await Promise.all([
          api.getPopular(1),
          api.getPopular(2),
          api.getPopular(3),
        ]);
        const combined = [
          ...(r1.data.items || []),
          ...(r2.data.items || []),
          ...(r3.data.items || []),
        ];
        // Deduplicate
        const seen = new Set();
        const unique = combined.filter(item => {
          if (seen.has(item.id)) return false;
          seen.add(item.id);
          return true;
        });
        setAllItems(unique);
        setFilteredItems(unique);
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [type]);

  useEffect(() => {
    if (activeGenre === 'all') {
      setFilteredItems(allItems);
    } else {
      setFilteredItems(allItems.filter(item =>
        item.genre_ids?.includes(activeGenre) ||
        item.genres?.includes(GENRES.find(g => g.id === activeGenre)?.label)
      ));
    }
  }, [activeGenre, allItems]);

  const scrollGenres = (dir) => genreScrollRef.current?.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });

  // Split into rows of 20
  const row1 = filteredItems.slice(0, 20);
  const row2 = filteredItems.slice(20, 40);
  const row3 = filteredItems.slice(40, 60);

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-600/30 rounded-lg"><Icon className="w-6 h-6 text-purple-400" /></div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">{type === 'movies' ? 'Movies' : 'Series'}</h2>
        </div>

        {/* Genre filter bar */}
        <div className="relative flex items-center gap-2 mb-8">
          <button onClick={() => scrollGenres('left')} className="flex-shrink-0 p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <div ref={genreScrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth flex-1">
            {GENRES.map(genre => (
              <button
                key={genre.id}
                onClick={() => setActiveGenre(genre.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeGenre === genre.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                {genre.label}
              </button>
            ))}
          </div>
          <button onClick={() => scrollGenres('right')} className="flex-shrink-0 p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Continue Watching - only on movies section */}
        {type === 'movies' && <ContinueWatchingRow onSelectContent={onSelectContent} />}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No {type} found in this genre</p>
            <button onClick={() => setActiveGenre('all')} className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors">
              Show All
            </button>
          </div>
        ) : (
          <>
            <ContentRow title={activeGenre === 'all' ? `Popular ${type === 'movies' ? 'Movies' : 'Series'}` : `${GENRES.find(g => g.id === activeGenre)?.label} ${type === 'movies' ? 'Movies' : 'Series'}`} icon={Icon} items={row1} onSelectContent={onSelectContent} loading={false} />
            {row2.length > 0 && <ContentRow title={`More ${type === 'movies' ? 'Movies' : 'Series'}`} icon={Icon} items={row2} onSelectContent={onSelectContent} loading={false} />}
            {row3.length > 0 && <ContentRow title={`Discover More`} icon={Icon} items={row3} onSelectContent={onSelectContent} loading={false} />}
          </>
        )}
      </div>
    </section>
  );
};

export default ContentSection;

import React, { useState, useEffect } from 'react';
import { Play, Star, ChevronLeft, ChevronRight, Film, Tv, Loader2, Clock, X } from 'lucide-react';
import { movieAPI, seriesAPI } from '../services/api';
import { getWatchHistory, removeFromWatchHistory } from './ContentDetailModal';

const genres = [
  { id: 0, name: 'All' },
  { id: 28, name: 'Action' },
  { id: 35, name: 'Comedy' },
  { id: 18, name: 'Drama' },
  { id: 27, name: 'Horror' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
  { id: 10749, name: 'Romance' },
  { id: 16, name: 'Animation' },
  { id: 99, name: 'Documentary' },
  { id: 14, name: 'Fantasy' },
  { id: 80, name: 'Crime' },
  { id: 12, name: 'Adventure' },
  { id: 10751, name: 'Family' },
  { id: 9648, name: 'Mystery' },
  { id: 36, name: 'History' },
];

const ContentSection = ({ type = 'movies', onSelectContent }) => {
  const [activeGenre, setActiveGenre] = useState(0); // 0 = All
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let res;
        if (activeGenre === 0) {
          // All = popular movies
          res = await movieAPI.getPopular();
        } else {
          // Specific genre
          res = await movieAPI.getByGenre(activeGenre);
        }
        setMovies(res.data.items || []);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [activeGenre]);

  // Continue Watching (only for movies)
  const ContinueWatchingRow = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
      setHistory(getWatchHistory());
    }, []);

    if (history.length === 0) return null;

    return (
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-6 h-6 text-green-500" />
          <h3 className="text-2xl font-bold text-white">Continue Watching</h3>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectContent(item)}
              className="flex-shrink-0 w-48 cursor-pointer group"
            >
              <div className="relative rounded-xl overflow-hidden mb-2">
                {item.poster && <img src={item.poster} alt={item.title} className="w-full h-64 object-cover" />}
                <button
                  onClick={(e) => { e.stopPropagation(); removeFromWatchHistory(item.id, item.type); setHistory(getWatchHistory()); }}
                  className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-white text-sm truncate">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Genre Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-4 scrollbar-hide">
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setActiveGenre(genre.id)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeGenre === genre.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* Continue Watching */}
        {type === 'movies' && <ContinueWatchingRow />}

        {/* Movies Grid */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-8">
            {activeGenre === 0 ? 'Popular Movies' : genres.find(g => g.id === activeGenre)?.name + ' Movies'}
          </h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            </div>
          ) : movies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => onSelectContent(movie)}
                  className="group cursor-pointer"
                >
                  <div className="relative rounded-2xl overflow-hidden aspect-[2/3] bg-zinc-800">
                    {movie.poster ? (
                      <img 
                        src={movie.poster} 
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Film className="w-12 h-12 text-gray-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center justify-between">
                        {movie.rating > 0 && (
                          <div className="flex items-center gap-1 bg-black/70 px-2 py-0.5 rounded text-xs">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{movie.rating}</span>
                          </div>
                        )}
                        <div className="text-xs bg-purple-600/90 px-2 py-0.5 rounded">
                          Movie
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-white text-sm font-medium line-clamp-2 group-hover:text-purple-400 transition-colors">
                    {movie.title}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">{movie.year}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              No movies found in this genre yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContentSection;

import React, { useState, useEffect } from 'react';
import { Play, Star, Film, Tv, Loader2, Clock, X } from 'lucide-react';
import { movieAPI } from '../services/api';
import { getWatchHistory, removeFromWatchHistory } from './ContentDetailModal';

const ContentSection = ({ type = 'movies', onSelectContent }) => {
  const [rows, setRows] = useState({
    popular: [],
    trending: [],
    action: [],
    comedy: [],
    horror: [],
    scifi: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const [pop, trend, actionRes, comedyRes, horrorRes, scifiRes] = await Promise.all([
          movieAPI.getPopular(),
          movieAPI.getTrending(),
          movieAPI.getByGenre(28),   // Action
          movieAPI.getByGenre(35),   // Comedy
          movieAPI.getByGenre(27),   // Horror
          movieAPI.getByGenre(878)   // Sci-Fi
        ]);

        setRows({
          popular: pop.data.items || [],
          trending: trend.data.items || [],
          action: actionRes.data.items || [],
          comedy: comedyRes.data.items || [],
          horror: horrorRes.data.items || [],
          scifi: scifiRes.data.items || []
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const renderRow = (title, items) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-12">
        <h3 className="text-3xl font-bold text-white mb-6 px-4">{title}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 px-4">
          {items.map((movie) => (
            <div
              key={movie.id}
              onClick={() => onSelectContent(movie)}
              className="cursor-pointer group"
            >
              <div className="relative rounded-xl overflow-hidden aspect-[2/3]">
                {movie.poster && <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />}
              </div>
              <p className="mt-3 text-white text-sm line-clamp-2 group-hover:text-green-400">{movie.title}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="py-12 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {renderRow("Popular Movies", rows.popular)}
        {renderRow("Trending Now", rows.trending)}
        {renderRow("Action Movies", rows.action)}
        {renderRow("Comedy Movies", rows.comedy)}
        {renderRow("Horror Movies", rows.horror)}
        {renderRow("Sci-Fi Movies", rows.scifi)}
      </div>
    </section>
  );
};

export default ContentSection;

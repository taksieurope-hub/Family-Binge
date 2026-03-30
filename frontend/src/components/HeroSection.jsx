import React, { useState, useEffect, useCallback } from 'react';
import { Play, Info, Star, Loader2, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { movieAPI } from '../services/api';

const HeroSection = ({ setActiveSection, onPlayVideo, onSelectContent }) => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await movieAPI.getNowPlaying(1);
        if (res.data.items?.length > 0) {
          const top5 = res.data.items.slice(0, 5);
          // Show content immediately with basic info
          setFeaturedMovies(top5.map(m => ({ ...m, type: 'movie' })));
          setLoading(false);
          
          // Then fetch details in background for trailers
          const detailPromises = top5.map(m => movieAPI.getDetails(m.id).catch(() => null));
          const details = await Promise.all(detailPromises);
          const valid = details.filter(Boolean).map(r => r.data);
          if (valid.length > 0) {
            setFeaturedMovies(valid);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching featured movies:', error);
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const goTo = useCallback((index) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning, currentIndex]);

  const goNext = useCallback(() => {
    if (featuredMovies.length === 0) return;
    goTo((currentIndex + 1) % featuredMovies.length);
  }, [featuredMovies.length, currentIndex, goTo]);

  const goPrev = useCallback(() => {
    if (featuredMovies.length === 0) return;
    goTo((currentIndex - 1 + featuredMovies.length) % featuredMovies.length);
  }, [featuredMovies.length, currentIndex, goTo]);

  // Auto-advance
  useEffect(() => {
    if (!autoPlay || featuredMovies.length <= 1) return;
    const timer = setInterval(goNext, 7000);
    return () => clearInterval(timer);
  }, [autoPlay, goNext, featuredMovies.length]);

  const featured = featuredMovies[currentIndex];

  const handlePlayTrailer = () => {
    if (featured?.youtube_id) onPlayVideo(featured.youtube_id);
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {featured?.backdrop || !loading ? (
          <img
            src={featured?.backdrop || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&h=1080&fit=crop'}
            alt={featured?.title || 'Featured'}
            className="w-full h-full object-cover"
          />
        ) : null}
        {/* Multi-layer gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
        {/* Cinematic vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.6)_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="flex flex-col justify-center min-h-[80vh]">
          {loading ? (
            <div className="flex items-center gap-3">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
              <span className="text-gray-300 text-lg">Loading featured content...</span>
            </div>
          ) : featured ? (
            <div className={`transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-lg shadow-purple-500/30">
                  Now Playing
                </span>
                {featured.genres?.slice(0, 3).map((g, i) => (
                  <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/15 text-gray-200 text-xs rounded-full">
                    {g}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-3 leading-[1.05] max-w-3xl tracking-tight">
                {featured.title}
              </h1>

              {/* Tagline */}
              {featured.tagline && (
                <p className="text-purple-300/80 italic text-lg mb-4 max-w-xl">
                  "{featured.tagline}"
                </p>
              )}

              {/* Overview */}
              <p className="text-base sm:text-lg text-gray-300/90 mb-6 max-w-2xl line-clamp-3 leading-relaxed">
                {featured.overview}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 mb-8 text-sm">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-yellow-300 font-bold">{featured.rating}</span>
                </div>
                <span className="text-gray-400">·</span>
                <span className="text-gray-300 font-medium">{featured.year}</span>
                {featured.runtime && (
                  <>
                    <span className="text-gray-400">·</span>
                    <span className="text-gray-300">{Math.floor(featured.runtime / 60)}h {featured.runtime % 60}m</span>
                  </>
                )}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handlePlayTrailer}
                  disabled={!featured.youtube_id}
                  className="flex items-center gap-2.5 bg-white hover:bg-gray-100 text-black px-7 py-5 text-base font-bold rounded-xl transition-all hover:scale-105 disabled:opacity-40 shadow-xl shadow-white/10"
                >
                  <Play className="w-5 h-5 fill-black" />
                  Watch Trailer
                </Button>
                <Button
                  onClick={() => onSelectContent({ ...featured, type: 'movie' })}
                  variant="outline"
                  className="flex items-center gap-2.5 bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40 px-7 py-5 text-base rounded-xl transition-all hover:scale-105 backdrop-blur-sm"
                >
                  <Info className="w-5 h-5" />
                  More Info
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white mb-4 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">Unlimited</span>
                <br />Entertainment
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-xl">220+ live channels · 60,000+ movies & series</p>
              <Button onClick={() => setActiveSection('movies')} className="flex items-center gap-2 bg-white hover:bg-gray-100 text-black px-8 py-6 text-lg font-bold rounded-xl">
                <Play className="w-6 h-6 fill-black" />
                Explore Movies
              </Button>
            </div>
          )}
        </div>

        {/* Carousel controls - positioned bottom right */}
        {featuredMovies.length > 1 && !loading && (
          <div className="absolute bottom-24 right-4 sm:right-8 flex flex-col items-end gap-4">
            {/* Dot indicators */}
            <div className="flex gap-1.5">
              {featuredMovies.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setAutoPlay(false); goTo(i); }}
                  className={`transition-all duration-300 rounded-full ${
                    i === currentIndex
                      ? 'w-6 h-2 bg-white'
                      : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
            {/* Arrow controls */}
            <div className="flex gap-2">
              <button
                onClick={() => { setAutoPlay(false); goPrev(); }}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 rounded-full flex items-center justify-center transition-all hover:scale-110"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => { setAutoPlay(false); goNext(); }}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 rounded-full flex items-center justify-center transition-all hover:scale-110"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* Progress bar for auto-advance */}
        {autoPlay && featuredMovies.length > 1 && !loading && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
            <div
              key={currentIndex}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              style={{ animation: 'progress-bar 7s linear' }}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes progress-bar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
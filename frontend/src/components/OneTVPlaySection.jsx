import React, { useState, useEffect, useRef } from "react";
import { Film, Loader2, ChevronLeft, ChevronRight, Play } from "lucide-react";

const API_BASE = "https://family-binge-backend.onrender.com";

const OneTVPlaySection = ({ onSelectContent }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const scrollRef = useRef(null);

  const scroll = (dir) =>
    scrollRef.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch(`${API_BASE}/api/content/1tvplay/homepage`);
        const data = await r.json();
        setMovies(data.movies || []);
      } catch (e) {
        console.error("1tvplay load error:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handlePlay = async (movie) => {
    if (movie.stream_480p) {
      setSelected(movie);
      return;
    }
    try {
      const r = await fetch(`${API_BASE}/api/content/1tvplay/movie/${movie.slug}`);
      const data = await r.json();
      setSelected(data);
    } catch (e) {
      console.error("stream fetch error:", e);
    }
  };

  return (
    <div className="bg-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-gradient-to-br from-red-700 to-red-500 p-3 rounded-xl shadow-lg">
            <Film className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">1TVPLAY</h2>
            <p className="text-gray-400 text-sm">Georgian movies and series from 1TV</p>
          </div>
        </div>

        {selected && (
          <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-white text-2xl font-bold bg-zinc-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-zinc-700">?</button>
            <h3 className="text-white text-xl font-bold mb-4">{selected.title}</h3>
            <video
              src={selected.stream_1080p || selected.stream_720p || selected.stream_480p}
              controls
              autoPlay
              className="w-full max-w-4xl rounded-xl"
              style={{ maxHeight: "70vh" }}
            />
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <Film className="w-12 h-12 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500">No content available right now</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm">{movies.length} titles available</p>
              <div className="hidden sm:flex gap-2">
                <button onClick={() => scroll("left")} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><ChevronLeft className="w-5 h-5 text-white" /></button>
                <button onClick={() => scroll("right")} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><ChevronRight className="w-5 h-5 text-white" /></button>
              </div>
            </div>
            <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4">
              {movies.map((movie) => (
                <div key={movie.slug} onClick={() => handlePlay(movie)} className="flex-shrink-0 w-40 sm:w-48 group cursor-pointer">
                  <div className="relative rounded-xl overflow-hidden mb-3 transition-transform duration-300 group-hover:scale-105">
                    {movie.poster
                      ? <img src={movie.poster} alt={movie.title} className="w-full aspect-[2/3] object-cover" loading="lazy" />
                      : <div className="w-full aspect-[2/3] bg-zinc-800 flex items-center justify-center"><Film className="w-8 h-8 text-gray-600" /></div>
                    }
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <div className="flex items-center gap-1 bg-red-600 rounded-full px-2 py-1">
                        <Play className="w-3 h-3 text-white fill-white" />
                        <span className="text-white text-xs font-bold">Play</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-white text-sm font-semibold truncate">{movie.title}</p>
                  <p className="text-gray-400 text-xs">{movie.year}{movie.imdb ? ` � ${movie.imdb}` : ""}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OneTVPlaySection;

import React, { useState, useEffect, useRef } from "react";
import { Film, Loader2, ChevronLeft, ChevronRight, Play, X } from "lucide-react";

const API_BASE = "https://family-binge-backend.onrender.com";

const IMovsSection = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [embedUrl, setEmbedUrl] = useState(null);
  const [embedTitle, setEmbedTitle] = useState("");
  const [loadingEmbed, setLoadingEmbed] = useState(false);
  const scrollRef = useRef(null);

  const scroll = (dir) =>
    scrollRef.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch(`${API_BASE}/api/content/imovs/movies?page=1`);
        const data = await r.json();
        setMovies(data.movies || []);
      } catch (e) {
        console.error("imovs load error:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handlePlay = async (movie) => {
    setLoadingEmbed(true);
    setEmbedTitle(movie.title);
    try {
      const r = await fetch(`${API_BASE}/api/content/imovs/stream?url=${encodeURIComponent(movie.url)}`);
      const data = await r.json();
      setEmbedUrl(data.embed_url);
    } catch (e) {
      console.error("embed fetch error:", e);
    } finally {
      setLoadingEmbed(false);
    }
  };

  return (
    <div className="bg-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-gradient-to-br from-yellow-600 to-yellow-400 p-3 rounded-xl shadow-lg">
            <Film className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white">iMovs Georgian</h2>
            <p className="text-gray-400 text-sm">??????? ?? ????????? ????????</p>
          </div>
        </div>

        {(embedUrl || loadingEmbed) && (
          <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4">
            <button onClick={() => { setEmbedUrl(null); setEmbedTitle(""); }} className="absolute top-4 right-4 text-white bg-zinc-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-zinc-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-white text-lg font-bold mb-4 text-center px-8">{embedTitle}</h3>
            {loadingEmbed ? (
              <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />
            ) : (
              <iframe
                src={embedUrl}
                className="w-full max-w-4xl rounded-xl"
                style={{ height: "70vh" }}
                allowFullScreen
                allow="autoplay; fullscreen"
                frameBorder="0"
              />
            )}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
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
              {movies.map((movie, i) => (
                <div key={i} onClick={() => handlePlay(movie)} className="flex-shrink-0 w-40 sm:w-48 group cursor-pointer">
                  <div className="relative rounded-xl overflow-hidden mb-3 transition-transform duration-300 group-hover:scale-105">
                    {movie.poster ? (
                      <img src={movie.poster} alt={movie.title} className="w-full aspect-[2/3] object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full aspect-[2/3] bg-zinc-800 flex items-center justify-center"><Film className="w-8 h-8 text-gray-600" /></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <div className="flex items-center gap-1 bg-yellow-500 rounded-full px-2 py-1">
                        <Play className="w-3 h-3 text-black fill-black" />
                        <span className="text-black text-xs font-bold">Play</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-white text-sm font-semibold truncate">{movie.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IMovsSection;

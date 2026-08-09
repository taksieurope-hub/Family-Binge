import React, { useState, useEffect, useRef } from "react";
import { Search, Tv, Play, ThumbsUp, X, Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const BASE = "https://www.googleapis.com/youtube/v3";

const fetchYT = async (endpoint, params) => {
  const url = new URL(`${BASE}/${endpoint}`);
  url.searchParams.set("key", API_KEY);
  url.searchParams.set("part", "snippet");
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url);
  return res.json();
};

const GENRES = [
  { id: "music", label: "Music", emoji: "" },
  { id: "gaming", label: "Gaming", emoji: "" },
  { id: "sport", label: "Sport", emoji: "" },
  { id: "comedy", label: "Comedy", emoji: "" },
  { id: "news", label: "News", emoji: "" },
  { id: "tech", label: "Tech", emoji: "" },
  { id: "food", label: "Food", emoji: "" },
  { id: "travel", label: "Travel", emoji: "" },
  { id: "fitness", label: "Fitness", emoji: "" },
  { id: "movies", label: "Movies", emoji: "" },
];

const FREE_LIVE_CHANNELS = [
  { id: "UCVTyTA4-tU1d5hRhZ_xyiEA", name: "CNN Live", category: "News" },
  { id: "UCef1-8eOpJgud_szVkZGAYg", name: "Al Jazeera English", category: "News" },
  { id: "UC16niRr50-MSBwiO3YDb3RA", name: "BBC News", category: "News" },
  { id: "UCNye-wNBqNL5ZzHSJj3l8Bg", name: "ABC News", category: "News" },
  { id: "UCBcRF18a7Qf58cCRy5xuWwQ", name: "NBC News", category: "News" },
  { id: "UCHjA3sGkTcCKiAXVbWGtCLA", name: "Sky News", category: "News" },
  { id: "UCWX3yGbODI3HLaGOmTOQjSw", name: "France 24 English", category: "News" },
  { id: "UC8p1vwvWtl6T73JiExfWs1g", name: "DW News", category: "News" },
  { id: "UCIALMKvObZNtJ6AmdCLP_xQ", name: "NASA Live", category: "Science" },
  { id: "UCSj1Er5Xl0PDsIpOF1UMFpg", name: "Lofi Hip Hop Radio", category: "Music" },
];

const VideoCard = ({ video, onPlay }) => {
  const { snippet } = video;
  const videoId = video.id?.videoId || video.id;
  return (
    <div onClick={() => onPlay(videoId, snippet?.title)} className="group cursor-pointer">
      <div className="relative rounded-xl overflow-hidden mb-2">
        <img src={snippet?.thumbnails?.medium?.url} alt={snippet?.title}
          className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play className="w-10 h-10 text-white fill-white" />
        </div>
      </div>
      <p className="text-white text-sm font-semibold line-clamp-2">{snippet?.title}</p>
      <p className="text-gray-400 text-xs mt-1">{snippet?.channelTitle}</p>
    </div>
  );
};

const YouTubePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);
  const [liveChannels, setLiveChannels] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState(() => {
    const uid = localStorage.getItem("fb_uid") || "guest";
    try { return JSON.parse(localStorage.getItem(`yt_genres_${uid}`)) || []; } catch { return []; }
  });
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeVideoTitle, setActiveVideoTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("discover");
  const searchTimeout = useRef(null);

  const saveGenres = (genres) => {
    const uid = localStorage.getItem("fb_uid") || "guest";
    localStorage.setItem(`yt_genres_${uid}`, JSON.stringify(genres));
  };

  const toggleGenre = (id) => {
    const updated = selectedGenres.includes(id)
      ? selectedGenres.filter(g => g !== id)
      : [...selectedGenres, id];
    setSelectedGenres(updated);
    saveGenres(updated);
  };

  const loadTrending = async () => {
    try {
      const data = await fetchYT("videos", { chart: "mostPopular", maxResults: 20, videoCategoryId: "0", type: "video" });
      setTrending(data.items || []);
    } catch {}
  };

  const loadRecommendations = async () => {
    if (selectedGenres.length === 0) return;
    setLoading(true);
    try {
      const query = selectedGenres.join(" OR ");
      const data = await fetchYT("search", { q: query, maxResults: 20, type: "video", order: "relevance" });
      setRecommendations(data.items || []);
    } catch {} finally { setLoading(false); }
  };

  const loadLiveChannels = async () => {
    try {
      const queries = [
        "BBC News live", "CNN live stream", "Al Jazeera English live",
        "Sky News live", "DW News live", "France 24 live",
        "NBC News live", "ABC News live", "Fox News live",
        "MSNBC live", "Bloomberg live stream", "CNBC live",
        "lofi hip hop radio live", "NASA TV live",
        "euronews live", "TRT World live", "NHK World live",
        "CNA live", "Times Now live", "NDTV live",
        "music live stream free", "jazz live radio",
        "nature live stream", "space live stream",
        "sports live stream free", "cricket live stream",
        "football live stream free", "gaming live stream",
        "cooking live stream", "meditation live stream",
        "study with me live", "rain sounds live",
        "rugby live stream", "rugby union live", "rugby league live",
        "World Rugby live", "SA Rugby live", "Springboks live",
        "England Rugby live", "Six Nations live",
        "Premiership Rugby live", "United Rugby Championship live",
        "Rugby Championship live", "Lions rugby live",
        "NFL live stream", "NBA live stream", "MLB live stream",
        "NHL live stream", "soccer live stream", "football live stream",
        "tennis live stream", "golf live stream", "PGA tour live",
        "boxing live stream", "MMA live stream", "UFC live stream",
        "Formula 1 live", "F1 live stream", "MotoGP live",
        "cycling live stream", "Tour de France live",
        "athletics live stream", "swimming live", "Olympics live",
        "cricket live stream", "IPL live", "test cricket live",
        "basketball live stream", "volleyball live stream",
        "wrestling live stream", "WWE live stream",
        "darts live stream", "snooker live stream",
        "horse racing live", "motorsport live stream",
        "esports live stream", "FIFA live stream",
        "netball live stream", "hockey live stream",
        "table tennis live", "badminton live stream",
      ];
      const results = await Promise.all(
        queries.map(q => fetchYT("search", {
          eventType: "live", type: "video", q, maxResults: 3, order: "viewCount"
        }))
      );
      const all = results.flatMap(r => r.items || []);
      const seen = new Set();
      const unique = all.filter(v => {
        const id = v.id?.videoId;
        if (!id || seen.has(id)) return false;
        seen.add(id);
        return true;
      });
      setLiveChannels(unique);
    } catch {}
  };

  const handleSearch = async (q) => {
    if (!q.trim()) { setSearchResults([]); return; }
    setLoading(true);
    try {
      const data = await fetchYT("search", { q, maxResults: 20, type: "video", order: "relevance" });
      setSearchResults(data.items || []);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { loadTrending(); loadLiveChannels(); }, []);
  useEffect(() => { loadRecommendations(); }, [selectedGenres]);
  useEffect(() => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => handleSearch(searchQuery), 500);
  }, [searchQuery]);

  const playVideo = (id, title) => { setActiveVideo(id); setActiveVideoTitle(title); };
  const closeVideo = () => { setActiveVideo(null); setActiveVideoTitle(""); };

  const tabs = [
    { id: "discover", label: "Discover" },
    { id: "search", label: "Search" },
  ];

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate("/app")} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors mr-2">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="bg-red-600 p-3 rounded-xl">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">YouTube</h1>
            <p className="text-gray-400 text-sm">Search, discover and watch free content</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === tab.id ? "bg-red-600 text-white" : "bg-zinc-800 text-gray-400 hover:text-white"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Tab */}
        {activeTab === "search" && (
          <div>
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search YouTube..."
                className="w-full bg-zinc-800 text-white pl-12 pr-4 py-4 rounded-2xl border border-zinc-700 focus:border-red-500 outline-none text-sm" />
              {loading && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400 animate-spin" />}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {searchResults.map(v => <VideoCard key={v.id?.videoId} video={v} onPlay={playVideo} />)}
            </div>
          </div>
        )}

        {/* Discover Tab */}
        {activeTab === "discover" && (
          <div>
            {/* Genre Picker */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <ThumbsUp className="w-5 h-5 text-red-400" />
                <h2 className="text-white font-bold text-lg">What do you like?</h2>
                <span className="text-gray-500 text-sm">Pick your interests for recommendations</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {GENRES.map(g => (
                  <button key={g.id} onClick={() => toggleGenre(g.id)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${selectedGenres.includes(g.id) ? "bg-red-600 text-white scale-105" : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"}`}>
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            {selectedGenres.length > 0 && recommendations.length > 0 && (
              <div className="mb-10">
                <h2 className="text-white font-bold text-xl mb-4">Recommended for You</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {recommendations.map(v => <VideoCard key={v.id?.videoId} video={v} onPlay={playVideo} />)}
                </div>
              </div>
            )}

            {/* Trending */}
            <div className="mb-10">
              <h2 className="text-white font-bold text-xl mb-4">?? Trending Now</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {trending.map(v => <VideoCard key={v.id} video={v} onPlay={playVideo} />)}
              </div>
            </div>
          </div>
        )}


      </div>

      {/* Video Player Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-semibold truncate mr-4">{activeVideoTitle}</p>
              <button onClick={closeVideo} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors flex-shrink-0">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="relative w-full" style={{paddingTop: "56.25%"}}>
              <iframe
                className="absolute inset-0 w-full h-full rounded-xl"
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`}
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubePage;

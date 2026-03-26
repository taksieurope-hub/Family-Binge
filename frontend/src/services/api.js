const API_BASE_URL = "https://family-binge-backend.onrender.com";

const GENRE_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
  10759: "Action & Adventure", 10762: "Kids", 10763: "News", 10764: "Reality",
  10765: "Sci-Fi & Fantasy", 10766: "Soap", 10767: "Talk", 10768: "War & Politics"
};

const formatItem = (item) => ({
  id: item.id,
  title: item.title || item.name || "Unknown",
  poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : (item.poster || null),
  backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : (item.backdrop || null),
  year: (item.release_date || item.first_air_date || "")?.slice(0, 4) || "N/A",
  rating: Math.round((item.vote_average || 0) * 10) / 10,
  overview: item.overview || "",
  genres: item.genres
    ? item.genres.map(g => typeof g === 'string' ? g : g.name).filter(Boolean)
    : (item.genre_ids || []).map(id => GENRE_MAP[id]).filter(Boolean),
  popularity: item.popularity || 0,
  type: item.name && !item.title ? "series" : "movie",
  // Details fields
  runtime: item.runtime || null,
  seasons: item.number_of_seasons || null,
  episodes: item.number_of_episodes || null,
  tagline: item.tagline || "",
  youtube_id: item.youtube_id || null,
  cast: item.credits?.cast?.slice(0, 10).map(c => ({
    name: c.name,
    character: c.character,
    profile: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : null
  })) || item.cast || [],
  similar: item.similar?.results?.slice(0, 6).map(formatItem) || item.similar || [],
  status: item.status || "",
});

// Wraps response in axios-like {data: {items: []}} format for component compatibility
const fetchList = (url) =>
  fetch(url)
    .then(r => r.json())
    .then(data => ({ data: { items: (data.results || []).map(formatItem), total_pages: data.total_pages || 1 } }));

const fetchDetails = (url) =>
  fetch(url)
    .then(r => r.json())
    .then(data => ({ data: formatItem(data) }));

const fetchSearch = (url) =>
  fetch(url)
    .then(r => r.json())
    .then(data => ({
      data: {
        items: (data.results || []).map(item => ({
          ...formatItem(item),
          type: item.media_type === 'tv' ? 'series' : 'movie'
        })).filter(i => i.poster)
      }
    }));

export const movieAPI = {
  getTrending: (page = 1) => fetchList(`${API_BASE_URL}/api/content/movies/popular?page=${page}`),
  getPopular: (page = 1) => fetchList(`${API_BASE_URL}/api/content/movies/popular?page=${page}`),
  getTopRated: (page = 1) => fetchList(`${API_BASE_URL}/api/content/movies/popular?page=${page}`),
  getNowPlaying: (page = 1) => fetchList(`${API_BASE_URL}/api/content/movies/popular?page=${page}`),
  getUpcoming: (page = 1) => fetchList(`${API_BASE_URL}/api/content/movies/popular?page=${page}`),
  getDetails: (id) => fetchDetails(`${API_BASE_URL}/api/content/movies/${id}`),
  search: (query, page = 1) => fetchSearch(`${API_BASE_URL}/api/content/search?q=${encodeURIComponent(query)}&page=${page}`),
};

export const seriesAPI = {
  getTrending: (page = 1) => fetchList(`${API_BASE_URL}/api/content/series/popular?page=${page}`),
  getPopular: (page = 1) => fetchList(`${API_BASE_URL}/api/content/series/popular?page=${page}`),
  getTopRated: (page = 1) => fetchList(`${API_BASE_URL}/api/content/series/popular?page=${page}`),
  getDetails: (id) => fetchDetails(`${API_BASE_URL}/api/content/series/${id}`),
  search: (query, page = 1) => fetchSearch(`${API_BASE_URL}/api/content/search?q=${encodeURIComponent(query)}&page=${page}`),
};

export const searchAPI = {
  searchAll: (query, page = 1) => fetchSearch(`${API_BASE_URL}/api/content/search?q=${encodeURIComponent(query)}&page=${page}`),
  search: (query, page = 1) => fetchSearch(`${API_BASE_URL}/api/content/search?q=${encodeURIComponent(query)}&page=${page}`),
};

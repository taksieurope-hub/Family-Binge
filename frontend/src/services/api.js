const API_BASE_URL = "https://family-binge-backend.onrender.com";

const GENRE_MAP = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

const formatItem = (item) => ({
  id: item.id,
  title: item.title || item.name || "Unknown",
  poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
  backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : null,
  year: (item.release_date || item.first_air_date || "")?.slice(0, 4) || "N/A",
  rating: Math.round((item.vote_average || 0) * 10) / 10,
  overview: item.overview || "",
  genres: (item.genre_ids || []).map(id => GENRE_MAP[id]).filter(Boolean),
  type: item.title ? "movie" : "series"
});

export const movieAPI = {
  getPopular: (page = 1) => fetch(`${API_BASE_URL}/api/content/movies/popular?page=${page}`).then(r => r.json()),
  getTrending: (page = 1) => fetch(`${API_BASE_URL}/api/content/movies/popular?page=${page}`).then(r => r.json()),
  getNowPlaying: (page = 1) => fetch(`${API_BASE_URL}/api/content/movies/popular?page=${page}`).then(r => r.json()),
  getDetails: (id) => fetch(`${API_BASE_URL}/api/content/movies/${id}`).then(r => r.json()),
};

export const seriesAPI = {
  getPopular: (page = 1) => fetch(`${API_BASE_URL}/api/content/series/popular?page=${page}`).then(r => r.json()),
  getDetails: (id) => fetch(`${API_BASE_URL}/api/content/series/${id}`).then(r => r.json()),
};

export const searchAPI = {
  search: (query) => fetch(`${API_BASE_URL}/api/content/search?q=${encodeURIComponent(query)}`).then(r => r.json()),
};

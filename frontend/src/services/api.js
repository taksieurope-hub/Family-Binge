const API_BASE_URL = "https://family-binge-backend.onrender.com/api";

// Simple in-memory cache with 5-minute TTL
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const getCached = (key) => {
  const item = cache.get(key);
  if (item && Date.now() - item.timestamp < CACHE_TTL) {
    return item.data;
  }
  cache.delete(key);
  return null;
};

const setCache = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

const fetchList = async (url) => {
  const cached = getCached(url);
  if (cached) return cached;

  const response = await fetch(url);
  const data = await response.json();
  const items = data.items || data.results || [];
  const processed = items.map(item => ({
    ...item,
    genre_ids: item.genre_ids || (item.genres ? item.genres.map(g => typeof g === 'object' ? g.id : g) : []),
    type: item.type || (item.name && !item.title ? 'series' : 'movie'),
  }));
  const result = { data: { items: processed, total_pages: data.total_pages || 1 } };
  setCache(url, result);
  return result;
};

const fetchDetails = async (url) => {
  const cached = getCached(url);
  if (cached) return cached;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  const result = {
    data: {
      ...data,
      type: data.type || (data.name && !data.title ? 'series' : 'movie'),
      genre_ids: data.genre_ids || (data.genres ? data.genres.map(g => typeof g === 'object' ? g.id : g) : []),
    }
  };
  setCache(url, result);
  return result;
};

const fetchSearch = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  const items = data.items || data.results || [];
  return {
    data: {
      items: items
        .filter(i => i.poster)
        .map(item => ({
          ...item,
          type: item.type || (item.media_type === 'tv' ? 'series' : 'movie'),
          genre_ids: item.genre_ids || (item.genres ? item.genres.map(g => typeof g === 'object' ? g.id : g) : []),
        }))
    }
  };
};

// Prefetch common content on app load
export const prefetchContent = async () => {
  try {
    await Promise.all([
      movieAPI.getTrending(1),
      movieAPI.getPopular(1),
      seriesAPI.getTrending(1),
    ]);
  } catch (e) {
    console.log('Prefetch failed:', e);
  }
};

export const movieAPI = {
  getTrending:  (page = 1) => fetchList(`${API_BASE_URL}/api/content/movies/trending?page=${page}`),
  getPopular:   (page = 1) => fetchList(`${API_BASE_URL}/api/content/movies/popular?page=${page}`),
  getTopRated:  (page = 1) => fetchList(`${API_BASE_URL}/api/content/movies/top-rated?page=${page}`),
  getNowPlaying:(page = 1) => fetchList(`${API_BASE_URL}/api/content/movies/now-playing?page=${page}`),
  getUpcoming:  (page = 1) => fetchList(`${API_BASE_URL}/api/content/movies/upcoming?page=${page}`),
  getDetails:   (id)       => fetchDetails(`${API_BASE_URL}/api/content/movies/${id}`),
  search: (query, page=1)  => fetchSearch(`${API_BASE_URL}/api/content/movies/search/${encodeURIComponent(query)}?page=${page}`),
};
export const bollywoodAPI = {
  getPopular:  (page = 1) => fetchList(`${API_BASE_URL}/api/content/movies/bollywood/popular?page=${page}`),
  getTrending: (page = 1) => fetchList(`${API_BASE_URL}/api/content/movies/bollywood/trending?page=${page}`),
  getHindiSeries:        (page = 1) => fetchList(`${API_BASE_URL}/api/content/series/hindi/popular?page=${page}`),
  getHindiSeriesTrending:(page = 1) => fetchList(`${API_BASE_URL}/api/content/series/hindi/trending?page=${page}`),
};

export const seriesAPI = {
  getTrending: (page = 1) => fetchList(`${API_BASE_URL}/api/content/series/trending?page=${page}`),
  getPopular:  (page = 1) => fetchList(`${API_BASE_URL}/api/content/series/popular?page=${page}`),
  getTopRated: (page = 1) => fetchList(`${API_BASE_URL}/api/content/series/top-rated?page=${page}`),
  getDetails:  (id)       => fetchDetails(`${API_BASE_URL}/api/content/series/${id}`),
  search: (query, page=1) => fetchSearch(`${API_BASE_URL}/api/content/series/search/${encodeURIComponent(query)}?page=${page}`),
};

export const searchAPI = {
  searchAll: (query, page=1) => fetchSearch(`${API_BASE_URL}/api/content/search?q=${encodeURIComponent(query)}&page=${page}`),
  search:    (query, page=1) => fetchSearch(`${API_BASE_URL}/api/content/search?q=${encodeURIComponent(query)}&page=${page}`),
};


export const georgianAPI = {
  getMovies:        (page = 1) => fetchList(`${API_BASE_URL}/api/content/movies/georgian/popular?page=${page}`),
  getTrendingMovies:(page = 1) => fetchList(`${API_BASE_URL}/api/content/movies/georgian/trending?page=${page}`),
  getRussianMovies: (page = 1) => fetchList(`${API_BASE_URL}/api/content/movies/russian/popular?page=${page}`),
  getSeries:        (page = 1) => fetchList(`${API_BASE_URL}/api/content/series/georgian/popular?page=${page}`),
  getRussianSeries: (page = 1) => fetchList(`${API_BASE_URL}/api/content/series/russian/popular?page=${page}`),
};

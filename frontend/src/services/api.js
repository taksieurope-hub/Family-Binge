const API_BASE_URL = "https://family-binge-backend.onrender.com";

// Backend already returns formatted items from tmdb_service.py
// List endpoints: { items: [...], total_pages: N, page: N }
// Detail endpoints: single formatted object with poster/backdrop/cast/similar etc.

const fetchList = (url) =>
  fetch(url)
    .then(r => r.json())
    .then(data => {
      // Handle both { items: [] } and { results: [] } formats
      const items = data.items || data.results || [];
      // Ensure genre_ids are preserved for filtering
      const processed = items.map(item => ({
        ...item,
        // Keep genre_ids if present, otherwise derive from genres
        genre_ids: item.genre_ids || (item.genres ? item.genres.map(g => typeof g === 'object' ? g.id : g) : []),
        type: item.type || (item.name && !item.title ? 'series' : 'movie'),
      }));
      return { data: { items: processed, total_pages: data.total_pages || 1 } };
    });

const fetchDetails = (url) =>
  fetch(url)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(data => ({
      data: {
        ...data,
        type: data.type || (data.name && !data.title ? 'series' : 'movie'),
        genre_ids: data.genre_ids || (data.genres ? data.genres.map(g => typeof g === 'object' ? g.id : g) : []),
      }
    }));

const fetchSearch = (url) =>
  fetch(url)
    .then(r => r.json())
    .then(data => {
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
    });

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


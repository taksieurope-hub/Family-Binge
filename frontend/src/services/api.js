const API_BASE_URL = "https://family-binge-backend.onrender.com";

export const movieAPI = {
  getPopular: (page = 1) => fetch(`${API_BASE_URL}/api/content/movies/popular?page=${page}`).then(r => r.json()),
  getTrending: (page = 1) => fetch(`${API_BASE_URL}/api/content/movies/popular?page=${page}`).then(r => r.json()),
  getNowPlaying: (page = 1) => fetch(`${API_BASE_URL}/api/content/movies/popular?page=${page}`).then(r => r.json()),
  getDetails: (id) => fetch(`${API_BASE_URL}/api/content/movies/${id}`).then(r => r.json()),
};

export const seriesAPI = {
  getPopular: (page = 1) => fetch(`${API_BASE_URL}/api/content/series/popular?page=${page}`).then(r => r.json()),
  getTrending: (page = 1) => fetch(`${API_BASE_URL}/api/content/series/popular?page=${page}`).then(r => r.json()),
  getDetails: (id) => fetch(`${API_BASE_URL}/api/content/series/${id}`).then(r => r.json()),
};

export const searchAPI = {
  search: (query) => fetch(`${API_BASE_URL}/api/content/search?q=${encodeURIComponent(query)}`).then(r => r.json()),
};

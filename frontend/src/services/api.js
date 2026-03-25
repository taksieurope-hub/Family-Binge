const API_BASE_URL = "https://family-binger-1.onrender.com";

export const movieAPI = {
  getPopular: () => fetch(`${API_BASE_URL}/api/content/movies/popular`).then(r => r.json()),
  getDetails: (id) => fetch(`${API_BASE_URL}/api/content/movies/${id}`).then(r => r.json()),
};

export const seriesAPI = {
  getPopular: () => fetch(`${API_BASE_URL}/api/content/series/popular`).then(r => r.json()),
  getDetails: (id) => fetch(`${API_BASE_URL}/api/content/series/${id}`).then(r => r.json()),
};

export const searchAPI = {
  search: (query) => fetch(`${API_BASE_URL}/api/content/search?q=${encodeURIComponent(query)}`).then(r => r.json()),
};

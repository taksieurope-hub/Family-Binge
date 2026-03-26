const API_BASE_URL = "https://family-binge-backend.onrender.com";

const wrapResults = (data) => ({
  data: {
    items: data.results || data || []
  }
});

export const movieAPI = {
  getPopular: () => fetch(`${API_BASE_URL}/api/content/movies/popular`).then(r => r.json()).then(wrapResults),
  getDetails: (id) => fetch(`${API_BASE_URL}/api/content/movies/${id}`).then(r => r.json()),
};

export const seriesAPI = {
  getPopular: () => fetch(`${API_BASE_URL}/api/content/series/popular`).then(r => r.json()).then(wrapResults),
  getDetails: (id) => fetch(`${API_BASE_URL}/api/content/series/${id}`).then(r => r.json()),
};

export const searchAPI = {
  search: (query) => fetch(`${API_BASE_URL}/api/content/search?q=${encodeURIComponent(query)}`).then(r => r.json()).then(wrapResults),
};

const API_BASE_URL = "https://family-binge-backend.onrender.com";

const fetchItems = (url) =>
  fetch(url)
    .then(r => r.json())
    .then(data => ({ data: { items: data.results || [] } }));

export const movieAPI = {
  getPopular: (page = 1) => fetchItems(`${API_BASE_URL}/api/content/movies/popular?page=${page}`),
  getTrending: (page = 1) => fetchItems(`${API_BASE_URL}/api/content/movies/popular?page=${page}`),
  getNowPlaying: (page = 1) => fetchItems(`${API_BASE_URL}/api/content/movies/popular?page=${page}`),
  getTopRated: (page = 1) => fetchItems(`${API_BASE_URL}/api/content/movies/popular?page=${page}`),
  getDetails: (id) => fetch(`${API_BASE_URL}/api/content/movies/${id}`).then(r => r.json()).then(data => ({ data })),
};

export const seriesAPI = {
  getPopular: (page = 1) => fetchItems(`${API_BASE_URL}/api/content/series/popular?page=${page}`),
  getTrending: (page = 1) => fetchItems(`${API_BASE_URL}/api/content/series/popular?page=${page}`),
  getTopRated: (page = 1) => fetchItems(`${API_BASE_URL}/api/content/series/popular?page=${page}`),
  getDetails: (id) => fetch(`${API_BASE_URL}/api/content/series/${id}`).then(r => r.json()).then(data => ({ data })),
};

export const searchAPI = {
  search: (query) => fetch(`${API_BASE_URL}/api/content/search?q=${encodeURIComponent(query)}`).then(r => r.json()),
};

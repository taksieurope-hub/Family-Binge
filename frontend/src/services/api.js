import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Movies API
export const movieAPI = {
  getTrending: (page = 1) => axios.get(`${API}/content/movies/trending?page=${page}`),
  getPopular: (page = 1) => axios.get(`${API}/content/movies/popular?page=${page}`),
  getTopRated: (page = 1) => axios.get(`${API}/content/movies/top-rated?page=${page}`),
  getNowPlaying: (page = 1) => axios.get(`${API}/content/movies/now-playing?page=${page}`),
  getUpcoming: (page = 1) => axios.get(`${API}/content/movies/upcoming?page=${page}`),
  getDetails: (id) => axios.get(`${API}/content/movies/${id}`),
  getGenres: () => axios.get(`${API}/content/movies/genres`),
  getByGenre: (genreId, page = 1) => axios.get(`${API}/content/movies/genre/${genreId}?page=${page}`),
  search: (query, page = 1) => axios.get(`${API}/content/movies/search/${encodeURIComponent(query)}?page=${page}`),
};

// Series API
export const seriesAPI = {
  getTrending: (page = 1) => axios.get(`${API}/content/series/trending?page=${page}`),
  getPopular: (page = 1) => axios.get(`${API}/content/series/popular?page=${page}`),
  getTopRated: (page = 1) => axios.get(`${API}/content/series/top-rated?page=${page}`),
  getDetails: (id) => axios.get(`${API}/content/series/${id}`),
  getGenres: () => axios.get(`${API}/content/series/genres`),
  getByGenre: (genreId, page = 1) => axios.get(`${API}/content/series/genre/${genreId}?page=${page}`),
  search: (query, page = 1) => axios.get(`${API}/content/series/search/${encodeURIComponent(query)}?page=${page}`),
};

// Live TV API
export const liveTVAPI = {
  getChannels: (category = 'all') => axios.get(`${API}/content/livetv/channels?category=${category}`),
  getCategories: () => axios.get(`${API}/content/livetv/categories`),
  getChannel: (id) => axios.get(`${API}/content/livetv/channel/${id}`),
  search: (query) => axios.get(`${API}/content/livetv/search?q=${encodeURIComponent(query)}`),
};

// Unified Search
export const searchAPI = {
  searchAll: (query, page = 1) => axios.get(`${API}/content/search?q=${encodeURIComponent(query)}&page=${page}`),
};

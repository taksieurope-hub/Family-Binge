import axios from "axios";

const api = axios.create({
  baseURL: "https://family-binge-backend.onrender.com/api",
  timeout: 15000,
});

// Auth token injection
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ============ AUTH ============
export const register = (data) => api.post("/auth/register", data);
export const login = (data) => api.post("/auth/login", data);
export const getProfile = () => api.get("/auth/profile");

// ============ SEARCH ============
export const searchContent = (query, page = 1) => api.get(`/search?q=${query}&page=${page}`);

// ============ POPULAR / TRENDING ============
export const getPopularMovies = (page = 1) => api.get(`/movies/popular?page=${page}`);
export const getPopularSeries = (page = 1) => api.get(`/series/popular?page=${page}`);
export const getTrendingAll = (page = 1) => api.get(`/trending?page=${page}`);

// ============ MOVIE CATEGORIES ============
export const getMoviesAction = (page = 1) => api.get(`/movies/action?page=${page}`);
export const getMoviesAnimation = (page = 1) => api.get(`/movies/animation?page=${page}`);
export const getMoviesHorror = (page = 1) => api.get(`/movies/horror?page=${page}`);
export const getMoviesDocumentary = (page = 1) => api.get(`/movies/documentary?page=${page}`);
export const getMoviesRomance = (page = 1) => api.get(`/movies/romance?page=${page}`);
export const getMoviesNetflix = (page = 1) => api.get(`/movies/netflix?page=${page}`);
export const getMoviesHBO = (page = 1) => api.get(`/movies/hbo?page=${page}`);
export const getMoviesPrime = (page = 1) => api.get(`/movies/prime?page=${page}`);
export const getMoviesDisney = (page = 1) => api.get(`/movies/disney?page=${page}`);
export const getMoviesSouthAfrica = (page = 1) => api.get(`/movies/south-africa?page=${page}`);
export const getMoviesAfrica = (page = 1) => api.get(`/movies/africa?page=${page}`);
export const getMoviesNollywood = (page = 1) => api.get(`/movies/nollywood?page=${page}`);
export const getMoviesKorea = (page = 1) => api.get(`/movies/korea?page=${page}`);
export const getMoviesAnime = (page = 1) => api.get(`/movies/anime?page=${page}`);
export const getMoviesHollywood = (page = 1) => api.get(`/movies/hollywood?page=${page}`);
export const getMoviesClassics = (page = 1) => api.get(`/movies/classics?page=${page}`);
export const getMoviesOscars = (page = 1) => api.get(`/movies/oscars?page=${page}`);
export const getMoviesTylerPerry = (page = 1) => api.get(`/movies/tyler-perry?page=${page}`);
export const getMoviesNewlyAdded = (page = 1) => api.get(`/movies/newly-added?page=${page}`);
export const getMoviesFranchise = (page = 1) => api.get(`/movies/franchise?page=${page}`);

// ============ SERIES CATEGORIES ============
export const getSeriesAction = (page = 1) => api.get(`/series/action?page=${page}`);
export const getSeriesAnimation = (page = 1) => api.get(`/series/animation?page=${page}`);
export const getSeriesHorror = (page = 1) => api.get(`/series/horror?page=${page}`);
export const getSeriesDocumentary = (page = 1) => api.get(`/series/documentary?page=${page}`);
export const getSeriesRomance = (page = 1) => api.get(`/series/romance?page=${page}`);
export const getSeriesNetflix = (page = 1) => api.get(`/series/netflix?page=${page}`);
export const getSeriesHBO = (page = 1) => api.get(`/series/hbo?page=${page}`);
export const getSeriesPrime = (page = 1) => api.get(`/series/prime?page=${page}`);
export const getSeriesDisney = (page = 1) => api.get(`/series/disney?page=${page}`);
export const getSeriesSouthAfrica = (page = 1) => api.get(`/series/south-africa?page=${page}`);
export const getSeriesAfrica = (page = 1) => api.get(`/series/africa?page=${page}`);
export const getSeriesNollywood = (page = 1) => api.get(`/series/nollywood?page=${page}`);
export const getSeriesKorea = (page = 1) => api.get(`/series/korea?page=${page}`);
export const getSeriesAnime = (page = 1) => api.get(`/series/anime?page=${page}`);
export const getSeriesHollywood = (page = 1) => api.get(`/series/hollywood?page=${page}`);
export const getSeriesClassics = (page = 1) => api.get(`/series/classics?page=${page}`);
export const getSeriesTylerPerry = (page = 1) => api.get(`/series/tyler-perry?page=${page}`);
export const getSeriesNewlyAdded = (page = 1) => api.get(`/series/newly-added?page=${page}`);
export const getSeriesFranchise = (page = 1) => api.get(`/series/franchise?page=${page}`);

// ============ CONTENT DETAIL ============
export const getMovieDetail = (id) => api.get(`/movies/${id}`);
export const getSeriesDetail = (id) => api.get(`/series/${id}`);
export const getSeasonDetail = (seriesId, season) => api.get(`/series/${seriesId}/season/${season}`);

// ============ WATCHLIST ============
export const getWatchlist = () => api.get("/watchlist");
export const addToWatchlist = (data) => api.post("/watchlist", data);
export const removeFromWatchlist = (id) => api.delete(`/watchlist/${id}`);

export default api;

// Keep backend alive
setInterval(() => {
  axios.get("https://family-binge-backend.onrender.com/api/health").catch(() => {});
}, 5 * 60 * 1000);

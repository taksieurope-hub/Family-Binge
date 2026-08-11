import axios from "axios";

const api = axios.create({
  baseURL: "https://api.familybinge.com/",
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
export const getPopularMovies = (page = 1) => api.get(`/api/content/movies/popular?page=${page}`);
export const getPopularSeries = (page = 1) => api.get(`/api/content/series/popular?page=${page}`);
export const getTrendingAll = (page = 1) => api.get(`/api/content/trending?page=${page}`);

// ============ MOVIE CATEGORIES ============
export const getMoviesAction = (page = 1) => api.get(`/api/content/movies/action?page=${page}`);
export const getMoviesAnimation = (page = 1) => api.get(`/api/content/movies/animation?page=${page}`);
export const getMoviesHorror = (page = 1) => api.get(`/api/content/movies/horror?page=${page}`);
export const getMoviesDocumentary = (page = 1) => api.get(`/api/content/movies/documentary?page=${page}`);
export const getMoviesRomance = (page = 1) => api.get(`/api/content/movies/romance?page=${page}`);
export const getMoviesNetflix = (page = 1) => api.get(`/api/content/movies/netflix?page=${page}`);
export const getMoviesHBO = (page = 1) => api.get(`/api/content/movies/hbo?page=${page}`);
export const getMoviesPrime = (page = 1) => api.get(`/api/content/movies/prime?page=${page}`);
export const getMoviesDisney = (page = 1) => api.get(`/api/content/movies/disney?page=${page}`);
export const getMoviesSouthAfrica = (page = 1) => api.get(`/api/content/movies/south-africa?page=${page}`);
export const getMoviesAfrica = (page = 1) => api.get(`/api/content/movies/africa?page=${page}`);
export const getMoviesNollywood = (page = 1) => api.get(`/api/content/movies/nollywood?page=${page}`);
export const getMoviesKorea = (page = 1) => api.get(`/api/content/movies/korea?page=${page}`);
export const getMoviesAnime = (page = 1) => api.get(`/api/content/movies/anime?page=${page}`);
export const getMoviesHollywood = (page = 1) => api.get(`/api/content/movies/hollywood?page=${page}`);
export const getMoviesClassics = (page = 1) => api.get(`/api/content/movies/classics?page=${page}`);
export const getMoviesOscars = (page = 1) => api.get(`/api/content/movies/oscars?page=${page}`);
export const getMoviesTylerPerry = (page = 1) => api.get(`/api/content/movies/tyler-perry?page=${page}`);
export const getMoviesNewlyAdded = (page = 1) => api.get(`/api/content/movies/newly-added?page=${page}`);
export const getMoviesFranchise = (page = 1) => api.get(`/api/content/movies/franchise?page=${page}`);

// ============ SERIES CATEGORIES ============
export const getSeriesAction = (page = 1) => api.get(`/api/content/series/action?page=${page}`);
export const getSeriesAnimation = (page = 1) => api.get(`/api/content/series/animation?page=${page}`);
export const getSeriesHorror = (page = 1) => api.get(`/api/content/series/horror?page=${page}`);
export const getSeriesDocumentary = (page = 1) => api.get(`/api/content/series/documentary?page=${page}`);
export const getSeriesRomance = (page = 1) => api.get(`/api/content/series/romance?page=${page}`);
export const getSeriesNetflix = (page = 1) => api.get(`/api/content/series/netflix?page=${page}`);
export const getSeriesHBO = (page = 1) => api.get(`/api/content/series/hbo?page=${page}`);
export const getSeriesPrime = (page = 1) => api.get(`/api/content/series/prime?page=${page}`);
export const getSeriesDisney = (page = 1) => api.get(`/api/content/series/disney?page=${page}`);
export const getSeriesSouthAfrica = (page = 1) => api.get(`/api/content/series/south-africa?page=${page}`);
export const getSeriesAfrica = (page = 1) => api.get(`/api/content/series/africa?page=${page}`);
export const getSeriesNollywood = (page = 1) => api.get(`/api/content/series/nollywood?page=${page}`);
export const getSeriesKorea = (page = 1) => api.get(`/api/content/series/korea?page=${page}`);
export const getSeriesAnime = (page = 1) => api.get(`/api/content/series/anime?page=${page}`);
export const getSeriesHollywood = (page = 1) => api.get(`/api/content/series/hollywood?page=${page}`);
export const getSeriesClassics = (page = 1) => api.get(`/api/content/series/classics?page=${page}`);
export const getSeriesTylerPerry = (page = 1) => api.get(`/api/content/series/tyler-perry?page=${page}`);
export const getSeriesNewlyAdded = (page = 1) => api.get(`/api/content/series/newly-added?page=${page}`);
export const getSeriesFranchise = (page = 1) => api.get(`/api/content/series/franchise?page=${page}`);

// ============ CONTENT DETAIL ============
export const getMovieDetail = (id) => api.get(`/api/content/movies/${id}`);
export const getSeriesDetail = (id) => api.get(`/api/content/series/${id}`);
export const getSeasonDetail = (seriesId, season) => api.get(`/api/content/series/${seriesId}/season/${season}`);

// ============ WATCHLIST ============
export const getWatchlist = () => api.get("/watchlist");
export const addToWatchlist = (data) => api.post("/watchlist", data);
export const removeFromWatchlist = (id) => api.delete(`/watchlist/${id}`);

export default api;

// Keep backend alive
setInterval(() => {
  axios.get("https://api.familybinge.com/").catch(() => {});
}, 5 * 60 * 1000);







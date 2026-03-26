const API_BASE_URL = "https://family-binge-backend.onrender.com";

const wrapResults = (data) => ({
  data: {
    items: (data.results || []).map(item => ({
      id: item.id,
      title: item.title || item.name || "Unknown Title",
      poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
      backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : null,
      year: (item.release_date || item.first_air_date || "").slice(0, 4) || "",
      rating: item.vote_average ? Math.round(item.vote_average * 10) / 10 : 0,
      type: "movie"
    }))
  }
});

export const movieAPI = {
  getPopular: () => fetch(`${API_BASE_URL}/api/content/movies/popular`).then(r => r.json()).then(wrapResults),
  getNowPlaying: () => fetch(`${API_BASE_URL}/api/content/movies/popular`).then(r => r.json()).then(wrapResults),
  getTrending: () => fetch(`${API_BASE_URL}/api/content/movies/popular`).then(r => r.json()).then(wrapResults),
  getNowPlayingInCinemas: () => fetch(`${API_BASE_URL}/api/content/movies/popular`).then(r => r.json()).then(wrapResults),
  getMostWatched: () => fetch(`${API_BASE_URL}/api/content/movies/popular`).then(r => r.json()).then(wrapResults),
  getByGenre: (genreId) => fetch(`${API_BASE_URL}/api/content/movies?with_genres=${genreId}`).then(r => r.json()).then(wrapResults),
  getDetails: (id) => fetch(`${API_BASE_URL}/api/content/movies/${id}`).then(r => r.json()),
};

export const seriesAPI = {
  getPopular: () => fetch(`${API_BASE_URL}/api/content/series/popular`).then(r => r.json()).then(wrapResults),
  getDetails: (id) => fetch(`${API_BASE_URL}/api/content/series/${id}`).then(r => r.json()),
};

export const searchAPI = {
  search: (query) => fetch(`${API_BASE_URL}/api/content/search?q=${encodeURIComponent(query)}`).then(r => r.json()).then(wrapResults),
};

const API_BASE_URL = "https://family-binger-1.onrender.com";   // Change this if your backend URL is different

export const movieAPI = {
  getPopular: () => fetch(`${API_BASE_URL}/movies/popular`).then(r => r.json()),
  getDetails: (id) => fetch(`${API_BASE_URL}/movies/${id}`).then(r => r.json()),
};

export const seriesAPI = {
  getPopular: () => fetch(`${API_BASE_URL}/series/popular`).then(r => r.json()),
  getDetails: (id) => fetch(`${API_BASE_URL}/series/${id}`).then(r => r.json()),
};

export const liveTVAPI = {
  getChannels: () => fetch(`${API_BASE_URL}/live/channels`).then(r => r.json()),
};

export const searchAPI = {
  search: (query) => fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`).then(r => r.json()),
};

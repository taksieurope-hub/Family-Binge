// src/lib/watchHistory.js
// Centralized watch history helpers — imported by ContentDetailModal, ContentSection, ContinueWatchingSection

const WATCH_HISTORY_KEY = 'familybinge_watch_history';

export const getWatchHistory = () => {
  try {
    const history = localStorage.getItem(WATCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch {
    return [];
  }
};

export const saveToWatchHistory = (content, season = 1, episode = 1, progress = 0) => {
  try {
    const history = getWatchHistory();
    const existingIndex = history.findIndex(h => h.id === content.id && h.type === content.type);

    const historyItem = {
      id: content.id,
      title: content.title,
      poster: content.poster,
      backdrop: content.backdrop,
      type: content.type,
      year: content.year,
      rating: content.rating,
      season,
      episode,
      progress,
      lastWatched: Date.now(),
    };

    if (existingIndex >= 0) {
      history[existingIndex] = historyItem;
    } else {
      history.unshift(historyItem);
    }

    const trimmedHistory = history.slice(0, 20);
    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(trimmedHistory));
    window.dispatchEvent(new Event('watchHistoryUpdated'));
  } catch (e) {
    console.error('Error saving watch history:', e);
  }
};

export const removeFromWatchHistory = (id, type) => {
  try {
    const history = getWatchHistory();
    const filtered = history.filter(h => !(h.id === id && h.type === type));
    localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Error removing from watch history:', e);
  }
};
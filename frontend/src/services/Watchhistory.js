const BACKEND = 'https://family-binge-g5hf.onrender.com';

const getUid = () => localStorage.getItem('fb_uid');

export const getWatchHistory = async () => {
  const uid = getUid();
  if (uid) {
    try {
      const res = await fetch(`${BACKEND}/api/auth/watch-history/${uid}`);
      if (res.ok) {
        const data = await res.json();
        return data.history || [];
      }
    } catch {}
  }
  try {
    const local = localStorage.getItem('familybinge_watch_history');
    return local ? JSON.parse(local) : [];
  } catch { return []; }
};

export const saveToWatchHistory = async (content, season = 1, episode = 1, progress = 0) => {
  const uid = getUid();
  const item = {
    id: content.id,
    title: content.title,
    poster: content.poster || null,
    backdrop: content.backdrop || null,
    type: content.type,
    year: content.year || null,
    rating: content.rating || null,
    season,
    episode,
    progress,
    lastWatched: Date.now(),
  };

  if (uid) {
    try {
      await fetch(`${BACKEND}/api/auth/watch-history/${uid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
    } catch {}
  }

  try {
    const history = JSON.parse(localStorage.getItem('familybinge_watch_history') || '[]');
    const idx = history.findIndex(h => h.id === content.id && h.type === content.type);
    if (idx >= 0) history[idx] = item; else history.unshift(item);
    localStorage.setItem('familybinge_watch_history', JSON.stringify(history.slice(0, 20)));
    window.dispatchEvent(new Event('watchHistoryUpdated'));
  } catch {}
};

export const removeFromWatchHistory = async (id, type) => {
  const uid = getUid();
  if (uid) {
    try {
      await fetch(`${BACKEND}/api/auth/watch-history/${uid}/${id}/${type}`, { method: 'DELETE' });
    } catch {}
  }
  try {
    const history = JSON.parse(localStorage.getItem('familybinge_watch_history') || '[]');
    localStorage.setItem('familybinge_watch_history', JSON.stringify(history.filter(h => !(h.id === id && h.type === type))));
  } catch {}
};

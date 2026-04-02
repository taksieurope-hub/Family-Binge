# -*- coding: utf-8 -*-
path = r'C:\Users\edahl\Desktop\Family Binge\frontend\src\components\ContentDetailModal.jsx'
c = open(path, 'r', encoding='utf-8').read()

old = """const getWatchHistoryKey = () => {
  const uid = auth.currentUser?.uid || 'guest';
  return "familybinge_watch_history_" + uid;
};"""

new = """const getWatchHistoryKey = () => {
  const uid = auth.currentUser?.uid;
  if (!uid) return null;
  return "familybinge_watch_history_" + uid;
};"""

old2 = """export const getWatchHistory = () => {
  try {
    const history = localStorage.getItem(getWatchHistoryKey());
    return history ? JSON.parse(history) : [];
  } catch { return []; }
};"""

new2 = """export const getWatchHistory = () => {
  try {
    const key = getWatchHistoryKey();
    if (!key) return [];
    const history = localStorage.getItem(key);
    return history ? JSON.parse(history) : [];
  } catch { return []; }
};"""

old3 = """export const removeFromWatchHistory = (id, type) => {
  try {
    const history = getWatchHistory().filter(h => !(h.id === id && h.type === type));
    localStorage.setItem(getWatchHistoryKey(), JSON.stringify(history));
  } catch (e) { console.error(\'Error removing from watch history:\', e); }
};"""

new3 = """export const removeFromWatchHistory = (id, type) => {
  try {
    const key = getWatchHistoryKey();
    if (!key) return;
    const history = getWatchHistory().filter(h => !(h.id === id && h.type === type));
    localStorage.setItem(key, JSON.stringify(history));
  } catch (e) { console.error(\'Error removing from watch history:\', e); }
};"""

if old in c and old2 in c:
    c = c.replace(old, new).replace(old2, new2).replace(old3, new3)
    open(path, 'w', encoding='utf-8').write(c)
    print("Done!")
else:
    print("ERROR: anchor not found")
    print("old1 found:", old in c)
    print("old2 found:", old2 in c)

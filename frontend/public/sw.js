const CACHE_NAME = 'familybinge-v3';
const STATIC_ASSETS = ['/'];

// On install, skip waiting immediately
self.addEventListener('install', event => {
  self.skipWaiting();
});

// On activate, delete all old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Never cache JS, CSS bundles or API calls - always fetch fresh
  if (
    url.pathname.includes('/static/js/') ||
    url.pathname.includes('/static/css/') ||
    url.hostname.includes('onrender.com') ||
    url.hostname.includes('firebase') ||
    url.hostname.includes('firestore') ||
    url.hostname.includes('googleapis')
  ) {
    event.respondWith(fetch(event.request));
    return;
  }

  // For everything else, network first then cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

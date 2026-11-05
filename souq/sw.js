const CACHE = 'souq-v27';
const APP_FILES = ['./', './index.html', './manifest.json', './icon.svg'];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll(APP_FILES);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    // Remove only older SouQ caches; never delete caches belonging to other apps
    // hosted on the same origin.
    await Promise.all(
      keys
        .filter(key => key.startsWith('souq-v') && key !== CACHE)
        .map(key => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Do not intercept Firebase, Google, or any other cross-origin requests.
  if (url.origin !== self.location.origin) return;

  const isPage =
    request.mode === 'navigate' ||
    url.pathname.endsWith('/index.html') ||
    url.pathname.endsWith('/souq/');

  if (isPage) {
    // Always prefer the latest website; use the cached shell only when offline.
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then(response => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put('./index.html', copy));
          }
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Cache same-origin app assets, while refreshing the cache after a network hit.
  event.respondWith(
    caches.match(request).then(cached => {
      const network = fetch(request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
        }
        return response;
      });
      return cached || network;
    })
  );
});

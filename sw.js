const CACHE_NAME = 'kerf-bender-v1';
const ASSETS = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install Event (Assets cachen)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching assets');
        return cache.addAll(ASSETS);
      })
  );
});

// Fetch Event (Offline-Bereitstellung)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Liefere aus Cache, falls vorhanden, sonst hole aus dem Netz
        return response || fetch(event.request);
      })
  );
});
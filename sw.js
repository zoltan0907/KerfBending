const CACHE_NAME = 'kerf-bender-v2'; // Version erhöht!
const ASSETS = [
  './index.html', // Achte darauf, dass deine Hauptdatei so heißt, oder ändere es hier auf kerf-box-calculator.html
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install Event (Assets cachen)
self.addEventListener('install', event => {
  // Zwingt den neuen Service Worker, sofort aktiv zu werden
  self.skipWaiting(); 
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching assets (v2)');
        return cache.addAll(ASSETS);
      })
  );
});

// Activate Event (Alte Caches aufräumen)
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          // Lösche alle Caches, die nicht der aktuellen CACHE_NAME Version entsprechen
          if (cache !== CACHE_NAME) {
            console.log('Lösche alten Cache:', cache);
            return caches.delete(cache);
          }
        })
      );
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
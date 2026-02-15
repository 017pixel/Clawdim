const CACHE_NAME = 'clawdim-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/css/main.css',
  '/src/css/eyes.css',
  '/src/css/menu.css',
  '/src/css/settings.css',
  '/src/utils/helpers.js',
  '/src/utils/storage.js',
  '/src/utils/config.js',
  '/src/services/cerebras.js',
  '/src/services/nvidia.js',
  '/src/services/api.js',
  '/src/services/tts.js',
  '/src/services/stt.js',
  '/src/js/eyes.js',
  '/src/js/menu.js',
  '/src/js/chat.js',
  '/src/js/settings.js',
  '/src/js/app.js',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200) {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseToCache));
            
            return response;
          })
          .catch(() => {
            return caches.match('/index.html');
          });
      })
  );
});
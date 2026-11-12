// Service Worker untuk mengaktifkan fitur Install Android APK / WebAPK
const CACHE_NAME = 'sikinerja-ai-v2.5';
const ASSETS_TO_CACHE = [
  'https://reeonetwo.github.io/ekinerja/',
  'https://reeonetwo.github.io/ekinerja/index.html',
  'https://reeonetwo.github.io/ekinerja/manifest.json'
];

// Tahap Instalasi Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {
        // Abaikan jika file belum tersedia saat pengujian lokal
      });
    })
  );
  self.skipWaiting();
});

// Tahap Aktivasi & Pembersihan Cache Lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Strategi Network-First agar data & Google Drive API selalu sinkron
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const cloned = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

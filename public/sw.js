self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open('crawler-trap-v1').then((cache) => {
      return cache.addAll([
        '/test/runtime/service-worker',
        '/test/runtime/service-worker/secret-data'
      ]);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activated');
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('secret-data')) {
    event.respondWith(
      new Response('SECRET_DATA_CACHED_BY_SERVICE_WORKER', {
        headers: { 'Content-Type': 'text/plain' }
      })
    );
  }
});

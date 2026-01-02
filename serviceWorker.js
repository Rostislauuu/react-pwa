importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

  workbox.precaching.precacheAndRoute([
    {
      url: '/index.html',
      revision: '1',
    },
  ]);

  // Pokemon API
  workbox.routing.registerRoute(
    ({ url, request }) => request.method === "GET" && url.href.includes("/api/"),
    new workbox.strategies.NetworkFirst({
      cacheName: "api-cache",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        })
      ]
    })
  );

  // Cache images
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'image-cache',
    })
  );

  // Serve Cached Resources
  workbox.routing.registerRoute(
    ({url}) => url.origin === self.location.origin,
    new workbox.strategies.CacheFirst({
      cacheName: 'static-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 7 * 24 * 60 * 60,  // Cache static resources for 7 days
        }),
      ],
    })
  );

   // Serve HTML pages with Network First and offline fallback (App Shell)
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    async ({ event }) => {
      try {
        const response = await new workbox.strategies.NetworkFirst({
          cacheName: 'pages-cache',
          plugins: [
            new workbox.expiration.ExpirationPlugin({
              maxEntries: 50,
            }),
          ],
        }).handle({ event });
        return response || await caches.match('/index.html');
      } catch (error) {
        return await caches.match('/index.html');
      }
    }
  );

  // Clean up old/unused caches during activation
  self.addEventListener('activate', event => {
    const currentCaches = [
      workbox.core.cacheNames.precache,
      'api-cache',
      'image-cache',
      'pages-cache',
      'static-cache'
    ];

    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!currentCaches.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });

} else {
  console.log('Workbox failed to load');
}

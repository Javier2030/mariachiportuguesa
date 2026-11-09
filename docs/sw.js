const CACHE = 'azp-acarigua-2611';
const PRECARGA = ['/', '/manifest.json', '/logo.png', '/fotos/hero-m.avif', '/fotos/hero-m.jpg'];

self.addEventListener('install', ev => {
  ev.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECARGA))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', ev => {
  ev.waitUntil(
    caches.keys()
      .then(claves => Promise.all(claves.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', ev => {
  const pedido = ev.request;
  if (pedido.method !== 'GET') return;
  if (new URL(pedido.url).origin !== self.location.origin) return;

  if (pedido.mode === 'navigate') {
    ev.respondWith(
      fetch(pedido)
        .then(resp => {
          const guardar = resp.clone();
          caches.open(CACHE).then(cache => cache.put(pedido, guardar));
          return resp;
        })
        .catch(() => caches.match(pedido).then(previo => previo || caches.match('/')))
    );
    return;
  }

  ev.respondWith(
    caches.match(pedido).then(previo => {
      const red = fetch(pedido)
        .then(resp => {
          if (resp.ok) {
            const guardar = resp.clone();
            caches.open(CACHE).then(cache => cache.put(pedido, guardar));
          }
          return resp;
        })
        .catch(() => previo);
      return previo || red;
    })
  );
});

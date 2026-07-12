/* Service Worker — Mariachi Bonito Tecalitlán
   HTML: red primero (siempre fresco), caché de respaldo (offline).
   Assets (fotos/fuentes/iconos): caché primero (visitas repetidas = 0 ms). */
const C = 'mb-v2';
const CORE = [
  '/', '/manifest.json', '/logo.png',
  '/fonts/fraunces-var.woff2', '/fonts/fraunces-italic.woff2', '/fonts/mulish-var.woff2',
  '/fotos/hero-m.avif', '/fotos/hero-m.jpg'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(C).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks =>
    Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(C).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match('/')))
    );
    return;
  }

  // Assets: stale-while-revalidate — muestra del caché al instante Y baja la versión fresca
  // en segundo plano, para que fotos nuevas/cambiadas lleguen solas en la siguiente visita.
  e.respondWith(
    caches.match(req).then(hit => {
      const fresh = fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(C).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => hit);
      return hit || fresh;
    })
  );
});

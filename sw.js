/* Service worker do Estuda — habilita instalação como app e funcionamento offline.
   Ao mudar arquivos, troque 'estuda-v1' por 'estuda-v2' para forçar atualização. */
const CACHE = 'estuda-v6';
const ASSETS = [
  './', './index.html', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png',
  './whale-light.png', './whale-dark.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE ? caches.delete(k) : null)))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Não intercepta chamadas externas (Google Sheets / fontes) — dados sempre ao vivo.
  if (url.origin !== location.origin) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request)).catch(() => caches.match('./index.html'))
  );
});

/* global self */
const CACHE_NAME = "songsniffer-shell-v1";

// App shell resursi koje želimo da rade offline.
// Kod Vite/React builda, /assets/* fajlovi imaju hash u imenu.
// Za početak ćemo cacheati statiku koju znamo + navigacije ćemo rješavati network->cache fallback.
const PRECACHE_URLS = [
  "/", // SPA entry
  "/index.html",
  "/offline.html",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

// Cache-first za statiku, a za navigacije (SPA) fallback na cache/offline.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Samo za isti origin
  if (url.origin !== self.location.origin) return;

  // SPA navigacije: uvijek vrati cached "/" (app shell), a ako ne postoji, offline fallback.
  if (req.mode === "navigate") {
    event.respondWith(
      caches.match("/").then((cached) => cached || fetch(req).catch(() => caches.match("/offline.html")))
    );
    return;
  }

  // Za ostalo: cache-first, pa network, pa offline fallback (ako je HTML)
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          // Cacheaj samo uspješne GET odgovore
          if (req.method === "GET" && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => {
          if (req.headers.get("accept")?.includes("text/html")) {
            return caches.match("/offline.html");
          }
        });
    })
  );
});

/* global self */
const CACHE_NAME = "songsniffer-shell-v1";

// App shell resursi for offline work
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

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.origin !== self.location.origin) return;

  // SPA navigation
  if (req.mode === "navigate") {
    event.respondWith(
      caches.match("/").then((cached) => cached || fetch(req).catch(() => caches.match("/offline.html")))
    );

    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((res) => {
          if (req.method === "GET" && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }

          return res;
        })
        .catch(() => {
          if (req.headers.get("accept")?.includes("text/html")) {
            return caches.match("/offline.html"); // offline fallback
          }
        });
    })
  );
});

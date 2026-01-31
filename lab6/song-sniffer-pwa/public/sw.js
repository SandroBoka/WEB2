/* global self */
const CACHE_NAME = "songsniffer-shell-v1";

// App shell resources for offline work
const PRECACHE_URLS = [
  "/", // SPA entry
  "/index.html",
  "/offline.html",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png"
];

const DB_NAME = "songsniffer-db";
const STORE = "recordings";

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

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);

    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
  });
}

async function getAllPending(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);
    const index = store.index("status");
    const req = index.getAll("pending");

    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result || []);
  });
}

async function updateItem(db, id, patch) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    const getReq = store.get(id);

    getReq.onerror = () => reject(getReq.error);
    getReq.onsuccess = () => {
      const current = getReq.result;

      if (!current) return resolve(null);

      const next = { ...current, ...patch};
      const putReq = store.put(next);

      putReq.onerror = () => reject(putReq.error);
      putReq.onsuccess = () => resolve(next);
    }
  });
}

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-recordings") {
    event.waitUntil(syncPendingRecordings());
  }
});

async function syncPendingRecordings() {
  const db = await openDB();
  const pending = await getAllPending(db);

  for (const item of pending) {
    try {
      const form = new FormData();
      form.append("file", item.blob, `recording-${item.id}.webm`);

      const res = await fetch("/api/recognize", {
        method: "POST",
        body: form
      });

      if (!res.ok) {
        await updateItem(db, item.id, { status: "failed", error: "Upload failed" });

        continue;
      }

      const data = await res.json();

      await updateItem(db, item.id, {
        status: "recognized",
        result: data.result || null,
        error: null
      });

      await notifyClientsSyncDone();
    } catch {
      console.error("Sync failed for recording", item.id);
    }
  }
}

async function notifyClientsSyncDone() {
  const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  for (const client of clients) {
    client.postMessage({ type: "SYNC_DONE" });
  }
}

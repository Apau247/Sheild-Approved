const CACHE_NAME = 'iron-vault-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/services.html',
  '/login.html',
  '/signup.html',
  '/client-portal.html',
  '/admin-dashboard.html',
  '/request-access.html',
  '/search.html',
  '/forgot-password.html',
  '/css/style.css',
  '/css/__colors_default.css',
  '/css/__colors_dark.css',
  '/css/__custom.css',
  '/css/responsive.css',
  '/js/nav.js',
  '/js/__scripts.js',
  '/images/logo.png',
  '/manifest.json'
];

// IndexedDB for offline form queue
const DB_NAME = 'iron-vault-offline';
const DB_VERSION = 1;
const STORE_NAME = 'formQueue';

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

async function queueFormSubmission(url, method, headers, body) {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await new Promise((resolve, reject) => {
    const req = store.add({ url, method, headers, body, timestamp: Date.now() });
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function processQueuedForms() {
  const db = await openDb();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const items = await new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  for (const item of items) {
    try {
      const response = await fetch(item.url, {
        method: item.method,
        headers: item.headers,
        body: item.body
      });
      if (response.ok) {
        const deleteTx = db.transaction(STORE_NAME, 'readwrite');
        const deleteStore = deleteTx.objectStore(STORE_NAME);
        await new Promise((resolve, reject) => {
          const req = deleteStore.delete(item.id);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      }
    } catch (e) {
      // Leave in queue for next sync attempt
    }
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).catch(() => {
      // Silent fail for optional assets
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // API calls: network first, cache fallback, queue if offline
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          // Queue POST requests for later sync
          if (request.method === 'POST') {
            try {
              const body = await request.clone().text();
              const headers = {};
              request.headers.forEach((value, key) => { headers[key] = value; });
              await queueFormSubmission(request.url, request.method, headers, body);
              return new Response(JSON.stringify({ ok: true, queued: true }), {
                status: 202,
                headers: { 'Content-Type': 'application/json' }
              });
            } catch (e) {
              return new Response(JSON.stringify({ ok: false, error: 'Offline — form queued for sync.' }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
              });
            }
          }
          return new Response(JSON.stringify({ ok: false, error: 'Network unavailable.' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  // Static assets: cache first, network fallback
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok && request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});

// Background sync for queued forms
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(processQueuedForms());
  }
});

// Push notification support placeholder
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'Iron Vault Security', {
      body: data.body || 'You have a new notification.',
      icon: 'images/logo.png',
      badge: 'images/logo.png',
      data: data.url || '/'
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data || '/')
  );
});

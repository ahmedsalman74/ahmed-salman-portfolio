const CACHE = "ahmed-ask-static-v1";
const OFFLINE = "/ask/offline.html";
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll([OFFLINE])));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then(async (names) => {
    await Promise.all(names.filter((name) => name.startsWith("ahmed-ask-static-") && name !== CACHE).map((name) => caches.delete(name)));
    await self.clients.claim();
  }));
});
self.addEventListener("fetch", (event) => {
  // Never cache inbox data, authentication, API responses, or rendered pages.
  if (event.request.method !== "GET" || event.request.mode !== "navigate") return;
  event.respondWith(fetch(event.request).catch(async () => (await caches.match(OFFLINE)) || Response.error()));
});

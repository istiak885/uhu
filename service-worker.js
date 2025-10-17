self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {title:"It’s time!", body:"Open your surprise 💖"};
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "photo.jpg",
      badge: "photo.jpg",
      vibrate: [80,40,80],
      data: { url: data.url || "./index.html" }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data.url || "./index.html";
  event.waitUntil(
    clients.matchAll({type:'window',includeUncontrolled:true})
      .then(list => list.find(w=>w.url.includes(url))?.focus() || clients.openWindow(url))
  );
});

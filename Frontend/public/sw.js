// ZealPlane Push Notification Service Worker
self.addEventListener('push', function (event) {
  if (event.data) {
    let data = {};
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'ZealPlane Update', body: event.data.text() };
    }

    const options = {
      body: data.body || 'New comic chapter & manga breakdown is live on ZealPlane!',
      icon: data.icon || 'https://www.zealplane.com/favicon.png',
      badge: 'https://www.zealplane.com/favicon.png',
      image: data.image || undefined,
      data: {
        url: data.url || 'https://www.zealplane.com'
      },
      vibrate: [150, 50, 150],
      tag: 'zealplane-notification-' + Date.now(),
      renotify: true,
      actions: [
        { action: 'open', title: 'Read Now' }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'ZealPlane Update', options)
    );
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : 'https://www.zealplane.com';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

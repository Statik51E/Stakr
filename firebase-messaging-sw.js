// Firebase Messaging Service Worker + Stakr PWA Cache + Reminders
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCEh9YsImC9mTkKjI8cmSEw6o83YH5OmlI",
  authDomain: "stakr-854fd.firebaseapp.com",
  projectId: "stakr-854fd",
  storageBucket: "stakr-854fd.firebasestorage.app",
  messagingSenderId: "960483081159",
  appId: "1:960483081159:web:3e7d523496ec902a79f7e2"
});

const messaging = firebase.messaging();

// Handle background push notifications
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'Stakr 🪶';
  const options = {
    body: payload.notification?.body || 'Kraa ! Ton corbeau a quelque chose à te dire...',
    icon: './icon-192.png',
    badge: './icon-192.png',
    vibrate: [100, 50, 100],
    data: { url: './' }
  };
  self.registration.showNotification(title, options);
});

// ===== REMINDER SYSTEM IN SERVICE WORKER =====
let reminders = [];

// Receive reminders from the main page
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SET_REMINDERS') {
    reminders = event.data.reminders || [];
    // Start checking if not already
    startReminderCheck();
  }
});

let reminderInterval = null;
function startReminderCheck() {
  if (reminderInterval) return;
  reminderInterval = setInterval(() => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    const triggered = [];
    reminders = reminders.filter(r => {
      if (r.time === currentTime) {
        self.registration.showNotification('Stakr — Rappel 🪶', {
          body: r.message,
          icon: './icon-192.png',
          badge: './icon-192.png',
          vibrate: [200, 100, 200, 100, 200],
          tag: 'stakr-reminder-' + r.id,
          data: { url: './' }
        });
        triggered.push(r.id);
        return false;
      }
      return true;
    });

    // Notify the page that reminders were triggered
    if (triggered.length > 0) {
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({ type: 'REMINDERS_TRIGGERED', ids: triggered });
        });
      });
    }
  }, 15000); // Check every 15 seconds
}

// Click on notification → open app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('stakr') && 'focus' in client) return client.focus();
      }
      return clients.openWindow('./');
    })
  );
});

// PWA Cache
const CACHE_NAME = 'stakr-v19';
const CACHE_FILES = ['./index.html', './stakr-raven.glb', './map.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(CACHE_FILES))
      .catch(() => {}) // Don't block install if cache fails
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // Network-first for HTML (always get latest), cache-first for assets
  if (e.request.url.endsWith('.html') || e.request.url.endsWith('/')) {
    e.respondWith(
      fetch(e.request).then(r => {
        const clone = r.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return r;
      }).catch(() => caches.match(e.request))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(r => {
        if (r) return r;
        return fetch(e.request).then(resp => {
          // Auto-cache .glb model files for offline use
          if (e.request.url.endsWith('.glb')) {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          }
          return resp;
        });
      })
    );
  }
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

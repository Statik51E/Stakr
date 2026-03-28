// Firebase Messaging Service Worker + Stakr PWA Cache
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
const CACHE_NAME = 'stakr-v3';
const CACHE_FILES = ['./index.html'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CACHE_FILES)));
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

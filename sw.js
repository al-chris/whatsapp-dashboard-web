// Service Worker for WhatsApp Chat Analyzer PWA
const CACHE_NAME = 'whatsapp-analyzer-v1';
const urlsToCache = [
  '/whatsapp-dashboard-web/',
  '/whatsapp-dashboard-web/index.html',
  '/whatsapp-dashboard-web/styles/main.css',
  '/whatsapp-dashboard-web/styles/components.css',
  '/whatsapp-dashboard-web/js/app.js',
  '/whatsapp-dashboard-web/js/charts.js',
  '/whatsapp-dashboard-web/js/core/ChatParser.js',
  '/whatsapp-dashboard-web/js/d3.layout.cloud.fixed.js',
  '/whatsapp-dashboard-web/logo.png',
  '/whatsapp-dashboard-web/assets/favicon/android-chrome-192x192.png',
  '/whatsapp-dashboard-web/assets/favicon/android-chrome-512x512.png',
  '/whatsapp-dashboard-web/assets/favicon/apple-touch-icon.png',
  '/whatsapp-dashboard-web/assets/favicon/favicon-16x16.png',
  '/whatsapp-dashboard-web/assets/favicon/favicon-32x32.png',
  '/whatsapp-dashboard-web/assets/favicon/favicon.ico',
  // External CDN resources
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://cdn.jsdelivr.net/npm/chartjs-chart-wordcloud@4.4.4',
  'https://d3js.org/d3.v4.js'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Cache install failed:', error);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        // Clone the request because it's a stream
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response because it's a stream
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        }).catch(() => {
          // Return offline page for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('/whatsapp-dashboard-web/index.html');
          }
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle background sync (optional)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync logic here
      console.log('Background sync triggered')
    );
  }
});

// Handle push notifications (optional)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/whatsapp-dashboard-web/assets/favicon/android-chrome-192x192.png',
      badge: '/whatsapp-dashboard-web/assets/favicon/android-chrome-192x192.png',
      vibrate: [200, 100, 200],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/whatsapp-dashboard-web/')
  );
});

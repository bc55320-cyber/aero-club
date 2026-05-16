// Nom du cache (incrémentez v1, v2, etc. lors de modifications majeures)
const CACHE_NAME = 'aero-club-v1';

// Liste des fichiers à mettre en cache pour le mode hors-ligne
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './manifest.json',
     './logo.jpg',
    'https://images.unsplash.com/photo-1473960104509-546e8b811317?auto=format&fit=crop&w=1200&q=80'
];

// 1. Événement d'INSTALLATION : On stocke les fichiers
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Mise en cache des fichiers statiques');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// 2. Événement d'ACTIVATION : On nettoie les vieux caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Nettoyage de l\'ancien cache', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// 3. Événement FETCH : Intercepter uniquement les ressources locales
self.addEventListener('fetch', (event) => {
    // On ne gère que les requêtes vers nos propres fichiers (statiques)
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    return response || fetch(event.request);
                })
        );
    }
    // Les requêtes Firebase et OpenWeather passent directement par le réseau sans interférence
});

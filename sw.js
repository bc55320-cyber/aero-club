// Nom du cache (incrémentez v1, v2, etc. lors de modifications majeures)
const CACHE_NAME = 'aero-club-v1';

// Liste des fichiers à mettre en cache pour le mode hors-ligne
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './manifest.json',
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

// 3. Événement FETCH : On intercepte les requêtes réseau
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Retourne le fichier du cache s'il existe, sinon fait la requête réseau
                return response || fetch(event.request);
            })
            .catch(() => {
                // Optionnel : Retourner une page d'erreur spécifique ici
                console.log('Ressource non trouvée et pas de réseau.');
            })
    );
});
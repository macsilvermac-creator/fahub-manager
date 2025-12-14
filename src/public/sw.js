
const CACHE_NAME = 'fahub-manager-v3.1-cache';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// 1. Instalação: Cacheia o App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 [SW] Cache aberto');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// 2. Ativação: Limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🧹 [SW] Limpando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch: Estratégia Stale-While-Revalidate
// Serve do cache imediatamente, mas busca na rede em background para atualizar
self.addEventListener('fetch', (event) => {
  // Ignora requisições não-GET, esquemas chrome-extension, ou API calls
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http') || event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((response) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Se a resposta da rede for válida, atualiza o cache
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
           // Se falhar rede e não tiver cache, retorna nada (ou página offline customizada)
        });

        // Retorna o cache se existir, senão espera a rede
        return response || fetchPromise;
      });
    })
  );
});


const CACHE_NAME = 'fahub-manager-v3.5-turbo';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// 1. Instalação: Cacheia o App Shell imediatamente
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Força a ativação imediata
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('⚡ [SW] Cache Turbo Iniciado');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// 2. Ativação: Limpa caches antigos para evitar conflitos de versão
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🧹 [SW] Limpando cache obsoleto:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Inteligente (Stale-While-Revalidate)
self.addEventListener('fetch', (event) => {
  // Ignora requisições de API, extensões e esquemas não-HTTP
  if (!event.request.url.startsWith('http') || event.request.method !== 'GET') return;
  
  // Ignora chamadas ao Gemini ou Firebase direto (deixa a rede cuidar)
  if (event.request.url.includes('googleapis') || event.request.url.includes('firestore')) return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        // A. Busca na rede para atualizar o cache futuro (em background)
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
             // Se falhar rede, sem problemas, o usuário já está vendo o cache
          });

        // B. Retorna o cache IMEDIATAMENTE se existir (Velocidade total), senão espera a rede
        return cachedResponse || fetchPromise;
      });
    })
  );
});
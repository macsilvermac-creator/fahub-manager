
type CacheEntry<T> = {
    data: T;
    timestamp: number;
    ttl: number; // Time to live in ms
};

class CacheService {
    private cache: Map<string, CacheEntry<any>> = new Map();
    private defaultTTL = 5 * 60 * 1000; // 5 minutos padrão

    // Salva dados no cache
    set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
        console.log(`💾 [CACHE] Dados salvos: ${key}`);
    }

    // Recupera dados se não estiverem expirados
    get<T>(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        const now = Date.now();
        if (now - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            console.log(`⌛ [CACHE] Expirado: ${key}`);
            return null;
        }

        console.log(`🚀 [CACHE] Recuperado (Rápido): ${key}`);
        return entry.data;
    }

    // Limpa cache específico (útil quando atualizamos dados)
    invalidate(keyPattern: string) {
        for (const key of this.cache.keys()) {
            if (key.includes(keyPattern)) {
                this.cache.delete(key);
                console.log(`🧹 [CACHE] Limpo: ${key}`);
            }
        }
    }

    clearAll() {
        this.cache.clear();
    }
}

export const cacheService = new CacheService();

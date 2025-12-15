
import { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

/**
 * Hook reativo para dados do StorageService.
 * Localizado em utils para evitar conflitos de cache de build em /hooks
 */
export function useAppStore<T>(key: string, getter: () => T): T {
    const [data, setData] = useState<T>(getter());

    useEffect(() => {
        // Se inscreve para ouvir mudanças
        const unsubscribe = storageService.subscribe(key, () => {
            setData(getter());
        });
        
        // Garante que o dado está fresco ao montar
        setData(getter());

        return () => {
            unsubscribe();
        };
    }, [key, getter]);

    return data;
}

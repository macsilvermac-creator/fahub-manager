
import { useState, useEffect, useRef } from 'react';
import { storageService } from '../services/storageService';

/**
 * Hook reativo para dados do StorageService com Deep Equality Check.
 * Evita que componentes re-renderizem se o dado novo for idêntico ao antigo.
 */
export function useAppStore<T>(key: string, getter: () => T): T {
    const [data, setData] = useState<T>(getter());
    const dataRef = useRef<T>(data);

    useEffect(() => {
        // Se inscreve para ouvir mudanças
        const unsubscribe = storageService.subscribe(key, () => {
            const newData = getter();
            
            // Check for equality using JSON stringify (fast enough for our data sizes)
            // For huge datasets, we rely on the fact that storageService changes reference
            if (JSON.stringify(newData) !== JSON.stringify(dataRef.current)) {
                dataRef.current = newData;
                setData(newData);
            }
        });
        
        // Garante que o dado está fresco ao montar (Lazy load trigger)
        const currentData = getter();
        if (JSON.stringify(currentData) !== JSON.stringify(dataRef.current)) {
             dataRef.current = currentData;
             setData(currentData);
        }

        return () => {
            unsubscribe();
        };
    }, [key, getter]);

    return data;
}

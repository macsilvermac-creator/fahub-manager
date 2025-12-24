
import { useState, useEffect, useRef } from 'react';
import { storageService } from '../services/storageService';

export function useAppStore<T>(key: string, getter: () => T): T {
    const [data, setData] = useState<T>(getter());
    const dataRef = useRef<T>(data);

    useEffect(() => {
        // Correctly used subscribe method added to storageService
        const unsubscribe = storageService.subscribe(key, () => {
            const newData = getter();
            if (JSON.stringify(newData) !== JSON.stringify(dataRef.current)) {
                dataRef.current = newData;
                setData(newData);
            }
        });
        
        // Verificação imediata para evitar lag de montagem
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


import { useState, useEffect, useRef } from 'react';
import { storageService } from '../services/storageService';

export function useAppStore<T>(key: string, getter: () => T): T {
    const [data, setData] = useState<T>(getter());
    const dataRef = useRef<T>(data);

    useEffect(() => {
        const unsubscribe = storageService.subscribe(key, () => {
            const newData = getter();
            if (JSON.stringify(newData) !== JSON.stringify(dataRef.current)) {
                dataRef.current = newData;
                setData(newData);
            }
        });
        
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

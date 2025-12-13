
import { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

export function useData<T>(key: string, getter: () => T): T {
    const [data, setData] = useState<T>(getter());

    useEffect(() => {
        // Inscreve no sistema de eventos do storageService
        // Se o método subscribe não existir (ainda não atualizado), fallback seguro
        if (!storageService.subscribe) return;

        const unsubscribe = storageService.subscribe(key, () => {
            // Quando notificado, busca o dado atualizado
            const newData = getter();
            setData(newData);
        });

        // Limpeza ao desmontar
        return () => {
            unsubscribe();
        };
    }, [key, getter]);

    return data;
}

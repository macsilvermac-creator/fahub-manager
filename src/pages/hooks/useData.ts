
import { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

// Tipagem para garantir que só pedimos chaves que existem no sistema
type DataKeys = 'players' | 'games' | 'transactions' | 'invoices' | 'staff' | 'practice' | 'activeProgram' | 'settings' | 'feed' | 'tasks';

export function useData<T>(key: string, getter: () => T): T {
    // Inicializa com o valor atual do getter (Lazy Load imediato se já estiver em RAM)
    const [data, setData] = useState<T>(getter());

    useEffect(() => {
        // Se inscreve para ouvir mudanças nessa chave específica do storageService
        // O storageService dispara esse listener sempre que saveAndCache() é chamado
        const unsubscribe = storageService.subscribe(key, () => {
            const newData = getter();
            setData(newData);
        });

        // Limpeza ao desmontar o componente para evitar memory leaks
        return () => {
            unsubscribe();
        };
    }, [key, getter]);

    return data;
}
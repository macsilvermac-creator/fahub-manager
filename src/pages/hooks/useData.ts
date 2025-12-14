
import { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';

// Tipagem para garantir que só pedimos chaves que existem
type DataKeys = 'players' | 'games' | 'transactions' | 'invoices' | 'staff' | 'practice' | 'activeProgram' | 'settings' | 'feed' | 'tasks';

export function useData<T>(key: string, getter: () => T): T {
    // Inicializa com o valor atual do getter (Lazy Load imediato se já estiver em RAM)
    const [data, setData] = useState<T>(getter());

    useEffect(() => {
        // Se inscreve para ouvir mudanças nessa chave específica
        const unsubscribe = storageService.subscribe(key, () => {
            // Quando notificado, busca o dado atualizado da RAM
            const newData = getter();
            setData(newData);
        });

        // Limpeza ao desmontar o componente
        return () => {
            unsubscribe();
        };
    }, [key, getter]);

    return data;
}

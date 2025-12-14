
import { useState, useEffect } from 'react';
// CORREÇÃO: Caminho relativo ajustado para sair de 'pages/hooks' e chegar em 'services'
import { storageService } from '../../services/storageService';

// Tipagem segura das chaves disponíveis
type DataKeys = 'players' | 'games' | 'transactions' | 'invoices' | 'staff' | 'practice' | 'activeProgram' | 'settings';

export function useData<T>(key: string, getter: () => T): T {
    const [data, setData] = useState<T>(getter());

    useEffect(() => {
        // Inscreve no sistema de eventos do storageService
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

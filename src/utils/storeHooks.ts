
import { useState, useEffect, useRef } from 'react';
import { storageService } from '../services/storageService';

/**
 * Hook reativo para dados do StorageService com Deep Equality Check.
 * Evita que componentes re-renderizem se o dado novo for idêntico ao antigo.
 * 
 * @param key Chave interna do storage (ex: 'players', 'games')
 * @param getter Função que retorna o dado atual (ex: storageService.getPlayers)
 */
export function useAppStore<T>(key: string, getter: () => T): T {
    const [data, setData] = useState<T>(getter());
    const dataRef = useRef<T>(data);

    useEffect(() => {
        // Se inscreve para ouvir mudanças no StorageService
        const unsubscribe = storageService.subscribe(key, () => {
            const newData = getter();
            
            // Verificação de igualdade simples (JSON) para evitar renders desnecessários
            // Para datasets gigantes, confiamos que o storageService muda a referência do objeto
            if (JSON.stringify(newData) !== JSON.stringify(dataRef.current)) {
                dataRef.current = newData;
                setData(newData);
            }
        });
        
        // Garante que o dado está fresco ao montar o componente (caso tenha mudado durante a navegação)
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

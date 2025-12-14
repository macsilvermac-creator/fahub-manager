
import { Game } from '../types';

class LiveGameService {
    private channel: BroadcastChannel | null = null;
    private listeners: ((data: any) => void)[] = [];

    constructor() {
        // Proteção Crítica: Só inicializa BroadcastChannel se estiver no navegador (Client-side)
        // Isso previne erros durante o build do Vite/Vercel (SSR) onde 'window' não existe
        if (typeof window !== 'undefined' && typeof BroadcastChannel !== 'undefined') {
            try {
                this.channel = new BroadcastChannel('fahub_war_room');
                this.channel.onmessage = (event) => {
                    this.notifyListeners(event.data);
                };
            } catch (e) {
                console.warn('BroadcastChannel error:', e);
            }
        }
    }

    public subscribe(callback: (data: any) => void): () => void {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    private notifyListeners(data: any) {
        this.listeners.forEach(callback => callback(data));
    }

    public broadcastUpdate(gameId: number, type: 'SCORE' | 'CLOCK' | 'FOUL' | 'STATUS', payload: Partial<Game>) {
        // Se não houver canal (ex: server-side ou erro), ignora silenciosamente
        if (!this.channel) return;
        
        const message = {
            gameId,
            type,
            payload,
            timestamp: Date.now()
        };
        
        try {
            this.channel.postMessage(message);
            // Notifica a própria aba também para feedback imediato na UI (Optimistic UI)
            this.notifyListeners(message);
        } catch (e) {
            console.error('Broadcast error:', e);
        }
    }
}

// CORREÇÃO AQUI: Exportando com 'S' maiúsculo para bater com os imports
export const liveGameService = new LiveGameService();


import { Game } from '../types';

class LiveGameService {
    private channel: BroadcastChannel | null = null;
    private listeners: ((data: any) => void)[] = [];

    constructor() {
        // Verifica suporte a BroadcastChannel (evita erro em ambientes sem suporte)
        if (typeof BroadcastChannel !== 'undefined') {
            this.channel = new BroadcastChannel('fahub_war_room');
            this.channel.onmessage = (event) => {
                this.notifyListeners(event.data);
            };
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
        if (!this.channel) return;
        
        const message = {
            gameId,
            type,
            payload,
            timestamp: Date.now()
        };
        
        this.channel.postMessage(message);
        // Notifica a própria aba também para feedback imediato na UI
        this.notifyListeners(message);
    }
}

export const liveGameService = new LiveGameService();

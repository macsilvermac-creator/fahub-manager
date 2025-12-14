
import { Game } from '../types';

class LiveGameService {
    private channel: BroadcastChannel | null = null;
    private listeners: ((data: any) => void)[] = [];

    constructor() {
        // Verifica se está no navegador para evitar erro no build do Vercel (Node.js environment)
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
        if (!this.channel) return;
        
        const message = {
            gameId,
            type,
            payload,
            timestamp: Date.now()
        };
        
        try {
            this.channel.postMessage(message);
            this.notifyListeners(message);
        } catch (e) {
            console.error('Broadcast error:', e);
        }
    }
}

export const liveGameService = new LiveGameService();
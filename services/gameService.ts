
import { Game } from '../types';

// Simula WebSockets usando BroadcastChannel API para comunicação entre abas
// Perfeito para o cenário "War Room" onde Juiz, Coach e TV estão no mesmo navegador ou rede local simulada
class LiveGameService {
    private channel: BroadcastChannel;
    private listeners: ((data: any) => void)[] = [];

    constructor() {
        // Verifica suporte ao BroadcastChannel (evita erro em ambientes antigos)
        if (typeof BroadcastChannel !== 'undefined') {
            this.channel = new BroadcastChannel('fahub_war_room');
            this.channel.onmessage = (event) => {
                console.log('⚡ [WAR ROOM] Mensagem recebida:', event.data);
                this.notifyListeners(event.data);
            };
        } else {
            console.warn("BroadcastChannel não suportado neste navegador. War Room desativado.");
            this.channel = { postMessage: () => {}, close: () => {}, onmessage: null } as any;
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

    // Chamado pelo Juiz (Officiating.tsx)
    public broadcastUpdate(gameId: number, type: 'SCORE' | 'CLOCK' | 'FOUL' | 'STATUS', payload: Partial<Game>) {
        const message = {
            gameId,
            type,
            payload,
            timestamp: Date.now()
        };
        this.channel.postMessage(message);
        // Também notifica a própria aba para consistência
        this.notifyListeners(message);
    }
}

export const liveGameService = new LiveGameService();

import { Game } from '../types';

// Simula WebSockets usando BroadcastChannel API para comunicação entre abas
// Perfeito para o cenário "War Room" onde Juiz, Coach e TV estão no mesmo navegador ou rede local simulada
class LiveGameService {
    private channel: BroadcastChannel | null = null;
    private listeners: ((data: any) => void)[] = [];

    constructor() {
        // Verifica suporte ao BroadcastChannel (evita erro em ambientes antigos/testes)
        if (typeof BroadcastChannel !== 'undefined') {
            this.channel = new BroadcastChannel('fahub_war_room');
            this.channel.onmessage = (event) => {
                console.log('⚡ [WAR ROOM] Mensagem recebida:', event.data);
                this.notifyListeners(event.data);
            };
        } else {
            console.warn("BroadcastChannel não suportado neste navegador. War Room desativado.");
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

    // Chamado pelo Juiz (Officiating.tsx) para atualizar placar em tempo real
    public broadcastUpdate(gameId: number, type: 'SCORE' | 'CLOCK' | 'FOUL' | 'STATUS', payload: Partial<Game>) {
        if (!this.channel) return;
        
        const message = {
            gameId,
            type,
            payload,
            timestamp: Date.now()
        };
        
        this.channel.postMessage(message);
        // Também notifica a própria aba para consistência imediata
        this.notifyListeners(message);
    }
}

export const liveGameService = new LiveGameService();
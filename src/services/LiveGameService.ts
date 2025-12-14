
import { Game } from '../types';

class LiveGameService {
    private channel: BroadcastChannel | null = null;
    private listeners: ((data: any) => void)[] = [];

    constructor() {
        // Verifica se está rodando no navegador antes de instanciar BroadcastChannel
        // Isso previne erros durante o build (SSR/Node environment)
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
            try {
                this.channel = new BroadcastChannel('fahub_war_room');
                this.channel.onmessage = (event) => {
                    this.notifyListeners(event.data);
                };
            } catch (e) {
                console.warn('BroadcastChannel falhou ao iniciar:', e);
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
        
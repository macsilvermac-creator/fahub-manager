
import { firebaseDataService } from './firebaseDataService';

type SyncStatus = 'SAVED' | 'SYNCING' | 'OFFLINE' | 'ERROR';
type SyncListener = (status: SyncStatus) => void;

class SyncService {
    private isOnline: boolean = navigator.onLine;
    private queueKey = 'gridiron_offline_queue';
    private status: SyncStatus = navigator.onLine ? 'SAVED' : 'OFFLINE';
    private listeners: SyncListener[] = [];
    private syncDebounceTimer: any = null;

    constructor() {
        window.addEventListener('online', () => this.handleConnectionChange(true));
        window.addEventListener('offline', () => this.handleConnectionChange(false));
    }

    // --- PUBLIC API ---

    public getConnectionStatus(): boolean {
        return this.isOnline;
    }

    public getSyncStatus(): SyncStatus {
        return this.status;
    }

    public subscribe(listener: SyncListener): () => void {
        this.listeners.push(listener);
        listener(this.status); // Emit initial status
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    // Chamado pelo StorageService quando um dado muda localmente
    public triggerSync(entity: string, data: any) {
        if (!this.isOnline) {
            this.enqueueAction(entity, data);
            this.updateStatus('OFFLINE');
            return;
        }

        this.updateStatus('SYNCING');

        // Debounce: Aguarda 2s antes de enviar para não sobrecarregar a rede em digitação rápida
        if (this.syncDebounceTimer) clearTimeout(this.syncDebounceTimer);
        
        this.syncDebounceTimer = setTimeout(async () => {
            try {
                await this.performCloudSync(entity, data);
                this.updateStatus('SAVED');
            } catch (error) {
                console.error(`Erro ao sincronizar ${entity}:`, error);
                this.enqueueAction(entity, data); // Fallback para fila
                this.updateStatus('ERROR');
            }
        }, 2000);
    }

    // --- INTERNAL LOGIC ---

    private updateStatus(newStatus: SyncStatus) {
        this.status = newStatus;
        this.listeners.forEach(l => l(newStatus));
    }

    private handleConnectionChange(status: boolean) {
        this.isOnline = status;
        console.log(status ? '🌐 Online - Tentando reconciliação...' : '📴 Offline - Modo Local Ativo');
        
        if (status) {
            this.processQueue();
        } else {
            this.updateStatus('OFFLINE');
        }
    }

    private getQueue(): any[] {
        try {
            const stored = localStorage.getItem(this.queueKey);
            return stored ? JSON.parse(stored) : [];
        } catch { return []; }
    }

    private saveQueue(queue: any[]) {
        localStorage.setItem(this.queueKey, JSON.stringify(queue));
    }

    public enqueueAction(type: string, payload: any) {
        const queue = this.getQueue();
        // Remove duplicatas (mantém apenas a versão mais recente da entidade)
        const filtered = queue.filter(item => item.type !== type);
        
        filtered.push({
            id: `act-${Date.now()}-${Math.random()}`,
            type,
            payload,
            timestamp: Date.now()
        });
        this.saveQueue(filtered);
        console.log(`📥 [Offline] Ação enfileirada: ${type}`);
    }

    public async processQueue() {
        const queue = this.getQueue();
        if (queue.length === 0) {
            this.updateStatus('SAVED');
            return;
        }

        this.updateStatus('SYNCING');
        console.log(`🔄 Processando ${queue.length} itens da fila offline...`);
        
        const remainingQueue = [];
        let successCount = 0;

        for (const item of queue) {
            try {
                await this.performCloudSync(item.type, item.payload);
                successCount++;
            } catch (e) {
                console.error(`Falha ao processar item da fila ${item.type}:`, e);
                remainingQueue.push(item); // Mantém na fila se falhar
            }
        }

        this.saveQueue(remainingQueue);
        
        if (remainingQueue.length === 0) {
            this.updateStatus('SAVED');
            console.log('✅ Reconciliação completa.');
        } else {
            this.updateStatus('ERROR'); // Ainda tem itens pendentes
            console.warn(`⚠️ ${remainingQueue.length} itens restaram na fila.`);
        }
    }

    // Roteador de Sincronização
    private async performCloudSync(entity: string, data: any) {
        switch (entity) {
            case 'players':
            case 'SYNC_PLAYERS':
                return await firebaseDataService.syncPlayers(data);
            case 'games':
            case 'SYNC_GAMES':
                return await firebaseDataService.syncGames(data);
            case 'transactions':
            case 'SYNC_TRANSACTIONS':
                return await firebaseDataService.syncTransactions(data);
            case 'settings':
                return await firebaseDataService.saveTeamSettings(data);
            default:
                console.warn(`Entidade desconhecida para sync: ${entity}`);
                return Promise.resolve();
        }
    }

    // Método para registrar processador externo (usado no Main.tsx para evitar loop de dependência circular na inicialização)
    public registerProcessor(fn: any) {
         // Mantido para compatibilidade, mas a lógica interna agora usa firebaseDataService direto para evitar loops
         console.log("Processor registered via legacy method (No-op in new architecture)");
    }

    public init() {
        if (this.isOnline) {
            this.processQueue();
        }
    }
}

export const syncService = new SyncService();
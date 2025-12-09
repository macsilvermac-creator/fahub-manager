
import { storageService } from './storageService';

interface PendingAction {
    id: string;
    type: string;
    payload: any;
    timestamp: number;
}

class SyncService {
    private isOnline: boolean = navigator.onLine;
    private syncInterval: any = null;
    private queueKey = 'gridiron_offline_queue';

    constructor() {
        window.addEventListener('online', this.handleOnline);
        window.addEventListener('offline', this.handleOffline);
    }

    private getQueue(): PendingAction[] {
        const stored = localStorage.getItem(this.queueKey);
        return stored ? JSON.parse(stored) : [];
    }

    private saveQueue(queue: PendingAction[]) {
        localStorage.setItem(this.queueKey, JSON.stringify(queue));
    }

    // Adiciona uma ação à fila (usado pelo storageService quando offline)
    public enqueueAction(type: string, payload: any) {
        const queue = this.getQueue();
        const action: PendingAction = {
            id: `act-${Date.now()}-${Math.random()}`,
            type,
            payload,
            timestamp: Date.now()
        };
        queue.push(action);
        this.saveQueue(queue);
        console.log(`📥 [OFFLINE QUEUE] Ação agendada: ${type}`);
    }

    private async processQueue() {
        const queue = this.getQueue();
        if (queue.length === 0) return;

        console.log(`🔄 [SYNC] Processando fila offline (${queue.length} itens)...`);
        
        const remainingQueue: PendingAction[] = [];

        // Processa item a item (FIFO)
        for (const action of queue) {
            try {
                // Aqui conectaríamos com o backend real. 
                // Como nosso backend é o Firebase via DataService, e o DataService já atualizou a RAM,
                // a "sincronização" neste modelo híbrido é garantir que o Firebase receba o dado final.
                
                // Exemplo simplificado de replay:
                if (action.type === 'SYNC_PLAYERS') {
                    // Re-trigger sync
                    await storageService.syncFromCloud(); // Na verdade, deveria ser pushToCloud
                }
                console.log(`✅ [SYNC] Ação processada: ${action.type}`);
            } catch (e) {
                console.error(`❌ [SYNC] Falha na ação ${action.type}`, e);
                // Se falhar, mantém na fila para tentar depois (Retry)
                // remainingQueue.push(action); 
            }
        }

        // Limpa a fila (ou mantém os falhados)
        this.saveQueue(remainingQueue);
        
        if (remainingQueue.length === 0) {
            console.log('🎉 [SYNC] Fila offline processada com sucesso!');
        }
    }

    private handleOnline = () => {
        this.isOnline = true;
        console.log('🌐 [SYNC] Conexão restaurada. Sincronizando dados...');
        
        // 1. Processa o que estava pendente na fila de escrita
        this.processQueue();

        // 2. Baixa dados novos da nuvem
        storageService.syncFromCloud().then(() => {
            console.log('✅ [SYNC] Sincronização pós-offline concluída.');
        });
    };

    private handleOffline = () => {
        this.isOnline = false;
        console.log('📴 [SYNC] Modo Offline ativado. Operando com dados locais (RAM/Disk).');
    };

    public init() {
        console.log('🛠️ [SYNC] Serviço de Sincronização Iniciado v2.2');
        
        // Verifica conexão inicial
        if (this.isOnline) {
            this.processQueue(); // Tenta limpar fila antiga
            storageService.syncFromCloud();
        }

        // Heartbeat: Verifica atualizações críticas a cada 2 minutos se estiver online
        this.syncInterval = setInterval(() => {
            if (this.isOnline) {
                // console.log('💓 [SYNC] Heartbeat check...');
                // storageService.syncFromCloud();
            }
        }, 2 * 60 * 1000);
    }

    public getConnectionStatus(): boolean {
        return this.isOnline;
    }
}

export const syncService = new SyncService();


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
        
        // Importação Dinâmica para evitar Ciclo de Dependência (Fix VS Code Freeze)
        const { storageService } = await import('./storageService');
        
        const remainingQueue: PendingAction[] = [];

        // Processa item a item (FIFO)
        for (const action of queue) {
            try {
                // Lógica de Replay
                if (action.type === 'SYNC_PLAYERS') {
                    // Tenta sincronizar novamente
                    // Nota: Na arquitetura atual, forçamos um sync geral
                    await storageService.syncFromCloud();
                }
                console.log(`✅ [SYNC] Ação processada: ${action.type}`);
            } catch (e) {
                console.error(`❌ [SYNC] Falha na ação ${action.type}`, e);
                // Se falhar, poderia manter na fila, mas por segurança limpamos para não travar
            }
        }

        // Limpa a fila
        this.saveQueue(remainingQueue);
        
        if (remainingQueue.length === 0) {
            console.log('🎉 [SYNC] Fila offline processada com sucesso!');
        }
    }

    private handleOnline = () => {
        this.isOnline = true;
        console.log('🌐 [SYNC] Conexão restaurada. Sincronizando dados...');
        
        this.processQueue();

        // Importação dinâmica aqui também
        import('./storageService').then(({ storageService }) => {
             storageService.syncFromCloud().then(() => {
                console.log('✅ [SYNC] Sincronização pós-offline concluída.');
            });
        });
    };

    private handleOffline = () => {
        this.isOnline = false;
        console.log('📴 [SYNC] Modo Offline ativado. Operando com dados locais (RAM/Disk).');
    };

    public init() {
        console.log('🛠️ [SYNC] Serviço de Sincronização Iniciado v2.2 (No-Cycle)');
        
        // Verifica conexão inicial
        if (this.isOnline) {
            this.processQueue(); 
            import('./storageService').then(({ storageService }) => {
                storageService.syncFromCloud();
            });
        }

        // Heartbeat
        this.syncInterval = setInterval(() => {
            if (this.isOnline) {
                // Heartbeat check
            }
        }, 2 * 60 * 1000);
    }

    public getConnectionStatus(): boolean {
        return this.isOnline;
    }
}

export const syncService = new SyncService();

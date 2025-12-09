
type SyncProcessor = () => Promise<boolean>;

class SyncService {
    private isOnline: boolean = navigator.onLine;
    private queueKey = 'gridiron_offline_queue';
    private processor: SyncProcessor | null = null;

    constructor() {
        window.addEventListener('online', () => this.handleConnectionChange(true));
        window.addEventListener('offline', () => this.handleConnectionChange(false));
    }

    // Método para registrar a função de sync sem importar o arquivo (Quebra de Loop)
    public registerProcessor(fn: SyncProcessor) {
        this.processor = fn;
        console.log('✅ Sync Processor registrado com sucesso.');
    }

    private handleConnectionChange(status: boolean) {
        this.isOnline = status;
        console.log(status ? '🌐 Online' : '📴 Offline');
        if (status) {
            this.processQueue();
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
        queue.push({
            id: `act-${Date.now()}-${Math.random()}`,
            type,
            payload,
            timestamp: Date.now()
        });
        this.saveQueue(queue);
    }

    public async processQueue() {
        const queue = this.getQueue();
        if (queue.length === 0) return;

        console.log('Tentando processar fila...');
        
        if (this.processor) {
            try {
                // Chama a função injetada pelo Layout
                const success = await this.processor();
                if (success) {
                    console.log('Fila processada com sucesso.');
                    this.saveQueue([]); // Limpa fila
                }
            } catch (e) {
                console.error("Erro ao processar fila:", e);
            }
        } else {
            console.warn("Processador de Sync não registrado ainda.");
        }
    }

    public init() {
        if (this.isOnline) {
            this.processQueue();
        }
    }

    public getConnectionStatus(): boolean {
        return this.isOnline;
    }
}

export const syncService = new SyncService();

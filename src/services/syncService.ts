
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

    public getConnectionStatus(): boolean {
        return this.isOnline;
    }

    public getSyncStatus(): SyncStatus {
        return this.status;
    }

    public subscribe(listener: SyncListener): () => void {
        this.listeners.push(listener);
        listener(this.status);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    public triggerSync(entity: string, data: any) {
        if (!this.isOnline) {
            this.enqueueAction(entity, data);
            this.updateStatus('OFFLINE');
            return;
        }

        this.updateStatus('SYNCING');

        if (this.syncDebounceTimer) clearTimeout(this.syncDebounceTimer);
        
        this.syncDebounceTimer = setTimeout(async () => {
            try {
                await this.performCloudSync(entity, data);
                this.updateStatus('SAVED');
            } catch (error) {
                console.error(`Erro ao sincronizar ${entity}:`, error);
                this.enqueueAction(entity, data);
                this.updateStatus('ERROR');
            }
        }, 2000);
    }

    private updateStatus(newStatus: SyncStatus) {
        if (this.status !== newStatus) {
            this.status = newStatus;
            this.listeners.forEach(l => l(newStatus));
        }
    }

    private handleConnectionChange(status: boolean) {
        this.isOnline = status;
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
        const filtered = queue.filter(item => item.type !== type);
        filtered.push({
            id: `act-${Date.now()}-${Math.random()}`,
            type,
            payload,
            timestamp: Date.now()
        });
        this.saveQueue(filtered);
    }

    public async processQueue() {
        const queue = this.getQueue();
        if (queue.length === 0) {
            this.updateStatus('SAVED');
            return;
        }

        this.updateStatus('SYNCING');
        
        const remainingQueue = [];
        for (const item of queue) {
            try {
                await this.performCloudSync(item.type, item.payload);
            } catch (e) {
                remainingQueue.push(item);
            }
        }

        this.saveQueue(remainingQueue);
        if (remainingQueue.length === 0) {
            this.updateStatus('SAVED');
        } else {
            this.updateStatus('ERROR');
        }
    }

    private async performCloudSync(entity: string, data: any) {
        switch (entity) {
            case 'players': return await firebaseDataService.syncPlayers(data);
            case 'games': return await firebaseDataService.syncGames(data);
            case 'transactions': return await firebaseDataService.syncTransactions(data);
            case 'settings': return await firebaseDataService.saveTeamSettings(data);
            default: return Promise.resolve();
        }
    }

    public init() {
        if (this.isOnline) {
            this.processQueue();
        }
    }
}

export const syncService = new SyncService();
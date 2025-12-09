
import { storageService } from './storageService';

class SyncService {
    private isOnline: boolean = navigator.onLine;
    private syncInterval: any = null;

    constructor() {
        window.addEventListener('online', this.handleOnline);
        window.addEventListener('offline', this.handleOffline);
    }

    private handleOnline = () => {
        this.isOnline = true;
        console.log('🌐 [SYNC] Conexão restaurada. Sincronizando dados...');
        
        // Dispara um evento visual ou toast se necessário (futuro)
        // Força uma sincronização com a nuvem para garantir que temos os dados mais recentes
        storageService.syncFromCloud().then(() => {
            console.log('✅ [SYNC] Sincronização pós-offline concluída.');
        });
    };

    private handleOffline = () => {
        this.isOnline = false;
        console.log('📴 [SYNC] Modo Offline ativado. Operando com dados locais (RAM/Disk).');
    };

    public init() {
        console.log('🛠️ [SYNC] Serviço de Sincronização Iniciado');
        
        // Verifica conexão inicial
        if (this.isOnline) {
            storageService.syncFromCloud();
        }

        // Heartbeat: Verifica atualizações críticas a cada 2 minutos se estiver online
        this.syncInterval = setInterval(() => {
            if (this.isOnline) {
                console.log('💓 [SYNC] Heartbeat check...');
                storageService.syncFromCloud();
            }
        }, 2 * 60 * 1000);
    }

    public getConnectionStatus(): boolean {
        return this.isOnline;
    }
}

export const syncService = new SyncService();
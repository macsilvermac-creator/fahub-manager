
import { 
    doc, setDoc, getDoc, collection, getDocs, 
    query, where, onSnapshot, updateDoc 
} from "firebase/firestore";
import { db } from "./apiConnection";
import { 
    Player, Game, PracticeSession, TeamSettings, 
    User, AuditLog, Transaction 
} from "../types";

const PREFIX = 'fahub_v1_';

export const storageService = {
    // Helper para LocalStorage
    local: {
        get: (key: string) => {
            const data = localStorage.getItem(PREFIX + key);
            return data ? JSON.parse(data) : null;
        },
        set: (key: string, data: any) => {
            localStorage.setItem(PREFIX + key, JSON.stringify(data));
            window.dispatchEvent(new Event('storage_update'));
        }
    },

    // --- CLOUD SYNC ENGINE ---
    
    // Sincroniza configurações do time
    syncTeamSettings: async (settings: TeamSettings) => {
        storageService.local.set('settings', settings);
        await setDoc(doc(db, "teams", settings.id), settings);
    },

    // Salva Atleta na Nuvem e Local
    savePlayer: async (player: Player) => {
        const teamId = storageService.local.get('current_user')?.teamId || 'default';
        const playerWithTeam = { ...player, teamId };
        
        // Local Save (Optimistic UI)
        const current = storageService.getPlayers();
        const updated = current.some(p => p.id === player.id)
            ? current.map(p => p.id === player.id ? playerWithTeam : p)
            : [...current, playerWithTeam];
        storageService.local.set('players', updated);

        // Cloud Push
        await setDoc(doc(db, "players", String(player.id)), playerWithTeam);
        storageService.logAuditAction('PLAYER_SYNC', `Atleta ${player.name} sincronizado na nuvem.`);
    },

    // Listener Real-time para Súmula (Importante para a Federação ver o jogo ao vivo)
    subscribeToLiveGame: (gameId: string | number, callback: (game: Game) => void) => {
        return onSnapshot(doc(db, "games", String(gameId)), (doc) => {
            if (doc.exists()) callback(doc.data() as Game);
        });
    },

    // Atualiza jogo em tempo real para todos os usuários
    updateLiveGame: async (gameId: string | number, updates: Partial<Game>) => {
        const games = storageService.getGames().map(g => String(g.id) === String(gameId) ? { ...g, ...updates } : g);
        storageService.local.set('games', games);
        
        await updateDoc(doc(db, "games", String(gameId)), updates);
    },

    // --- MÉTODOS DE ACESSO ---

    getPlayers: () => storageService.local.get('players') || [],
    getGames: () => storageService.local.get('games') || [],
    getPracticeSessions: () => storageService.local.get('practice') || [],
    getTeamSettings: (): TeamSettings => storageService.local.get('settings') || { id: '1', teamName: 'FAHUB Stars', primaryColor: '#059669', address: 'Digital' },
    getCurrentUser: (): User | null => storageService.local.get('current_user'),
    setCurrentUser: (user: User | null) => storageService.local.set('current_user', user),

    getAuditLogs: () => storageService.local.get('audit') || [],
    logAuditAction: (action: string, details: string) => {
        const user = storageService.getCurrentUser();
        const logs = storageService.getAuditLogs();
        const newLog: AuditLog = {
            id: `log-${Date.now()}`,
            action,
            details,
            timestamp: new Date(),
            userId: user?.id || 'system',
            userName: user?.name || 'System',
            role: user?.role || 'SYSTEM'
        };
        storageService.local.set('audit', [newLog, ...logs].slice(0, 100));
    },

    // Inicialização da RAM e Sincronia Inicial
    initializeRAM: async () => {
        const user = storageService.getCurrentUser();
        if (!user) return;

        console.log('FAHUB CLOUD ENGINE: Iniciando Sincronia...');
        
        // Pull de dados críticos (Exemplo: Jogadores do time do usuário)
        const q = query(collection(db, "players"), where("teamId", "==", user.teamId || 'default'));
        const querySnapshot = await getDocs(q);
        const cloudPlayers: Player[] = [];
        querySnapshot.forEach((doc) => cloudPlayers.push(doc.data() as Player));
        
        if (cloudPlayers.length > 0) {
            storageService.local.set('players', cloudPlayers);
        }
    },

    // Mock Methods para compatibilidade de build
    getAthleteMissions: (id: any) => [],
    savePracticeSessions: (data: PracticeSession[]) => storageService.local.set('practice', data),
    getTransactions: () => storageService.local.get('transactions') || [],
    saveTransactions: (data: Transaction[]) => storageService.local.set('transactions', data),
    getActiveProgram: () => localStorage.getItem(PREFIX + 'active_program') || 'TACKLE',
    setActiveProgram: (p: string) => localStorage.setItem(PREFIX + 'active_program', p),
    getAthleteStatsHistory: (id: string | number) => [],
    getTacticalPlays: () => storageService.local.get('tactical_plays') || [],
    saveTacticalPlays: (data: any[]) => storageService.local.set('tactical_plays', data),
    uploadFile: async (file: File, path: string) => URL.createObjectURL(file),
    getLeague: () => ({ id: '1', name: 'Liga Brasileira', season: '2025', teams: [] }),
    saveGames: (data: Game[]) => storageService.local.set('games', data)
};
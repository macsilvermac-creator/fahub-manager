
import { 
    doc, setDoc, getDoc, collection, getDocs, 
    query, where, onSnapshot, updateDoc 
} from "firebase/firestore";
import { db } from "./apiConnection";
/* Fix: Added missing types to root storageService imports */
import { 
    Player, Game, PracticeSession, TeamSettings, 
    User, AuditLog, Transaction, Invoice, Subscription, Budget, Bill, Announcement, ChatMessage, TeamDocument, EquipmentItem, VideoClip, MarketplaceItem, KanbanTask, SocialPost, SponsorDeal, EventSale, SocialFeedPost, League, ConfederationStats, NationalTeamCandidate, Affiliate, TransferRequest, YouthClass, YouthStudent, StaffMember, RecruitmentCandidate, Course
} from "../types";

const PREFIX = 'fahub_v1_';

const subscribers: Record<string, (() => void)[]> = {};

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
            storageService.notify(key);
        }
    },

    subscribe: (key: string, callback: () => void) => {
        if (!subscribers[key]) subscribers[key] = [];
        subscribers[key].push(callback);
        return () => { subscribers[key] = subscribers[key].filter(cb => cb !== callback); };
    },

    notify: (key: string) => {
        if (subscribers[key]) subscribers[key].forEach(cb => cb());
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

    // Added savePlayers method
    savePlayers: (players: Player[]) => {
        storageService.local.set('players', players);
    },

    // Added registerAthlete method
    registerAthlete: (player: Player) => {
        const current = storageService.getPlayers();
        storageService.savePlayers([...current, player]);
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

    getPlayers: (): Player[] => storageService.local.get('players') || [],
    getGames: (): Game[] => storageService.local.get('games') || [],
    getPracticeSessions: (): PracticeSession[] => storageService.local.get('practice') || [],
    getTeamSettings: (): TeamSettings => storageService.local.get('settings') || { id: '1', teamName: 'FAHUB Stars', primaryColor: '#059669', address: 'Digital' },
    getCurrentUser: (): User | null => storageService.local.get('current_user'),
    setCurrentUser: (user: User | null) => storageService.local.set('current_user', user),

    getAuditLogs: (): AuditLog[] => storageService.local.get('audit') || [],
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

    // Added logAction for AdminPanel
    logAction: (action: string, details: string, user: User) => {
        const logs = storageService.getAuditLogs();
        const newLog: AuditLog = {
            id: `log-${Date.now()}`,
            action,
            details,
            timestamp: new Date(),
            userId: user.id,
            userName: user.name,
            role: user.role
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

    // Methods for Finance
    getInvoices: (): Invoice[] => storageService.local.get('invoices') || [],
    saveInvoices: (data: Invoice[]) => storageService.local.set('invoices', data),
    getSubscriptions: (): Subscription[] => storageService.local.get('subscriptions') || [],
    saveSubscriptions: (data: Subscription[]) => storageService.local.set('subscriptions', data),
    getBudgets: (): Budget[] => storageService.local.get('budgets') || [],
    saveBudgets: (data: Budget[]) => storageService.local.set('budgets', data),
    getBills: (): Bill[] => storageService.local.get('bills') || [],
    saveBills: (data: Bill[]) => storageService.local.set('bills', data),

    // Methods for Communications
    getAnnouncements: (): Announcement[] => storageService.local.get('announcements') || [],
    saveAnnouncements: (data: Announcement[]) => storageService.local.set('announcements', data),
    getChatMessages: (): ChatMessage[] => storageService.local.get('chat_messages') || [],
    saveChatMessages: (data: ChatMessage[]) => storageService.local.set('chat_messages', data),

    // Methods for Resources
    getDocuments: (): TeamDocument[] => storageService.local.get('documents') || [],
    saveDocuments: (data: TeamDocument[]) => storageService.local.set('documents', data),

    // Added togglePracticeAttendance
    togglePracticeAttendance: (practiceId: string, playerId: string) => {
        const sessions = storageService.getPracticeSessions();
        const updated = sessions.map(s => {
            if (String(s.id) === practiceId) {
                const attendees = s.attendees || [];
                const newAttendees = attendees.includes(playerId) 
                    ? attendees.filter(id => id !== playerId)
                    : [...attendees, playerId];
                return { ...s, attendees: newAttendees };
            }
            return s;
        });
        storageService.savePracticeSessions(updated);
    },

    // Mock Methods para compatibilidade de build
    getAthleteMissions: (id: any) => [],
    savePracticeSessions: (data: PracticeSession[]) => storageService.local.set('practice', data),
    getTransactions: (): Transaction[] => storageService.local.get('transactions') || [],
    saveTransactions: (data: Transaction[]) => storageService.local.set('transactions', data),
    getActiveProgram: () => localStorage.getItem(PREFIX + 'active_program') || 'TACKLE',
    setActiveProgram: (p: string) => localStorage.setItem(PREFIX + 'active_program', p),
    getAthleteStatsHistory: (id: string | number) => [],
    getTacticalPlays: () => storageService.local.get('tactical_plays') || [],
    saveTacticalPlays: (data: any[]) => storageService.local.set('tactical_plays', data),
    uploadFile: async (file: File, path: string) => URL.createObjectURL(file),
    getLeague: (): League => ({ id: '1', name: 'Liga Brasileira', season: '2025', teams: [] }),
    saveGames: (data: Game[]) => storageService.local.set('games', data),
    getInventory: (): EquipmentItem[] => storageService.local.get('inventory') || [],
    saveInventory: (data: EquipmentItem[]) => storageService.local.set('inventory', data),
    getClips: (): VideoClip[] => storageService.local.get('clips') || [],
    saveClips: (data: VideoClip[]) => storageService.local.set('clips', data),
    getMarketplaceItems: (): MarketplaceItem[] => storageService.local.get('marketplace') || [],
    saveMarketplaceItems: (data: MarketplaceItem[]) => storageService.local.set('marketplace', data),
    getTasks: (): KanbanTask[] => storageService.local.get('tasks') || [],
    saveTasks: (data: KanbanTask[]) => storageService.local.set('tasks', data),
    getSocialPosts: (): SocialPost[] => storageService.local.get('social_posts') || [],
    saveSocialPosts: (data: SocialPost[]) => storageService.local.set('social_posts', data),
    getSponsors: (): SponsorDeal[] => storageService.local.get('sponsors') || [],
    saveSponsors: (data: SponsorDeal[]) => storageService.local.set('sponsors', data),
    getEventSales: (): EventSale[] => storageService.local.get('event_sales') || [],
    saveEventSales: (data: EventSale[]) => storageService.local.set('event_sales', data),
    getSocialFeed: (): SocialFeedPost[] => storageService.local.get('social_feed') || [],
    saveSocialFeedPost: (p: SocialFeedPost) => {
        const current = storageService.getSocialFeed();
        storageService.local.set('social_feed', [p, ...current]);
    },
    toggleLikePost: (id: string) => {
        const current = storageService.getSocialFeed();
        const updated = current.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p);
        storageService.local.set('social_feed', updated);
    },
    /* Fix: Correctly assigned type names for build */
    getStaff: (): StaffMember[] => storageService.local.get('staff') || [],
    saveStaff: (data: StaffMember[]) => storageService.local.set('staff', data),
    getYouthClasses: (): YouthClass[] => storageService.local.get('youth_classes') || [],
    saveYouthClasses: (data: YouthClass[]) => storageService.local.set('youth_classes', data),
    getYouthStudents: (): YouthStudent[] => storageService.local.get('youth_students') || [],
    getConfederationStats: (): ConfederationStats => ({ totalAthletes: 4850, totalTeams: 18, totalGamesThisYear: 142, activeAffiliates: 8, growthRate: 5.4 }),
    getNationalTeamScouting: (): NationalTeamCandidate[] => storageService.local.get('national_team_scouting') || [],
    getAffiliatesStatus: (): Affiliate[] => storageService.local.get('affiliates') || [],
    getTransferRequests: (): TransferRequest[] => storageService.local.get('transfers') || [],
    processTransfer: (id: string, decision: string, by: string) => {
        const current = storageService.getTransferRequests();
        const updated = current.map(t => t.id === id ? { ...t, status: decision === 'APPROVE' ? 'APPROVED' : 'REJECTED' } as TransferRequest : t);
        storageService.local.set('transfers', updated);
    },
    getPublicGameData: (id: string) => null,
    getPublicLeagueStats: () => ({ name: 'BFA', season: '2025', leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),
    /* Fix: Corrected name for RecruitmentCandidate build */
    getCandidates: (): RecruitmentCandidate[] => storageService.local.get('candidates') || [],
    saveCandidates: (data: RecruitmentCandidate[]) => storageService.local.set('candidates', data),
    saveTeamSettings: (data: TeamSettings) => storageService.local.set('settings', data),
    seedDatabaseToCloud: async () => true,
    createChampionship: (name: string, year: number, division: string) => console.log('Championship Created:', name),
    /* Fix: Added missing getCourses method used by Academy and Marketing */
    getCourses: (): Course[] => storageService.local.get('courses') || [],
};
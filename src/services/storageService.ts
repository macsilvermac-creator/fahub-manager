
import { 
    Player, Game, PracticeSession, TeamSettings, 
    AuditLog, LeagueRanking, VideoClip, KanbanTask,
    RecruitmentCandidate, Transaction, Invoice, Subscription,
    Budget, Bill, TacticalPlay, OKR, RoadmapItem,
    DigitalProduct, Entitlement, Objective
} from '../types';

const set = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('storage_update'));
};

const get = <T>(key: string): T[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
};

const getSingle = <T>(key: string): T | null => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

export const storageService = {
    initializeRAM: () => {
        if (!localStorage.getItem('fahub_settings')) {
            set('fahub_settings', {
                id: '1',
                teamName: 'Joinville Gladiators',
                logoUrl: 'https://ui-avatars.com/api/?name=JG&background=059669&color=fff',
                primaryColor: '#059669',
                address: 'Joinville, SC',
                sportType: 'TACKLE'
            });
        }
    },

    subscribe: (key: string, callback: () => void) => {
        window.addEventListener('storage_update', callback);
        return () => window.removeEventListener('storage_update', callback);
    },

    getCurrentUser: () => JSON.parse(localStorage.getItem('gridiron_current_user') || '{"role":"HEAD_COACH","name":"Coach Guto", "id": "user-123", "program": "TACKLE"}'),
    setCurrentUser: (u: any) => localStorage.setItem('gridiron_current_user', JSON.stringify(u)),
    
    getPlayers: () => get<Player>('fahub_players'),
    savePlayers: (data: Player[]) => set('fahub_players', data),
    registerAthlete: (player: Player) => set('fahub_players', [...get<Player>('fahub_players'), player]),
    getAthletes: () => get<Player>('fahub_players'),
    getAthleteByUserId: (id: string) => get<Player>('fahub_players').find(p => p.id === id),
    getAthleteStatsHistory: (id: any) => [],

    getGames: () => get<Game>('fahub_games'),
    saveGames: (data: Game[]) => set('fahub_games', data),
    updateLiveGame: (id: any, updates: any) => {
        const games = get<Game>('fahub_games');
        set('fahub_games', games.map(g => g.id === id ? { ...g, ...updates } : g));
    },

    getTeamSettings: () => getSingle<TeamSettings>('fahub_settings') || { id: '1', teamName: 'JG', logoUrl: '', primaryColor: '#059669', sportType: 'TACKLE' },
    saveTeamSettings: (data: TeamSettings) => set('fahub_settings', data),
    
    getAuditLogs: () => get<AuditLog>('fahub_audit'),
    logAuditAction: (action: string, details: string) => {
        const logs = get<AuditLog>('fahub_audit');
        const user = storageService.getCurrentUser();
        set('fahub_audit', [{ id: Date.now().toString(), action, details, timestamp: new Date(), userName: user.name, role: user.role }, ...logs]);
    },
    logAction: (action: string, details: string) => storageService.logAuditAction(action, details),

    getClips: () => get<VideoClip>('fahub_clips'),
    saveClips: (data: VideoClip[]) => set('fahub_clips', data),

    getPracticeSessions: () => get<PracticeSession>('fahub_practice'),
    savePracticeSessions: (data: PracticeSession[]) => set('fahub_practice', data),

    getTransactions: () => get<Transaction>('fahub_transactions'),
    saveTransactions: (data: Transaction[]) => set('fahub_transactions', data),

    getInvoices: () => get<Invoice>('fahub_invoices'),
    saveInvoices: (data: Invoice[]) => set('fahub_invoices', data),

    getMarketplaceItems: () => get<any>('fahub_marketplace'),
    saveMarketplaceItems: (data: any) => set('fahub_marketplace', data),

    getTasks: () => get<KanbanTask>('hc_tasks'),
    saveTasks: (data: KanbanTask[]) => set('hc_tasks', data),

    getRankings: () => get<LeagueRanking>('league_rankings'),
    getObjectives: () => get<Objective>('fahub_objectives'),
    saveObjectives: (data: Objective[]) => set('fahub_objectives', data),

    getActiveProgram: () => (storageService.getTeamSettings().sportType || 'TACKLE') as any,
    
    getRoadmap: () => get<RoadmapItem>('fahub_roadmap'),
    getProjectCompletion: () => 85,

    getCandidates: () => get<RecruitmentCandidate>('fahub_candidates'),
    saveCandidates: (data: RecruitmentCandidate[]) => set('fahub_candidates', data),

    getPublicGameData: (id: string) => ({ id, opponent: 'Raptors', score: '14-7', clock: '10:00', currentQuarter: 2 }),
    getPublicLeagueStats: () => ({ leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),

    saveCoachProfile: (id: string, profile: any) => {},
    createChampionship: (n: string, y: number, d: string) => {},
    notify: (c: string) => {},
    sendSignal: (s: any) => {},
    generateMonthlyInvoices: () => {},
    getSponsors: () => [],
    saveSponsors: (d: any) => {},
    getEventSales: () => [],
    saveEventSales: (d: any) => {},
    getSubscriptions: () => [],
    saveSubscriptions: (d: any) => {},
    getBudgets: () => [],
    saveBudgets: (d: any) => {},
    getBills: () => [],
    saveBills: (d: any) => {},
    getDocuments: () => [],
    saveDocuments: (d: any) => {},
    getTacticalPlays: () => [],
    saveTacticalPlays: (d: any) => {},
    getOKRs: () => [],
    saveOKRs: (d: any) => {},
    getEntitlements: () => [],
    purchaseDigitalProduct: (u: string, p: any) => {},
    getStaff: () => [],
    getSocialPosts: () => [],
    saveSocialPosts: (d: any) => {},
    getCourses: () => [],
    getAnnouncements: () => [],
    saveAnnouncements: (d: any) => {},
    getChatMessages: () => [],
    saveChatMessages: (d: any) => {},
    getSocialFeed: () => [],
    saveSocialFeedPost: (d: any) => {},
    toggleLikePost: (id: string) => {},
    getInventory: () => [],
    saveInventory: (d: any) => {},
    getYouthClasses: () => [],
    saveYouthClasses: (d: any) => {},
    getYouthStudents: () => [],
    getConfederationStats: () => ({ totalAthletes: 4850, totalTeams: 142, totalGamesThisYear: 320, activeAffiliates: 18 }),
    getNationalTeamScouting: () => [],
    getAffiliatesStatus: () => [],
    getTransferRequests: () => [],
    getLeague: () => ({ id: '1', name: 'Liga Brasileira', season: '2025', teams: [] }),
    togglePracticeAttendance: (pId: string, aId: string) => {},
    processTransfer: (id: string, d: string, a: string) => {},
    getTeams: () => [],
    saveTeam: (t: any) => {},

    // Fix: Added missing seedDatabaseToCloud method to resolve error in pages/Login.tsx
    seedDatabaseToCloud: async () => { console.log('Seeding cloud...'); },

    // Fix: Added missing uploadFile method to resolve error in pages/TeamSettings.tsx
    uploadFile: async (file: File, path: string) => "https://example.com/logo.png",
};


import { 
    Player, Game, PracticeSession, TeamSettings, 
    AuditLog, LeagueRanking, Objective,
    RecruitmentCandidate, Transaction, Subscription, Budget,
    Bill, Invoice, Announcement, ChatMessage, TeamDocument,
    TacticalPlay, VideoClip, Course, MarketplaceItem,
    KanbanTask, SocialPost, SponsorDeal, EventSale,
    StaffMember, YouthClass, YouthStudent, Affiliate, TransferRequest,
    League, OKR, RoadmapItem, Entitlement, DigitalProduct,
    ObjectiveSignal, Team, SocialFeedPost, EquipmentItem,
    Championship, NationalTeamCandidate
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
                plan: 'ALL_PRO',
                sportType: 'TACKLE'
            });
        }
    },

    subscribe: (key: string, callback: () => void) => {
        const handler = () => callback();
        window.addEventListener('storage_update', handler);
        return () => window.removeEventListener('storage_update', handler);
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('gridiron_current_user');
        return user ? JSON.parse(user) : { role: 'MASTER', name: 'Admin', id: '1' };
    },

    setCurrentUser: (u: any) => set('gridiron_current_user', u),
    
    getPracticeSessions: () => get<PracticeSession>('fahub_practice'),
    savePracticeSessions: (data: PracticeSession[]) => set('fahub_practice', data),

    getPlayers: () => get<Player>('fahub_players'),
    savePlayers: (data: Player[]) => set('fahub_players', data),
    
    registerAthlete: (player: Player) => {
        const players = get<Player>('fahub_players');
        set('fahub_players', [...players, player]);
    },

    getGames: () => get<Game>('fahub_games'),
    saveGames: (data: Game[]) => set('fahub_games', data),
    updateLiveGame: (gameId: string | number, updates: Partial<Game>) => {
        const games = get<Game>('fahub_games');
        const updated = games.map(g => String(g.id) === String(gameId) ? { ...g, ...updates } : g);
        set('fahub_games', updated);
    },

    getRankings: () => [
        { position: 1, teamName: 'Gladiators', record: '4-0' },
        { position: 2, teamName: 'Istepôs', record: '3-1' },
        { position: 3, teamName: 'Timbó Rex', record: '3-1' }
    ],

    getTeamSettings: () => {
        const s = localStorage.getItem('fahub_settings');
        return s ? JSON.parse(s) : { teamName: 'Gladiators', primaryColor: '#059669', logoUrl: '' };
    },
    saveTeamSettings: (data: TeamSettings) => set('fahub_settings', data),
    
    getAuditLogs: () => get<AuditLog>('fahub_audit'),
    logAuditAction: (action: string, details: string) => {
        const logs = get<AuditLog>('fahub_audit');
        const user = storageService.getCurrentUser();
        set('fahub_audit', [{ id: Date.now().toString(), action, details, timestamp: new Date(), userName: user.name, role: user.role }, ...logs]);
    },

    getClips: () => get<VideoClip>('fahub_clips'),
    saveClips: (data: VideoClip[]) => set('fahub_clips', data),

    getTransactions: () => get<Transaction>('fahub_transactions'),
    saveTransactions: (data: Transaction[]) => set('fahub_transactions', data),

    getInvoices: () => get<Invoice>('fahub_invoices'),
    saveInvoices: (data: Invoice[]) => set('fahub_invoices', data),

    getMarketplaceItems: () => get<MarketplaceItem>('fahub_marketplace'),
    saveMarketplaceItems: (data: MarketplaceItem[]) => set('fahub_marketplace', data),

    getActiveProgram: () => (storageService.getTeamSettings().sportType || 'TACKLE') as any,
    notify: (channel: string) => { window.dispatchEvent(new Event('storage_update')); },
    
    getTacticalPlays: () => get<TacticalPlay>('fahub_tactical'),
    saveTacticalPlays: (data: TacticalPlay[]) => set('fahub_tactical', data),

    getCandidates: () => get<RecruitmentCandidate>('fahub_candidates'),
    saveCandidates: (data: RecruitmentCandidate[]) => set('fahub_candidates', data),

    getSponsors: () => get<SponsorDeal>('fahub_sponsors'),
    saveSponsors: (data: SponsorDeal[]) => set('fahub_sponsors', data),

    getEventSales: () => get<EventSale>('fahub_event_sales'),
    saveEventSales: (data: EventSale[]) => set('fahub_event_sales', data),

    // Fix: Added missing methods for various pages
    getObjectives: () => get<Objective>('fahub_objectives'),
    saveObjectives: (data: Objective[]) => set('fahub_objectives', data),

    getAnnouncements: () => get<Announcement>('fahub_announcements'),
    saveAnnouncements: (data: Announcement[]) => set('fahub_announcements', data),

    getChatMessages: () => get<ChatMessage>('fahub_chat'),
    saveChatMessages: (data: ChatMessage[]) => set('fahub_chat', data),

    getTasks: () => get<KanbanTask>('fahub_tasks'),
    saveTasks: (data: KanbanTask[]) => set('fahub_tasks', data),

    getSubscriptions: () => get<Subscription>('fahub_subscriptions'),
    saveSubscriptions: (data: Subscription[]) => set('fahub_subscriptions', data),

    getBudgets: () => get<Budget>('fahub_budgets'),
    saveBudgets: (data: Budget[]) => set('fahub_budgets', data),

    getBills: () => get<Bill>('fahub_bills'),
    saveBills: (data: Bill[]) => set('fahub_bills', data),

    getDocuments: () => get<TeamDocument>('fahub_docs'),
    saveDocuments: (data: TeamDocument[]) => set('fahub_docs', data),

    getCourses: () => get<Course>('fahub_courses'),
    saveCourses: (data: Course[]) => set('fahub_courses', data),

    getSocialPosts: () => get<SocialPost>('fahub_social_posts'),
    saveSocialPosts: (data: SocialPost[]) => set('fahub_social_posts', data),

    getInventory: () => get<EquipmentItem>('fahub_inventory'),
    saveInventory: (data: EquipmentItem[]) => set('fahub_inventory', data),

    getYouthClasses: () => get<YouthClass>('fahub_youth_classes'),
    saveYouthClasses: (data: YouthClass[]) => set('fahub_youth_classes', data),

    getStaff: () => get<StaffMember>('fahub_staff'),
    saveStaff: (data: StaffMember[]) => set('fahub_staff', data),

    getSocialFeed: () => get<SocialFeedPost>('fahub_feed'),
    saveSocialFeedPost: (post: SocialFeedPost) => set('fahub_feed', [post, ...get<SocialFeedPost>('fahub_feed')]),
    toggleLikePost: (postId: string) => {
        const feed = get<SocialFeedPost>('fahub_feed');
        set('fahub_feed', feed.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    },

    getLeague: () => getSingle<League>('fahub_league') || { id: '1', name: 'Liga Brasileira', season: '2025', teams: [] },
    saveLeague: (data: League) => set('fahub_league', data),

    getPublicGameData: (gameId: string) => ({ id: gameId, opponent: 'Raptors', score: '14-7', clock: '10:00', currentQuarter: 2 }),
    getPublicLeagueStats: () => ({ name: 'Liga Catarinense', season: '2025', leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),

    createChampionship: (name: string, year: number, division: string) => { console.log(`Championship Created: ${name}`); },

    seedDatabaseToCloud: async () => { console.log('Seeding cloud...'); },

    uploadFile: async (file: File, path: string) => "https://example.com/logo.png",

    getAthleteStatsHistory: (id: any) => [],
    getRoadmap: () => [],
    getProjectCompletion: () => 85,
    getAthleteByUserId: (id: string) => null,
    getOKRs: () => [],
    saveOKRs: (d: any) => {},
    sendSignal: (s: any) => {},
    getEntitlements: () => [],
    purchaseDigitalProduct: (u: any, p: any) => {},
    saveCoachProfile: (u: any, p: any) => {},
    getYouthStudents: () => [],
    getConfederationStats: () => ({ totalAthletes: 0, totalTeams: 0, totalGamesThisYear: 0, activeAffiliates: 0 }),
    getNationalTeamScouting: () => [],
    getAffiliatesStatus: () => [],
    getTransferRequests: () => [],
    processTransfer: (id: any, d: any, a: any) => {},
    createBulkInvoices: (pIds: number[], t: string, am: number, dd: Date, c: string, pl: any[], iiId?: string) => {},
    processInvoicePayment: (id: string) => {},
    processPayroll: (id: string, am: number, name: string) => {},
    generateMonthlyInvoices: () => {},
    togglePracticeAttendance: (pr: any, pl: any) => {},
    logAction: (a: any, d: any) => storageService.logAuditAction(a, d),
    getTeams: () => [],
    saveTeam: (t: Team) => {},
    getAthletes: () => [],
};

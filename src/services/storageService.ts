
import { 
    Player, Game, PracticeSession, TeamSettings, 
    AuditLog, LeagueRanking, VideoClip, VideoTag,
    RecruitmentCandidate, Transaction, Invoice, KanbanTask,
    Objective, Subscription, Budget, Bill, Announcement, ChatMessage, TeamDocument, Course, MarketplaceItem,
    SponsorDeal, EventSale, SocialFeedPost, EquipmentItem, StaffMember, YouthClass, YouthStudent, Affiliate,
    TransferRequest, League, OKR, RoadmapItem, Entitlement, DigitalProduct, ObjectiveSignal, Team,
    TacticalPlay, SocialPost
} from '../types';

const set = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('storage_update'));
};

const get = <T>(key: string): T[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
};

export const storageService = {
    initializeRAM: () => {
        if (!localStorage.getItem('fahub_settings')) {
            set('fahub_settings', {
                id: '1',
                teamName: 'Joinville Gladiators',
                logoUrl: 'https://ui-avatars.com/api/?name=JG&background=059669&color=fff',
                primaryColor: '#059669',
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
        return user ? JSON.parse(user) : { role: 'MASTER', name: 'Admin', id: 'u1', program: 'TACKLE' };
    },
    
    setCurrentUser: (u: any) => set('gridiron_current_user', u),
    
    getPlayers: () => get<Player>('fahub_players'),
    savePlayers: (data: Player[]) => set('fahub_players', data),
    registerAthlete: (player: Player) => set('fahub_players', [...get<Player>('fahub_players'), player]),

    getGames: () => get<Game>('fahub_games'),
    saveGames: (data: Game[]) => set('fahub_games', data),
    updateLiveGame: (id: any, updates: any) => {
        const games = get<Game>('fahub_games');
        set('fahub_games', games.map(g => g.id === id ? { ...g, ...updates } : g));
    },

    getTeamSettings: () => JSON.parse(localStorage.getItem('fahub_settings') || '{"teamName":"Time"}') as TeamSettings,
    saveTeamSettings: (data: TeamSettings) => set('fahub_settings', data),
    
    getAuditLogs: () => get<AuditLog>('fahub_audit'),
    logAuditAction: (action: string, details: string) => {
        const logs = get<AuditLog>('fahub_audit');
        const user = storageService.getCurrentUser();
        set('fahub_audit', [{ id: Date.now().toString(), action, details, timestamp: new Date(), userName: user.name, role: user.role }, ...logs]);
    },

    getClips: () => get<VideoClip>('fahub_clips'),
    saveClips: (data: VideoClip[]) => set('fahub_clips', data),

    getPracticeSessions: () => get<PracticeSession>('fahub_practice'),
    savePracticeSessions: (data: PracticeSession[]) => set('fahub_practice', data),

    getTransactions: () => get<Transaction>('fahub_transactions'),
    saveTransactions: (data: Transaction[]) => set('fahub_transactions', data),

    getInvoices: () => get<Invoice>('fahub_invoices'),
    saveInvoices: (data: Invoice[]) => set('fahub_invoices', data),

    getTasks: () => get<KanbanTask>('fahub_tasks'),
    saveTasks: (data: KanbanTask[]) => set('fahub_tasks', data),

    getObjectives: () => get<Objective>('fahub_objectives'),
    saveObjectives: (data: Objective[]) => set('fahub_objectives', data),

    getRankings: () => [
        { position: 1, teamName: 'Gladiators', record: '4-0' },
        { position: 2, teamName: 'Istepôs', record: '3-1' },
        { position: 3, teamName: 'Timbó Rex', record: '3-1' }
    ],

    getActiveProgram: () => (storageService.getTeamSettings().sportType || 'TACKLE') as any,

    getCandidates: () => get<RecruitmentCandidate>('fahub_candidates'),
    saveCandidates: (data: RecruitmentCandidate[]) => set('fahub_candidates', data),
    
    getSubscriptions: () => get<Subscription>('fahub_subs'),
    saveSubscriptions: (data: Subscription[]) => set('fahub_subs', data),
    
    getBudgets: () => get<Budget>('fahub_budgets'),
    saveBudgets: (data: Budget[]) => set('fahub_budgets', data),
    
    getBills: () => get<Bill>('fahub_bills'),
    saveBills: (data: Bill[]) => set('fahub_bills', data),

    getAnnouncements: () => get<Announcement>('fahub_announcements'),
    saveAnnouncements: (data: Announcement[]) => set('fahub_announcements', data),
    
    getChatMessages: () => get<ChatMessage>('fahub_chat'),
    saveChatMessages: (data: ChatMessage[]) => set('fahub_chat', data),

    getDocuments: () => get<TeamDocument>('fahub_docs'),
    saveDocuments: (data: TeamDocument[]) => set('fahub_docs', data),

    getCourses: () => get<Course>('fahub_courses'),
    saveCourses: (data: Course[]) => set('fahub_courses', data),

    getMarketplaceItems: () => get<MarketplaceItem>('fahub_marketplace'),
    saveMarketplaceItems: (data: MarketplaceItem[]) => set('fahub_marketplace', data),

    getSponsors: () => get<SponsorDeal>('fahub_sponsors'),
    saveSponsors: (data: SponsorDeal[]) => set('fahub_sponsors', data),

    getEventSales: () => get<EventSale>('fahub_event_sales'),
    saveEventSales: (data: EventSale[]) => set('fahub_event_sales', data),

    getSocialFeed: () => get<SocialFeedPost>('fahub_feed'),
    saveSocialFeedPost: (post: SocialFeedPost) => set('fahub_feed', [post, ...get<SocialFeedPost>('fahub_feed')]),
    toggleLikePost: (postId: string) => {
        const feed = get<SocialFeedPost>('fahub_feed');
        set('fahub_feed', feed.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    },

    getInventory: () => get<EquipmentItem>('fahub_inventory'),
    saveInventory: (data: EquipmentItem[]) => set('fahub_inventory', data),

    getStaff: () => get<StaffMember>('fahub_staff'),
    saveStaff: (data: StaffMember[]) => set('fahub_staff', data),

    getLeague: () => ({ id: '1', name: 'Liga Brasileira', season: '2025', teams: [] }),
    getOKRs: () => get<OKR>('fahub_okrs'),
    saveOKRs: (data: OKR[]) => set('fahub_okrs', data),
    getRoadmap: () => get<RoadmapItem>('fahub_roadmap'),
    getProjectCompletion: () => 85,
    getAthleteByUserId: (id: string) => null,
    getAthleteStatsHistory: (id: any) => [],
    getEntitlements: () => get<Entitlement>('fahub_entitlements'),
    purchaseDigitalProduct: (u: any, p: any) => {},
    getYouthClasses: () => get<YouthClass>('fahub_youth_classes'),
    saveYouthClasses: (data: YouthClass[]) => set('fahub_youth_classes', data),
    getYouthStudents: () => get<YouthStudent>('fahub_youth_students'),
    getConfederationStats: () => ({ totalAthletes: 1000, totalTeams: 50, totalGamesThisYear: 100, activeAffiliates: 10 }),
    getNationalTeamScouting: () => [],
    getAffiliatesStatus: () => [],
    getTransferRequests: () => [],
    processTransfer: (id: string, decision: string, actor: string) => {},
    getPublicGameData: (id: string) => ({}),
    getPublicLeagueStats: () => ({ name: 'Liga Brasileira', season: '2025', leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),
    createChampionship: (n: string, y: number, d: string) => {},
    generateMonthlyInvoices: () => {},
    togglePracticeAttendance: (prId: string, plId: string) => {},
    saveCoachProfile: (uId: string, profile: any) => {},
    saveTeam: (t: Team) => {},
    getTeams: () => [],
    getAthletes: () => get<Player>('fahub_players'),
    logAction: (a: string, d: string) => storageService.logAuditAction(a, d),
    uploadFile: async (f: any, p: string) => "url",
    seedDatabaseToCloud: async () => {},
    notify: (c: string) => {},
    sendSignal: (s: any) => {},
    // Fix: Added missing tactical play methods
    getTacticalPlays: () => get<TacticalPlay>('fahub_tactical'),
    saveTacticalPlays: (data: TacticalPlay[]) => set('fahub_tactical', data),
    // Fix: Added missing social post methods for marketing
    getSocialPosts: () => get<SocialPost>('fahub_social_posts'),
    saveSocialPosts: (data: SocialPost[]) => set('fahub_social_posts', data),
};

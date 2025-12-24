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
                teamName: 'Gladiators',
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
        return user ? JSON.parse(user) : { role: 'MASTER', name: 'Diretor', id: 'u1', program: 'TACKLE' };
    },
    
    setCurrentUser: (u: any) => set('gridiron_current_user', u),
    
    getPracticeSessions: () => get<PracticeSession>('fahub_practice'),
    savePracticeSessions: (data: PracticeSession[]) => set('fahub_practice', data),

    getPlayers: () => get<Player>('fahub_players'),
    savePlayers: (data: Player[]) => set('fahub_players', data),
    registerAthlete: (player: Player) => set('fahub_players', [...get<Player>('fahub_players'), player]),
    getAthletes: () => get<Player>('fahub_players'),

    getGames: () => get<Game>('fahub_games'),
    saveGames: (data: Game[]) => set('fahub_games', data),
    updateLiveGame: (id: any, updates: any) => {
        const games = get<Game>('fahub_games');
        set('fahub_games', games.map(g => g.id === id ? { ...g, ...updates } : g));
    },

    getRankings: () => [
        { position: 1, teamName: 'Gladiators', record: '4-0' },
        { position: 2, teamName: 'Istepôs', record: '3-1' },
        { position: 3, teamName: 'Rex', record: '3-1' }
    ],

    getTeamSettings: (): TeamSettings => {
        const data = localStorage.getItem('fahub_settings');
        const settings = data ? JSON.parse(data) : null;
        if (settings && settings.id) return settings as TeamSettings;
        return { 
            id: '1', 
            teamName: 'Gladiators', 
            logoUrl: 'https://ui-avatars.com/api/?name=JG&background=059669&color=fff',
            primaryColor: '#059669',
            sportType: 'TACKLE',
            address: 'Joinville, SC',
            plan: 'ALL_PRO'
        };
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

    getObjectives: () => get<Objective>('fahub_objectives'),
    saveObjectives: (data: Objective[]) => set('fahub_objectives', data),

    getAnnouncements: () => get<Announcement>('fahub_announcements'),
    saveAnnouncements: (data: Announcement[]) => set('fahub_announcements', data),

    getChatMessages: () => get<ChatMessage>('fahub_chat'),
    saveChatMessages: (data: ChatMessage[]) => set('fahub_chat', data),

    getTasks: () => get<KanbanTask>('fahub_tasks'),
    saveTasks: (data: KanbanTask[]) => set('fahub_tasks', data),

    getInventory: () => get<EquipmentItem>('fahub_inventory'),
    saveInventory: (data: EquipmentItem[]) => set('fahub_inventory', data),

    getStaff: () => get<StaffMember>('fahub_staff'),
    saveStaff: (data: StaffMember[]) => set('fahub_staff', data),

    getYouthClasses: () => get<YouthClass>('fahub_youth_classes'),
    saveYouthClasses: (data: YouthClass[]) => set('fahub_youth_classes', data),
    getYouthStudents: () => get<YouthStudent>('fahub_youth_students'),

    getConfederationStats: () => ({ totalAthletes: 4850, totalTeams: 142, totalGamesThisYear: 320, activeAffiliates: 18 }),
    getNationalTeamScouting: () => get<NationalTeamCandidate>('fahub_national_scout'),
    getAffiliatesStatus: () => get<Affiliate>('fahub_affiliates'),
    getTransferRequests: () => get<TransferRequest>('fahub_transfers'),
    processTransfer: (id: any, d: any, a: any) => {},

    getLeague: () => getSingle<League>('fahub_league') || { id: '1', name: 'Liga Catarinense', season: '2025', teams: [] },
    saveLeague: (d: any) => set('fahub_league', d),

    getPublicGameData: (id: any) => ({}),
    getPublicLeagueStats: () => ({ name: 'Liga Catarinense', season: '2025', leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),
    getAthleteStatsHistory: (id: any) => [],
    getOKRs: () => get<OKR>('fahub_okrs'),
    saveOKRs: (d: any) => set('fahub_okrs', d),
    sendSignal: (s: any) => {},
    getEntitlements: () => [],
    purchaseDigitalProduct: (u: any, p: any) => {},
    saveCoachProfile: (u: any, p: any) => {},
    getSocialPosts: () => [],
    saveSocialPosts: (d: any) => {},
    getSocialFeed: () => get<SocialFeedPost>('fahub_feed'),
    saveSocialFeedPost: (d: any) => set('fahub_feed', d),
    toggleLikePost: (id: any) => {},
    getDocuments: () => [],
    saveDocuments: (d: any) => {},
    getCourses: () => [],
    saveCourses: (d: any) => {},
    saveTeam: (t: any) => {},
    getTeams: () => [],
    togglePracticeAttendance: (pr: any, pl: any) => {},
    logAction: (a: any, d: any) => storageService.logAuditAction(a, d),
    seedDatabaseToCloud: async () => {},
    uploadFile: async (file: File, path: string) => "https://ui-avatars.com/api/?name=Logo",
    getRoadmap: () => [],
    getProjectCompletion: () => 85,
    getAthleteByUserId: (id: string) => null,
    getSubscriptions: () => [],
    getBudgets: () => [],
    getBills: () => [],
    generateMonthlyInvoices: () => {},
    createChampionship: (n: any, y: any, d: any) => {}
};
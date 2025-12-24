import { 
    Player, Game, PracticeSession, TeamSettings, 
    AuditLog, Objective, Transaction, Invoice, MarketplaceItem,
    TacticalPlay, VideoClip, Course, SponsorDeal, EventSale,
    StaffMember, YouthClass, YouthStudent, Affiliate, TransferRequest,
    League, OKR, RoadmapItem, Entitlement, DigitalProduct,
    SocialFeedPost, EquipmentItem, NationalTeamCandidate, ConfederationStats
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
        return user ? JSON.parse(user) : null;
    },
    
    setCurrentUser: (u: any) => set('gridiron_current_user', u),
    
    getPracticeSessions: () => get<PracticeSession>('fahub_practice'),
    savePracticeSessions: (data: PracticeSession[]) => set('fahub_practice', data),

    getPlayers: () => get<Player>('fahub_players'),
    savePlayers: (data: Player[]) => set('fahub_players', data),
    registerAthlete: (player: Player) => set('fahub_players', [...get<Player>('fahub_players'), player]),

    getGames: () => get<Game>('fahub_games'),
    saveGames: (data: Game[]) => set('fahub_games', data),
    updateLiveGame: (id: any, updates: any) => {
        const games = get<Game>('fahub_games');
        set('fahub_games', games.map(g => String(g.id) === String(id) ? { ...g, ...updates } : g));
    },

    getRankings: () => [
        { position: 1, teamName: 'Gladiators', record: '4-0' },
        { position: 2, teamName: 'Rex', record: '3-1' }
    ],

    getTeamSettings: () => {
        const s = localStorage.getItem('fahub_settings');
        return s ? JSON.parse(s) : { teamName: 'Gladiators', primaryColor: '#059669' };
    },
    saveTeamSettings: (data: TeamSettings) => set('fahub_settings', data),
    
    getAuditLogs: () => get<AuditLog>('fahub_audit'),
    logAuditAction: (action: string, details: string) => {
        const logs = get<AuditLog>('fahub_audit');
        const user = storageService.getCurrentUser() || { name: 'Sistema' };
        set('fahub_audit', [{ id: Date.now().toString(), action, details, timestamp: new Date(), userName: user.name }, ...logs]);
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

    getDocuments: () => get<TeamDocument>('fahub_docs'),
    saveDocuments: (data: TeamDocument[]) => set('fahub_docs', data),

    getCourses: () => get<Course>('fahub_courses'),
    saveCourses: (data: Course[]) => set('fahub_courses', data),

    getInventory: () => get<EquipmentItem>('fahub_inventory'),
    saveInventory: (data: EquipmentItem[]) => set('fahub_inventory', data),

    getStaff: () => get<StaffMember>('fahub_staff'),
    saveStaff: (data: StaffMember[]) => set('fahub_staff', data),

    getOKRs: () => get<OKR>('fahub_okrs'),
    saveOKRs: (data: OKR[]) => set('fahub_okrs', data),

    getRoadmap: () => get<RoadmapItem>('fahub_roadmap'),
    getProjectCompletion: () => 85,

    getEntitlements: () => get<Entitlement>('fahub_entitlements'),
    purchaseDigitalProduct: (userId: string, product: DigitalProduct) => {
        const ents = get<Entitlement>('fahub_entitlements');
        const exp = new Date(); exp.setHours(exp.getHours() + product.durationHours);
        set('fahub_entitlements', [...ents, { id: `ent-${Date.now()}`, userId, productId: product.id, expiresAt: exp }]);
    },

    getPublicGameData: (gameId: string) => ({ id: gameId, opponent: 'Adversário', score: '0-0' }),
    getPublicLeagueStats: () => ({ name: 'Liga Catarinense', season: '2025', leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),
    getAthleteStatsHistory: (id: any) => [],
    getAthleteByUserId: (userId: string) => null,
    
    getConfederationStats: () => ({ totalAthletes: 1000, totalTeams: 50, totalGamesThisYear: 200, activeAffiliates: 10 }),
    getNationalTeamScouting: () => [],
    getAffiliatesStatus: () => [],
    getTransferRequests: () => [],
    processTransfer: (id: any, d: any, a: any) => {},
    
    getLeague: () => ({ id: '1', name: 'Liga', season: '2025', teams: [] }),
    saveLeague: (d: any) => {},
    
    getSocialPosts: () => [],
    saveSocialPosts: (d: any) => {},
    getSocialFeed: () => [],
    saveSocialFeedPost: (p: any) => {},
    toggleLikePost: (id: any) => {},
    
    getYouthClasses: () => [],
    saveYouthClasses: (d: any) => {},
    getYouthStudents: () => [],

    sendSignal: (s: any) => {},
    notify: (c: string) => {},
    saveCoachProfile: (u: any, p: any) => {},
    createChampionship: (n: any, y: any, d: any) => {},
    saveTeam: (t: any) => {},
    getTeams: () => [],
    getAthletes: () => [],
    togglePracticeAttendance: (pr: any, pl: any) => {},
    logAction: (a: any, d: any) => storageService.logAuditAction(a, d),
    getSubscriptions: () => [],
    saveSubscriptions: (d: any) => {},
    getBudgets: () => [],
    saveBudgets: (d: any) => {},
    getBills: () => [],
    saveBills: (d: any) => {},
    generateMonthlyInvoices: () => {},
    uploadFile: async (f: File, p: string) => "url"
};
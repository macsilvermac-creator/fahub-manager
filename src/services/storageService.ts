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
        return user ? JSON.parse(user) : { role: 'MASTER', name: 'Diretor Geral', id: 'master-01', program: 'TACKLE' };
    },
    
    setCurrentUser: (u: any) => set('gridiron_current_user', u),
    
    getPracticeSessions: () => get<PracticeSession>('fahub_practice'),
    savePracticeSessions: (data: PracticeSession[]) => set('fahub_practice', data),

    getPlayers: () => get<Player>('fahub_players'),
    savePlayers: (data: Player[]) => set('fahub_players', data),
    registerAthlete: (player: Player) => {
        const current = get<Player>('fahub_players');
        set('fahub_players', [...current, player]);
    },

    getGames: () => get<Game>('fahub_games'),
    saveGames: (data: Game[]) => set('fahub_games', data),
    updateLiveGame: (id: any, updates: any) => {
        const games = get<Game>('fahub_games');
        set('fahub_games', games.map(g => String(g.id) === String(id) ? { ...g, ...updates } : g));
    },

    getRankings: () => [
        { position: 1, teamName: 'Gladiators', record: '4-0' },
        { position: 2, teamName: 'Istepôs', record: '3-1' },
        { position: 3, teamName: 'Timbó Rex', record: '3-1' }
    ],

    getTeamSettings: () => getSingle<TeamSettings>('fahub_settings') || { teamName: 'Novo Time', primaryColor: '#059669', logoUrl: '' },
    saveTeamSettings: (data: TeamSettings) => set('fahub_settings', data),
    
    getAuditLogs: () => get<AuditLog>('fahub_audit'),
    logAuditAction: (action: string, details: string) => {
        const logs = get<AuditLog>('fahub_audit');
        const user = storageService.getCurrentUser();
        set('fahub_audit', [{ 
            id: Date.now().toString(), 
            action, 
            details, 
            timestamp: new Date(), 
            userName: user.name, 
            role: user.role,
            ipAddress: '127.0.0.1' 
        }, ...logs]);
    },

    getClips: () => get<VideoClip>('fahub_clips'),
    saveClips: (data: VideoClip[]) => set('fahub_clips', data),

    getTransactions: () => get<Transaction>('fahub_transactions'),
    saveTransactions: (data: Transaction[]) => set('fahub_transactions', data),

    getInvoices: () => get<Invoice>('fahub_invoices'),
    saveInvoices: (data: Invoice[]) => set('fahub_invoices', data),

    getSubscriptions: () => get<Subscription>('fahub_subscriptions'),
    saveSubscriptions: (data: Subscription[]) => set('fahub_subscriptions', data),

    getBudgets: () => get<Budget>('fahub_budgets'),
    saveBudgets: (data: Budget[]) => set('fahub_budgets', data),

    getBills: () => get<Bill>('fahub_bills'),
    saveBills: (data: Bill[]) => set('fahub_bills', data),

    getMarketplaceItems: () => get<MarketplaceItem>('fahub_marketplace'),
    saveMarketplaceItems: (data: MarketplaceItem[]) => set('fahub_marketplace', data),

    getSponsors: () => get<SponsorDeal>('fahub_sponsors'),
    saveSponsors: (data: SponsorDeal[]) => set('fahub_sponsors', data),

    getEventSales: () => get<EventSale>('fahub_event_sales'),
    saveEventSales: (data: EventSale[]) => set('fahub_event_sales', data),

    getStaff: () => get<StaffMember>('fahub_staff'),
    saveStaff: (data: StaffMember[]) => set('fahub_staff', data),

    getInventory: () => get<EquipmentItem>('fahub_inventory'),
    saveInventory: (data: EquipmentItem[]) => set('fahub_inventory', data),

    getOKRs: () => get<OKR>('fahub_okrs'),
    saveOKRs: (data: OKR[]) => set('fahub_okrs', data),

    getRoadmap: () => get<RoadmapItem>('fahub_roadmap'),
    getProjectCompletion: () => 85,

    getEntitlements: () => get<Entitlement>('fahub_entitlements'),
    purchaseDigitalProduct: (userId: string, product: DigitalProduct) => {
        const entitlements = get<Entitlement>('fahub_entitlements');
        const exp = new Date();
        exp.setHours(exp.getHours() + product.durationHours);
        const newEnt: Entitlement = { id: `ent-${Date.now()}`, userId, productId: product.id, expiresAt: exp };
        set('fahub_entitlements', [...entitlements, newEnt]);
    },

    getPublicGameData: (gameId: string) => ({ 
        id: gameId, 
        opponent: 'Adversário', 
        score: '0-0', 
        clock: '12:00', 
        currentQuarter: 1,
        sponsors: []
    }),

    getPublicLeagueStats: () => ({ 
        name: 'Liga Catarinense', 
        season: '2025', 
        leagueTable: [], 
        leaders: { passing: [], rushing: [], defense: [] } 
    }),

    getAthleteStatsHistory: (id: any) => [],
    getTacticalPlays: () => get<TacticalPlay>('fahub_tactical'),
    saveTacticalPlays: (data: TacticalPlay[]) => set('fahub_tactical', data),

    getCandidates: () => get<RecruitmentCandidate>('fahub_candidates'),
    saveCandidates: (data: RecruitmentCandidate[]) => set('fahub_candidates', data),

    getYouthClasses: () => get<YouthClass>('fahub_youth'),
    saveYouthClasses: (data: YouthClass[]) => set('fahub_youth', data),
    
    getTransferRequests: () => get<TransferRequest>('fahub_transfers'),
    
    getLeague: () => getSingle<League>('fahub_league') || { id: '1', name: 'Liga Catarinense', season: '2025', teams: [] },
    
    getActiveProgram: () => (getSingle<TeamSettings>('fahub_settings')?.sportType || 'TACKLE') as any,
    
    notify: (channel: string) => { window.dispatchEvent(new Event('storage_update')); },
    sendSignal: (s: any) => {},
    processTransfer: (id: any, d: any, a: any) => {},
    createChampionship: (n: any, y: any, d: any) => {},
    saveCoachProfile: (u: any, p: any) => {},
    getSocialPosts: () => [],
    saveSocialPosts: (d: any) => {},
    getSocialFeed: () => get<SocialFeedPost>('fahub_feed'),
    saveSocialFeedPost: (p: any) => set('fahub_feed', [p, ...get<SocialFeedPost>('fahub_feed')]),
    toggleLikePost: (id: string) => {},
    getAnnouncements: () => get<Announcement>('fahub_announcements'),
    saveAnnouncements: (data: Announcement[]) => set('fahub_announcements', data),
    getChatMessages: () => get<ChatMessage>('fahub_chat'),
    saveChatMessages: (data: ChatMessage[]) => set('fahub_chat', data),
    getDocuments: () => get<TeamDocument>('fahub_docs'),
    saveDocuments: (data: TeamDocument[]) => set('fahub_docs', data),
    getCourses: () => get<Course>('fahub_courses'),
    saveCourses: (data: Course[]) => set('fahub_courses', data),
    getTasks: () => get<KanbanTask>('fahub_tasks'),
    saveTasks: (data: KanbanTask[]) => set('fahub_tasks', data),
    saveTeam: (t: any) => {},
    getTeams: () => [],
    getAthletes: () => get<Player>('fahub_players'),
};

import { Player, Game, PracticeSession, TeamSettings, Objective, AuditLog, Transaction, RecruitmentCandidate, Invoice, Subscription, Budget, Bill, Announcement, ChatMessage, TeamDocument, TacticalPlay, VideoClip, MarketplaceItem, KanbanTask, SocialPost, SponsorDeal, EventSale, StaffMember, ConfederationStats, NationalTeamCandidate, Affiliate, TransferRequest, Course, Entitlement, Drill, YouthClass, YouthStudent } from '../types';

const get = <T>(key: string): T[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data, (k, v) => (k === 'date' || k === 'timestamp' || k === 'deadline' || k === 'lastUpdated' || k === 'joinedAt' || k === 'purchasedAt' || k === 'expiresAt' || k === 'uploadDate' || k === 'scheduledDate') ? new Date(v) : v) : [];
};

const set = <T>(key: string, data: T) => {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('storage_update'));
};

const subscribers: Record<string, (() => void)[]> = {};

export const storageService = {
    initializeRAM: () => console.log('ERP Engine Online'),

    subscribe: (key: string, callback: () => void) => {
        if (!subscribers[key]) subscribers[key] = [];
        subscribers[key].push(callback);
        return () => { subscribers[key] = subscribers[key].filter(cb => cb !== callback); };
    },

    notify: (key: string) => {
        if (subscribers[key]) subscribers[key].forEach(cb => cb());
    },

    // Audit System
    getAuditLogs: () => get<AuditLog>('gridiron_audit'),
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
            role: user?.role || 'SYSTEM',
            ipAddress: 'local'
        };
        set('gridiron_audit', [newLog, ...logs].slice(0, 100));
        storageService.notify('audit');
    },

    // Objectives
    getObjectives: () => get<Objective>('gridiron_objectives'),
    saveObjectives: (objs: Objective[]) => {
        set('gridiron_objectives', objs);
        storageService.notify('objectives');
    },

    // Recruitment
    getCandidates: () => get<RecruitmentCandidate>('gridiron_candidates'),
    saveCandidates: (data: RecruitmentCandidate[]) => {
        set('gridiron_candidates', data);
        storageService.notify('candidates');
    },

    // Finance
    getTransactions: () => get<Transaction>('gridiron_transactions'),
    saveTransactions: (t: Transaction[]) => {
        set('gridiron_transactions', t);
        storageService.notify('transactions');
    },
    getInvoices: () => get<Invoice>('gridiron_invoices'),
    saveInvoices: (inv: Invoice[]) => set('gridiron_invoices', inv),
    getSubscriptions: () => get<Subscription>('gridiron_subscriptions'),
    saveSubscriptions: (s: Subscription[]) => set('gridiron_subscriptions', s),
    getBudgets: () => get<Budget>('gridiron_budgets'),
    saveBudgets: (b: Budget[]) => set('gridiron_budgets', b),
    getBills: () => get<Bill>('gridiron_bills'),
    generateMonthlyInvoices: () => console.log('Monthly invoices generated'),

    // Sponsors & Commercial
    getSponsors: () => get<SponsorDeal>('gridiron_sponsors'),
    saveSponsors: (s: SponsorDeal[]) => set('gridiron_sponsors', s),
    getMarketplaceItems: () => get<MarketplaceItem>('gridiron_marketplace'),
    saveMarketplaceItems: (m: MarketplaceItem[]) => set('gridiron_marketplace', m),
    getEventSales: () => get<EventSale>('gridiron_event_sales'),
    saveEventSales: (s: EventSale[]) => set('gridiron_event_sales', s),

    // Confederation
    getConfederationStats: (): ConfederationStats => ({ totalAthletes: 4850, totalTeams: 18, totalGamesThisYear: 142, activeAffiliates: 12, growthRate: 0.15 }),
    getNationalTeamScouting: () => get<NationalTeamCandidate>('gridiron_nt_scouting'),
    getAffiliatesStatus: () => get<Affiliate>('gridiron_affiliates'),
    getTransferRequests: () => get<TransferRequest>('gridiron_transfers'),
    processTransfer: (id: string, decision: string, by: string) => console.log(`Transfer ${id} ${decision} by ${by}`),

    // Video
    getClips: () => get<VideoClip>('gridiron_clips'),
    saveClips: (c: VideoClip[]) => set('gridiron_clips', c),

    // Practice
    getPracticeSessions: () => get<PracticeSession>('gridiron_practice'),
    savePracticeSessions: (p: PracticeSession[]) => {
        set('gridiron_practice', p);
        storageService.notify('practice');
    },
    savePracticeCheckIn: (sessionId: string, attendeeIds: string[]) => console.log(`Checkin for ${sessionId}`),
    togglePracticeAttendance: (sessionId: string, playerId: string) => console.log(`Toggle attendance ${playerId}`),

    // Players
    getPlayers: () => get<Player>('gridiron_players'),
    savePlayers: (p: Player[]) => {
        set('gridiron_players', p);
        storageService.notify('players');
    },
    registerAthlete: (p: Player) => storageService.savePlayers([...storageService.getPlayers(), p]),
    addPlayerXP: (playerId: number, xp: number, reason: string) => console.log(`XP added to ${playerId}`),
    getAthleteStatsHistory: (playerId: number) => [],

    // Games
    getGames: () => get<Game>('gridiron_games'),
    saveGames: (g: Game[]) => {
        set('gridiron_games', g);
        storageService.notify('games');
    },
    updateLiveGame: (id: number, updates: Partial<Game>) => {
        const games = storageService.getGames().map(g => g.id === id ? { ...g, ...updates } : g);
        storageService.saveGames(games);
    },
    getPublicGameData: (id: string) => storageService.getGames().find(g => String(g.id) === id),

    // Tactical
    getTacticalPlays: () => get<TacticalPlay>('gridiron_tactical_plays'),
    saveTacticalPlays: (p: TacticalPlay[]) => set('gridiron_tactical_plays', p),

    // Resources & Comms
    getDocuments: () => get<TeamDocument>('gridiron_documents'),
    saveDocuments: (d: TeamDocument[]) => set('gridiron_documents', d),
    getAnnouncements: () => get<Announcement>('gridiron_announcements'),
    saveAnnouncements: (a: Announcement[]) => set('gridiron_announcements', a),
    getChatMessages: () => get<ChatMessage>('gridiron_chat'),
    saveChatMessages: (m: ChatMessage[]) => set('gridiron_chat', m),

    // Academy
    getCourses: () => get<Course>('gridiron_courses'),
    getDrillLibrary: () => get<Drill>('gridiron_drills'),
    getYouthClasses: () => get<YouthClass>('gridiron_youth_classes'),
    getYouthStudents: () => get<YouthStudent>('gridiron_youth_students'),
    saveYouthClasses: (c: YouthClass[]) => set('gridiron_youth_classes', c),

    // Settings
    getTeamSettings: (): TeamSettings => {
        const s = localStorage.getItem('gridiron_settings');
        return s ? JSON.parse(s) : { id: '1', teamName: 'FAHUB Stars', primaryColor: '#059669', logoUrl: '', address: 'Sede Principal' };
    },
    saveTeamSettings: (s: TeamSettings) => set('gridiron_settings', s),
    getActiveProgram: () => localStorage.getItem('active_program') || 'TACKLE',
    setActiveProgram: (p: string) => localStorage.setItem('active_program', p),
    getPublicLeagueStats: () => ({ name: 'Liga Nacional', season: '2025', leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),

    // Auth & Profile
    getCurrentUser: () => {
        const u = localStorage.getItem('gridiron_current_user');
        return u ? JSON.parse(u) : null;
    },
    setCurrentUser: (u: any) => localStorage.setItem('gridiron_current_user', JSON.stringify(u)),
    saveCoachProfile: (userId: string, profile: any) => console.log('Coach profile saved'),
    getAthleteByUserId: (userId: string) => null,
    getTeams: () => get<Team>('gridiron_teams'),
    saveTeam: (t: Team) => set('gridiron_teams', [...storageService.getTeams(), t]),
    getAthletes: () => [],

    // Tasks
    getTasks: () => get<KanbanTask>('gridiron_tasks'),
    saveTasks: (t: KanbanTask[]) => set('gridiron_tasks', t),

    // Store
    getEntitlements: () => get<Entitlement>('gridiron_entitlements'),
    purchaseDigitalProduct: (userId: string, product: any) => console.log('Product purchased'),
    getLeague: () => ({ name: 'Liga Base', season: '2025', teams: [] }),
    getSocialFeed: () => get<SocialFeedPost>('gridiron_feed'),
    saveSocialFeedPost: (p: SocialFeedPost) => set('gridiron_feed', [...storageService.getSocialFeed(), p]),
    toggleLikePost: (id: string) => console.log('Like toggled'),
};

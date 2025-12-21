
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
    Championship,
    // Fix: Added missing NationalTeamCandidate to imports
    NationalTeamCandidate
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
    // Fix: Added initializeRAM to set default team settings
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

    // Fix: Added subscribe method for real-time updates
    subscribe: (key: string, callback: () => void) => {
        window.addEventListener('storage_update', callback);
        return () => window.removeEventListener('storage_update', callback);
    },

    // Fix: Added getCurrentUser and setCurrentUser
    getCurrentUser: () => JSON.parse(localStorage.getItem('gridiron_current_user') || '{"role":"HEAD_COACH","name":"Coach Guto", "id": "user-123", "program": "TACKLE"}'),
    setCurrentUser: (u: any) => localStorage.setItem('gridiron_current_user', JSON.stringify(u)),
    
    // Fix: Added getTasks and saveTasks
    getTasks: () => get<KanbanTask>('hc_tasks'),
    saveTasks: (data: KanbanTask[]) => set('hc_tasks', data),

    // Fix: Added getRankings
    getRankings: () => get<LeagueRanking>('league_rankings'),
    
    // Fix: Added getPracticeSessions and savePracticeSessions
    getPracticeSessions: () => get<PracticeSession>('fahub_practice'),
    savePracticeSessions: (data: PracticeSession[]) => set('fahub_practice', data),

    // Fix: Added getPlayers, savePlayers, and registerAthlete
    getPlayers: () => get<Player>('fahub_players'),
    savePlayers: (data: Player[]) => set('fahub_players', data),
    getAthletes: () => get<Player>('fahub_players'),
    registerAthlete: (player: Player) => {
        const players = get<Player>('fahub_players');
        set('fahub_players', [...players, player]);
    },
    getAthleteByUserId: (userId: string) => get<Player>('fahub_players').find(p => (p as any).userId === userId),
    getAthleteStatsHistory: (playerId: string | number) => [],

    // Fix: Added getGames, saveGames, and updateLiveGame
    getGames: () => get<Game>('fahub_games'),
    saveGames: (data: Game[]) => set('fahub_games', data),
    updateLiveGame: (gameId: string | number, updates: Partial<Game>) => {
        const games = get<Game>('fahub_games');
        const updated = games.map(g => String(g.id) === String(gameId) ? { ...g, ...updates } : g);
        set('fahub_games', updated);
    },

    // Fix: Added getTeamSettings and saveTeamSettings
    getTeamSettings: () => getSingle<TeamSettings>('fahub_settings') || { id: '1', teamName: 'JG', logoUrl: '', primaryColor: '#059669', sportType: 'TACKLE' },
    saveTeamSettings: (data: TeamSettings) => set('fahub_settings', data),
    
    // Fix: Added getAuditLogs and logAuditAction
    getAuditLogs: () => get<AuditLog>('fahub_audit'),
    logAuditAction: (action: string, details: string) => {
        const logs = get<AuditLog>('fahub_audit');
        const user = storageService.getCurrentUser();
        set('fahub_audit', [{ id: Date.now().toString(), action, details, timestamp: new Date(), userName: user.name, role: user.role }, ...logs]);
    },
    logAction: (action: string, details: string) => storageService.logAuditAction(action, details),

    // Fix: Added getObjectives and saveObjectives
    getObjectives: () => get<Objective>('fahub_objectives'),
    saveObjectives: (data: Objective[]) => set('fahub_objectives', data),

    // Fix: Added getClips and saveClips
    getClips: () => get<VideoClip>('fahub_clips'),
    saveClips: (data: VideoClip[]) => set('fahub_clips', data),

    // Fix: Added getTransactions and saveTransactions
    getTransactions: () => get<Transaction>('fahub_transactions'),
    saveTransactions: (data: Transaction[]) => set('fahub_transactions', data),

    // Fix: Added getInvoices and saveInvoices
    getInvoices: () => get<Invoice>('fahub_invoices'),
    saveInvoices: (data: Invoice[]) => set('fahub_invoices', data),

    // Fix: Added getSubscriptions and saveSubscriptions
    getSubscriptions: () => get<Subscription>('fahub_subscriptions'),
    saveSubscriptions: (data: Subscription[]) => set('fahub_subscriptions', data),

    // Fix: Added getBudgets and saveBudgets
    getBudgets: () => get<Budget>('fahub_budgets'),
    saveBudgets: (data: Budget[]) => set('fahub_budgets', data),

    // Fix: Added getBills and saveBills
    getBills: () => get<Bill>('fahub_bills'),
    saveBills: (data: Bill[]) => set('fahub_bills', data),

    // Fix: Added getMarketplaceItems and saveMarketplaceItems
    getMarketplaceItems: () => get<MarketplaceItem>('fahub_marketplace'),
    saveMarketplaceItems: (data: MarketplaceItem[]) => set('fahub_marketplace', data),

    // Fix: Added getSponsors and saveSponsors
    getSponsors: () => get<SponsorDeal>('fahub_sponsors'),
    saveSponsors: (data: SponsorDeal[]) => set('fahub_sponsors', data),

    // Fix: Added getEventSales and saveEventSales
    getEventSales: () => get<EventSale>('fahub_event_sales'),
    saveEventSales: (data: EventSale[]) => set('fahub_event_sales', data),

    // Fix: Added getStaff and saveStaff
    getStaff: () => get<StaffMember>('fahub_staff'),
    saveStaff: (data: StaffMember[]) => set('fahub_staff', data),
    
    // Fix: Added getActiveProgram and notify
    getActiveProgram: () => (getSingle<TeamSettings>('fahub_settings')?.sportType || 'TACKLE') as any,
    notify: (channel: string) => { window.dispatchEvent(new Event('storage_update')); },
    
    // Fix: Added getTacticalPlays and saveTacticalPlays
    getTacticalPlays: () => get<TacticalPlay>('fahub_tactical'),
    saveTacticalPlays: (data: TacticalPlay[]) => set('fahub_tactical', data),

    // Fix: Added getCandidates and saveCandidates
    getCandidates: () => get<RecruitmentCandidate>('fahub_candidates'),
    saveCandidates: (data: RecruitmentCandidate[]) => set('fahub_candidates', data),

    // Fix: Added togglePracticeAttendance
    togglePracticeAttendance: (practiceId: string, playerId: string) => {
        const practices = get<PracticeSession>('fahub_practice');
        const updated = practices.map(p => {
            if (String(p.id) === practiceId) {
                const attendees = p.attendees || [];
                if (attendees.includes(playerId)) {
                    return { ...p, attendees: attendees.filter(id => id !== playerId) };
                }
                return { ...p, attendees: [...attendees, playerId] };
            }
            return p;
        });
        set('fahub_practice', updated);
    },

    // Fix: Added getAnnouncements and saveAnnouncements
    getAnnouncements: () => get<Announcement>('fahub_announcements'),
    saveAnnouncements: (data: Announcement[]) => set('fahub_announcements', data),

    // Fix: Added getChatMessages and saveChatMessages
    getChatMessages: () => get<ChatMessage>('fahub_chat'),
    saveChatMessages: (data: ChatMessage[]) => set('fahub_chat', data),

    // Fix: Added getDocuments and saveDocuments
    getDocuments: () => get<TeamDocument>('fahub_docs'),
    saveDocuments: (data: TeamDocument[]) => set('fahub_docs', data),

    // Fix: Added getCourses and saveCourses
    getCourses: () => get<Course>('fahub_courses'),
    saveCourses: (data: Course[]) => set('fahub_courses', data),

    // Fix: Added getLeague and saveLeague
    getLeague: () => getSingle<League>('fahub_league') || { id: '1', name: 'Liga Brasileira', season: '2025', teams: [] },
    saveLeague: (data: League) => set('fahub_league', data),

    // Fix: Added seedDatabaseToCloud
    seedDatabaseToCloud: async () => { console.log('Seeding cloud...'); },

    // Fix: Added uploadFile
    uploadFile: async (file: File, path: string) => "https://example.com/logo.png",

    // Fix: Added getSocialFeed, saveSocialFeedPost, and toggleLikePost
    getSocialFeed: () => get<SocialFeedPost>('fahub_feed'),
    saveSocialFeedPost: (post: SocialFeedPost) => set('fahub_feed', [post, ...get<SocialFeedPost>('fahub_feed')]),
    toggleLikePost: (postId: string) => {
        const feed = get<SocialFeedPost>('fahub_feed');
        set('fahub_feed', feed.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    },

    // Fix: Added getInventory and saveInventory
    getInventory: () => get<EquipmentItem>('fahub_inventory'),
    saveInventory: (data: EquipmentItem[]) => set('fahub_inventory', data),

    // Fix: Added getYouthClasses, saveYouthClasses, and getYouthStudents
    getYouthClasses: () => get<YouthClass>('fahub_youth_classes'),
    saveYouthClasses: (data: YouthClass[]) => set('fahub_youth_classes', data),
    getYouthStudents: () => get<YouthStudent>('fahub_youth_students'),

    // Fix: Added confederation and public league data methods
    getConfederationStats: () => ({ totalAthletes: 4850, totalTeams: 142, totalGamesThisYear: 320, activeAffiliates: 18 }),
    getNationalTeamScouting: () => get<NationalTeamCandidate>('fahub_national_scout'),
    getAffiliatesStatus: () => get<Affiliate>('fahub_affiliates'),
    getTransferRequests: () => get<TransferRequest>('fahub_transfers'),
    processTransfer: (id: string, decision: string, actor: string) => {},

    getPublicGameData: (gameId: string) => ({ id: gameId, opponent: 'Raptors', score: '14-7', clock: '10:00', currentQuarter: 2 }),
    getPublicLeagueStats: () => ({ name: 'Liga Brasileira', season: '2025', leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),

    // Fix: Added createChampionship
    createChampionship: (name: string, year: number, div: string) => {},

    // Fix: Added roadmap methods
    getRoadmap: () => get<RoadmapItem>('fahub_roadmap'),
    getProjectCompletion: () => 85,

    // Fix: Added OKR and Entitlement methods
    getOKRs: () => get<OKR>('fahub_okrs'),
    saveOKRs: (data: OKR[]) => set('fahub_okrs', data),
    sendSignal: (signal: Partial<ObjectiveSignal>) => {},

    getEntitlements: () => get<Entitlement>('fahub_entitlements'),
    purchaseDigitalProduct: (userId: string, product: DigitalProduct) => {
        const exp = new Date();
        exp.setHours(exp.getHours() + product.durationHours);
        const e: Entitlement = { id: `ent-${Date.now()}`, userId, productId: product.id, expiresAt: exp };
        set('fahub_entitlements', [...get<Entitlement>('fahub_entitlements'), e]);
    },

    generateMonthlyInvoices: () => {},
    saveCoachProfile: (userId: string, profile: any) => {},

    // Fix: Added getSocialPosts and saveSocialPosts
    getSocialPosts: () => get<SocialPost>('fahub_social_posts'),
    saveSocialPosts: (data: SocialPost[]) => set('fahub_social_posts', data),
    // Fix: Added saveTeam and getTeams
    saveTeam: (t: Team) => set('fahub_teams', [...get<Team>('fahub_teams'), t]),
    getTeams: () => get<Team>('fahub_teams'),
};

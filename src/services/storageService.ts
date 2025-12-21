
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
        window.addEventListener('storage_update', callback);
        return () => window.removeEventListener('storage_update', callback);
    },

    getCurrentUser: () => JSON.parse(localStorage.getItem('gridiron_current_user') || '{"role":"HEAD_COACH","name":"Coach Guto", "id": "user-123", "program": "TACKLE"}'),
    setCurrentUser: (u: any) => localStorage.setItem('gridiron_current_user', JSON.stringify(u)),
    
    getTasks: () => get<KanbanTask>('hc_tasks'),
    saveTasks: (data: KanbanTask[]) => set('hc_tasks', data),

    getRankings: () => [
        { position: 1, teamName: 'Gladiators', record: '4-0' },
        { position: 2, teamName: 'Istepôs', record: '3-1' },
        { position: 3, teamName: 'Timbó Rex', record: '3-1' }
    ],
    
    getPracticeSessions: () => get<PracticeSession>('fahub_practice'),
    savePracticeSessions: (data: PracticeSession[]) => set('fahub_practice', data),

    getPlayers: () => get<Player>('fahub_players'),
    savePlayers: (data: Player[]) => set('fahub_players', data),
    getAthletes: () => get<Player>('fahub_players'),
    registerAthlete: (player: Player) => {
        const players = get<Player>('fahub_players');
        set('fahub_players', [...players, player]);
    },
    getAthleteByUserId: (userId: string) => get<Player>('fahub_players').find(p => (p as any).userId === userId),
    getAthleteStatsHistory: (playerId: string | number) => [],

    getGames: () => get<Game>('fahub_games'),
    saveGames: (data: Game[]) => set('fahub_games', data),
    updateLiveGame: (gameId: string | number, updates: Partial<Game>) => {
        const games = get<Game>('fahub_games');
        const updated = games.map(g => String(g.id) === String(gameId) ? { ...g, ...updates } : g);
        set('fahub_games', updated);
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

    // Fix: Added getObjectives method
    getObjectives: () => get<Objective>('fahub_objectives'),
    // Fix: Added saveObjectives method
    saveObjectives: (data: Objective[]) => set('fahub_objectives', data),

    getClips: () => get<VideoClip>('fahub_clips'),
    saveClips: (data: VideoClip[]) => set('fahub_clips', data),

    getTransactions: () => get<Transaction>('fahub_transactions'),
    saveTransactions: (data: Transaction[]) => set('fahub_transactions', data),

    getInvoices: () => get<Invoice>('fahub_invoices'),
    saveInvoices: (data: Invoice[]) => set('fahub_invoices', data),

    // Fix: Added getSubscriptions method
    getSubscriptions: () => get<Subscription>('fahub_subscriptions'),
    // Fix: Added saveSubscriptions method
    saveSubscriptions: (data: Subscription[]) => set('fahub_subscriptions', data),

    // Fix: Added getBudgets method
    getBudgets: () => get<Budget>('fahub_budgets'),
    // Fix: Added saveBudgets method
    saveBudgets: (data: Budget[]) => set('fahub_budgets', data),

    // Fix: Added getBills method
    getBills: () => get<Bill>('fahub_bills'),
    // Fix: Added saveBills method
    saveBills: (data: Bill[]) => set('fahub_bills', data),

    getMarketplaceItems: () => get<MarketplaceItem>('fahub_marketplace'),
    saveMarketplaceItems: (data: MarketplaceItem[]) => set('fahub_marketplace', data),

    getSponsors: () => get<SponsorDeal>('fahub_sponsors'),
    saveSponsors: (data: SponsorDeal[]) => set('fahub_sponsors', data),

    getEventSales: () => get<EventSale>('fahub_event_sales'),
    saveEventSales: (data: EventSale[]) => set('fahub_event_sales', data),

    getStaff: () => get<StaffMember>('fahub_staff'),
    saveStaff: (data: StaffMember[]) => set('fahub_staff', data),
    
    getActiveProgram: () => (getSingle<TeamSettings>('fahub_settings')?.sportType || 'TACKLE') as any,
    notify: (channel: string) => { window.dispatchEvent(new Event('storage_update')); },
    
    getTacticalPlays: () => get<TacticalPlay>('fahub_tactical'),
    saveTacticalPlays: (data: TacticalPlay[]) => set('fahub_tactical', data),

    getCandidates: () => get<RecruitmentCandidate>('fahub_candidates'),
    saveCandidates: (data: RecruitmentCandidate[]) => set('fahub_candidates', data),

    // Fix: Added togglePracticeAttendance method
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

    // Fix: Added getAnnouncements method
    getAnnouncements: () => get<Announcement>('fahub_announcements'),
    // Fix: Added saveAnnouncements method
    saveAnnouncements: (data: Announcement[]) => set('fahub_announcements', data),

    // Fix: Added getChatMessages method
    getChatMessages: () => get<ChatMessage>('fahub_chat'),
    // Fix: Added saveChatMessages method
    saveChatMessages: (data: ChatMessage[]) => set('fahub_chat', data),

    getDocuments: () => get<TeamDocument>('fahub_docs'),
    // Fix: Added saveDocuments method
    saveDocuments: (data: TeamDocument[]) => set('fahub_docs', data),

    // Fix: Added getCourses method
    getCourses: () => get<Course>('fahub_courses'),
    // Fix: Added saveCourses method
    saveCourses: (data: Course[]) => set('fahub_courses', data),

    getLeague: () => getSingle<League>('fahub_league') || { id: '1', name: 'Liga Brasileira', season: '2025', teams: [] },
    saveLeague: (data: League) => set('fahub_league', data),

    seedDatabaseToCloud: async () => { console.log('Seeding cloud...'); },

    uploadFile: async (file: File, path: string) => "https://example.com/logo.png",

    getSocialFeed: () => get<SocialFeedPost>('fahub_feed'),
    saveSocialFeedPost: (post: SocialFeedPost) => set('fahub_feed', [post, ...get<SocialFeedPost>('fahub_feed')]),
    toggleLikePost: (postId: string) => {
        const feed = get<SocialFeedPost>('fahub_feed');
        set('fahub_feed', feed.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
    },

    getInventory: () => get<EquipmentItem>('fahub_inventory'),
    saveInventory: (data: EquipmentItem[]) => set('fahub_inventory', data),

    getYouthClasses: () => get<YouthClass>('fahub_youth_classes'),
    // Fix: Added saveYouthClasses method
    saveYouthClasses: (data: YouthClass[]) => set('fahub_youth_classes', data),
    getYouthStudents: () => get<YouthStudent>('fahub_youth_students'),

    getConfederationStats: () => ({ totalAthletes: 4850, totalTeams: 142, totalGamesThisYear: 320, activeAffiliates: 18 }),
    getNationalTeamScouting: () => get<NationalTeamCandidate>('fahub_national_scout'),
    getAffiliatesStatus: () => get<Affiliate>('fahub_affiliates'),
    getTransferRequests: () => get<TransferRequest>('fahub_transfers'),
    processTransfer: (id: string, decision: string, actor: string) => {
        console.log(`Transfer ${id} ${decision} by ${actor}`);
    },

    // Fix: Added getPublicGameData method
    getPublicGameData: (gameId: string) => ({ id: gameId, opponent: 'Raptors', score: '14-7', clock: '10:00', currentQuarter: 2 }),
    getPublicLeagueStats: () => ({ name: 'Liga Brasileira', season: '2025', leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),

    // Fix: Added createChampionship method
    createChampionship: (name: string, year: number, division: string) => {
        console.log(`Championship Created: ${name}`);
    },

    getRoadmap: () => get<RoadmapItem>('fahub_roadmap'),
    getProjectCompletion: () => 85,

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

    // Fix: Added getSocialPosts method
    getSocialPosts: () => get<SocialPost>('fahub_social_posts'),
    // Fix: Added saveSocialPosts method
    saveSocialPosts: (data: SocialPost[]) => set('fahub_social_posts', data),
    saveTeam: (t: Team) => set('fahub_teams', [...get<Team>('fahub_teams'), t]),
    getTeams: () => get<Team>('fahub_teams'),
};

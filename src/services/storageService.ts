
import { Player, Game, PracticeSession, TeamSettings, StaffMember, Transaction, Invoice, SocialFeedPost, Announcement, ChatMessage, TeamDocument, TacticalPlay, Course, AuditLog, MarketplaceItem, YouthClass, YouthStudent, RecruitmentCandidate, Objective, Subscription, Budget, Bill, KanbanTask, RefereeProfile, LegalDocument, ProgramType, Drill, Entitlement, DigitalProduct, League, SponsorDeal, SocialPost, EquipmentItem, EventSale, GameReport, VideoClip, VideoPlaylist, CoachGameNote, CoachCareer, CrewLogistics, NationalTeamCandidate, Affiliate, TransferRequest } from '../types';
import { firebaseDataService } from './firebaseDataService';
import { syncService } from './syncService';
import { securityService } from './securityService'; 
import { get, set } from 'idb-keyval';

const KEYS = {
    PLAYERS: 'gridiron_players',
    GAMES: 'gridiron_games',
    SETTINGS: 'gridiron_settings',
    PRACTICE: 'gridiron_practice',
    TRANSACTIONS: 'gridiron_transactions',
    INVOICES: 'gridiron_invoices',
    STAFF: 'gridiron_staff',
    TASKS: 'gridiron_tasks',
    ANNOUNCEMENTS: 'gridiron_announcements',
    CHAT: 'gridiron_chat',
    DOCUMENTS: 'gridiron_documents',
    INVENTORY: 'gridiron_inventory',
    SPONSORS: 'gridiron_sponsors',
    SOCIAL_POSTS: 'gridiron_social_posts',
    MARKETPLACE: 'gridiron_marketplace',
    SALES: 'gridiron_sales',
    COURSES: 'gridiron_courses',
    PLAYS: 'gridiron_tactical_plays',
    CLIPS: 'gridiron_clips',
    PLAYLISTS: 'gridiron_playlists',
    YOUTH_CLASSES: 'gridiron_youth_classes',
    COACH_NOTES: 'gridiron_coach_notes',
    COACH_PROFILES: 'gridiron_coach_profiles',
    FEED: 'gridiron_social_feed',
    LOGS: 'gridiron_audit_logs',
    ACTIVE_PROGRAM: 'gridiron_active_program',
    CANDIDATES: 'gridiron_candidates',
    OBJECTIVES: 'gridiron_objectives',
    ENTITLEMENTS: 'gridiron_entitlements',
    DRILLS: 'gridiron_drill_library',
    SUBSCRIPTIONS: 'gridiron_subscriptions',
    BUDGETS: 'gridiron_budgets',
    BILLS: 'gridiron_bills'
};

const INITIAL_TEAM_SETTINGS: TeamSettings = {
    id: 'ts-1',
    teamName: 'FAHUB Stars',
    logoUrl: 'https://ui-avatars.com/api/?name=FS&background=00A86B&color=fff&size=200', 
    address: 'Arena Principal, Centro Esportivo',
    primaryColor: '#00A86B',
    secondaryColor: '#EAB308',
    level: 5,
    xp: 2400,
    reputation: 85,
    badges: ['Campeão Estadual', 'Fair Play', 'Elite Training'],
    sportType: 'FULLPADS'
};

const RAM_DB: Record<string, any> = {
    players: [],
    games: [],
    settings: INITIAL_TEAM_SETTINGS,
    practice: [],
    transactions: [],
    invoices: [],
    staff: [],
    tasks: [],
    announcements: [],
    chat: [],
    documents: [],
    inventory: [],
    sponsors: [],
    socialPosts: [],
    marketplace: [],
    sales: [],
    courses: [],
    plays: [],
    clips: [],
    playlists: [],
    youthClasses: [],
    coachNotes: [],
    coachProfiles: {},
    feed: [],
    logs: [],
    candidates: [],
    objectives: [],
    entitlements: [],
    drills: [],
    activeProgram: 'TACKLE',
    subscriptions: [],
    budgets: [],
    bills: []
};

const LISTENERS: Record<string, Function[]> = {};

const persist = (dbKey: string, ramKey: string, data: any, syncEntity?: string) => {
    RAM_DB[ramKey] = data;
    if (LISTENERS[ramKey]) {
        LISTENERS[ramKey].forEach(cb => cb(data));
    }
    set(dbKey, data).catch(err => console.error(`Erro ao salvar ${dbKey}:`, err));

    if (syncEntity && syncService.getConnectionStatus()) {
        syncService.triggerSync(syncEntity, data);
    }
};

export const storageService = {
    initializeRAM: async () => {
        try {
            const keys = Object.values(KEYS);
            const values = await Promise.all(keys.map(key => get(key)));
            
            const keyMap: Record<string, string> = {
                [KEYS.PLAYERS]: 'players', [KEYS.GAMES]: 'games', [KEYS.SETTINGS]: 'settings',
                [KEYS.TRANSACTIONS]: 'transactions', [KEYS.PRACTICE]: 'practice', [KEYS.INVOICES]: 'invoices',
                [KEYS.STAFF]: 'staff', [KEYS.TASKS]: 'tasks', [KEYS.ANNOUNCEMENTS]: 'announcements',
                [KEYS.CHAT]: 'chat', [KEYS.DOCUMENTS]: 'documents', [KEYS.INVENTORY]: 'inventory',
                [KEYS.SPONSORS]: 'sponsors', [KEYS.SOCIAL_POSTS]: 'socialPosts', [KEYS.MARKETPLACE]: 'marketplace',
                [KEYS.SALES]: 'sales', [KEYS.COURSES]: 'courses', [KEYS.PLAYS]: 'plays',
                [KEYS.CLIPS]: 'clips', [KEYS.PLAYLISTS]: 'playlists', [KEYS.YOUTH_CLASSES]: 'youthClasses',
                [KEYS.COACH_NOTES]: 'coachNotes', [KEYS.COACH_PROFILES]: 'coachProfiles', [KEYS.FEED]: 'feed',
                [KEYS.LOGS]: 'logs', [KEYS.ACTIVE_PROGRAM]: 'activeProgram', [KEYS.CANDIDATES]: 'candidates',
                [KEYS.OBJECTIVES]: 'objectives', [KEYS.ENTITLEMENTS]: 'entitlements', [KEYS.DRILLS]: 'drills',
                [KEYS.SUBSCRIPTIONS]: 'subscriptions', [KEYS.BUDGETS]: 'budgets', [KEYS.BILLS]: 'bills'
            };

            keys.forEach((key, index) => {
                const val = values[index];
                if (val !== undefined && val !== null) {
                    const ramKey = keyMap[key];
                    if (ramKey) RAM_DB[ramKey] = val;
                }
            });
        } catch (e) {
            console.error("Critical DB Error:", e);
        }
    },

    subscribe: (key: string, callback: Function) => {
        if (!LISTENERS[key]) LISTENERS[key] = [];
        LISTENERS[key].push(callback);
        return () => {
            LISTENERS[key] = LISTENERS[key].filter(cb => cb !== callback);
        };
    },

    getPlayers: (): Player[] => RAM_DB.players,
    savePlayers: (players: Player[]) => {
        securityService.enforce('MANAGE_ROSTER');
        persist(KEYS.PLAYERS, 'players', players, 'players');
    },

    getGames: (): Game[] => RAM_DB.games,
    saveGames: (games: Game[]) => {
        securityService.enforce('MANAGE_TACTICS');
        persist(KEYS.GAMES, 'games', games, 'games');
    },

    updateLiveGame: (gameId: number, updates: Partial<Game>) => {
        const updated = RAM_DB.games.map((g: Game) => g.id === gameId ? { ...g, ...updates } : g);
        persist(KEYS.GAMES, 'games', updated, 'games'); 
    },

    finalizeGameReport: (gameId: number, report: GameReport, score: string, winner: string) => {
        securityService.enforce('OFFICIATE_GAME');
        const updated = RAM_DB.games.map((g: Game) => g.id === gameId ? {
            ...g,
            officialReport: report, score,
            result: (winner === 'HOME' ? 'W' : winner === 'AWAY' ? 'L' : 'T') as any,
            status: 'FINAL' as const
        } : g);
        persist(KEYS.GAMES, 'games', updated, 'games');
    },

    getPracticeSessions: (): PracticeSession[] => RAM_DB.practice,
    savePracticeSessions: (p: PracticeSession[]) => {
        securityService.enforce('MANAGE_TACTICS');
        persist(KEYS.PRACTICE, 'practice', p);
    },

    getTeamSettings: (): TeamSettings => RAM_DB.settings,
    saveTeamSettings: (s: TeamSettings) => {
        securityService.enforce('EDIT_SETTINGS');
        persist(KEYS.SETTINGS, 'settings', s, 'settings');
    },

    getActiveProgram: (): ProgramType => RAM_DB.activeProgram || 'TACKLE',
    setActiveProgram: (p: ProgramType) => persist(KEYS.ACTIVE_PROGRAM, 'activeProgram', p),

    getTransactions: (): Transaction[] => RAM_DB.transactions,
    saveTransactions: (t: Transaction[]) => {
        securityService.enforce('MANAGE_FINANCE');
        persist(KEYS.TRANSACTIONS, 'transactions', t, 'transactions');
    },

    getInvoices: (): Invoice[] => RAM_DB.invoices,
    saveInvoices: (i: Invoice[]) => {
        securityService.enforce('MANAGE_FINANCE');
        persist(KEYS.INVOICES, 'invoices', i);
    },

    getStaff: (): StaffMember[] => RAM_DB.staff,
    saveStaff: (s: StaffMember[]) => {
        securityService.enforce('MANAGE_STAFF');
        persist(KEYS.STAFF, 'staff', s);
    },

    getInventory: (): EquipmentItem[] => RAM_DB.inventory,
    saveInventory: (i: EquipmentItem[]) => persist(KEYS.INVENTORY, 'inventory', i),

    getSponsors: (): SponsorDeal[] => RAM_DB.sponsors,
    saveSponsors: (s: SponsorDeal[]) => persist(KEYS.SPONSORS, 'sponsors', s),

    getSocialPosts: (): SocialPost[] => RAM_DB.socialPosts,
    saveSocialPosts: (p: SocialPost[]) => persist(KEYS.SOCIAL_POSTS, 'socialPosts', p),

    getMarketplaceItems: (): MarketplaceItem[] => RAM_DB.marketplace,
    saveMarketplaceItems: (i: MarketplaceItem[]) => persist(KEYS.MARKETPLACE, 'marketplace', i),

    getCourses: (): Course[] => RAM_DB.courses,
    saveCourses: (c: Course[]) => persist(KEYS.COURSES, 'courses', c),

    getTacticalPlays: (): TacticalPlay[] => RAM_DB.plays,
    saveTacticalPlays: (t: TacticalPlay[]) => {
        securityService.enforce('MANAGE_TACTICS');
        persist(KEYS.PLAYS, 'plays', t);
    },

    getClips: (): VideoClip[] => RAM_DB.clips,
    saveClips: (c: VideoClip[]) => persist(KEYS.CLIPS, 'clips', c),
    
    getPlaylists: (): VideoPlaylist[] => RAM_DB.playlists,
    savePlaylists: (p: VideoPlaylist[]) => persist(KEYS.PLAYLISTS, 'playlists', p),

    getAuditLogs: (): AuditLog[] => RAM_DB.logs,
    logAuditAction: (action: string, detail: string) => {
        const newLog: AuditLog = {
            id: `log-${Date.now()}`, action, details: detail,
            timestamp: new Date(), userId: 'sys', userName: 'System',
            role: 'SYSTEM', ipAddress: '127.0.0.1'
        };
        const updated = [newLog, ...RAM_DB.logs];
        persist(KEYS.LOGS, 'logs', updated);
    },

    getCoachDashboardStats: () => {
        const activePlayers = RAM_DB.players.filter((p: Player) => p.status === 'ACTIVE').length;
        const injuredPlayers = RAM_DB.players.filter((p: Player) => p.status === 'INJURED' || p.status === 'IR').length;
        const nextGame = RAM_DB.games
            .filter((g: Game) => new Date(g.date) > new Date() && g.status === 'SCHEDULED')
            .sort((a: Game, b: Game) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
        return { activePlayers, injuredPlayers, nextGame: nextGame || null };
    },

    getPublicGameData: (id: string) => RAM_DB.games.find((g: Game) => String(g.id) === id),
    getPublicLeagueStats: () => ({ name: 'Liga Nacional BFA', season: '2025', leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),
    getRefereeProfile: (id: string) => ({ id: id || 'ref-1', name: 'Árbitro Principal', level: 'Senior', city: 'São Paulo', availability: 'AVAILABLE', totalGames: 42, balance: 450.00, certifications: [] } as RefereeProfile),
    getCrewLogistics: (gameId: number) => ({ gameId, meetingPoint: 'Hotel Plaza', meetingTime: '13:00', carPools: [], uniformColor: 'Tradicional' } as CrewLogistics),
    getAssociationFinancials: () => ({ totalReceivableFromLeagues: 0, totalPayableToReferees: 0, cashBalance: 0 }),
    getReferees: () => [], getCandidates: () => RAM_DB.candidates || [], saveCandidates: (c: any) => persist(KEYS.CANDIDATES, 'candidates', c),
    getObjectives: () => RAM_DB.objectives || [], saveObjectives: (o: any) => persist(KEYS.OBJECTIVES, 'objectives', o),
    getTasks: () => RAM_DB.tasks || [], saveTasks: (t: any) => persist(KEYS.TASKS, 'tasks', t),
    getAnnouncements: () => RAM_DB.announcements || [], saveAnnouncements: (a: any) => persist(KEYS.ANNOUNCEMENTS, 'announcements', a),
    getChatMessages: () => RAM_DB.chat || [], saveChatMessages: (m: any) => persist(KEYS.CHAT, 'chat', m),
    getSocialFeed: () => RAM_DB.feed || [], saveSocialFeedPost: (p: any) => persist(KEYS.FEED, 'feed', [p, ...RAM_DB.feed]),
    toggleLikePost: (id: string) => persist(KEYS.FEED, 'feed', RAM_DB.feed.map((p: any) => p.id === id ? { ...p, likes: p.likes + 1 } : p)),
    getDocuments: () => RAM_DB.documents || [], saveDocuments: (d: any) => persist(KEYS.DOCUMENTS, 'documents', d),
    getEventSales: () => RAM_DB.sales || [], saveEventSales: (s: any) => persist(KEYS.SALES, 'sales', s),
    getEntitlements: () => RAM_DB.entitlements || [], purchaseDigitalProduct: (u: string, p: any) => persist(KEYS.ENTITLEMENTS, 'entitlements', [...RAM_DB.entitlements, { id: Date.now().toString(), userId: u, productId: p.id, purchaseDate: new Date(), expiresAt: new Date(Date.now() + 30 * 24 * 3600000), status: 'ACTIVE' }]),
    getDrillLibrary: () => RAM_DB.drills || [], getYouthClasses: () => RAM_DB.youthClasses || [], saveYouthClasses: (c: any) => persist(KEYS.YOUTH_CLASSES, 'youthClasses', c),
    getYouthStudents: () => { let s: any[] = []; RAM_DB.youthClasses.forEach((c: any) => s = [...s, ...c.students]); return s; },
    getCoachGameNotes: () => RAM_DB.coachNotes || [], saveCoachGameNotes: (n: any) => persist(KEYS.COACH_NOTES, 'coachNotes', n),
    getCoachProfile: (id: string) => RAM_DB.coachProfiles[id] || null, saveCoachProfile: (id: string, p: any) => persist(KEYS.COACH_PROFILES, 'coachProfiles', { ...RAM_DB.coachProfiles, [id]: p }),
    togglePracticeAttendance: (pid: string, uid: string) => persist(KEYS.PRACTICE, 'practice', RAM_DB.practice.map((p: any) => String(p.id) === pid ? { ...p, attendees: p.attendees.includes(uid) ? p.attendees.filter((id: string) => id !== uid) : [...p.attendees, uid] } : p)),
    savePracticeCheckIn: (pid: string, ids: string[]) => persist(KEYS.PRACTICE, 'practice', RAM_DB.practice.map((p: any) => String(p.id) === pid ? { ...p, checkedInAttendees: ids } : p)),
    generateMonthlyInvoices: () => {}, 
    getSubscriptions: () => RAM_DB.subscriptions || [], 
    saveSubscriptions: (data: any) => persist(KEYS.SUBSCRIPTIONS, 'subscriptions', data), 
    getBudgets: () => RAM_DB.budgets || [], 
    saveBudgets: (data: any) => persist(KEYS.BUDGETS, 'budgets', data), 
    getBills: () => RAM_DB.bills || [], 
    saveBills: (data: any) => persist(KEYS.BILLS, 'bills', data),
    addPlayerXP: (id: number, amt: number, r: string) => persist(KEYS.PLAYERS, 'players', RAM_DB.players.map((p: any) => p.id === id ? { ...p, xp: (p.xp || 0) + amt, level: Math.floor(((p.xp || 0) + amt) / 100) + 1 } : p)),
    registerAthlete: (p: any) => persist(KEYS.PLAYERS, 'players', [...RAM_DB.players, p]),
    seedDatabaseToCloud: async () => {}, syncFromCloud: async () => true, getLeague: () => ({ id: 'l1', name: 'Liga BFA', season: '2025', teams: [] } as any),
    exportFullDatabase: async () => { const blob = new Blob([JSON.stringify(RAM_DB)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'backup.json'; a.click(); },
    uploadFile: async (f: File) => "https://via.placeholder.com/150", checkDocumentSigned: () => true,
    getConfederationStats: () => ({ totalAthletes: 1200, totalTeams: 15, totalGamesThisYear: 45, activeAffiliates: 4, growthRate: 10 }),
    getNationalTeamScouting: (): NationalTeamCandidate[] => [],
    getAffiliatesStatus: (): Affiliate[] => [],
    getTransferRequests: (): TransferRequest[] => [],
    processTransfer: (id: string, decision: string, by: string) => {
        storageService.logAuditAction('TRANSFER', `Transferência ${id} ${decision} por ${by}`);
    },
};

// FIX: Added missing LEGAL_DOCUMENTS export
export const LEGAL_DOCUMENTS: LegalDocument[] = [];

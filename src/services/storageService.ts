
import { Player, Game, PracticeSession, TeamSettings, StaffMember, Transaction, Invoice, SocialFeedPost, Announcement, ChatMessage, TeamDocument, TacticalPlay, Course, AuditLog, MarketplaceItem, YouthClass, YouthStudent, TransferRequest, CoachCareer, CoachGameNote, GameReport, CrewLogistics, VideoClip, VideoPlaylist, SponsorDeal, SocialPost, EquipmentItem, EventSale, RecruitmentCandidate, Objective, Subscription, Budget, Bill, KanbanTask, NationalTeamCandidate, Affiliate, RefereeProfile, LegalDocument, ProgramType, AssociationFinance, Drill, Entitlement, DigitalProduct } from '../types';
import { firebaseDataService } from './firebaseDataService';
import { syncService } from './syncService';

// Chaves do LocalStorage
const PLAYERS_KEY = 'gridiron_players';
const GAMES_KEY = 'gridiron_games';
const TEAM_SETTINGS_KEY = 'gridiron_settings';
const PRACTICE_KEY = 'gridiron_practice';
const TRANSACTIONS_KEY = 'gridiron_transactions';
const INVOICES_KEY = 'gridiron_invoices';
const STAFF_KEY = 'gridiron_staff';
const TASKS_KEY = 'gridiron_tasks';
const ANNOUNCEMENTS_KEY = 'gridiron_announcements';
const CHAT_KEY = 'gridiron_chat';
const DOCUMENTS_KEY = 'gridiron_documents';
const INVENTORY_KEY = 'gridiron_inventory';
const SPONSORS_KEY = 'gridiron_sponsors';
const SOCIAL_POSTS_KEY = 'gridiron_social_posts';
const MARKETPLACE_KEY = 'gridiron_marketplace';
const SALES_KEY = 'gridiron_sales';
const COURSES_KEY = 'gridiron_courses';
const TACTICAL_PLAYS_KEY = 'gridiron_tactical_plays';
const CLIPS_KEY = 'gridiron_clips';
const PLAYLISTS_KEY = 'gridiron_playlists';
const YOUTH_CLASSES_KEY = 'gridiron_youth_classes';
const COACH_PROFILES_KEY = 'gridiron_coach_profiles';
const COACH_NOTES_KEY = 'gridiron_coach_notes';
const SOCIAL_FEED_KEY = 'gridiron_social_feed';
const AUDIT_LOGS_KEY = 'gridiron_audit_logs';
const ACTIVE_PROGRAM_KEY = 'gridiron_active_program';
const CANDIDATES_KEY = 'gridiron_candidates';
const OBJECTIVES_KEY = 'gridiron_objectives';
const ENTITLEMENTS_KEY = 'gridiron_entitlements';
const DRILL_LIBRARY_KEY = 'gridiron_drill_library';

const dateReviver = (key: string, value: any) => {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
        return new Date(value);
    }
    return value;
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
    sportType: 'FULLPADS',
    legalAgreementsSigned: []
};

// Defined Legal Documents
export const LEGAL_DOCUMENTS: LegalDocument[] = [
    {
        id: 'doc-compliance-01',
        title: 'Política de Integridade Financeira e Compliance',
        version: '1.0',
        requiredRole: ['HEAD_COACH', 'FINANCIAL_MANAGER', 'MASTER'],
        createdAt: new Date(),
        content: `1. OBJETIVO
        Esta política visa garantir a transparência, a ética e a responsabilidade na gestão dos recursos financeiros da equipe/entidade.

        2. RESPONSABILIDADES
        O Diretor Financeiro (CFO) é responsável por manter os registros precisos. O Head Coach e o Presidente (Master) têm dever de fiscalização.

        3. PRESTAÇÃO DE CONTAS
        Todas as transações acima de R$ 100,00 devem ter comprovante anexado (digitalização via IA permitida).

        4. PROIBIÇÕES
        É estritamente proibido o uso de fundos da equipe para despesas pessoais não autorizadas.

        Ao assinar este documento digitalmente, declaro estar ciente das regras acima e sujeito às penalidades do estatuto.`
    }
];

// --- IN-MEMORY DATABASE & OBSERVERS ---
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
    activeProgram: 'TACKLE'
};

const LISTENERS: Record<string, Function[]> = {};

// Helper: Persistência Centralizada com Notificação
const persist = (key: string, ramKey: string, data: any, syncEntity?: string) => {
    RAM_DB[ramKey] = data;
    localStorage.setItem(key, JSON.stringify(data));
    
    // Notifica assinantes
    if (LISTENERS[ramKey]) {
        LISTENERS[ramKey].forEach(cb => cb(data));
    }

    // Aciona Sync
    if (syncEntity) {
        if (syncService.getConnectionStatus()) {
           // Lógica de sync direto poderia vir aqui, mas delegamos ao syncService
           syncService.triggerSync(syncEntity, data);
        } else {
           syncService.enqueueAction(syncEntity, data);
        }
    }
};

const getListFromDisk = <T>(key: string): T[] => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored, dateReviver) : [];
};

export const storageService = {
    initializeRAM: () => {
        RAM_DB.players = getListFromDisk(PLAYERS_KEY);
        RAM_DB.games = getListFromDisk(GAMES_KEY);
        
        const storedSettings = localStorage.getItem(TEAM_SETTINGS_KEY);
        RAM_DB.settings = storedSettings ? JSON.parse(storedSettings, dateReviver) : INITIAL_TEAM_SETTINGS;
        
        RAM_DB.practice = getListFromDisk(PRACTICE_KEY);
        RAM_DB.transactions = getListFromDisk(TRANSACTIONS_KEY);
        RAM_DB.invoices = getListFromDisk(INVOICES_KEY);
        RAM_DB.staff = getListFromDisk(STAFF_KEY);
        RAM_DB.tasks = getListFromDisk(TASKS_KEY);
        RAM_DB.announcements = getListFromDisk(ANNOUNCEMENTS_KEY);
        RAM_DB.chat = getListFromDisk(CHAT_KEY);
        RAM_DB.documents = getListFromDisk(DOCUMENTS_KEY);
        RAM_DB.inventory = getListFromDisk(INVENTORY_KEY);
        RAM_DB.sponsors = getListFromDisk(SPONSORS_KEY);
        RAM_DB.socialPosts = getListFromDisk(SOCIAL_POSTS_KEY);
        RAM_DB.marketplace = getListFromDisk(MARKETPLACE_KEY);
        RAM_DB.sales = getListFromDisk(SALES_KEY);
        RAM_DB.courses = getListFromDisk(COURSES_KEY);
        RAM_DB.plays = getListFromDisk(TACTICAL_PLAYS_KEY);
        RAM_DB.clips = getListFromDisk(CLIPS_KEY);
        RAM_DB.playlists = getListFromDisk(PLAYLISTS_KEY);
        RAM_DB.youthClasses = getListFromDisk(YOUTH_CLASSES_KEY);
        RAM_DB.coachNotes = getListFromDisk(COACH_NOTES_KEY);
        RAM_DB.feed = getListFromDisk(SOCIAL_FEED_KEY);
        RAM_DB.logs = getListFromDisk(AUDIT_LOGS_KEY);
        RAM_DB.candidates = getListFromDisk(CANDIDATES_KEY);
        RAM_DB.objectives = getListFromDisk(OBJECTIVES_KEY);
        RAM_DB.entitlements = getListFromDisk(ENTITLEMENTS_KEY);
        RAM_DB.drills = getListFromDisk(DRILL_LIBRARY_KEY);
        
        const storedProgram = localStorage.getItem(ACTIVE_PROGRAM_KEY);
        RAM_DB.activeProgram = storedProgram ? JSON.parse(storedProgram) : 'TACKLE';
    },

    // --- REATIVIDADE ---
    subscribe: (key: string, callback: Function) => {
        if (!LISTENERS[key]) LISTENERS[key] = [];
        LISTENERS[key].push(callback);
        return () => {
            LISTENERS[key] = LISTENERS[key].filter(cb => cb !== callback);
        };
    },

    // --- PLAYERS ---
    getPlayers: (): Player[] => RAM_DB.players,
    savePlayers: (players: Player[]) => persist(PLAYERS_KEY, 'players', players, 'players'),
    
    registerAthlete: (player: Player) => {
        const newPlayer = { ...player, teamId: 'ts-1', rosterCategory: 'ACTIVE' as const };
        const updated = [...RAM_DB.players, newPlayer];
        storageService.savePlayers(updated);
    },

    addPlayerXP: (playerId: number, amount: number, reason: string) => {
        const updated = RAM_DB.players.map((p: Player) => {
            if (p.id === playerId) {
                const newXp = (p.xp || 0) + amount;
                const newLevel = Math.floor(newXp / 100) + 1;
                return { ...p, xp: newXp, level: newLevel };
            }
            return p;
        });
        storageService.savePlayers(updated);
    },

    // --- GAMES ---
    getGames: (): Game[] => RAM_DB.games,
    saveGames: (games: Game[]) => persist(GAMES_KEY, 'games', games, 'games'),
    
    updateLiveGame: (gameId: number, updates: Partial<Game>) => {
        const updated = RAM_DB.games.map((g: Game) => g.id === gameId ? { ...g, ...updates } : g);
        storageService.saveGames(updated);
    },

    finalizeGameReport: (gameId: number, report: GameReport, score: string, winner: string) => {
        const updated = RAM_DB.games.map((g: Game) => g.id === gameId ? {
            ...g,
            officialReport: report,
            score,
            result: (winner === 'HOME' ? 'W' : winner === 'AWAY' ? 'L' : 'T') as 'W' | 'L' | 'T',
            status: 'FINAL' as const
        } : g);
        storageService.saveGames(updated);
    },

    // --- PRACTICE ---
    getPracticeSessions: (): PracticeSession[] => RAM_DB.practice,
    savePracticeSessions: (p: PracticeSession[]) => persist(PRACTICE_KEY, 'practice', p),
    
    togglePracticeAttendance: (practiceId: string, userId: string) => {
        const updated = RAM_DB.practice.map((p: PracticeSession) => {
            if (String(p.id) === practiceId) {
                const attendees = p.attendees || [];
                const newAttendees = attendees.includes(userId) 
                    ? attendees.filter(id => id !== userId)
                    : [...attendees, userId];
                return { ...p, attendees: newAttendees };
            }
            return p;
        });
        storageService.savePracticeSessions(updated);
    },

    savePracticeCheckIn: (practiceId: string, checkedInIds: string[]) => {
        const updated = RAM_DB.practice.map((p: PracticeSession) => {
            if (String(p.id) === practiceId) {
                return { ...p, checkedInAttendees: checkedInIds };
            }
            return p;
        });
        storageService.savePracticeSessions(updated);
    },
    
    getDrillLibrary: (): Drill[] => RAM_DB.drills,

    // --- SETTINGS ---
    getTeamSettings: (): TeamSettings => RAM_DB.settings,
    saveTeamSettings: (s: TeamSettings) => persist(TEAM_SETTINGS_KEY, 'settings', s, 'settings'),

    getActiveProgram: (): ProgramType => RAM_DB.activeProgram,
    setActiveProgram: (p: ProgramType) => persist(ACTIVE_PROGRAM_KEY, 'activeProgram', p),

    // --- FINANCE ---
    getTransactions: (): Transaction[] => RAM_DB.transactions,
    saveTransactions: (t: Transaction[]) => persist(TRANSACTIONS_KEY, 'transactions', t, 'transactions'),
    
    getInvoices: (): Invoice[] => RAM_DB.invoices,
    saveInvoices: (i: Invoice[]) => persist(INVOICES_KEY, 'invoices', i),
    
    createBulkInvoices: (ids: number[], title: string, amount: number, dueDate: Date, category: string) => {
        const newInvoices: Invoice[] = ids.map(id => {
            const player = RAM_DB.players.find((p: Player) => p.id === id);
            return {
                id: `inv-${Date.now()}-${id}`,
                playerId: id,
                playerName: player?.name || 'Atleta',
                title,
                amount,
                dueDate,
                status: 'PENDING',
                category: category as any
            };
        });
        storageService.saveInvoices([...RAM_DB.invoices, ...newInvoices]);
    },

    getEventSales: (): EventSale[] => RAM_DB.sales,
    saveEventSales: (s: EventSale[]) => persist(SALES_KEY, 'sales', s),

    getSubscriptions: (): Subscription[] => [], // Mock for now
    saveSubscriptions: (s: Subscription[]) => {}, 
    getBudgets: (): Budget[] => [], 
    saveBudgets: (b: Budget[]) => {}, 
    getBills: (): Bill[] => [], 
    saveBills: (b: Bill[]) => {},

    // --- STAFF ---
    getStaff: (): StaffMember[] => RAM_DB.staff,
    saveStaff: (s: StaffMember[]) => persist(STAFF_KEY, 'staff', s),

    // --- RECRUITMENT ---
    getCandidates: (): RecruitmentCandidate[] => RAM_DB.candidates,
    saveCandidates: (c: RecruitmentCandidate[]) => persist(CANDIDATES_KEY, 'candidates', c),

    // --- GOALS ---
    getObjectives: (): Objective[] => RAM_DB.objectives,
    saveObjectives: (o: Objective[]) => persist(OBJECTIVES_KEY, 'objectives', o),

    // --- TASKS ---
    getTasks: (): KanbanTask[] => RAM_DB.tasks,
    saveTasks: (t: KanbanTask[]) => persist(TASKS_KEY, 'tasks', t),

    // --- COMMUNICATION ---
    getAnnouncements: (): Announcement[] => RAM_DB.announcements,
    saveAnnouncements: (a: Announcement[]) => persist(ANNOUNCEMENTS_KEY, 'announcements', a),
    
    getChatMessages: (): ChatMessage[] => RAM_DB.chat,
    saveChatMessages: (m: ChatMessage[]) => persist(CHAT_KEY, 'chat', m),
    
    getSocialFeed: (): SocialFeedPost[] => RAM_DB.feed,
    saveSocialFeedPost: (p: SocialFeedPost) => {
        const updated = [p, ...RAM_DB.feed];
        persist(SOCIAL_FEED_KEY, 'feed', updated);
    },
    toggleLikePost: (postId: string) => {
        const updated = RAM_DB.feed.map((p: SocialFeedPost) => p.id === postId ? { ...p, likes: p.likes + 1 } : p);
        persist(SOCIAL_FEED_KEY, 'feed', updated);
    },

    // --- RESOURCES ---
    getDocuments: (): TeamDocument[] => RAM_DB.documents,
    saveDocuments: (d: TeamDocument[]) => persist(DOCUMENTS_KEY, 'documents', d),
    
    getInventory: (): EquipmentItem[] => RAM_DB.inventory,
    saveInventory: (i: EquipmentItem[]) => persist(INVENTORY_KEY, 'inventory', i),

    // --- COMMERCIAL ---
    getSponsors: (): SponsorDeal[] => RAM_DB.sponsors,
    saveSponsors: (s: SponsorDeal[]) => persist(SPONSORS_KEY, 'sponsors', s),

    getSocialPosts: (): SocialPost[] => RAM_DB.socialPosts,
    saveSocialPosts: (p: SocialPost[]) => persist(SOCIAL_POSTS_KEY, 'socialPosts', p),

    getMarketplaceItems: (): MarketplaceItem[] => RAM_DB.marketplace,
    saveMarketplaceItems: (i: MarketplaceItem[]) => persist(MARKETPLACE_KEY, 'marketplace', i),

    // --- ACADEMY & DRM ---
    getCourses: (): Course[] => RAM_DB.courses,
    saveCourses: (c: Course[]) => persist(COURSES_KEY, 'courses', c),
    
    getEntitlements: (): Entitlement[] => RAM_DB.entitlements,
    checkAccess: (userId: string, productId: string) => true, // Mock
    purchaseDigitalProduct: (userId: string, product: DigitalProduct) => {
        console.log("Product purchased:", product.title);
    },

    savePlayerWorkout: (playerId: number, content: string, title: string) => {
        const updated = RAM_DB.players.map((p: Player) => {
            if(p.id === playerId) {
                const workouts = p.savedWorkouts || [];
                workouts.push({ id: `w-${Date.now()}`, date: new Date(), title, content, category: 'GYM' });
                return { ...p, savedWorkouts: workouts };
            }
            return p;
        });
        storageService.savePlayers(updated);
    },

    // --- TACTICAL ---
    getTacticalPlays: (): TacticalPlay[] => RAM_DB.plays,
    saveTacticalPlays: (t: TacticalPlay[]) => persist(TACTICAL_PLAYS_KEY, 'plays', t),

    // --- VIDEO ---
    getClips: (): VideoClip[] => RAM_DB.clips,
    saveClips: (c: VideoClip[]) => persist(CLIPS_KEY, 'clips', c),
    getPlaylists: (): VideoPlaylist[] => RAM_DB.playlists,
    savePlaylists: (p: VideoPlaylist[]) => persist(PLAYLISTS_KEY, 'playlists', p),

    // --- YOUTH ---
    getYouthClasses: (): YouthClass[] => RAM_DB.youthClasses,
    saveYouthClasses: (c: YouthClass[]) => persist(YOUTH_CLASSES_KEY, 'youthClasses', c),
    getYouthStudents: (): YouthStudent[] => {
        let allStudents: YouthStudent[] = [];
        RAM_DB.youthClasses.forEach((c: YouthClass) => allStudents = [...allStudents, ...c.students]);
        return allStudents;
    },

    // --- COACH ---
    getCoachGameNotes: (): CoachGameNote[] => RAM_DB.coachNotes,
    saveCoachGameNotes: (n: CoachGameNote[]) => persist(COACH_NOTES_KEY, 'coachNotes', n),
    
    getCoachProfile: (id: string): CoachCareer | null => {
         const profiles = JSON.parse(localStorage.getItem(COACH_PROFILES_KEY) || '{}');
         return profiles[id] || null;
    },
    saveCoachProfile: (id: string, p: CoachCareer) => {
         const profiles = JSON.parse(localStorage.getItem(COACH_PROFILES_KEY) || '{}');
         profiles[id] = p;
         localStorage.setItem(COACH_PROFILES_KEY, JSON.stringify(profiles));
    },

    // --- LOGS ---
    getAuditLogs: (): AuditLog[] => RAM_DB.logs,
    logAuditAction: (action: string, detail: string) => {
        const newLog: AuditLog = {
            id: `log-${Date.now()}`,
            action,
            details: detail,
            timestamp: new Date(),
            userId: 'sys',
            userName: 'System',
            role: 'SYSTEM',
            ipAddress: '127.0.0.1'
        };
        const updated = [newLog, ...RAM_DB.logs];
        persist(AUDIT_LOGS_KEY, 'logs', updated);
    },

    // --- UTILS & MOCKS ---
    syncFromCloud: async () => {
         // Placeholder for real cloud sync logic call
         return true;
    },
    seedDatabaseToCloud: async () => { 
        await firebaseDataService.syncPlayers(RAM_DB.players);
        await firebaseDataService.syncGames(RAM_DB.games);
        await firebaseDataService.syncTransactions(RAM_DB.transactions);
    },
    exportFullDatabase: () => {
        const data = JSON.stringify(RAM_DB);
        const blob = new Blob([data], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fahub_backup_${Date.now()}.json`;
        a.click();
    },
    uploadFile: async (file: File, folder: string) => {
        return firebaseDataService.uploadFile(file, folder);
    },
    
    getCoachDashboardStats: () => {
        const activePlayers = RAM_DB.players.filter((p: Player) => p.status === 'ACTIVE').length;
        const injuredPlayers = RAM_DB.players.filter((p: Player) => p.status === 'INJURED' || p.status === 'IR').length;
        const now = new Date();
        const nextGame = RAM_DB.games
            .filter((g: Game) => new Date(g.date) > now && g.status === 'SCHEDULED')
            .sort((a: Game, b: Game) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
        return { activePlayers, injuredPlayers, nextGame: nextGame || null };
    },

    // Mock Methods for other modules
    checkDocumentSigned: () => true,
    getConfederationStats: () => ({ totalAthletes: 1200, totalTeams: 15, totalGamesThisYear: 45, activeAffiliates: 4, growthRate: 10 }),
    getNationalTeamScouting: () => [],
    getAffiliatesStatus: () => [],
    getTransferRequests: () => [],
    
    processTransfer: (id: string, decision: string, by: string) => {
        console.log(`Transfer ${id} processed: ${decision} by ${by}`);
    },

    getPublicGameData: (id: string) => RAM_DB.games.find((g: Game) => String(g.id) === id),
    getPublicLeagueStats: () => ({ name: 'Liga Nacional', season: '2025', leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),
    getReferees: () => [],
    
    getRefereeProfile: (id: string) => ({
        id: id || 'ref-1',
        name: 'Árbitro Principal',
        level: 'Senior',
        city: 'São Paulo',
        availability: 'AVAILABLE',
        totalGames: 42,
        balance: 450.00,
        certifications: [
             { id: 'cert-1', name: 'Regras IFAF 2024', issueDate: new Date(), expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), status: 'ACTIVE' }
        ]
    } as RefereeProfile),

    getCrewLogistics: (gameId: number) => ({
        gameId,
        meetingPoint: 'Hotel Plaza',
        meetingTime: '13:00',
        carPools: [
            { driver: 'Ref A', passengers: ['Ref B', 'Ref C'], vehicle: 'Sedan Prata' }
        ],
        uniformColor: 'Tradicional (Listrado)'
    } as CrewLogistics),

    getAssociationFinancials: () => ({ totalReceivableFromLeagues: 0, totalPayableToReferees: 0, cashBalance: 0 }),
    addTeamXP: (amount: number) => {},
    createChampionship: () => {},
    generateMonthlyInvoices: () => {}
};


import { Player, Game, PracticeSession, TeamSettings, StaffMember, Transaction, Invoice, SocialFeedPost, Announcement, ChatMessage, TeamDocument, TacticalPlay, Course, AuditLog, MarketplaceItem, YouthClass, YouthStudent, TransferRequest, CoachCareer, CoachGameNote, GameReport, CrewLogistics, VideoClip, VideoPlaylist, SponsorDeal, SocialPost, EquipmentItem, EventSale, RecruitmentCandidate, Objective, Subscription, Budget, Bill, KanbanTask, NationalTeamCandidate, Affiliate, RefereeProfile, LegalDocument, ProgramType, AssociationFinance } from '../types';
import { firebaseDataService } from './firebaseDataService';
import { syncService } from './syncService';

// Keys for LocalStorage
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
    YOUTH: 'gridiron_youth_classes',
    COACH_NOTES: 'gridiron_coach_notes',
    COACH_PROFILES: 'gridiron_coach_profiles',
    FEED: 'gridiron_social_feed',
    LOGS: 'gridiron_audit_logs',
    CANDIDATES: 'gridiron_candidates',
    OBJECTIVES: 'gridiron_objectives',
    SUBSCRIPTIONS: 'gridiron_subscriptions',
    BUDGETS: 'gridiron_budgets',
    BILLS: 'gridiron_bills',
    ACTIVE_PROGRAM: 'gridiron_active_program'
};

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
    address: 'Arena Principal',
    primaryColor: '#00A86B',
    secondaryColor: '#EAB308',
    level: 5,
    xp: 2400,
    reputation: 85,
    badges: ['Campeão Estadual'],
    sportType: 'FULLPADS',
    legalAgreementsSigned: []
};

// Internal RAM Database
const RAM_DB: Record<string, any> = {};
const LISTENERS: Record<string, Function[]> = {};

// Helper to get from disk
const getFromDisk = <T>(key: string, defaultValue: T): T => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored, dateReviver) : defaultValue;
    } catch {
        return defaultValue;
    }
};

// Helper to save to disk and notify
const saveToDisk = (key: string, value: any, syncEntity?: string) => {
    localStorage.setItem(key, JSON.stringify(value));
    RAM_DB[key] = value;
    
    // Notify local listeners
    if (LISTENERS[key]) {
        LISTENERS[key].forEach(cb => cb(value));
    }

    // Trigger Cloud Sync
    if (syncEntity) {
        syncService.triggerSync(syncEntity, value);
    }
};

export const storageService = {
    initializeRAM: () => {
        RAM_DB[KEYS.PLAYERS] = getFromDisk(KEYS.PLAYERS, []);
        RAM_DB[KEYS.GAMES] = getFromDisk(KEYS.GAMES, []);
        RAM_DB[KEYS.SETTINGS] = getFromDisk(KEYS.SETTINGS, INITIAL_TEAM_SETTINGS);
        RAM_DB[KEYS.TRANSACTIONS] = getFromDisk(KEYS.TRANSACTIONS, []);
        RAM_DB[KEYS.ACTIVE_PROGRAM] = getFromDisk(KEYS.ACTIVE_PROGRAM, 'TACKLE');
        // Load others on demand or here if critical
    },

    subscribe: (keyName: string, callback: Function) => {
        // Map generic names to specific keys if needed, or use direct keys
        let internalKey = '';
        if (keyName === 'players') internalKey = KEYS.PLAYERS;
        else if (keyName === 'games') internalKey = KEYS.GAMES;
        else if (keyName === 'activeProgram') internalKey = KEYS.ACTIVE_PROGRAM;
        else internalKey = keyName;

        if (!LISTENERS[internalKey]) LISTENERS[internalKey] = [];
        LISTENERS[internalKey].push(callback);

        return () => {
            LISTENERS[internalKey] = LISTENERS[internalKey].filter(cb => cb !== callback);
        };
    },

    // --- PLAYERS ---
    getPlayers: (): Player[] => getFromDisk(KEYS.PLAYERS, []),
    savePlayers: (players: Player[]) => saveToDisk(KEYS.PLAYERS, players, 'players'),
    registerAthlete: (player: Player) => {
        const players = storageService.getPlayers();
        const updated = [...players, player];
        storageService.savePlayers(updated);
    },
    addPlayerXP: (playerId: number, amount: number, reason: string) => {
        const players = storageService.getPlayers();
        const updated = players.map(p => {
            if (p.id === playerId) {
                return { ...p, xp: (p.xp || 0) + amount };
            }
            return p;
        });
        storageService.savePlayers(updated);
        storageService.logAuditAction('GAMIFICATION', `Player ${playerId} +${amount} XP: ${reason}`);
    },

    // --- GAMES ---
    getGames: (): Game[] => getFromDisk(KEYS.GAMES, []),
    saveGames: (games: Game[]) => saveToDisk(KEYS.GAMES, games, 'games'),
    updateLiveGame: (gameId: number, updates: Partial<Game>) => {
        const games = storageService.getGames();
        const updated = games.map(g => g.id === gameId ? { ...g, ...updates } : g);
        storageService.saveGames(updated);
    },
    finalizeGameReport: (gameId: number, report: GameReport, score: string, winner: string) => {
        const games = storageService.getGames();
        const updated = games.map(g => g.id === gameId ? {
            ...g,
            officialReport: report,
            score,
            result: (winner === 'HOME' ? 'W' : winner === 'AWAY' ? 'L' : 'T') as 'W' | 'L' | 'T',
            status: 'FINAL' as const
        } : g);
        storageService.saveGames(updated);
    },

    // --- TEAM SETTINGS ---
    getTeamSettings: (): TeamSettings => getFromDisk(KEYS.SETTINGS, INITIAL_TEAM_SETTINGS),
    saveTeamSettings: (s: TeamSettings) => saveToDisk(KEYS.SETTINGS, s, 'settings'),

    // --- PROGRAM CONTEXT ---
    getActiveProgram: (): ProgramType => getFromDisk(KEYS.ACTIVE_PROGRAM, 'TACKLE'),
    setActiveProgram: (program: ProgramType) => saveToDisk(KEYS.ACTIVE_PROGRAM, program),

    // --- FINANCE ---
    getTransactions: (): Transaction[] => getFromDisk(KEYS.TRANSACTIONS, []),
    saveTransactions: (t: Transaction[]) => saveToDisk(KEYS.TRANSACTIONS, t, 'transactions'),
    
    getInvoices: (): Invoice[] => getFromDisk(KEYS.INVOICES, []),
    saveInvoices: (i: Invoice[]) => saveToDisk(KEYS.INVOICES, i),
    generateMonthlyInvoices: () => { /* Mock Implementation */ },
    createBulkInvoices: (ids: number[], title: string, amount: number, dueDate: Date, category: string) => {
        const invoices = storageService.getInvoices();
        // Mock creation logic
        const newInvoices: Invoice[] = ids.map(id => ({
            id: `inv-${Date.now()}-${id}`,
            playerId: id,
            playerName: 'Player', // Fetch real name
            title,
            amount,
            dueDate,
            status: 'PENDING',
            category: category as any
        }));
        storageService.saveInvoices([...invoices, ...newInvoices]);
    },

    getSubscriptions: (): Subscription[] => getFromDisk(KEYS.SUBSCRIPTIONS, []),
    saveSubscriptions: (s: Subscription[]) => saveToDisk(KEYS.SUBSCRIPTIONS, s),

    getBudgets: (): Budget[] => getFromDisk(KEYS.BUDGETS, []),
    saveBudgets: (b: Budget[]) => saveToDisk(KEYS.BUDGETS, b),

    getBills: (): Bill[] => getFromDisk(KEYS.BILLS, []),
    saveBills: (b: Bill[]) => saveToDisk(KEYS.BILLS, b),

    // --- OTHER ENTITIES (Simple Getters/Setters) ---
    getPracticeSessions: (): PracticeSession[] => getFromDisk(KEYS.PRACTICE, []),
    savePracticeSessions: (p: PracticeSession[]) => saveToDisk(KEYS.PRACTICE, p),
    togglePracticeAttendance: (practiceId: string, userId: string) => {
        const practices = storageService.getPracticeSessions();
        const updated = practices.map(p => {
            if (p.id === practiceId) {
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
    confirmPracticePresence: (practiceId: string, userId: string) => {
        const practices = storageService.getPracticeSessions();
        const updated = practices.map(p => {
            if (p.id === practiceId) {
                const checkedIn = p.checkedInAttendees || [];
                if (!checkedIn.includes(userId)) {
                    return { ...p, checkedInAttendees: [...checkedIn, userId] };
                }
            }
            return p;
        });
        storageService.savePracticeSessions(updated);
    },

    getStaff: (): StaffMember[] => getFromDisk(KEYS.STAFF, []),
    saveStaff: (s: StaffMember[]) => saveToDisk(KEYS.STAFF, s),

    getTasks: (): KanbanTask[] => getFromDisk(KEYS.TASKS, []),
    saveTasks: (t: KanbanTask[]) => saveToDisk(KEYS.TASKS, t),

    getAnnouncements: (): Announcement[] => getFromDisk(KEYS.ANNOUNCEMENTS, []),
    saveAnnouncements: (a: Announcement[]) => saveToDisk(KEYS.ANNOUNCEMENTS, a),

    getChatMessages: (): ChatMessage[] => getFromDisk(KEYS.CHAT, []),
    saveChatMessages: (m: ChatMessage[]) => saveToDisk(KEYS.CHAT, m),

    getDocuments: (): TeamDocument[] => getFromDisk(KEYS.DOCUMENTS, []),
    saveDocuments: (d: TeamDocument[]) => saveToDisk(KEYS.DOCUMENTS, d),

    getInventory: (): EquipmentItem[] => getFromDisk(KEYS.INVENTORY, []),
    saveInventory: (i: EquipmentItem[]) => saveToDisk(KEYS.INVENTORY, i),

    getSponsors: (): SponsorDeal[] => getFromDisk(KEYS.SPONSORS, []),
    saveSponsors: (s: SponsorDeal[]) => saveToDisk(KEYS.SPONSORS, s),

    getSocialPosts: (): SocialPost[] => getFromDisk(KEYS.SOCIAL_POSTS, []),
    saveSocialPosts: (p: SocialPost[]) => saveToDisk(KEYS.SOCIAL_POSTS, p),

    getMarketplaceItems: (): MarketplaceItem[] => getFromDisk(KEYS.MARKETPLACE, []),
    saveMarketplaceItems: (i: MarketplaceItem[]) => saveToDisk(KEYS.MARKETPLACE, i),

    getEventSales: (): EventSale[] => getFromDisk(KEYS.SALES, []),
    saveEventSales: (s: EventSale[]) => saveToDisk(KEYS.SALES, s),

    getCourses: (): Course[] => getFromDisk(KEYS.COURSES, []),
    saveCourses: (c: Course[]) => saveToDisk(KEYS.COURSES, c),

    getTacticalPlays: (): TacticalPlay[] => getFromDisk(KEYS.PLAYS, []),
    saveTacticalPlays: (t: TacticalPlay[]) => saveToDisk(KEYS.PLAYS, t),

    getClips: (): VideoClip[] => getFromDisk(KEYS.CLIPS, []),
    saveClips: (c: VideoClip[]) => saveToDisk(KEYS.CLIPS, c),

    getPlaylists: (): VideoPlaylist[] => getFromDisk(KEYS.PLAYLISTS, []),
    savePlaylists: (p: VideoPlaylist[]) => saveToDisk(KEYS.PLAYLISTS, p),

    getYouthClasses: (): YouthClass[] => getFromDisk(KEYS.YOUTH, []),
    saveYouthClasses: (c: YouthClass[]) => saveToDisk(KEYS.YOUTH, c),
    getYouthStudents: (): YouthStudent[] => {
        const classes = getFromDisk<YouthClass[]>(KEYS.YOUTH, []);
        let allStudents: YouthStudent[] = [];
        classes.forEach(c => allStudents = [...allStudents, ...c.students]);
        return allStudents;
    },

    getCoachGameNotes: (): CoachGameNote[] => getFromDisk(KEYS.COACH_NOTES, []),
    saveCoachGameNotes: (n: CoachGameNote[]) => saveToDisk(KEYS.COACH_NOTES, n),

    getCoachProfile: (userId: string): CoachCareer | null => {
        const profiles = getFromDisk<Record<string, CoachCareer>>(KEYS.COACH_PROFILES, {});
        return profiles[userId] || null;
    },
    saveCoachProfile: (userId: string, profile: CoachCareer) => {
        const profiles = getFromDisk<Record<string, CoachCareer>>(KEYS.COACH_PROFILES, {});
        profiles[userId] = profile;
        saveToDisk(KEYS.COACH_PROFILES, profiles);
    },

    getSocialFeed: (): SocialFeedPost[] => getFromDisk(KEYS.FEED, []),
    saveSocialFeedPost: (p: SocialFeedPost) => {
        const feed = storageService.getSocialFeed();
        saveToDisk(KEYS.FEED, [p, ...feed]);
    },
    toggleLikePost: (postId: string) => {
        const feed = storageService.getSocialFeed();
        const updated = feed.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p);
        saveToDisk(KEYS.FEED, updated);
    },

    getAuditLogs: (): AuditLog[] => getFromDisk(KEYS.LOGS, []),
    logAuditAction: (action: string, details: string) => {
        const logs = storageService.getAuditLogs();
        const newLog: AuditLog = {
            id: `log-${Date.now()}`,
            action,
            details,
            timestamp: new Date(),
            userId: 'sys',
            userName: 'System',
            role: 'SYSTEM',
            ipAddress: 'local'
        };
        saveToDisk(KEYS.LOGS, [newLog, ...logs]);
    },

    getCandidates: (): RecruitmentCandidate[] => getFromDisk(KEYS.CANDIDATES, []),
    saveCandidates: (c: RecruitmentCandidate[]) => saveToDisk(KEYS.CANDIDATES, c),

    getObjectives: (): Objective[] => getFromDisk(KEYS.OBJECTIVES, []),
    saveObjectives: (o: Objective[]) => saveToDisk(KEYS.OBJECTIVES, o),

    // --- MOCKS FOR EXTERNAL MODULES ---
    getConfederationStats: () => ({ totalAthletes: 1250, totalTeams: 18, totalGamesThisYear: 42, activeAffiliates: 5, growthRate: 12 }),
    getNationalTeamScouting: (): NationalTeamCandidate[] => [],
    getAffiliatesStatus: (): Affiliate[] => [],
    getTransferRequests: (): TransferRequest[] => [],
    processTransfer: (id: string, decision: string, by: string) => {},
    
    getLeague: () => ({ id: 'lg-1', name: 'Liga Nacional', season: '2025', teams: [] }),
    getPublicLeagueStats: () => ({ name: 'Liga Nacional', season: '2025', leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),
    getPublicGameData: (gameId: string) => {
        const games = storageService.getGames();
        return games.find(g => String(g.id) === gameId) || null;
    },
    
    getReferees: (): RefereeProfile[] => [],
    getRefereeProfile: (id: string): RefereeProfile | null => ({ id, name: 'Juiz Exemplo', level: 'Senior', city: 'SP', availability: 'AVAILABLE', totalGames: 10, balance: 500, certifications: [] }),
    getCrewLogistics: (gameId: number): CrewLogistics | null => ({ gameId, meetingPoint: 'Hotel A', meetingTime: '10:00', carPools: [], uniformColor: 'BW' }),
    getAssociationFinancials: (): AssociationFinance => ({ totalReceivableFromLeagues: 0, totalPayableToReferees: 0, cashBalance: 0 }),

    addTeamXP: (amount: number) => {
        const s = storageService.getTeamSettings();
        s.xp = (s.xp || 0) + amount;
        storageService.saveTeamSettings(s);
    },

    savePlayerWorkout: (playerId: number, content: string, title: string) => {
        const players = storageService.getPlayers();
        const updated = players.map(p => {
            if(p.id === playerId) {
                const workouts = p.savedWorkouts || [];
                workouts.push({ id: `w-${Date.now()}`, date: new Date(), title, content, category: 'GYM' });
                return { ...p, savedWorkouts: workouts };
            }
            return p;
        });
        storageService.savePlayers(updated);
    },

    createChampionship: (name: string, year: number, division: string) => {},

    exportFullDatabase: () => {
        const data = JSON.stringify(localStorage);
        const blob = new Blob([data], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fahub_backup.json';
        a.click();
    },

    seedDatabaseToCloud: async () => {
        console.log("Seeding database...");
        return true;
    },

    uploadFile: async (file: File, folder: string) => {
        return firebaseDataService.uploadFile(file, folder);
    },
    
    syncFromCloud: async () => {
        return syncService.processQueue();
    },

    checkDocumentSigned: (docId: string) => true,
};

export const LEGAL_DOCUMENTS: LegalDocument[] = [
    {
        id: 'doc-terms-use',
        title: 'Termos de Uso e Responsabilidade Financeira',
        version: '1.0',
        requiredRole: ['MASTER', 'FINANCIAL_MANAGER'],
        createdAt: new Date('2024-01-01'),
        content: `
        1. O usuário declara estar ciente de que todas as transações são registradas.
        2. O uso indevido dos recursos do time é passível de punição estatutária.
        3. A prestação de contas deve ser feita mensalmente.
        `
    }
];

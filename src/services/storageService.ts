
import { Player, Game, PracticeSession, TeamSettings, StaffMember, Transaction, Invoice, SocialFeedPost, Announcement, ChatMessage, TeamDocument, TacticalPlay, Course, AuditLog, MarketplaceItem, YouthClass, YouthStudent, TransferRequest, CoachCareer, CoachGameNote, GameReport, CrewLogistics, VideoClip, VideoPlaylist, SponsorDeal, SocialPost, EquipmentItem, EventSale, RecruitmentCandidate, Objective, Subscription, Budget, Bill, KanbanTask, NationalTeamCandidate, Affiliate, RefereeProfile } from '../types';
import { firebaseDataService } from './firebaseDataService';
import { syncService } from './syncService';

// Chaves do LocalStorage
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
    badges: ['Verificado'],
    sportType: 'FULLPADS',
    legalAgreementsSigned: []
};

// --- RAM CACHE & LAZY LOADING SYSTEM ---
const RAM_DB: any = {
    settings: null,
    activeProgram: 'TACKLE',
    // Dados Críticos
    players: null,
    games: null,
    // Dados Lazy
    practice: null,
    transactions: null,
    invoices: null,
    staff: null,
    feed: null,
    tasks: null,
    announcements: null,
    chat: null,
    documents: null,
    inventory: null,
    sponsors: null,
    socialPosts: null,
    marketplace: null,
    sales: null,
    courses: null,
    plays: null,
    clips: null,
    playlists: null,
    youthClasses: null,
    coachNotes: null,
    coachProfiles: null,
    logs: null,
    candidates: null,
    objectives: null,
    subscriptions: null,
    budgets: null,
    bills: null,
};

// Listener System
type Listener = () => void;
const listeners: Record<string, Listener[]> = {};

const notifyListeners = (key: string) => {
    if (listeners[key]) {
        listeners[key].forEach(fn => fn());
    }
};

const saveTimeouts: Record<string, any> = {};

// LAZY LOAD: Carrega do disco apenas se necessário
const loadIfNeeded = <T>(ramKey: string, storageKey: string, initialValue: any = []): T[] => {
    if (RAM_DB[ramKey] !== null && RAM_DB[ramKey] !== undefined) {
        return RAM_DB[ramKey];
    }
    try {
        const stored = localStorage.getItem(storageKey);
        if (!stored) {
            RAM_DB[ramKey] = initialValue;
            return initialValue;
        }
        const parsed = JSON.parse(stored, dateReviver);
        RAM_DB[ramKey] = parsed;
        return parsed;
    } catch (e) {
        RAM_DB[ramKey] = initialValue;
        return initialValue;
    }
};

// CORE OPTIMISTIC UI LOGIC
const saveAndCache = <T>(ramKey: string, storageKey: string, data: T) => {
    // 1. Atualiza RAM imediatamente (UI reage instantaneamente via hooks)
    RAM_DB[ramKey] = data;
    notifyListeners(ramKey); 
    
    // 2. Salva no Disco (LocalStorage) para persistência offline
    if (saveTimeouts[storageKey]) {
        clearTimeout(saveTimeouts[storageKey]);
    }
    saveTimeouts[storageKey] = setTimeout(() => {
        try {
            localStorage.setItem(storageKey, JSON.stringify(data));
            
            // 3. Dispara Sincronização em Background (Fire & Forget)
            syncService.triggerSync(ramKey, data); 
            
        } catch (e) {
            console.error("Storage Write Error", e);
        }
        delete saveTimeouts[storageKey];
    }, 500); 
};

export const storageService = {
    subscribe: (key: string, callback: Listener) => {
        if (!listeners[key]) listeners[key] = [];
        listeners[key].push(callback);
        return () => {
            listeners[key] = listeners[key].filter(cb => cb !== callback);
        };
    },

    initializeRAM: () => {
        console.group("🚀 FAHUB PROTOCOL: SYSTEM BOOT");
        if (RAM_DB.settings === null) {
            try {
                const storedSettings = localStorage.getItem(KEYS.SETTINGS);
                RAM_DB.settings = storedSettings ? JSON.parse(storedSettings, dateReviver) : INITIAL_TEAM_SETTINGS;
            } catch (e) {
                RAM_DB.settings = INITIAL_TEAM_SETTINGS;
            }
        }
        const storedProgram = localStorage.getItem(KEYS.ACTIVE_PROGRAM);
        if (storedProgram) RAM_DB.activeProgram = storedProgram;
        
        loadIfNeeded('players', KEYS.PLAYERS);
        loadIfNeeded('games', KEYS.GAMES);
        
        console.log("✅ Core Memory Loaded: Players, Games, Settings");
        console.log(`⚡ Active Program: ${RAM_DB.activeProgram}`);
        console.groupEnd();
        return true; 
    },

    uploadFile: async (file: File, folder: string = 'general') => {
        return await firebaseDataService.uploadFile(file, folder);
    },

    syncFromCloud: async () => {
        return await syncService.processQueue().then(() => true).catch(() => false);
    },

    getActiveProgram: (): 'TACKLE' | 'FLAG' => RAM_DB.activeProgram || 'TACKLE',
    setActiveProgram: (program: 'TACKLE' | 'FLAG') => {
        RAM_DB.activeProgram = program;
        localStorage.setItem(KEYS.ACTIVE_PROGRAM, program);
        notifyListeners('activeProgram');
    },

    // --- DATA ACCESSORS ---
    getPlayers: (): Player[] => loadIfNeeded<Player>('players', KEYS.PLAYERS),
    savePlayers: (players: Player[]) => saveAndCache('players', KEYS.PLAYERS, players),
    
    getGames: (): Game[] => loadIfNeeded<Game>('games', KEYS.GAMES),
    saveGames: (games: Game[]) => saveAndCache('games', KEYS.GAMES, games),
    
    getTeamSettings: (): TeamSettings => RAM_DB.settings || INITIAL_TEAM_SETTINGS,
    saveTeamSettings: (s: TeamSettings) => {
        RAM_DB.settings = s;
        saveAndCache('settings', KEYS.SETTINGS, s);
    },

    getPracticeSessions: (): PracticeSession[] => loadIfNeeded<PracticeSession>('practice', KEYS.PRACTICE),
    savePracticeSessions: (p: PracticeSession[]) => saveAndCache('practice', KEYS.PRACTICE, p),

    getTransactions: (): Transaction[] => loadIfNeeded<Transaction>('transactions', KEYS.TRANSACTIONS),
    saveTransactions: (t: Transaction[]) => saveAndCache('transactions', KEYS.TRANSACTIONS, t),
    
    getInvoices: (): Invoice[] => loadIfNeeded<Invoice>('invoices', KEYS.INVOICES),
    saveInvoices: (i: Invoice[]) => saveAndCache('invoices', KEYS.INVOICES, i),
    
    getStaff: (): StaffMember[] => loadIfNeeded<StaffMember>('staff', KEYS.STAFF),
    saveStaff: (s: StaffMember[]) => saveAndCache('staff', KEYS.STAFF, s),

    getCoachDashboardStats: () => {
        const players = loadIfNeeded<Player>('players', KEYS.PLAYERS);
        const games = loadIfNeeded<Game>('games', KEYS.GAMES);
        const activeProgram = RAM_DB.activeProgram;
        
        const activePlayers = players.filter(p => p.status === 'ACTIVE' && (p.program === activeProgram || p.program === 'BOTH')).length;
        const injuredPlayers = players.filter(p => (p.status === 'INJURED' || p.status === 'IR') && (p.program === activeProgram || p.program === 'BOTH')).length;
        
        const now = new Date();
        const nextGame = games
            .filter((g: Game) => new Date(g.date) >= now && g.status === 'SCHEDULED')
            .sort((a: Game, b: Game) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

        return { activePlayers, injuredPlayers, nextGame: nextGame || null };
    },

    getSubscriptions: () => loadIfNeeded<Subscription>('subscriptions', KEYS.SUBSCRIPTIONS),
    saveSubscriptions: (s: Subscription[]) => saveAndCache('subscriptions', KEYS.SUBSCRIPTIONS, s),
    
    getBudgets: () => loadIfNeeded<Budget>('budgets', KEYS.BUDGETS),
    saveBudgets: (b: Budget[]) => saveAndCache('budgets', KEYS.BUDGETS, b),
    
    getBills: () => loadIfNeeded<Bill>('bills', KEYS.BILLS),
    saveBills: (b: Bill[]) => saveAndCache('bills', KEYS.BILLS, b),

    getSocialFeed: () => loadIfNeeded<SocialFeedPost>('feed', KEYS.FEED),
    saveSocialFeedPost: (p: SocialFeedPost) => {
        const current = loadIfNeeded<SocialFeedPost>('feed', KEYS.FEED);
        saveAndCache('feed', KEYS.FEED, [p, ...current]);
    },
    toggleLikePost: (postId: string) => {
        const feed = loadIfNeeded<SocialFeedPost>('feed', KEYS.FEED);
        const updated = feed.map((p: SocialFeedPost) => p.id === postId ? { ...p, likes: p.likes + 1 } : p);
        saveAndCache('feed', KEYS.FEED, updated);
    },

    getTasks: () => loadIfNeeded<KanbanTask>('tasks', KEYS.TASKS),
    saveTasks: (t: KanbanTask[]) => saveAndCache('tasks', KEYS.TASKS, t),

    getAnnouncements: () => loadIfNeeded<Announcement>('announcements', KEYS.ANNOUNCEMENTS),
    saveAnnouncements: (a: Announcement[]) => saveAndCache('announcements', KEYS.ANNOUNCEMENTS, a),

    getChatMessages: () => loadIfNeeded<ChatMessage>('chat', KEYS.CHAT),
    saveChatMessages: (m: ChatMessage[]) => saveAndCache('chat', KEYS.CHAT, m),

    getDocuments: () => loadIfNeeded<TeamDocument>('documents', KEYS.DOCUMENTS),
    saveDocuments: (d: TeamDocument[]) => saveAndCache('documents', KEYS.DOCUMENTS, d),

    getInventory: () => loadIfNeeded<EquipmentItem>('inventory', KEYS.INVENTORY),
    saveInventory: (i: EquipmentItem[]) => saveAndCache('inventory', KEYS.INVENTORY, i),

    getSponsors: () => loadIfNeeded<SponsorDeal>('sponsors', KEYS.SPONSORS),
    saveSponsors: (s: SponsorDeal[]) => saveAndCache('sponsors', KEYS.SPONSORS, s),

    getSocialPosts: () => loadIfNeeded<SocialPost>('socialPosts', KEYS.SOCIAL_POSTS),
    saveSocialPosts: (p: SocialPost[]) => saveAndCache('socialPosts', KEYS.SOCIAL_POSTS, p),

    getMarketplaceItems: () => loadIfNeeded<MarketplaceItem>('marketplace', KEYS.MARKETPLACE),
    saveMarketplaceItems: (i: MarketplaceItem[]) => saveAndCache('marketplace', KEYS.MARKETPLACE, i),

    getEventSales: () => loadIfNeeded<EventSale>('sales', KEYS.SALES),
    saveEventSales: (s: EventSale[]) => saveAndCache('sales', KEYS.SALES, s),

    getCourses: () => loadIfNeeded<Course>('courses', KEYS.COURSES),
    saveCourses: (c: Course[]) => saveAndCache('courses', KEYS.COURSES, c),

    getTacticalPlays: () => loadIfNeeded<TacticalPlay>('plays', KEYS.PLAYS),
    saveTacticalPlays: (t: TacticalPlay[]) => saveAndCache('plays', KEYS.PLAYS, t),

    getClips: () => loadIfNeeded<VideoClip>('clips', KEYS.CLIPS),
    saveClips: (c: VideoClip[]) => saveAndCache('clips', KEYS.CLIPS, c),

    getPlaylists: () => loadIfNeeded<VideoPlaylist>('playlists', KEYS.PLAYLISTS),
    savePlaylists: (p: VideoPlaylist[]) => saveAndCache('playlists', KEYS.PLAYLISTS, p),

    getYouthClasses: () => loadIfNeeded<YouthClass>('youthClasses', KEYS.YOUTH),
    saveYouthClasses: (c: YouthClass[]) => saveAndCache('youthClasses', KEYS.YOUTH, c),
    getYouthStudents: () => {
        const classes = loadIfNeeded<YouthClass>('youthClasses', KEYS.YOUTH);
        let all: YouthStudent[] = [];
        classes.forEach(c => all = [...all, ...c.students]);
        return all;
    },

    getCoachGameNotes: () => loadIfNeeded<CoachGameNote>('coachNotes', KEYS.COACH_NOTES),
    saveCoachGameNotes: (n: CoachGameNote[]) => saveAndCache('coachNotes', KEYS.COACH_NOTES, n),

    getCoachProfile: (id: string) => {
        const profiles = loadIfNeeded<CoachCareer>('coachProfiles', KEYS.COACH_PROFILES);
        return profiles[0] || null;
    },
    saveCoachProfile: (id: string, p: CoachCareer) => saveAndCache('coachProfiles', KEYS.COACH_PROFILES, [p]),

    getAuditLogs: () => loadIfNeeded<AuditLog>('logs', KEYS.LOGS),
    logAuditAction: (action: string, detail: string) => {
        const newLog = {
            id: `log-${Date.now()}`,
            action,
            details: detail,
            timestamp: new Date(),
            userId: 'sys',
            userName: 'System',
            role: 'SYSTEM',
            ipAddress: '127.0.0.1'
        };
        const logs = loadIfNeeded<AuditLog>('logs', KEYS.LOGS);
        saveAndCache('logs', KEYS.LOGS, [newLog, ...logs]);
    },

    getCandidates: () => loadIfNeeded<RecruitmentCandidate>('candidates', KEYS.CANDIDATES),
    saveCandidates: (c: RecruitmentCandidate[]) => saveAndCache('candidates', KEYS.CANDIDATES, c),

    getObjectives: () => loadIfNeeded<Objective>('objectives', KEYS.OBJECTIVES),
    saveObjectives: (o: Objective[]) => saveAndCache('objectives', KEYS.OBJECTIVES, o),

    registerAthlete: (player: Player) => {
        const players = loadIfNeeded<Player>('players', KEYS.PLAYERS);
        const updated = [...players, { 
            ...player, 
            teamId: 'ts-1', 
            rosterCategory: 'ACTIVE' as const,
            wellnessHistory: [],
            gameLogs: [],
            savedWorkouts: [],
            medicalReports: []
        }];
        saveAndCache('players', KEYS.PLAYERS, updated);
    },

    addTeamXP: (amount: number) => {
        const settings = storageService.getTeamSettings();
        settings.xp += amount;
        if(settings.xp > 5000) {
            settings.level += 1;
            settings.xp = 0;
        }
        storageService.saveTeamSettings(settings);
    },
    
    updateLiveGame: (gameId: number, updates: Partial<Game>) => {
        const games = loadIfNeeded<Game>('games', KEYS.GAMES);
        const updated = games.map((g: Game) => g.id === gameId ? { ...g, ...updates } : g);
        saveAndCache('games', KEYS.GAMES, updated);
    },
    finalizeGameReport: (gameId: number, report: GameReport, score: string, winner: string) => {
        const games = loadIfNeeded<Game>('games', KEYS.GAMES);
        const updated = games.map((g: Game) => g.id === gameId ? {
            ...g,
            officialReport: report,
            score,
            result: (winner === 'HOME' ? 'W' : winner === 'AWAY' ? 'L' : 'T') as 'W' | 'L' | 'T',
            status: 'FINAL' as const
        } : g);
        saveAndCache('games', KEYS.GAMES, updated);
    },
    createBulkInvoices: (ids: number[], title: string, amount: number, dueDate: Date, category: string, inventoryItemId?: string) => {
        const invoices = storageService.getInvoices();
        const players = storageService.getPlayers();
        
        const newInvoices: Invoice[] = ids.map(id => {
            const player = players.find(p => p.id === id);
            return {
                id: `inv-${Date.now()}-${id}`,
                playerId: id,
                playerName: player?.name || 'Atleta',
                title,
                amount,
                dueDate,
                status: 'PENDING',
                category: category as any,
                inventoryItemId
            };
        });
        saveAndCache('invoices', KEYS.INVOICES, [...invoices, ...newInvoices]);
    },
    generateMonthlyInvoices: () => {
         const subscriptions = storageService.getSubscriptions();
         const activeSubs = subscriptions.filter(s => s.active);
         
         activeSubs.forEach(sub => {
             storageService.createBulkInvoices(sub.assignedTo, sub.title, sub.amount, new Date(), 'TUITION');
         });
    },

    getPermissions: () => [],
    seedDatabaseToCloud: async () => {
        await syncService.processQueue();
    },
    exportFullDatabase: () => {
        const data = JSON.stringify(localStorage);
        const blob = new Blob([data], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fahub_backup_${new Date().toISOString()}.json`;
        a.click();
    },
    checkDocumentSigned: (docId: string) => true, 
    signLegalDocument: () => {},
    getConfederationStats: () => ({ totalAthletes: 1200, totalTeams: 15, totalGamesThisYear: 45, activeAffiliates: 4, growthRate: 10 }),
    getNationalTeamScouting: () => loadIfNeeded<NationalTeamCandidate>('candidates', KEYS.CANDIDATES), 
    getAffiliatesStatus: () => [],
    getTransferRequests: () => loadIfNeeded<TransferRequest>('transfers', 'gridiron_transfers'), 
    processTransfer: (id: string, decision: string, by: string) => {},
    getLeague: () => ({ id: 'lg-1', name: 'Liga Nacional', season: '2025', teams: [] }),
    getPublicLeagueStats: () => ({ name: 'Liga Nacional', season: '2025', leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),
    getPublicGameData: (gameId: string) => null,
    getReferees: (): RefereeProfile[] => [],
    getRefereeProfile: (id: string): RefereeProfile => ({ id, name: 'Juiz Demo', level: 'Senior', city: 'SP', availability: 'AVAILABLE', totalGames: 10, balance: 250, certifications: [] }),
    getCrewLogistics: (gameId: number): CrewLogistics | null => null,
    getAssociationFinancials: () => null,
    savePlayerWorkout: (playerId: number, content: string, title: string) => {
        const players = loadIfNeeded<Player>('players', KEYS.PLAYERS);
        const updated = players.map((p: Player) => {
            if(p.id === playerId) {
                const workouts = p.savedWorkouts || [];
                workouts.push({ id: `w-${Date.now()}`, date: new Date(), title, content, category: 'GYM' });
                return { ...p, savedWorkouts: workouts };
            }
            return p;
        });
        saveAndCache('players', KEYS.PLAYERS, updated);
    },
    createChampionship: (name: string, year: number, division: string) => {}
};

export const LEGAL_DOCUMENTS: any[] = [{ id: 'doc-terms', title: 'Termos de Uso Financeiro', version: '1.0', content: 'Termos de uso do sistema financeiro...', requiredRole: ['FINANCIAL_MANAGER'] }];

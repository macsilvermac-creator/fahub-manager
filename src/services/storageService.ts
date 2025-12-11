
import { Player, Game, PracticeSession, TeamSettings, StaffMember, Transaction, Invoice, SocialFeedPost, Announcement, ChatMessage, TeamDocument, TacticalPlay, Course, AuditLog, League, MarketplaceItem, YouthClass, YouthStudent, TransferRequest, CoachCareer, CoachGameNote, GameReport, Championship, CrewLogistics, VideoClip, VideoPlaylist, SponsorDeal, SocialPost, VideoPermissionGroup, EquipmentItem, EventSale, SavedWorkout, NationalTeamCandidate, Affiliate, KanbanTask, RecruitmentCandidate, Objective } from '../types';
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
const CANDIDATES_KEY = 'gridiron_candidates';
const OBJECTIVES_KEY = 'gridiron_objectives';

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

// --- IN-MEMORY DATABASE (RAM CACHE) ---
const RAM_DB: any = {
    players: [],
    games: [],
    settings: null,
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
    coachProfiles: [],
    feed: [],
    logs: [],
    candidates: [],
    objectives: []
};

// Generic Helper for Disk I/O
const getListFromDisk = <T>(key: string): T[] => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored, dateReviver) : [];
    } catch (e) {
        console.error(`Error reading ${key} from disk`, e);
        return [];
    }
};

const saveListToDisk = <T>(key: string, list: T[]) => {
    try {
        localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {
        console.error(`Error saving ${key} to disk`, e);
    }
};

export const storageService = {
    // --- INITIALIZATION (Critical for Performance) ---
    initializeRAM: () => {
        console.time("RAM_INIT");
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
        RAM_DB.coachProfiles = getListFromDisk(COACH_PROFILES_KEY);
        RAM_DB.feed = getListFromDisk(SOCIAL_FEED_KEY);
        RAM_DB.logs = getListFromDisk(AUDIT_LOGS_KEY);
        RAM_DB.candidates = getListFromDisk(CANDIDATES_KEY);
        RAM_DB.objectives = getListFromDisk(OBJECTIVES_KEY);
        console.timeEnd("RAM_INIT");
    },

    // --- CLOUD STORAGE (FILES) ---
    uploadFile: async (file: File, folder: string = 'general') => {
        return await firebaseDataService.uploadFile(file, folder);
    },

    // --- CORE SYNC FUNCTION ---
    syncFromCloud: async () => {
        console.log("📡 Iniciando sincronização (Background)...");
        try {
            const cloudPlayers = await firebaseDataService.getPlayers();
            if (cloudPlayers && cloudPlayers.length > 0) {
                RAM_DB.players = cloudPlayers;
                saveListToDisk(PLAYERS_KEY, cloudPlayers);
            }

            const cloudGames = await firebaseDataService.getGames();
            if (cloudGames && cloudGames.length > 0) {
                RAM_DB.games = cloudGames;
                saveListToDisk(GAMES_KEY, cloudGames);
            }

            const cloudTxs = await firebaseDataService.getTransactions();
            if (cloudTxs && cloudTxs.length > 0) {
                RAM_DB.transactions = cloudTxs;
                saveListToDisk(TRANSACTIONS_KEY, cloudTxs);
            }
            return true;
        } catch (error) {
            console.error("⚠️ Erro na sincronização:", error);
            return false;
        }
    },

    // --- ACCESSORS (Instant RAM Access with Offline Queue) ---

    // PLAYERS
    getPlayers: (): Player[] => RAM_DB.players,
    savePlayers: (players: Player[]) => {
        RAM_DB.players = players;
        saveListToDisk(PLAYERS_KEY, players);
        
        if (syncService.getConnectionStatus()) {
            firebaseDataService.syncPlayers(players).catch(e => console.warn("Sync failed", e));
        } else {
            syncService.enqueueAction('SYNC_PLAYERS', players);
        }
    },
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
        storageService.logAuditAction('GAMIFICATION', `Atleta ID ${playerId} recebeu ${amount} XP: ${reason}`);
    },

    // RECRUITMENT (CANDIDATES)
    getCandidates: (): RecruitmentCandidate[] => RAM_DB.candidates,
    saveCandidates: (candidates: RecruitmentCandidate[]) => {
        RAM_DB.candidates = candidates;
        saveListToDisk(CANDIDATES_KEY, candidates);
    },

    // OKRS (GOALS)
    getObjectives: (): Objective[] => RAM_DB.objectives,
    saveObjectives: (objectives: Objective[]) => {
        RAM_DB.objectives = objectives;
        saveListToDisk(OBJECTIVES_KEY, objectives);
    },

    // GAMES
    getGames: (): Game[] => RAM_DB.games,
    saveGames: (games: Game[]) => {
        RAM_DB.games = games;
        saveListToDisk(GAMES_KEY, games);
        
        if (syncService.getConnectionStatus()) {
            firebaseDataService.syncGames(games).catch(e => console.warn("Sync failed", e));
        } else {
            syncService.enqueueAction('SYNC_GAMES', games);
        }
    },
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

    // PRACTICE
    getPracticeSessions: (): PracticeSession[] => RAM_DB.practice,
    savePracticeSessions: (p: PracticeSession[]) => {
        RAM_DB.practice = p;
        saveListToDisk(PRACTICE_KEY, p);
    },

    // SETTINGS
    getTeamSettings: (): TeamSettings => RAM_DB.settings || INITIAL_TEAM_SETTINGS,
    saveTeamSettings: (s: TeamSettings) => {
        RAM_DB.settings = s;
        localStorage.setItem(TEAM_SETTINGS_KEY, JSON.stringify(s));
        if (syncService.getConnectionStatus()) {
            firebaseDataService.saveTeamSettings(s).catch(e => console.warn("Sync failed", e));
        }
    },

    // FINANCE
    getTransactions: (): Transaction[] => RAM_DB.transactions,
    saveTransactions: (t: Transaction[]) => {
        RAM_DB.transactions = t;
        saveListToDisk(TRANSACTIONS_KEY, t);
        if (syncService.getConnectionStatus()) {
            firebaseDataService.syncTransactions(t).catch(e => console.warn("Sync failed", e));
        } else {
            syncService.enqueueAction('SYNC_TRANSACTIONS', t);
        }
    },
    getInvoices: (): Invoice[] => RAM_DB.invoices,
    saveInvoices: (i: Invoice[]) => {
        RAM_DB.invoices = i;
        saveListToDisk(INVOICES_KEY, i);
    },
    createBulkInvoices: (ids: number[], title: string, amount: number, dueDate: Date, category: string, iId?: string) => {
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
                category: category as any,
                inventoryItemId: iId
            };
        });
        storageService.saveInvoices([...RAM_DB.invoices, ...newInvoices]);
    },

    // STAFF
    getStaff: (): StaffMember[] => RAM_DB.staff,
    saveStaff: (s: StaffMember[]) => {
        RAM_DB.staff = s;
        saveListToDisk(STAFF_KEY, s);
    },

    // DASHBOARD CALCULATIONS (RAM Optimized)
    getCoachDashboardStats: () => {
        const activePlayers = RAM_DB.players.filter((p: Player) => p.status === 'ACTIVE').length;
        const injuredPlayers = RAM_DB.players.filter((p: Player) => p.status === 'INJURED' || p.status === 'IR').length;
        
        const now = new Date();
        const nextGame = RAM_DB.games
            .filter((g: Game) => new Date(g.date) > now && g.status === 'SCHEDULED')
            .sort((a: Game, b: Game) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

        return { activePlayers, injuredPlayers, nextGame: nextGame || null };
    },

    // SOCIAL & COMMS
    getSocialFeed: (): SocialFeedPost[] => RAM_DB.feed,
    saveSocialFeedPost: (p: SocialFeedPost) => {
        const updated = [p, ...RAM_DB.feed];
        RAM_DB.feed = updated;
        saveListToDisk(SOCIAL_FEED_KEY, updated);
    },
    toggleLikePost: (postId: string) => {
        const updated = RAM_DB.feed.map((p: SocialFeedPost) => p.id === postId ? { ...p, likes: p.likes + 1 } : p);
        RAM_DB.feed = updated;
        saveListToDisk(SOCIAL_FEED_KEY, updated);
    },

    getTasks: (): KanbanTask[] => RAM_DB.tasks,
    saveTasks: (t: KanbanTask[]) => {
        RAM_DB.tasks = t;
        saveListToDisk(TASKS_KEY, t);
    },

    getAnnouncements: (): Announcement[] => RAM_DB.announcements,
    saveAnnouncements: (a: Announcement[]) => {
        RAM_DB.announcements = a;
        saveListToDisk(ANNOUNCEMENTS_KEY, a);
    },

    getChatMessages: (): ChatMessage[] => RAM_DB.chat,
    saveChatMessages: (m: ChatMessage[]) => {
        RAM_DB.chat = m;
        saveListToDisk(CHAT_KEY, m);
    },

    // RESOURCES
    getDocuments: (): TeamDocument[] => RAM_DB.documents,
    saveDocuments: (d: TeamDocument[]) => {
        RAM_DB.documents = d;
        saveListToDisk(DOCUMENTS_KEY, d);
    },

    getInventory: (): EquipmentItem[] => RAM_DB.inventory,
    saveInventory: (i: EquipmentItem[]) => {
        RAM_DB.inventory = i;
        saveListToDisk(INVENTORY_KEY, i);
    },

    // COMMERCIAL
    getSponsors: (): SponsorDeal[] => RAM_DB.sponsors,
    saveSponsors: (s: SponsorDeal[]) => {
        RAM_DB.sponsors = s;
        saveListToDisk(SPONSORS_KEY, s);
    },

    getSocialPosts: (): SocialPost[] => RAM_DB.socialPosts,
    saveSocialPosts: (p: SocialPost[]) => {
        RAM_DB.socialPosts = p;
        saveListToDisk(SOCIAL_POSTS_KEY, p);
    },

    getMarketplaceItems: (): MarketplaceItem[] => RAM_DB.marketplace,
    saveMarketplaceItems: (i: MarketplaceItem[]) => {
        RAM_DB.marketplace = i;
        saveListToDisk(MARKETPLACE_KEY, i);
    },

    getEventSales: (): EventSale[] => RAM_DB.sales,
    saveEventSales: (s: EventSale[]) => {
        RAM_DB.sales = s;
        saveListToDisk(SALES_KEY, s);
    },

    // ACADEMY
    getCourses: (): Course[] => RAM_DB.courses,
    saveCourses: (c: Course[]) => {
        RAM_DB.courses = c;
        saveListToDisk(COURSES_KEY, c);
    },

    // TACTICAL
    getTacticalPlays: (): TacticalPlay[] => RAM_DB.plays,
    saveTacticalPlays: (t: TacticalPlay[]) => {
        RAM_DB.plays = t;
        saveListToDisk(TACTICAL_PLAYS_KEY, t);
    },

    // VIDEO
    getClips: (): VideoClip[] => RAM_DB.clips,
    saveClips: (c: VideoClip[]) => {
        RAM_DB.clips = c;
        saveListToDisk(CLIPS_KEY, c);
    },
    getPlaylists: (): VideoPlaylist[] => RAM_DB.playlists,
    savePlaylists: (p: VideoPlaylist[]) => {
        RAM_DB.playlists = p;
        saveListToDisk(PLAYLISTS_KEY, p);
    },

    // YOUTH
    getYouthClasses: (): YouthClass[] => RAM_DB.youthClasses,
    saveYouthClasses: (c: YouthClass[]) => {
        RAM_DB.youthClasses = c;
        saveListToDisk(YOUTH_CLASSES_KEY, c);
    },
    getYouthStudents: (): YouthStudent[] => {
        let allStudents: YouthStudent[] = [];
        RAM_DB.youthClasses.forEach((c: YouthClass) => allStudents = [...allStudents, ...c.students]);
        return allStudents;
    },

    // COACH
    getCoachGameNotes: (): CoachGameNote[] => RAM_DB.coachNotes,
    saveCoachGameNotes: (n: CoachGameNote[]) => {
        RAM_DB.coachNotes = n;
        saveListToDisk(COACH_NOTES_KEY, n);
    },
    getCoachProfile: (id: string) => RAM_DB.coachProfiles[0] || null,
    saveCoachProfile: (id: string, p: CoachCareer) => {
        RAM_DB.coachProfiles = [p];
        saveListToDisk(COACH_PROFILES_KEY, [p]);
    },

    // LOGS
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
        RAM_DB.logs = updated;
        saveListToDisk(AUDIT_LOGS_KEY, updated);
    },

    // --- MOCKS & UTILS ---
    getPermissions: (): VideoPermissionGroup[] => [],
    seedDatabaseToCloud: async () => { 
        await firebaseDataService.syncPlayers(RAM_DB.players);
        await firebaseDataService.syncGames(RAM_DB.games);
        await firebaseDataService.syncTransactions(RAM_DB.transactions);
        console.log("Seeding complete"); 
    },
    exportFullDatabase: () => {
        const data = JSON.stringify(localStorage);
        const blob = new Blob([data], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fahub_backup.json';
        a.click();
    },
    checkDocumentSigned: (docId: string) => true,
    signLegalDocument: (docId: string) => {},
    getConfederationStats: () => ({ totalAthletes: 1200, totalTeams: 15, totalGamesThisYear: 45, activeAffiliates: 4, growthRate: 10 }),
    getNationalTeamScouting: (): NationalTeamCandidate[] => [],
    getAffiliatesStatus: (): Affiliate[] => [],
    getTransferRequests: (): TransferRequest[] => [],
    processTransfer: (id: string, decision: string, by: string) => {},
    getLeague: () => ({ id: 'lg-1', name: 'Liga Nacional', season: '2025', teams: [] }),
    getPublicLeagueStats: () => ({ name: 'Liga Nacional', season: '2025', leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),
    getPublicGameData: (gameId: string) => null,
    getReferees: () => [],
    getRefereeProfile: (id: string) => null,
    getCrewLogistics: (gameId: number) => null,
    getAssociationFinancials: () => null,
    addTeamXP: (amount: number) => {},
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
    createChampionship: (name: string, year: number, division: string) => {}
};

export const LEGAL_DOCUMENTS: any[] = [
    {
        id: 'term-finance-01',
        title: 'Termo de Responsabilidade Financeira',
        version: '1.0',
        content: `
        1. O usuário declara estar ciente de que as informações financeiras inseridas no sistema são de sua inteira responsabilidade.
        2. O sistema armazena logs de auditoria de todas as transações para fins de compliance.
        3. Fraudes ou lançamentos indevidos poderão ser rastreados pelo IP e ID do usuário.
        `,
        requiredRole: ['HEAD_COACH', 'FINANCIAL_MANAGER', 'MASTER'],
        createdAt: new Date()
    }
];
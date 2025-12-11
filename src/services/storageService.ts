import { Player, Game, PracticeSession, TeamSettings, StaffMember, Transaction, Invoice, SocialFeedPost, Announcement, ChatMessage, TeamDocument, TacticalPlay, Course, AuditLog, League, MarketplaceItem, YouthClass, YouthStudent, TransferRequest, CoachCareer, CoachGameNote, GameReport, Championship, CrewLogistics, VideoClip, VideoPlaylist, SponsorDeal, SocialPost, VideoPermissionGroup, EquipmentItem, EventSale, SavedWorkout, NationalTeamCandidate, Affiliate, KanbanTask, RecruitmentCandidate, Objective, Subscription, PaymentAgreement, Budget, Bill, Vendor, PurchaseRequest } from '../types';
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
const SUBSCRIPTIONS_KEY = 'gridiron_subscriptions';
const AGREEMENTS_KEY = 'gridiron_agreements';
const BUDGETS_KEY = 'gridiron_budgets';
const BILLS_KEY = 'gridiron_bills';
const VENDORS_KEY = 'gridiron_vendors';
const PURCHASE_REQUESTS_KEY = 'gridiron_purchase_requests';

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
    objectives: [],
    subscriptions: [],
    agreements: [],
    budgets: [],
    bills: [],
    vendors: [],
    purchaseRequests: []
};

const getListFromDisk = <T>(key: string): T[] => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored, dateReviver) : [];
    } catch (e) {
        console.error(`Error reading ${key}`, e);
        return [];
    }
};

const saveListToDisk = <T>(key: string, list: T[]) => {
    setTimeout(() => {
        try {
            localStorage.setItem(key, JSON.stringify(list));
        } catch (e) {
            console.error(`Error saving ${key}`, e);
        }
    }, 0);
};

export const storageService = {
    initializeRAM: () => {
        // FASE 1: CRÍTICO (Instantâneo para renderizar UI)
        const storedSettings = localStorage.getItem(TEAM_SETTINGS_KEY);
        RAM_DB.settings = storedSettings ? JSON.parse(storedSettings, dateReviver) : INITIAL_TEAM_SETTINGS;
        
        // FASE 2: OPERACIONAL (50ms - Destrava navegação)
        setTimeout(() => {
            RAM_DB.players = getListFromDisk(PLAYERS_KEY);
            RAM_DB.games = getListFromDisk(GAMES_KEY);
            RAM_DB.staff = getListFromDisk(STAFF_KEY);
        }, 50);

        // FASE 3: PESADO (1s - Carrega em background)
        setTimeout(() => {
            RAM_DB.transactions = getListFromDisk(TRANSACTIONS_KEY);
            RAM_DB.invoices = getListFromDisk(INVOICES_KEY);
            RAM_DB.practice = getListFromDisk(PRACTICE_KEY);
            RAM_DB.marketplace = getListFromDisk(MARKETPLACE_KEY);
            RAM_DB.sales = getListFromDisk(SALES_KEY);
            RAM_DB.inventory = getListFromDisk(INVENTORY_KEY);
            RAM_DB.sponsors = getListFromDisk(SPONSORS_KEY);
            RAM_DB.documents = getListFromDisk(DOCUMENTS_KEY);
            RAM_DB.feed = getListFromDisk(SOCIAL_FEED_KEY);
            RAM_DB.clips = getListFromDisk(CLIPS_KEY);
            RAM_DB.candidates = getListFromDisk(CANDIDATES_KEY);
            RAM_DB.objectives = getListFromDisk(OBJECTIVES_KEY);
            // ... load remaining non-critical data
        }, 1000);
    },

    uploadFile: async (file: File, folder: string = 'general') => {
        return await firebaseDataService.uploadFile(file, folder);
    },

    syncFromCloud: async () => {
        console.log("📡 Sync iniciado...");
        try {
            const cloudPlayers = await firebaseDataService.getPlayers();
            if (cloudPlayers?.length) {
                RAM_DB.players = cloudPlayers;
                saveListToDisk(PLAYERS_KEY, cloudPlayers);
            }
            return true;
        } catch (error) {
            return false;
        }
    },

    // --- ACCESSORS ---
    getPlayers: (): Player[] => RAM_DB.players || [],
    savePlayers: (players: Player[]) => {
        RAM_DB.players = players;
        saveListToDisk(PLAYERS_KEY, players);
        if (!syncService.getConnectionStatus()) syncService.enqueueAction('SYNC_PLAYERS', players);
    },
    
    getGames: (): Game[] => RAM_DB.games || [],
    saveGames: (games: Game[]) => {
        RAM_DB.games = games;
        saveListToDisk(GAMES_KEY, games);
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

    getPracticeSessions: (): PracticeSession[] => RAM_DB.practice || [],
    savePracticeSessions: (p: PracticeSession[]) => {
        RAM_DB.practice = p;
        saveListToDisk(PRACTICE_KEY, p);
    },

    getTeamSettings: (): TeamSettings => RAM_DB.settings || INITIAL_TEAM_SETTINGS,
    saveTeamSettings: (s: TeamSettings) => {
        RAM_DB.settings = s;
        localStorage.setItem(TEAM_SETTINGS_KEY, JSON.stringify(s));
    },

    getTransactions: (): Transaction[] => RAM_DB.transactions || [],
    saveTransactions: (t: Transaction[]) => {
        RAM_DB.transactions = t;
        saveListToDisk(TRANSACTIONS_KEY, t);
    },
    
    getInvoices: (): Invoice[] => RAM_DB.invoices || [],
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
        storageService.saveInvoices([...(RAM_DB.invoices || []), ...newInvoices]);
    },

    getSubscriptions: (): Subscription[] => RAM_DB.subscriptions || [],
    saveSubscriptions: (s: Subscription[]) => {
        RAM_DB.subscriptions = s;
        saveListToDisk(SUBSCRIPTIONS_KEY, s);
    },

    getBudgets: (): Budget[] => RAM_DB.budgets || [],
    saveBudgets: (b: Budget[]) => {
        RAM_DB.budgets = b;
        saveListToDisk(BUDGETS_KEY, b);
    },
    
    getBills: (): Bill[] => RAM_DB.bills || [],
    saveBills: (b: Bill[]) => {
        RAM_DB.bills = b;
        saveListToDisk(BILLS_KEY, b);
    },

    generateMonthlyInvoices: () => {
        const today = new Date();
        const subs = (RAM_DB.subscriptions || []) as Subscription[];
        let newInvoices: Invoice[] = [];
        
        subs.forEach(sub => {
            if(sub.active) {
                sub.assignedTo.forEach(playerId => {
                    const player = RAM_DB.players.find((p:any) => p.id === playerId);
                    if(player) {
                        newInvoices.push({
                            id: `inv-sub-${Date.now()}-${playerId}`,
                            playerId: playerId,
                            playerName: player.name,
                            title: `Assinatura: ${sub.title}`,
                            amount: sub.amount,
                            dueDate: new Date(today.getFullYear(), today.getMonth() + 1, 5), 
                            status: 'PENDING',
                            category: 'TUITION'
                        });
                    }
                });
            }
        });
        
        if (newInvoices.length > 0) {
            storageService.saveInvoices([...(RAM_DB.invoices || []), ...newInvoices]);
        }
    },

    // --- OTHER GETTERS (Returning empty if not loaded yet) ---
    getStaff: () => RAM_DB.staff || [],
    saveStaff: (s: StaffMember[]) => { RAM_DB.staff = s; saveListToDisk(STAFF_KEY, s); },
    getSocialFeed: () => RAM_DB.feed || [],
    saveSocialFeedPost: (p: SocialFeedPost) => { const u = [p, ...(RAM_DB.feed || [])]; RAM_DB.feed = u; saveListToDisk(SOCIAL_FEED_KEY, u); },
    toggleLikePost: (pid: string) => { /* simplified */ },
    getTasks: () => RAM_DB.tasks || [],
    saveTasks: (t: KanbanTask[]) => { RAM_DB.tasks = t; saveListToDisk(TASKS_KEY, t); },
    getAnnouncements: () => RAM_DB.announcements || [],
    saveAnnouncements: (a: Announcement[]) => { RAM_DB.announcements = a; saveListToDisk(ANNOUNCEMENTS_KEY, a); },
    getChatMessages: () => RAM_DB.chat || [],
    saveChatMessages: (m: ChatMessage[]) => { RAM_DB.chat = m; saveListToDisk(CHAT_KEY, m); },
    getDocuments: () => RAM_DB.documents || [],
    saveDocuments: (d: TeamDocument[]) => { RAM_DB.documents = d; saveListToDisk(DOCUMENTS_KEY, d); },
    getInventory: () => RAM_DB.inventory || [],
    saveInventory: (i: EquipmentItem[]) => { RAM_DB.inventory = i; saveListToDisk(INVENTORY_KEY, i); },
    getSponsors: () => RAM_DB.sponsors || [],
    saveSponsors: (s: SponsorDeal[]) => { RAM_DB.sponsors = s; saveListToDisk(SPONSORS_KEY, s); },
    getSocialPosts: () => RAM_DB.socialPosts || [],
    saveSocialPosts: (p: SocialPost[]) => { RAM_DB.socialPosts = p; saveListToDisk(SOCIAL_POSTS_KEY, p); },
    getMarketplaceItems: () => RAM_DB.marketplace || [],
    saveMarketplaceItems: (i: MarketplaceItem[]) => { RAM_DB.marketplace = i; saveListToDisk(MARKETPLACE_KEY, i); },
    getEventSales: () => RAM_DB.sales || [],
    saveEventSales: (s: EventSale[]) => { RAM_DB.sales = s; saveListToDisk(SALES_KEY, s); },
    getCourses: () => RAM_DB.courses || [],
    saveCourses: (c: Course[]) => { RAM_DB.courses = c; saveListToDisk(COURSES_KEY, c); },
    getTacticalPlays: () => RAM_DB.plays || [],
    saveTacticalPlays: (t: TacticalPlay[]) => { RAM_DB.plays = t; saveListToDisk(TACTICAL_PLAYS_KEY, t); },
    getClips: () => RAM_DB.clips || [],
    saveClips: (c: VideoClip[]) => { RAM_DB.clips = c; saveListToDisk(CLIPS_KEY, c); },
    getPlaylists: () => RAM_DB.playlists || [],
    savePlaylists: (p: VideoPlaylist[]) => { RAM_DB.playlists = p; saveListToDisk(PLAYLISTS_KEY, p); },
    getYouthClasses: () => RAM_DB.youthClasses || [],
    saveYouthClasses: (c: YouthClass[]) => { RAM_DB.youthClasses = c; saveListToDisk(YOUTH_CLASSES_KEY, c); },
    getYouthStudents: () => [],
    getCoachGameNotes: () => RAM_DB.coachNotes || [],
    saveCoachGameNotes: (n: CoachGameNote[]) => { RAM_DB.coachNotes = n; saveListToDisk(COACH_NOTES_KEY, n); },
    getCoachProfile: (id: string) => RAM_DB.coachProfiles?.[0] || null,
    saveCoachProfile: (id: string, p: CoachCareer) => { RAM_DB.coachProfiles = [p]; saveListToDisk(COACH_PROFILES_KEY, [p]); },
    getAuditLogs: () => RAM_DB.logs || [],
    logAuditAction: (action: string, detail: string) => { /* simplified */ },
    getCandidates: () => RAM_DB.candidates || [],
    saveCandidates: (c: RecruitmentCandidate[]) => { RAM_DB.candidates = c; saveListToDisk(CANDIDATES_KEY, c); },
    getObjectives: () => RAM_DB.objectives || [],
    saveObjectives: (o: Objective[]) => { RAM_DB.objectives = o; saveListToDisk(OBJECTIVES_KEY, o); },
    
    registerAthlete: (player: Player) => {
        const updated = [...(RAM_DB.players || []), { ...player, teamId: 'ts-1', rosterCategory: 'ACTIVE' as const }];
        storageService.savePlayers(updated);
    },
    
    getCoachDashboardStats: () => {
        const activePlayers = (RAM_DB.players || []).filter((p: Player) => p.status === 'ACTIVE').length;
        const injuredPlayers = (RAM_DB.players || []).filter((p: Player) => p.status === 'INJURED' || p.status === 'IR').length;
        
        const now = new Date();
        const nextGame = (RAM_DB.games || [])
            .filter((g: Game) => new Date(g.date) > now && g.status === 'SCHEDULED')
            .sort((a: Game, b: Game) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

        return { activePlayers, injuredPlayers, nextGame: nextGame || null };
    },

    // --- MOCKS & UTILS (Keep existing) ---
    getPermissions: () => [],
    seedDatabaseToCloud: async () => {},
    exportFullDatabase: () => {},
    checkDocumentSigned: () => true,
    signLegalDocument: () => {},
    getConfederationStats: () => ({ totalAthletes: 1200, totalTeams: 15, totalGamesThisYear: 45, activeAffiliates: 4, growthRate: 10 }),
    getNationalTeamScouting: () => [],
    getAffiliatesStatus: () => [],
    getTransferRequests: () => [],
    processTransfer: (id: string, decision: string, by: string) => {
        console.log(`Transfer ${id} ${decision} by ${by}`);
    },
    getLeague: () => ({ id: 'lg-1', name: 'Liga Nacional', season: '2025', teams: [] }),
    getPublicLeagueStats: () => ({ name: 'Liga Nacional', season: '2025', leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),
    getPublicGameData: () => null,
    getReferees: () => [],
    getRefereeProfile: () => null,
    getCrewLogistics: () => null,
    getAssociationFinancials: () => null,
    addTeamXP: () => {},
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
    createChampionship: () => {}
};

export const LEGAL_DOCUMENTS: any[] = [];

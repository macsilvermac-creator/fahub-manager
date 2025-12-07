
import { Player, Game, PracticeSession, TeamSettings, StaffMember, Transaction, Invoice, SocialFeedPost, Announcement, ChatMessage, TeamDocument, TacticalPlay, Course, AuditLog, League, MarketplaceItem, YouthClass, YouthStudent, TransferRequest, CoachCareer, CoachGameNote, GameReport, Championship, CrewLogistics, VideoClip, VideoPlaylist, SponsorDeal, SocialPost, VideoPermissionGroup, EquipmentItem, EventSale, SavedWorkout, NationalTeamCandidate, Affiliate, KanbanTask } from '../types';

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

// Generic Helper
const getList = <T>(key: string): T[] => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored, dateReviver) : [];
};

const saveList = <T>(key: string, list: T[]) => {
    localStorage.setItem(key, JSON.stringify(list));
};

export const storageService = {
    // --- PLAYERS ---
    getPlayers: () => getList<Player>(PLAYERS_KEY),
    savePlayers: (players: Player[]) => saveList(PLAYERS_KEY, players),
    registerAthlete: (player: Player) => {
        const current = storageService.getPlayers();
        const newPlayer = { ...player, teamId: 'ts-1', rosterCategory: 'ACTIVE' as const };
        storageService.savePlayers([...current, newPlayer]);
    },

    // --- GAMES ---
    getGames: () => getList<Game>(GAMES_KEY),
    saveGames: (games: Game[]) => saveList(GAMES_KEY, games),
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

    // --- PRACTICE ---
    getPracticeSessions: () => getList<PracticeSession>(PRACTICE_KEY),
    savePracticeSessions: (p: PracticeSession[]) => saveList(PRACTICE_KEY, p),

    // --- SETTINGS ---
    getTeamSettings: (): TeamSettings => {
        const stored = localStorage.getItem(TEAM_SETTINGS_KEY);
        return stored ? JSON.parse(stored, dateReviver) : INITIAL_TEAM_SETTINGS;
    },
    saveTeamSettings: (s: TeamSettings) => localStorage.setItem(TEAM_SETTINGS_KEY, JSON.stringify(s)),

    // --- FINANCE ---
    getTransactions: () => getList<Transaction>(TRANSACTIONS_KEY),
    saveTransactions: (t: Transaction[]) => saveList(TRANSACTIONS_KEY, t),
    getInvoices: () => getList<Invoice>(INVOICES_KEY),
    saveInvoices: (i: Invoice[]) => saveList(INVOICES_KEY, i),
    createBulkInvoices: (ids: number[], title: string, amount: number, dueDate: Date, category: string, iId?: string) => {
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
                inventoryItemId: iId
            };
        });
        storageService.saveInvoices([...invoices, ...newInvoices]);
    },

    // --- STAFF ---
    getStaff: () => getList<StaffMember>(STAFF_KEY),
    saveStaff: (s: StaffMember[]) => saveList(STAFF_KEY, s),

    // --- IMPLEMENTED FEATURES (Previously Mocks) ---
    getSocialFeed: () => getList<SocialFeedPost>(SOCIAL_FEED_KEY),
    saveSocialFeedPost: (p: SocialFeedPost) => {
        const current = storageService.getSocialFeed();
        saveList(SOCIAL_FEED_KEY, [p, ...current]);
    },
    toggleLikePost: (postId: string) => {
        const feed = storageService.getSocialFeed();
        const updated = feed.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p);
        saveList(SOCIAL_FEED_KEY, updated);
    },

    getTasks: () => getList<KanbanTask>(TASKS_KEY),
    saveTasks: (t: KanbanTask[]) => saveList(TASKS_KEY, t),

    getAnnouncements: () => getList<Announcement>(ANNOUNCEMENTS_KEY),
    saveAnnouncements: (a: Announcement[]) => saveList(ANNOUNCEMENTS_KEY, a),

    getChatMessages: () => getList<ChatMessage>(CHAT_KEY),
    saveChatMessages: (m: ChatMessage[]) => saveList(CHAT_KEY, m),

    getDocuments: () => getList<TeamDocument>(DOCUMENTS_KEY),
    saveDocuments: (d: TeamDocument[]) => saveList(DOCUMENTS_KEY, d),

    getInventory: () => getList<EquipmentItem>(INVENTORY_KEY),
    saveInventory: (i: EquipmentItem[]) => saveList(INVENTORY_KEY, i),

    getSponsors: () => getList<SponsorDeal>(SPONSORS_KEY),
    saveSponsors: (s: SponsorDeal[]) => saveList(SPONSORS_KEY, s),

    getSocialPosts: () => getList<SocialPost>(SOCIAL_POSTS_KEY),
    saveSocialPosts: (p: SocialPost[]) => saveList(SOCIAL_POSTS_KEY, p),

    getMarketplaceItems: () => getList<MarketplaceItem>(MARKETPLACE_KEY),
    saveMarketplaceItems: (i: MarketplaceItem[]) => saveList(MARKETPLACE_KEY, i),

    getEventSales: () => getList<EventSale>(SALES_KEY),
    saveEventSales: (s: EventSale[]) => saveList(SALES_KEY, s),

    getCourses: () => getList<Course>(COURSES_KEY),
    saveCourses: (c: Course[]) => saveList(COURSES_KEY, c),

    getTacticalPlays: () => getList<TacticalPlay>(TACTICAL_PLAYS_KEY),
    saveTacticalPlays: (t: TacticalPlay[]) => saveList(TACTICAL_PLAYS_KEY, t),

    getClips: () => getList<VideoClip>(CLIPS_KEY),
    saveClips: (c: VideoClip[]) => saveList(CLIPS_KEY, c),

    getPlaylists: () => getList<VideoPlaylist>(PLAYLISTS_KEY),
    savePlaylists: (p: VideoPlaylist[]) => saveList(PLAYLISTS_KEY, p),

    getYouthClasses: () => getList<YouthClass>(YOUTH_CLASSES_KEY),
    saveYouthClasses: (c: YouthClass[]) => saveList(YOUTH_CLASSES_KEY, c),
    getYouthStudents: () => {
        const classes = storageService.getYouthClasses();
        let allStudents: YouthStudent[] = [];
        classes.forEach(c => allStudents = [...allStudents, ...c.students]);
        return allStudents;
    },

    getCoachGameNotes: () => getList<CoachGameNote>(COACH_NOTES_KEY),
    saveCoachGameNotes: (n: CoachGameNote[]) => saveList(COACH_NOTES_KEY, n),

    getCoachProfile: (id: string) => {
        const profiles = getList<CoachCareer>(COACH_PROFILES_KEY);
        // Simple mock mapping for single user context or store by ID in future
        return profiles[0] || null; 
    },
    saveCoachProfile: (id: string, p: CoachCareer) => {
        // Simple singleton save for demo
        saveList(COACH_PROFILES_KEY, [p]);
    },

    getAuditLogs: () => getList<AuditLog>(AUDIT_LOGS_KEY),
    logAuditAction: (action: string, detail: string) => {
        const logs = storageService.getAuditLogs();
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
        saveList(AUDIT_LOGS_KEY, [newLog, ...logs]);
    },

    // --- PLACEHOLDERS / MOCKS (No persistence needed yet) ---
    getPermissions: (): VideoPermissionGroup[] => [],
    seedDatabaseToCloud: async () => { console.log("Seeding local storage..."); },
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
    getCoachDashboardStats: () => ({ activePlayers: 45, injuredPlayers: 2, nextGame: null }),
    
    getLeague: () => ({ id: 'lg-1', name: 'Liga Nacional', season: '2025', teams: [] }),
    getPublicLeagueStats: () => ({ name: 'Liga Nacional', season: '2025', leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),
    getPublicGameData: (gameId: string) => null,
    
    getReferees: () => [],
    getRefereeProfile: (id: string) => null,
    getCrewLogistics: (gameId: number) => null,
    getAssociationFinancials: () => null,
    
    addTeamXP: (amount: number) => {},
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
    createChampionship: (name: string, year: number, division: string) => {}
};

export const LEGAL_DOCUMENTS: any[] = [];

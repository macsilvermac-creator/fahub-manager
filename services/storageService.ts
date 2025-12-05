
import { Player, Game, PracticeSession, TeamSettings, StaffMember, Transaction, Invoice, SocialFeedPost, Announcement, ChatMessage, TeamDocument, TacticalPlay, Course, AuditLog, League, MarketplaceItem, YouthClass, YouthStudent, TransferRequest, CoachCareer, CoachGameNote, GameReport, Championship, CrewLogistics, VideoClip, VideoPlaylist, SponsorDeal, SocialPost, VideoPermissionGroup, EquipmentItem, EventSale, SavedWorkout, NationalTeamCandidate, Affiliate } from '../types';

// Chaves do LocalStorage
const PLAYERS_KEY = 'gridiron_players';
const GAMES_KEY = 'gridiron_games';
const TEAM_SETTINGS_KEY = 'gridiron_settings';
const PRACTICE_KEY = 'gridiron_practice';
const TRANSACTIONS_KEY = 'gridiron_transactions';
const INVOICES_KEY = 'gridiron_invoices';
const STAFF_KEY = 'gridiron_staff';

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

export const storageService = {
    // --- PLAYERS ---
    getPlayers: (): Player[] => {
        const stored = localStorage.getItem(PLAYERS_KEY);
        return stored ? JSON.parse(stored, dateReviver) : [];
    },
    savePlayers: (players: Player[]) => localStorage.setItem(PLAYERS_KEY, JSON.stringify(players)),
    registerAthlete: (player: Player) => {
        const current = storageService.getPlayers();
        const newPlayer = { ...player, teamId: 'ts-1', rosterCategory: 'ACTIVE' as const };
        storageService.savePlayers([...current, newPlayer]);
    },

    // --- GAMES ---
    getGames: (): Game[] => {
        const stored = localStorage.getItem(GAMES_KEY);
        return stored ? JSON.parse(stored, dateReviver) : [];
    },
    saveGames: (games: Game[]) => localStorage.setItem(GAMES_KEY, JSON.stringify(games)),
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
    getPracticeSessions: (): PracticeSession[] => {
        const stored = localStorage.getItem(PRACTICE_KEY);
        return stored ? JSON.parse(stored, dateReviver) : [];
    },
    savePracticeSessions: (p: PracticeSession[]) => localStorage.setItem(PRACTICE_KEY, JSON.stringify(p)),

    // --- SETTINGS ---
    getTeamSettings: (): TeamSettings => {
        const stored = localStorage.getItem(TEAM_SETTINGS_KEY);
        return stored ? JSON.parse(stored, dateReviver) : INITIAL_TEAM_SETTINGS;
    },
    saveTeamSettings: (s: TeamSettings) => localStorage.setItem(TEAM_SETTINGS_KEY, JSON.stringify(s)),

    // --- FINANCE ---
    getTransactions: (): Transaction[] => {
        const stored = localStorage.getItem(TRANSACTIONS_KEY);
        return stored ? JSON.parse(stored, dateReviver) : [];
    },
    saveTransactions: (t: Transaction[]) => localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(t)),
    getInvoices: (): Invoice[] => {
        const stored = localStorage.getItem(INVOICES_KEY);
        return stored ? JSON.parse(stored, dateReviver) : [];
    },
    saveInvoices: (i: Invoice[]) => localStorage.setItem(INVOICES_KEY, JSON.stringify(i)),
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
    getStaff: (): StaffMember[] => {
        const stored = localStorage.getItem(STAFF_KEY);
        return stored ? JSON.parse(stored, dateReviver) : [];
    },
    saveStaff: (s: StaffMember[]) => localStorage.setItem(STAFF_KEY, JSON.stringify(s)),

    // --- MOCKS FOR OTHERS (Updated to fix errors) ---
    getSocialFeed: (): SocialFeedPost[] => [],
    saveSocialFeedPost: (p: SocialFeedPost) => {},
    getTasks: (): any[] => [],
    saveTasks: (t: any[]) => {},
    getAnnouncements: (): Announcement[] => [],
    saveAnnouncements: (a: Announcement[]) => {},
    getChatMessages: (): ChatMessage[] => [],
    saveChatMessages: (m: ChatMessage[]) => {},
    getDocuments: (): TeamDocument[] => [],
    saveDocuments: (d: TeamDocument[]) => {},
    getInventory: (): EquipmentItem[] => [],
    saveInventory: (i: EquipmentItem[]) => {},
    getSponsors: (): SponsorDeal[] => [],
    saveSponsors: (s: SponsorDeal[]) => {},
    getSocialPosts: (): SocialPost[] => [],
    saveSocialPosts: (p: SocialPost[]) => {},
    getMarketplaceItems: (): MarketplaceItem[] => [],
    saveMarketplaceItems: (i: MarketplaceItem[]) => {},
    getEventSales: (): EventSale[] => [],
    saveEventSales: (s: EventSale[]) => {},
    getCourses: (): Course[] => [],
    saveCourses: (c: Course[]) => {},
    getTacticalPlays: (): TacticalPlay[] => [],
    saveTacticalPlays: (t: TacticalPlay[]) => {},
    getClips: (): VideoClip[] => [],
    saveClips: (c: VideoClip[]) => {},
    getPlaylists: (): VideoPlaylist[] => [],
    savePlaylists: (p: VideoPlaylist[]) => {},
    getPermissions: (): VideoPermissionGroup[] => [],
    
    // Advanced
    seedDatabaseToCloud: async () => { console.log("Seeding local storage..."); },
    getAuditLogs: (): AuditLog[] => [],
    logAuditAction: (action: string, detail: string) => console.log(action, detail),
    exportFullDatabase: () => console.log("Exporting..."),
    
    // Youth
    getYouthClasses: (): YouthClass[] => [],
    saveYouthClasses: (c: YouthClass[]) => {},
    getYouthStudents: (): YouthStudent[] => [],
    
    // Compliance
    checkDocumentSigned: (docId: string) => true,
    signLegalDocument: (docId: string) => {},
    
    // Confederation
    getConfederationStats: () => ({ totalAthletes: 1200, totalTeams: 15, totalGamesThisYear: 45, activeAffiliates: 4, growthRate: 10 }),
    getNationalTeamScouting: (): NationalTeamCandidate[] => [],
    getAffiliatesStatus: (): Affiliate[] => [],
    getTransferRequests: (): TransferRequest[] => [],
    processTransfer: (id: string, decision: string, by: string) => {},
    
    // Coach
    getCoachProfile: (id: string) => null,
    saveCoachProfile: (id: string, p: any) => {},
    getCoachGameNotes: (): CoachGameNote[] => [],
    saveCoachGameNotes: (n: CoachGameNote[]) => {},
    getCoachDashboardStats: () => ({ activePlayers: 45, injuredPlayers: 2, nextGame: null }),
    
    // League
    getLeague: () => ({ id: 'lg-1', name: 'Liga Nacional', season: '2025', teams: [] }),
    getPublicLeagueStats: () => ({ name: 'Liga Nacional', season: '2025', leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),
    getPublicGameData: (gameId: string) => null,
    
    // Referee
    getReferees: () => [],
    getRefereeProfile: (id: string) => null,
    getCrewLogistics: (gameId: number) => null,
    getAssociationFinancials: () => null,
    
    // Misc
    addTeamXP: (amount: number) => {},
    savePlayerWorkout: (playerId: number, content: string, title: string) => {},
    toggleLikePost: (postId: string) => {},
    createChampionship: (name: string, year: number, division: string) => {}
};

export const LEGAL_DOCUMENTS: any[] = [];

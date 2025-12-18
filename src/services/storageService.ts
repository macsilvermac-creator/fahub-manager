
import { Player, Game, PracticeSession, Course, TeamSettings, RecruitmentCandidate, SocialPost, Announcement, Transaction, Invoice, Subscription, Budget, Bill, EquipmentItem, Objective, StaffMember, TacticalPlay, VideoClip, Entitlement, League, SponsorDeal, CrewLogistics, RefereeProfile, AssociationFinance, SocialFeedPost, CoachCareer, ProgramType, TeamDocument, ChatMessage, KanbanTask, EventSale, CoachGameNote, YouthClass, YouthStudent, AuditLog, TransferRequest, ConfederationStats, GameReport, MarketplaceItem, Drill, LegalDocument } from '../types';

// Helper for dates
const dateReviver = (key: string, value: any) => {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
        return new Date(value);
    }
    return value;
};

// Generic Helper for Disk I/O
const getListFromDisk = <T>(key: string): T[] => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored, dateReviver) : [];
};

const saveListToDisk = <T>(key: string, list: T[]) => {
    localStorage.setItem(key, JSON.stringify(list));
};

const PLAYERS_KEY = 'gridiron_players';
const GAMES_KEY = 'gridiron_games';
const TEAM_SETTINGS_KEY = 'gridiron_settings';
const PRACTICE_KEY = 'gridiron_practice';
const TRANSACTIONS_KEY = 'gridiron_transactions';
const INVOICES_KEY = 'gridiron_invoices';
const STAFF_KEY = 'gridiron_staff';
const ANNOUNCEMENTS_KEY = 'gridiron_announcements';
const CLIPS_KEY = 'gridiron_clips';
const CANDIDATES_KEY = 'gridiron_candidates';
const SOCIAL_POSTS_KEY = 'gridiron_social_posts';
const SUBSCRIPTIONS_KEY = 'gridiron_subscriptions';
const BUDGETS_KEY = 'gridiron_budgets';
const BILLS_KEY = 'gridiron_bills';
const INVENTORY_KEY = 'gridiron_inventory';
const OBJECTIVES_KEY = 'gridiron_objectives';
const TACTICAL_PLAYS_KEY = 'gridiron_tactical_plays';
const ENTITLEMENTS_KEY = 'gridiron_entitlements';
const SPONSORS_KEY = 'gridiron_sponsors';
const SOCIAL_FEED_KEY = 'gridiron_social_feed';
const COACH_PROFILES_KEY = 'gridiron_coach_profiles';
const COACH_NOTES_KEY = 'gridiron_coach_notes';
const SALES_KEY = 'gridiron_event_sales';
const DOCUMENTS_KEY = 'gridiron_documents';
const CHAT_MESSAGES_KEY = 'gridiron_chat_messages';
const TASKS_KEY = 'gridiron_tasks';

let players: Player[] = getListFromDisk(PLAYERS_KEY);
let games: Game[] = getListFromDisk(GAMES_KEY);
let practices: PracticeSession[] = getListFromDisk(PRACTICE_KEY);

export const storageService = {
    initializeRAM: async () => {
        players = getListFromDisk(PLAYERS_KEY);
        games = getListFromDisk(GAMES_KEY);
        practices = getListFromDisk(PRACTICE_KEY);
    },

    syncFromCloud: async () => {
        // Implementation for Cloud Syncing logic (simulated)
        console.log("Syncing from cloud...");
        return true;
    },

    getPlayers: () => players,
    savePlayers: (updated: Player[]) => {
        players = updated;
        saveListToDisk(PLAYERS_KEY, updated);
    },
    registerAthlete: (player: Player) => {
        players.push(player);
        storageService.savePlayers(players);
    },
    addPlayerXP: (playerId: number, amount: number, reason: string) => {
        const updated = players.map(p => {
            if (p.id === playerId) {
                const newXp = p.xp + amount;
                const newLevel = Math.floor(newXp / 100) + 1;
                return { ...p, xp: newXp, level: newLevel };
            }
            return p;
        });
        storageService.savePlayers(updated);
    },

    getGames: () => games,
    saveGames: (updated: Game[]) => {
        games = updated;
        saveListToDisk(GAMES_KEY, updated);
    },
    updateLiveGame: (gameId: number, updates: Partial<Game>) => {
        const updated = games.map(g => g.id === gameId ? { ...g, ...updates } : g);
        storageService.saveGames(updated);
    },
    finalizeGameReport: (gameId: number, report: GameReport, score: string, winner: string) => {
        const updated = games.map(g => g.id === gameId ? {
            ...g,
            officialReport: report,
            score,
            result: (winner === 'HOME' ? 'W' : winner === 'AWAY' ? 'L' : 'T') as any,
            status: 'FINAL' as const
        } : g);
        storageService.saveGames(updated);
    },

    getPracticeSessions: () => practices,
    savePracticeSessions: (updated: PracticeSession[]) => {
        practices = updated;
        saveListToDisk(PRACTICE_KEY, updated);
    },
    togglePracticeAttendance: (sessionId: string, playerId: string) => {
        const updated = practices.map(p => {
            if (String(p.id) === sessionId) {
                const attendees = p.attendees || [];
                const newAttendees = attendees.includes(playerId) 
                    ? attendees.filter(id => id !== playerId)
                    : [...attendees, playerId];
                return { ...p, attendees: newAttendees };
            }
            return p;
        });
        storageService.savePracticeSessions(updated);
    },

    getTeamSettings: (): TeamSettings => {
        const stored = localStorage.getItem(TEAM_SETTINGS_KEY);
        return stored ? JSON.parse(stored, dateReviver) : { id: 'ts-1', teamName: 'FAHUB Stars', logoUrl: '', address: '', primaryColor: '#00A86B' };
    },
    saveTeamSettings: (settings: TeamSettings) => {
        localStorage.setItem(TEAM_SETTINGS_KEY, JSON.stringify(settings));
    },

    getAnnouncements: (): Announcement[] => getListFromDisk(ANNOUNCEMENTS_KEY),
    saveAnnouncements: (updated: Announcement[]) => saveListToDisk(ANNOUNCEMENTS_KEY, updated),

    getChatMessages: (): ChatMessage[] => getListFromDisk(CHAT_MESSAGES_KEY),
    saveChatMessages: (updated: ChatMessage[]) => saveListToDisk(CHAT_MESSAGES_KEY, updated),

    getTransactions: (): Transaction[] => getListFromDisk(TRANSACTIONS_KEY),
    saveTransactions: (updated: Transaction[]) => saveListToDisk(TRANSACTIONS_KEY, updated),

    getInvoices: (): Invoice[] => getListFromDisk(INVOICES_KEY),
    saveInvoices: (updated: Invoice[]) => saveListToDisk(INVOICES_KEY, updated),

    getInventory: (): EquipmentItem[] => getListFromDisk(INVENTORY_KEY),
    saveInventory: (updated: EquipmentItem[]) => saveListToDisk(INVENTORY_KEY, updated),

    getDocuments: (): TeamDocument[] => getListFromDisk(DOCUMENTS_KEY),
    saveDocuments: (updated: TeamDocument[]) => saveListToDisk(DOCUMENTS_KEY, updated),

    getTasks: (): KanbanTask[] => getListFromDisk(TASKS_KEY),
    saveTasks: (updated: KanbanTask[]) => saveListToDisk(TASKS_KEY, updated),

    getSocialPosts: (): SocialPost[] => getListFromDisk(SOCIAL_POSTS_KEY),
    saveSocialPosts: (updated: SocialPost[]) => saveListToDisk(SOCIAL_POSTS_KEY, updated),

    getSponsors: (): SponsorDeal[] => getListFromDisk(SPONSORS_KEY),
    saveSponsors: (updated: SponsorDeal[]) => saveListToDisk(SPONSORS_KEY, updated),

    getSocialFeed: (): SocialFeedPost[] => getListFromDisk(SOCIAL_FEED_KEY),
    saveSocialFeedPost: (post: SocialFeedPost) => {
        const current = storageService.getSocialFeed();
        saveListToDisk(SOCIAL_FEED_KEY, [post, ...current]);
    },
    toggleLikePost: (postId: string) => {
        const current = storageService.getSocialFeed();
        const updated = current.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p);
        saveListToDisk(SOCIAL_FEED_KEY, updated);
    },

    getStaff: (): StaffMember[] => getListFromDisk(STAFF_KEY),
    saveStaff: (updated: StaffMember[]) => saveListToDisk(STAFF_KEY, updated),

    getClips: (): VideoClip[] => getListFromDisk(CLIPS_KEY),
    saveClips: (updated: VideoClip[]) => saveListToDisk(CLIPS_KEY, updated),

    getPlaylists: (): any[] => getListFromDisk('gridiron_playlists'),

    getTacticalPlays: (): TacticalPlay[] => getListFromDisk(TACTICAL_PLAYS_KEY),
    saveTacticalPlays: (updated: TacticalPlay[]) => saveListToDisk(TACTICAL_PLAYS_KEY, updated),

    getEventSales: (): EventSale[] => getListFromDisk(SALES_KEY),
    saveEventSales: (updated: EventSale[]) => saveListToDisk(SALES_KEY, updated),

    getMarketplaceItems: (): MarketplaceItem[] => getListFromDisk('gridiron_marketplace'),
    saveMarketplaceItems: (updated: MarketplaceItem[]) => saveListToDisk('gridiron_marketplace', updated),

    getCoachGameNotes: (): CoachGameNote[] => getListFromDisk(COACH_NOTES_KEY),
    saveCoachGameNotes: (updated: CoachGameNote[]) => saveListToDisk(COACH_NOTES_KEY, updated),

    // Fix: Added getCandidates and saveCandidates
    getCandidates: (): RecruitmentCandidate[] => getListFromDisk(CANDIDATES_KEY),
    saveCandidates: (updated: RecruitmentCandidate[]) => saveListToDisk(CANDIDATES_KEY, updated),

    createBulkInvoices: (playerIds: number[], title: string, amount: number, dueDate: Date, category: string) => {
        const invoices = storageService.getInvoices();
        const newInvoices: Invoice[] = playerIds.map(id => ({
            id: `inv-${Date.now()}-${id}`,
            playerId: id,
            playerName: 'Atleta',
            title,
            amount,
            dueDate,
            status: 'PENDING',
            category: category as any
        }));
        storageService.saveInvoices([...invoices, ...newInvoices]);
    },

    checkDocumentSigned: (docId: string) => {
        return !!localStorage.getItem(`signed_doc_${docId}`);
    },

    getAthleteMissions: (playerId: number) => {
        const now = new Date();
        const nextGames = games
            .filter(g => new Date(g.date) > now && g.status === 'SCHEDULED')
            .map(g => ({ ...g, missionType: 'GAME' as const }));
        const nextPractices = practices
            .filter(p => new Date(p.date) > now)
            .map(p => ({ ...p, missionType: 'PRACTICE' as const }));
        return [...nextGames, ...nextPractices].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    },

    getAthleteStatsHistory: (playerId: number) => {
        const player = players.find(p => p.id === playerId);
        return player?.combineHistory || [];
    },

    getCourses: (): Course[] => [
        { 
            id: 'c1', title: 'Fundamentos de Cover 3', 
            description: 'Leitura obrigatória para a secundária.', 
            thumbnailUrl: '',
            priority: true,
            modules: []
        }
    ],

    getActiveProgram: () => (localStorage.getItem('gridiron_active_program') || 'TACKLE') as ProgramType,

    getPublicGameData: (gameId: string) => {
        return games.find(g => String(g.id) === gameId) || null;
    },

    getPublicLeagueStats: () => ({ leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),

    getConfederationStats: (): ConfederationStats => ({ totalAthletes: 0, totalTeams: 0, totalGamesThisYear: 156, activeAffiliates: 18, growthRate: 15 }),
    getNationalTeamScouting: (): any[] => [],
    getAffiliatesStatus: (): any[] => [],
    getTransferRequests: (): TransferRequest[] => getListFromDisk('gridiron_transfers'),
    getAuditLogs: (): AuditLog[] => getListFromDisk('gridiron_audit_logs'),
    logAuditAction: (action: string, details: string) => {
        const logs = storageService.getAuditLogs();
        const newLog: AuditLog = {
            id: `audit-${Date.now()}`,
            action,
            details,
            timestamp: new Date(),
            userId: 'system',
            userName: 'System',
            role: 'SYSTEM',
            ipAddress: '0.0.0.0'
        };
        saveListToDisk('gridiron_audit_logs', [newLog, ...logs]);
    },
    exportFullDatabase: () => {},
    seedDatabaseToCloud: async () => {},
    getLeague: (): League | null => null,
    getRefereeProfile: (id: string): RefereeProfile | null => null,
    getAssociationFinancials: (): AssociationFinance | null => null,
    getCrewLogistics: (gameId: number): CrewLogistics | null => null,
    getReferees: (): RefereeProfile[] => [],
    addTeamXP: (xp: number) => {},
    createChampionship: (name: string, year: number, division: string) => {},
    uploadFile: async (file: File, path: string) => "http://localhost:3000/placeholder.png",
    getDrillLibrary: (): Drill[] => [],
    getYouthClasses: (): YouthClass[] => getListFromDisk(YOUTH_CLASSES_KEY),
    saveYouthClasses: (updated: YouthClass[]) => saveListToDisk(YOUTH_CLASSES_KEY, updated),
    getYouthStudents: (): YouthStudent[] => getListFromDisk(YOUTH_STUDENTS_KEY),
    saveYouthStudents: (updated: YouthStudent[]) => saveListToDisk(YOUTH_STUDENTS_KEY, updated),
    processTransfer: (id: string, decision: 'APPROVE' | 'REJECT', by: string) => {
        const transfers = getListFromDisk<TransferRequest>('gridiron_transfers');
        const updated = transfers.map(t => t.id === id ? { ...t, status: (decision === 'APPROVE' ? 'APPROVED' : 'REJECTED') as any } : t);
        saveListToDisk('gridiron_transfers', updated);
    }
};

const YOUTH_CLASSES_KEY = 'gridiron_youth_classes';
const YOUTH_STUDENTS_KEY = 'gridiron_youth_students';

export const LEGAL_DOCUMENTS: LegalDocument[] = [
    { id: 'compliance-1', title: 'Termos de Compliance', content: 'Termos de uso...', version: '1.0' }
];

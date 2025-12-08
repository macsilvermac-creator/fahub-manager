
import { Player, Game, PracticeSession, TeamSettings, StaffMember, Transaction, Invoice, SocialFeedPost, Announcement, ChatMessage, TeamDocument, TacticalPlay, Course, AuditLog, League, MarketplaceItem, YouthClass, YouthStudent, TransferRequest, CoachCareer, CoachGameNote, GameReport, Championship, CrewLogistics, VideoClip, VideoPlaylist, SponsorDeal, SocialPost, VideoPermissionGroup, EquipmentItem, EventSale, SavedWorkout, NationalTeamCandidate, Affiliate, KanbanTask } from '../types';
import { firebaseDataService } from './firebaseDataService';

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
    // --- CLOUD STORAGE (FILES) ---
    uploadFile: async (file: File, folder: string = 'general') => {
        return await firebaseDataService.uploadFile(file, folder);
    },

    // --- CORE SYNC FUNCTION (A "Antena") ---
    syncFromCloud: async () => {
        console.log("📡 Iniciando sincronização com a nuvem...");
        try {
            // 1. Players
            const cloudPlayers = await firebaseDataService.getPlayers();
            if (cloudPlayers && cloudPlayers.length > 0) {
                saveList(PLAYERS_KEY, cloudPlayers);
                console.log(`✅ ${cloudPlayers.length} atletas sincronizados.`);
            }

            // 2. Games
            const cloudGames = await firebaseDataService.getGames();
            if (cloudGames && cloudGames.length > 0) {
                saveList(GAMES_KEY, cloudGames);
                console.log(`✅ ${cloudGames.length} jogos sincronizados.`);
            }

            // 3. Transactions
            const cloudTxs = await firebaseDataService.getTransactions();
            if (cloudTxs && cloudTxs.length > 0) {
                saveList(TRANSACTIONS_KEY, cloudTxs);
                console.log(`✅ ${cloudTxs.length} transações sincronizadas.`);
            }
            
            return true;
        } catch (error) {
            console.error("⚠️ Erro na sincronização (Usando dados locais):", error);
            return false;
        }
    },

    // --- PLAYERS ---
    getPlayers: () => getList<Player>(PLAYERS_KEY),
    savePlayers: (players: Player[]) => {
        saveList(PLAYERS_KEY, players);
        // Background Sync (Optimistic UI)
        firebaseDataService.syncPlayers(players).catch(e => console.warn("Sync failed", e));
    },
    registerAthlete: (player: Player) => {
        const current = storageService.getPlayers();
        const newPlayer = { ...player, teamId: 'ts-1', rosterCategory: 'ACTIVE' as const };
        const updated = [...current, newPlayer];
        storageService.savePlayers(updated);
    },
    
    // --- GAMIFICATION (XP) ---
    addPlayerXP: (playerId: number, amount: number, reason: string) => {
        const players = storageService.getPlayers();
        const updated = players.map(p => {
            if (p.id === playerId) {
                const newXp = (p.xp || 0) + amount;
                // Simple Level Up Logic: Every 100 XP = 1 Level
                const newLevel = Math.floor(newXp / 100) + 1;
                return { ...p, xp: newXp, level: newLevel };
            }
            return p;
        });
        storageService.savePlayers(updated);
        storageService.logAuditAction('GAMIFICATION', `Atleta ID ${playerId} recebeu ${amount} XP: ${reason}`);
    },

    // --- GAMES ---
    getGames: () => getList<Game>(GAMES_KEY),
    saveGames: (games: Game[]) => {
        saveList(GAMES_KEY, games);
        firebaseDataService.syncGames(games).catch(e => console.warn("Sync failed", e));
    },
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
    saveTeamSettings: (s: TeamSettings) => {
        localStorage.setItem(TEAM_SETTINGS_KEY, JSON.stringify(s));
        firebaseDataService.saveTeamSettings(s).catch(e => console.warn("Sync failed", e));
    },

    // --- FINANCE ---
    getTransactions: () => getList<Transaction>(TRANSACTIONS_KEY),
    saveTransactions: (t: Transaction[]) => {
        saveList(TRANSACTIONS_KEY, t);
        firebaseDataService.syncTransactions(t).catch(e => console.warn("Sync failed", e));
    },
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

    // --- DASHBOARD REAL STATS ---
    getCoachDashboardStats: () => {
        const players = getList<Player>(PLAYERS_KEY);
        const games = getList<Game>(GAMES_KEY);
        
        const activePlayers = players.filter(p => p.status === 'ACTIVE').length;
        const injuredPlayers = players.filter(p => p.status === 'INJURED' || p.status === 'IR').length;
        
        // Find next scheduled game
        const now = new Date();
        const nextGame = games
            .filter(g => new Date(g.date) > now && g.status === 'SCHEDULED')
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

        return { 
            activePlayers, 
            injuredPlayers, 
            nextGame: nextGame || null 
        };
    },

    // --- SOCIAL & COMMS ---
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

    // --- RESOURCES ---
    getDocuments: () => getList<TeamDocument>(DOCUMENTS_KEY),
    saveDocuments: (d: TeamDocument[]) => saveList(DOCUMENTS_KEY, d),

    getInventory: () => getList<EquipmentItem>(INVENTORY_KEY),
    saveInventory: (i: EquipmentItem[]) => saveList(INVENTORY_KEY, i),

    // --- COMMERCIAL & MARKETING ---
    getSponsors: () => getList<SponsorDeal>(SPONSORS_KEY),
    saveSponsors: (s: SponsorDeal[]) => saveList(SPONSORS_KEY, s),

    getSocialPosts: () => getList<SocialPost>(SOCIAL_POSTS_KEY),
    saveSocialPosts: (p: SocialPost[]) => saveList(SOCIAL_POSTS_KEY, p),

    getMarketplaceItems: () => getList<MarketplaceItem>(MARKETPLACE_KEY),
    saveMarketplaceItems: (i: MarketplaceItem[]) => saveList(MARKETPLACE_KEY, i),

    getEventSales: () => getList<EventSale>(SALES_KEY),
    saveEventSales: (s: EventSale[]) => saveList(SALES_KEY, s),

    // --- ACADEMY & TACTICAL ---
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
        return profiles[0] || null; 
    },
    saveCoachProfile: (id: string, p: CoachCareer) => {
        saveList(COACH_PROFILES_KEY, [p]);
    },

    // --- SYSTEM & AUDIT ---
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

    // --- MOCKS (For Federation/External that we don't persist locally yet) ---
    getPermissions: (): VideoPermissionGroup[] => [],
    seedDatabaseToCloud: async () => { 
        // Force sync of current local data to cloud
        const players = getList<Player>(PLAYERS_KEY);
        const games = getList<Game>(GAMES_KEY);
        const txs = getList<Transaction>(TRANSACTIONS_KEY);
        
        await firebaseDataService.syncPlayers(players);
        await firebaseDataService.syncGames(games);
        await firebaseDataService.syncTransactions(txs);
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

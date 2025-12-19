
import { Athlete, Coach, Team, User, Player, Game, PracticeSession, Course, TeamSettings, RecruitmentCandidate, SocialPost, Announcement, Transaction, Invoice, Subscription, Budget, Bill, EquipmentItem, Objective, StaffMember, TacticalPlay, VideoClip, Entitlement, League, SponsorDeal, CrewLogistics, RefereeProfile, AssociationFinance, SocialFeedPost, CoachCareer, ProgramType, GameReport, ConfederationStats, NationalTeamCandidate, Affiliate, TransferRequest, AuditLog, EventSale, Drill, YouthClass, YouthStudent, LegalDocument, ChatMessage, TeamDocument, KanbanTask, MarketplaceItem } from '../types';

const KEYS = {
    ATHLETES: 'fahub_entity_athletes',
    COACHES: 'fahub_entity_coaches',
    TEAMS: 'fahub_entity_teams',
    USERS: 'fahub_entity_users',
    CURRENT_USER: 'fahub_session_user',
    PLAYERS: 'gridiron_players',
    GAMES: 'gridiron_games',
    TEAM_SETTINGS: 'gridiron_settings',
    PRACTICE: 'gridiron_practice',
    TRANSACTIONS: 'gridiron_transactions',
    STAFF: 'gridiron_staff',
    INVENTORY: 'gridiron_inventory',
    TACTICAL_PLAYS: 'gridiron_tactical_plays',
    MARKETPLACE: 'gridiron_marketplace',
    YOUTH_CLASSES: 'gridiron_youth_classes',
    YOUTH_STUDENTS: 'gridiron_youth_students',
    OBJECTIVES: 'gridiron_objectives',
    ENTITLEMENTS: 'gridiron_entitlements',
    SPONSORS: 'gridiron_sponsors',
    SOCIAL_POSTS: 'gridiron_social_posts',
    ANNOUNCEMENTS: 'gridiron_announcements',
    SOCIAL_FEED: 'gridiron_social_feed',
    CLIPS: 'gridiron_clips',
    TASKS: 'gridiron_tasks',
    CHAT: 'gridiron_chat',
    DOCUMENTS: 'gridiron_documents',
    INVOICES: 'gridiron_invoices',
    BUDGETS: 'gridiron_budgets',
    BILLS: 'gridiron_bills',
    SUBSCRIPTIONS: 'gridiron_subscriptions',
    CANDIDATES: 'gridiron_candidates',
    TRANSFERS: 'gridiron_transfers',
    AUDIT_LOGS: 'gridiron_audit_logs',
    EVENT_SALES: 'gridiron_event_sales',
    DRILLS: 'gridiron_drills'
};

const dateReviver = (key: string, value: any) => {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
        return new Date(value);
    }
    return value;
};

const get = <T>(key: string): T[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data, dateReviver) : [];
};

const set = <T>(key: string, data: T) => {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('storage_update'));
};

const subscribers: Record<string, (() => void)[]> = {};

export const storageService = {
    // Basic System
    initializeRAM: () => {
        console.log('RAM Initialized');
    },

    syncFromCloud: async () => {
        return true;
    },

    subscribe: (key: string, callback: () => void) => {
        if (!subscribers[key]) subscribers[key] = [];
        subscribers[key].push(callback);
        return () => {
            subscribers[key] = subscribers[key].filter(cb => cb !== callback);
        };
    },

    notify: (key: string) => {
        if (subscribers[key]) {
            subscribers[key].forEach(cb => cb());
        }
    },

    // Athletes/Players
    getAthletes: () => get<Athlete>(KEYS.ATHLETES),
    saveAthlete: (athlete: Athlete) => {
        const athletes = storageService.getAthletes();
        const index = athletes.findIndex(a => a.id === athlete.id);
        if (index > -1) athletes[index] = athlete;
        else athletes.push(athlete);
        set(KEYS.ATHLETES, athletes);
    },
    getAthleteByUserId: (userId: string) => 
        storageService.getAthletes().find(a => a.userId === userId),

    getPlayers: () => get<Player>(KEYS.PLAYERS),
    savePlayers: (players: Player[]) => {
        set(KEYS.PLAYERS, players);
        storageService.notify('players');
    },
    registerAthlete: (player: Player) => {
        const current = storageService.getPlayers();
        const updated = [...current, player];
        storageService.savePlayers(updated);
    },
    addPlayerXP: (playerId: number, amount: number, reason: string) => {
        const updated = storageService.getPlayers().map(p => {
            if (p.id === playerId) {
                const newXp = p.xp + amount;
                const newLevel = Math.floor(newXp / 100) + 1;
                return { ...p, xp: newXp, level: newLevel };
            }
            return p;
        });
        storageService.savePlayers(updated);
    },

    // Coaches
    getCoaches: () => get<Coach>(KEYS.COACHES),
    saveCoach: (coach: Coach) => {
        const coaches = storageService.getCoaches();
        const index = coaches.findIndex(c => c.id === coach.id);
        if (index > -1) coaches[index] = coach;
        else coaches.push(coach);
        set(KEYS.COACHES, coaches);
    },
    saveCoachProfile: (userId: string, profile: any) => {
        localStorage.setItem(`coach_profile_${userId}`, JSON.stringify(profile));
    },

    // Teams & Settings
    getTeams: () => get<Team>(KEYS.TEAMS),
    saveTeam: (team: Team) => {
        const teams = storageService.getTeams();
        const index = teams.findIndex(t => t.id === team.id);
        if (index > -1) teams[index] = team;
        else teams.push(team);
        set(KEYS.TEAMS, teams);
    },
    getTeamSettings: (): TeamSettings => {
        const stored = localStorage.getItem(KEYS.TEAM_SETTINGS);
        return stored ? JSON.parse(stored, dateReviver) : { id: 'ts-1', teamName: 'FAHUB Stars', logoUrl: '', address: '', primaryColor: '#00A86B' };
    },
    saveTeamSettings: (settings: TeamSettings) => {
        localStorage.setItem(KEYS.TEAM_SETTINGS, JSON.stringify(settings));
        storageService.notify('settings');
    },
    getActiveProgram: () => (localStorage.getItem('gridiron_active_program') as ProgramType) || 'TACKLE',
    setActiveProgram: (prog: ProgramType) => {
        localStorage.setItem('gridiron_active_program', prog);
        storageService.notify('activeProgram');
    },

    // Games & Practices
    getGames: () => get<Game>(KEYS.GAMES),
    saveGames: (updated: Game[]) => {
        set(KEYS.GAMES, updated);
        storageService.notify('games');
    },
    updateLiveGame: (gameId: number, updates: Partial<Game>) => {
        const updated = storageService.getGames().map(g => g.id === gameId ? { ...g, ...updates } : g);
        storageService.saveGames(updated);
    },
    getPracticeSessions: () => get<PracticeSession>(KEYS.PRACTICE),
    savePracticeSessions: (p: PracticeSession[]) => {
        set(KEYS.PRACTICE, p);
        storageService.notify('practice');
    },
    savePracticeCheckIn: (sessionId: string, checkedInIds: string[]) => {
        const updated = storageService.getPracticeSessions().map(s => String(s.id) === sessionId ? { ...s, checkedInAttendees: checkedInIds } : s);
        storageService.savePracticeSessions(updated);
    },
    togglePracticeAttendance: (sessionId: string, playerId: string) => {
        const updated = storageService.getPracticeSessions().map(s => {
            if (String(s.id) === sessionId) {
                const attendees = s.attendees || [];
                const newAttendees = attendees.includes(playerId) 
                    ? attendees.filter(id => id !== playerId)
                    : [...attendees, playerId];
                return { ...s, attendees: newAttendees };
            }
            return s;
        });
        storageService.savePracticeSessions(updated);
    },

    // Financial
    getTransactions: () => get<Transaction>(KEYS.TRANSACTIONS),
    saveTransactions: (txs: Transaction[]) => set(KEYS.TRANSACTIONS, txs),
    getInvoices: () => get<Invoice>(KEYS.INVOICES),
    saveInvoices: (inv: Invoice[]) => set(KEYS.INVOICES, inv),
    getSubscriptions: () => get<Subscription>(KEYS.SUBSCRIPTIONS),
    saveSubscriptions: (s: Subscription[]) => set(KEYS.SUBSCRIPTIONS, s),
    getBudgets: () => get<Budget>(KEYS.BUDGETS),
    saveBudgets: (b: Budget[]) => set(KEYS.BUDGETS, b),
    getBills: () => get<Bill>(KEYS.BILLS),
    saveBills: (b: Bill[]) => set(KEYS.BILLS, b),
    generateMonthlyInvoices: () => {
        console.log('Generating monthly invoices...');
    },

    // Operations
    getInventory: () => get<EquipmentItem>(KEYS.INVENTORY),
    saveInventory: (items: EquipmentItem[]) => set(KEYS.INVENTORY, items),
    getStaff: () => get<StaffMember>(KEYS.STAFF),
    saveStaff: (s: StaffMember[]) => set(KEYS.STAFF, s),
    getTacticalPlays: () => get<TacticalPlay>(KEYS.TACTICAL_PLAYS),
    saveTacticalPlays: (plays: TacticalPlay[]) => set(KEYS.TACTICAL_PLAYS, plays),
    getMarketplaceItems: () => get<MarketplaceItem>(KEYS.MARKETPLACE),
    saveMarketplaceItems: (items: MarketplaceItem[]) => set(KEYS.MARKETPLACE, items),
    getEventSales: () => get<EventSale>(KEYS.EVENT_SALES),
    saveEventSales: (sales: EventSale[]) => set(KEYS.EVENT_SALES, sales),
    getDrillLibrary: () => get<Drill>(KEYS.DRILLS),

    // Strategy & Comms
    getObjectives: () => get<Objective>(KEYS.OBJECTIVES),
    saveObjectives: (objs: Objective[]) => {
        set(KEYS.OBJECTIVES, objs);
        storageService.notify('objectives');
    },
    getTasks: () => get<KanbanTask>(KEYS.TASKS),
    saveTasks: (tasks: KanbanTask[]) => set(KEYS.TASKS, tasks),
    getChatMessages: () => get<ChatMessage>(KEYS.CHAT),
    saveChatMessages: (msgs: ChatMessage[]) => set(KEYS.CHAT, msgs),
    getDocuments: () => get<TeamDocument>(KEYS.DOCUMENTS),
    saveDocuments: (docs: TeamDocument[]) => set(KEYS.DOCUMENTS, docs),
    getAnnouncements: () => get<Announcement>(KEYS.ANNOUNCEMENTS),
    saveAnnouncements: (a: Announcement[]) => set(KEYS.ANNOUNCEMENTS, a),
    getSocialPosts: () => get<SocialPost>(KEYS.SOCIAL_POSTS),
    saveSocialPosts: (p: SocialPost[]) => set(KEYS.SOCIAL_POSTS, p),
    getSocialFeed: () => get<SocialFeedPost>(KEYS.SOCIAL_FEED),
    saveSocialFeedPost: (post: SocialFeedPost) => {
        const feed = storageService.getSocialFeed();
        set(KEYS.SOCIAL_FEED, [post, ...feed]);
        storageService.notify('socialFeed');
    },
    toggleLikePost: (id: string) => {
        const feed = storageService.getSocialFeed();
        const updated = feed.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p);
        set(KEYS.SOCIAL_FEED, updated);
        storageService.notify('socialFeed');
    },

    // National & League
    getSponsors: () => get<SponsorDeal>(KEYS.SPONSORS),
    saveSponsors: (s: SponsorDeal[]) => set(KEYS.SPONSORS, s),
    getLeague: (): League => ({ id: 'l1', name: 'BFA', season: '2025', teams: [] }),
    getConfederationStats: (): ConfederationStats => ({ totalAthletes: 1245, totalTeams: 42, totalGamesThisYear: 156, activeAffiliates: 18, growthRate: 15 }),
    getNationalTeamScouting: () => get<NationalTeamCandidate>(KEYS.PLAYERS),
    getAffiliatesStatus: () => [],
    getTransferRequests: () => get<TransferRequest>(KEYS.TRANSFERS),
    getAuditLogs: () => get<AuditLog>(KEYS.AUDIT_LOGS),
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
        set(KEYS.AUDIT_LOGS, [newLog, ...logs]);
    },
    processTransfer: (id: string, decision: string, by: string) => {
        const transfers = get<TransferRequest>(KEYS.TRANSFERS);
        const updated = transfers.map(t => t.id === id ? { ...t, status: (decision === 'APPROVE' ? 'APPROVED' : 'REJECTED') as any } : t);
        set(KEYS.TRANSFERS, updated);
    },

    // Utilities
    getCourses: () => get<Course>('gridiron_courses'),
    getPublicLeagueStats: () => ({ 
        name: 'BFA', season: '2025',
        leagueTable: [],
        leaders: { passing: [], rushing: [], defense: [] } 
    }),
    getPublicGameData: (id: string) => storageService.getGames().find(g => String(g.id) === id) || null,
    getAthleteStatsHistory: (playerId: number) => {
        const player = storageService.getPlayers().find(p => p.id === playerId);
        return player?.combineHistory || [];
    },
    getAthleteMissions: (playerId: number) => {
        const now = new Date();
        const nextGames = storageService.getGames()
            .filter(g => new Date(g.date) > now)
            .map(g => ({ ...g, missionType: 'GAME' as const }));
        const nextPractices = storageService.getPracticeSessions()
            .filter(p => new Date(p.date) > now)
            .map(p => ({ ...p, missionType: 'PRACTICE' as const }));
        return [...nextGames, ...nextPractices].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    },
    getEntitlements: () => get<Entitlement>(KEYS.ENTITLEMENTS),
    purchaseDigitalProduct: (userId: string, product: any) => {
        const ents = storageService.getEntitlements();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + (product.durationHours || 720));
        const newEnt: Entitlement = { id: `ent-${Date.now()}`, userId, productId: product.id, purchasedAt: new Date(), expiresAt };
        set(KEYS.ENTITLEMENTS, [...ents, newEnt]);
        storageService.notify('entitlements');
    },
    getCandidates: () => get<RecruitmentCandidate>(KEYS.CANDIDATES),
    saveCandidates: (c: RecruitmentCandidate[]) => set(KEYS.CANDIDATES, c),
    getClips: () => get<VideoClip>(KEYS.CLIPS),
    getPlaylists: () => [],
    exportFullDatabase: () => {
        const data = JSON.stringify(localStorage);
        const blob = new Blob([data], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'backup.json'; a.click();
    },
    seedDatabaseToCloud: async () => {},
    createChampionship: (name: string, year: number, div: string) => {},
    uploadFile: async (file: File, path: string) => URL.createObjectURL(file),

    // Session and User
    getCurrentUser: (): User | null => {
        const data = localStorage.getItem(KEYS.CURRENT_USER);
        return data ? JSON.parse(data) : null;
    },
    setCurrentUser: (user: User | null) => {
        if (user) localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
        else localStorage.removeItem(KEYS.CURRENT_USER);
    }
};

export const LEGAL_DOCUMENTS: LegalDocument[] = [
    { id: 'compliance-1', title: 'Termos de Compliance', content: 'Termos de uso...', version: '1.0' }
];

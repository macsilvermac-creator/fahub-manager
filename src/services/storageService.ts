
import { Player, Game, PracticeSession, Course, TeamSettings, RecruitmentCandidate, SocialPost, Announcement, Transaction, Invoice, Subscription, Budget, Bill, EquipmentItem, Objective, StaffMember, TacticalPlay, VideoClip, Entitlement, League, SponsorDeal, CrewLogistics, RefereeProfile, AssociationFinance, SocialFeedPost, CoachCareer, ProgramType, GameReport, ConfederationStats, NationalTeamCandidate, Affiliate, TransferRequest, AuditLog, EventSale, Drill, YouthClass, YouthStudent } from '../types';

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
const MARKETPLACE_KEY = 'gridiron_marketplace';
const YOUTH_CLASSES_KEY = 'gridiron_youth_classes';
const YOUTH_STUDENTS_KEY = 'gridiron_youth_students';

let players: Player[] = getListFromDisk(PLAYERS_KEY);
let games: Game[] = getListFromDisk(GAMES_KEY);
let practices: PracticeSession[] = getListFromDisk(PRACTICE_KEY);
let activeProgram: ProgramType = (localStorage.getItem('gridiron_active_program') as ProgramType) || 'TACKLE';

const INITIAL_TEAM_SETTINGS: TeamSettings = {
    id: 'ts-1',
    teamName: 'FAHUB Stars',
    logoUrl: 'https://ui-avatars.com/api/?name=FS&background=00A86B&color=fff&size=200', 
    address: 'Arena Principal, Centro Esportivo',
    primaryColor: '#00A86B'
};

const subscribers: Record<string, (() => void)[]> = {};

export const storageService = {
    initializeRAM: async () => {
        players = getListFromDisk(PLAYERS_KEY);
        games = getListFromDisk(GAMES_KEY);
        practices = getListFromDisk(PRACTICE_KEY);
        activeProgram = (localStorage.getItem('gridiron_active_program') as ProgramType) || 'TACKLE';
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

    getPlayers: () => players,
    savePlayers: (updated: Player[]) => {
        players = updated;
        saveListToDisk(PLAYERS_KEY, updated);
        storageService.notify('players');
    },
    registerAthlete: (player: Player) => {
        const updated = [...players, player];
        storageService.savePlayers(updated);
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
        storageService.notify('games');
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
        storageService.notify('practice');
    },
    savePracticeCheckIn: (sessionId: string, checkedInIds: string[]) => {
        const updated = practices.map(p => String(p.id) === sessionId ? { ...p, checkedInAttendees: checkedInIds } : p);
        storageService.savePracticeSessions(updated);
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
        return stored ? JSON.parse(stored, dateReviver) : INITIAL_TEAM_SETTINGS;
    },
    saveTeamSettings: (settings: TeamSettings) => {
        localStorage.setItem(TEAM_SETTINGS_KEY, JSON.stringify(settings));
        storageService.notify('settings');
    },

    getActiveProgram: () => activeProgram,
    setActiveProgram: (prog: ProgramType) => {
        activeProgram = prog;
        localStorage.setItem('gridiron_active_program', prog);
        storageService.notify('activeProgram');
    },

    getCandidates: (): RecruitmentCandidate[] => getListFromDisk(CANDIDATES_KEY),
    saveCandidates: (updated: RecruitmentCandidate[]) => saveListToDisk(CANDIDATES_KEY, updated),

    getSocialPosts: (): SocialPost[] => getListFromDisk(SOCIAL_POSTS_KEY),
    saveSocialPosts: (updated: SocialPost[]) => saveListToDisk(SOCIAL_POSTS_KEY, updated),

    getAnnouncements: (): Announcement[] => getListFromDisk(ANNOUNCEMENTS_KEY),
    saveAnnouncements: (updated: Announcement[]) => saveListToDisk(ANNOUNCEMENTS_KEY, updated),

    getTransactions: (): Transaction[] => getListFromDisk(TRANSACTIONS_KEY),
    saveTransactions: (updated: Transaction[]) => saveListToDisk(TRANSACTIONS_KEY, updated),

    getInvoices: (): Invoice[] => getListFromDisk(INVOICES_KEY),
    saveInvoices: (updated: Invoice[]) => saveListToDisk(INVOICES_KEY, updated),

    getSubscriptions: (): Subscription[] => getListFromDisk(SUBSCRIPTIONS_KEY),
    saveSubscriptions: (updated: Subscription[]) => saveListToDisk(SUBSCRIPTIONS_KEY, updated),

    getBudgets: (): Budget[] => getListFromDisk(BUDGETS_KEY),
    saveBudgets: (updated: Budget[]) => saveListToDisk(BUDGETS_KEY, updated),

    getBills: (): Bill[] => getListFromDisk(BILLS_KEY),
    saveBills: (updated: Bill[]) => saveListToDisk(BILLS_KEY, updated),

    generateMonthlyInvoices: () => {
        const subs = storageService.getSubscriptions();
        const allPlayers = storageService.getPlayers();
        const invoices = storageService.getInvoices();
        const newInvoices: Invoice[] = [];
        
        subs.filter(s => s.active).forEach(s => {
            s.assignedTo.forEach(pid => {
                const player = allPlayers.find(p => p.id === pid);
                newInvoices.push({
                    id: `inv-sub-${s.id}-${pid}-${Date.now()}`,
                    playerId: pid,
                    playerName: player?.name || 'Atleta',
                    title: s.title,
                    amount: s.amount,
                    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
                    status: 'PENDING',
                    category: 'TUITION'
                });
            });
        });
        storageService.saveInvoices([...invoices, ...newInvoices]);
    },

    getInventory: (): EquipmentItem[] => getListFromDisk(INVENTORY_KEY),
    saveInventory: (updated: EquipmentItem[]) => saveListToDisk(INVENTORY_KEY, updated),

    getObjectives: (): Objective[] => getListFromDisk(OBJECTIVES_KEY),
    saveObjectives: (updated: Objective[]) => saveListToDisk(OBJECTIVES_KEY, updated),

    getStaff: (): StaffMember[] => getListFromDisk(STAFF_KEY),
    saveStaff: (updated: StaffMember[]) => saveListToDisk(STAFF_KEY, updated),

    getTacticalPlays: (): TacticalPlay[] => getListFromDisk(TACTICAL_PLAYS_KEY),
    saveTacticalPlays: (updated: TacticalPlay[]) => saveListToDisk(TACTICAL_PLAYS_KEY, updated),

    getClips: (): VideoClip[] => getListFromDisk(CLIPS_KEY),
    saveClips: (updated: VideoClip[]) => saveListToDisk(CLIPS_KEY, updated),

    getEntitlements: (): Entitlement[] => getListFromDisk(ENTITLEMENTS_KEY),
    purchaseDigitalProduct: (userId: string, product: any) => {
        const ents = storageService.getEntitlements();
        const newEnt: Entitlement = {
            id: `ent-${Date.now()}`,
            userId,
            productId: product.id,
            purchasedAt: new Date(),
            expiresAt: new Date(Date.now() + (product.durationHours || 720) * 3600000)
        };
        saveListToDisk(ENTITLEMENTS_KEY, [...ents, newEnt]);
    },

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

    saveCoachProfile: (userId: string, profile: CoachCareer) => {
        const profiles = getListFromDisk<any>(COACH_PROFILES_KEY);
        saveListToDisk(COACH_PROFILES_KEY, { ...profiles, [userId]: profile });
    },
    getCoachProfile: (userId: string): CoachCareer | null => {
        const profiles = getListFromDisk<any>(COACH_PROFILES_KEY);
        return profiles[userId] || null;
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
            thumbnailUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400',
            priority: true,
            modules: []
        }
    ],

    getPublicGameData: (gameId: string) => {
        return games.find(g => String(g.id) === gameId) || null;
    },

    getPublicLeagueStats: () => {
        return {
            name: 'BFA', season: '2025',
            leagueTable: [
                { teamId: 't1', teamName: 'Stars', wins: 8, losses: 0, draws: 0, pointsFor: 240, pointsAgainst: 42, logoUrl: INITIAL_TEAM_SETTINGS.logoUrl }
            ],
            leaders: {
                passing: [], rushing: [], defense: []
            }
        };
    },

    getConfederationStats: (): ConfederationStats => ({
        totalAthletes: 1245, totalTeams: 42, totalGamesThisYear: 156, activeAffiliates: 18, growthRate: 15
    }),
    getNationalTeamScouting: (): NationalTeamCandidate[] => [],
    getAffiliatesStatus: (): Affiliate[] => [],
    getTransferRequests: (): TransferRequest[] => [],
    getAuditLogs: (): AuditLog[] => getListFromDisk('gridiron_audit_logs'),
    logAuditAction: (action: string, details: string) => {
        const logs = storageService.getAuditLogs();
        const newLog: AuditLog = {
            id: `log-${Date.now()}`, action, details, timestamp: new Date(),
            userId: 'admin', userName: 'Admin', role: 'MASTER', ipAddress: '127.0.0.1'
        };
        saveListToDisk('gridiron_audit_logs', [newLog, ...logs]);
    },
    /* Added processTransfer to resolve Confederation.tsx error */
    processTransfer: (id: string, decision: string, by: string) => {
        storageService.logAuditAction('TRANSFER_DECISION', `Processou transferência ${id}: ${decision} por ${by}`);
    },
    getEventSales: (): EventSale[] => getListFromDisk(SALES_KEY),
    saveEventSales: (updated: EventSale[]) => saveListToDisk(SALES_KEY, updated),
    getDrillLibrary: (): Drill[] => getListFromDisk('gridiron_drill_library'),
    exportFullDatabase: () => {
        const data = JSON.stringify(localStorage);
        const blob = new Blob([data], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_${new Date().toISOString()}.json`;
        a.click();
    },
    seedDatabaseToCloud: async () => {},
    getLeague: (): League => ({
        id: 'l1', name: 'BFA', season: '2025',
        teams: [{ teamId: 't1', teamName: 'Stars', wins: 8, losses: 0, draws: 0, pointsFor: 240, pointsAgainst: 42, logoUrl: INITIAL_TEAM_SETTINGS.logoUrl }]
    }),
    getRefereeProfile: (id: string): RefereeProfile | null => null,
    getAssociationFinancials: (): AssociationFinance | null => null,
    getCrewLogistics: (gameId: number): CrewLogistics | null => null,
    getReferees: (): RefereeProfile[] => [],

    /* Added Marketplace methods to resolve Commercial.tsx and Marketplace.tsx errors */
    getMarketplaceItems: (): any[] => getListFromDisk(MARKETPLACE_KEY),
    saveMarketplaceItems: (items: any[]) => saveListToDisk(MARKETPLACE_KEY, items),

    /* Added Youth methods to resolve YouthProgram.tsx errors */
    getYouthClasses: (): YouthClass[] => getListFromDisk(YOUTH_CLASSES_KEY),
    saveYouthClasses: (classes: YouthClass[]) => saveListToDisk(YOUTH_CLASSES_KEY, classes),
    getYouthStudents: (): YouthStudent[] => getListFromDisk(YOUTH_STUDENTS_KEY),
    saveYouthStudents: (students: YouthStudent[]) => saveListToDisk(YOUTH_STUDENTS_KEY, students),

    /* Added addTeamXP to resolve LockerRoom.tsx error */
    addTeamXP: (amount: number) => {
        const settings = storageService.getTeamSettings();
        storageService.saveTeamSettings({ ...settings, xp: (settings.xp || 0) + amount });
    },
    createChampionship: (name: string, year: number, division: string) => {
        storageService.logAuditAction('CHAMPIONSHIP_CREATED', `Criou campeonato: ${name}`);
    }
};

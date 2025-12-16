
import { Player, Game, PracticeSession, TeamSettings, StaffMember, Transaction, Invoice, SocialFeedPost, Announcement, ChatMessage, TeamDocument, TacticalPlay, Course, AuditLog, MarketplaceItem, YouthClass, YouthStudent, TransferRequest, CoachCareer, CoachGameNote, GameReport, CrewLogistics, VideoClip, VideoPlaylist, SponsorDeal, SocialPost, EquipmentItem, EventSale, RecruitmentCandidate, Objective, Subscription, Budget, Bill, KanbanTask, NationalTeamCandidate, Affiliate, RefereeProfile, LegalDocument, ProgramType, AssociationFinance, GameStatsSnapshot, DigitalProduct, Entitlement, Drill } from '../types';
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
    ACTIVE_PROGRAM: 'gridiron_active_program',
    ENTITLEMENTS: 'gridiron_entitlements',
    DRILL_LIBRARY: 'gridiron_drill_library',
    REFEREES: 'gridiron_referees',
    TRANSFERS: 'gridiron_transfers'
};

export const LEGAL_DOCUMENTS: LegalDocument[] = [
    { id: 'term-usage', title: 'Termos de Uso e Responsabilidade Financeira', version: '1.0', requiredRole: ['HEAD_COACH', 'FINANCIAL_MANAGER'], createdAt: new Date(), content: 'Termos legais padrão...' }
];

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

const RAM_DB: Record<string, any> = {};
const LISTENERS: Record<string, Function[]> = {};

const getFromDisk = <T>(key: string, defaultValue: T): T => {
    if (RAM_DB[key] !== undefined) {
        return RAM_DB[key] as T;
    }
    try {
        const stored = localStorage.getItem(key);
        if (!stored) {
            RAM_DB[key] = defaultValue; 
            return defaultValue;
        }
        const data = JSON.parse(stored, dateReviver);
        RAM_DB[key] = data; 
        return data;
    } catch (e) {
        console.error(`❌ Data corruption detected for key: ${key}`, e);
        RAM_DB[key] = defaultValue;
        return defaultValue;
    }
};

const saveToDisk = (key: string, value: any, syncEntity?: string) => {
    RAM_DB[key] = value;
    if (LISTENERS[key]) {
        LISTENERS[key].forEach(cb => cb(value));
    }
    setTimeout(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error("❌ Storage Error", e);
        }
    }, 0);
    if (syncEntity) {
        syncService.triggerSync(syncEntity, value);
    }
};

export const storageService = {
    initializeRAM: () => {
        console.log("🚀 [SYSTEM] Booting Lazy Storage...");
        getFromDisk(KEYS.SETTINGS, INITIAL_TEAM_SETTINGS);
        getFromDisk(KEYS.ACTIVE_PROGRAM, 'TACKLE');
    },

    subscribe: (keyName: string, callback: Function) => {
        let internalKey = keyName;
        if (keyName === 'players') internalKey = KEYS.PLAYERS;
        else if (keyName === 'games') internalKey = KEYS.GAMES;
        else if (keyName === 'activeProgram') internalKey = KEYS.ACTIVE_PROGRAM;
        else if (keyName === 'settings') internalKey = KEYS.SETTINGS;

        if (!LISTENERS[internalKey]) LISTENERS[internalKey] = [];
        LISTENERS[internalKey].push(callback);
        return () => {
            LISTENERS[internalKey] = LISTENERS[internalKey].filter(cb => cb !== callback);
        };
    },

    // --- SYNC & CLOUD ---
    syncFromCloud: async () => {
        console.log("☁️ Sync requested...");
        try {
            const players = await firebaseDataService.getPlayers();
            if(players.length) saveToDisk(KEYS.PLAYERS, players);
            
            const games = await firebaseDataService.getGames();
            if(games.length) saveToDisk(KEYS.GAMES, games);
            
            console.log("☁️ Sync complete.");
        } catch(e) {
            console.warn("Cloud sync failed (Offline?)");
        }
    },
    
    uploadFile: async (file: File, folder: string): Promise<string> => {
        return firebaseDataService.uploadFile(file, folder);
    },

    seedDatabaseToCloud: async () => {
        const players = getFromDisk<Player[]>(KEYS.PLAYERS, []);
        const games = getFromDisk<Game[]>(KEYS.GAMES, []);
        if (players.length > 0) await firebaseDataService.syncPlayers(players);
        if (games.length > 0) await firebaseDataService.syncGames(games);
        alert("Seed complete.");
    },

    exportFullDatabase: () => {
        const data = JSON.stringify(localStorage);
        const blob = new Blob([data], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fahub_backup_${Date.now()}.json`;
        a.click();
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
    
    getPublicGameData: (gameId: string) => {
        const games = getFromDisk<Game[]>(KEYS.GAMES, []);
        return games.find(g => String(g.id) === gameId) || null;
    },

    // --- SETTINGS & PROGRAM ---
    getTeamSettings: (): TeamSettings => getFromDisk(KEYS.SETTINGS, INITIAL_TEAM_SETTINGS),
    saveTeamSettings: (s: TeamSettings) => saveToDisk(KEYS.SETTINGS, s, 'settings'),

    getActiveProgram: (): ProgramType => getFromDisk(KEYS.ACTIVE_PROGRAM, 'TACKLE'),
    setActiveProgram: (program: ProgramType) => saveToDisk(KEYS.ACTIVE_PROGRAM, program),

    // --- FINANCE ---
    getTransactions: (): Transaction[] => getFromDisk(KEYS.TRANSACTIONS, []),
    saveTransactions: (t: Transaction[]) => saveToDisk(KEYS.TRANSACTIONS, t, 'transactions'),
    
    getInvoices: (): Invoice[] => getFromDisk(KEYS.INVOICES, []),
    saveInvoices: (i: Invoice[]) => saveToDisk(KEYS.INVOICES, i),
    
    generateMonthlyInvoices: () => {
        const subscriptions = storageService.getSubscriptions().filter(s => s.active);
        const players = storageService.getPlayers().filter(p => p.status === 'ACTIVE');
        const invoices = storageService.getInvoices();
        
        const newInvoices: Invoice[] = [];
        
        subscriptions.forEach(sub => {
            players.forEach(p => {
                if (sub.assignedTo.includes(p.id)) {
                    newInvoices.push({
                        id: `inv-${Date.now()}-${p.id}`,
                        playerId: p.id,
                        playerName: p.name,
                        title: sub.title,
                        amount: sub.amount,
                        dueDate: sub.nextBillingDate,
                        status: 'PENDING',
                        category: 'TUITION'
                    });
                }
            });
        });
        
        storageService.saveInvoices([...invoices, ...newInvoices]);
    },
    
    getSubscriptions: (): Subscription[] => getFromDisk(KEYS.SUBSCRIPTIONS, []),
    saveSubscriptions: (s: Subscription[]) => saveToDisk(KEYS.SUBSCRIPTIONS, s),

    getBudgets: (): Budget[] => getFromDisk(KEYS.BUDGETS, []),
    saveBudgets: (b: Budget[]) => saveToDisk(KEYS.BUDGETS, b),

    getBills: (): Bill[] => getFromDisk(KEYS.BILLS, []),
    saveBills: (b: Bill[]) => saveToDisk(KEYS.BILLS, b),

    // --- PRACTICE ---
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
    
    savePracticeCheckIn: (practiceId: string, checkedInIds: string[]) => {
        const practices = storageService.getPracticeSessions();
        const updated = practices.map(p => {
            if (p.id === practiceId) {
                return { ...p, checkedInAttendees: checkedInIds };
            }
            return p;
        });
        storageService.savePracticeSessions(updated);
        
        checkedInIds.forEach(pid => {
            storageService.addPlayerXP(Number(pid), 50, 'Presença Confirmada em Treino');
        });
    },

    getDrillLibrary: (): Drill[] => getFromDisk(KEYS.DRILL_LIBRARY, []),

    // --- STAFF ---
    getStaff: (): StaffMember[] => getFromDisk(KEYS.STAFF, []),
    saveStaff: (s: StaffMember[]) => saveToDisk(KEYS.STAFF, s),

    // --- RECRUITMENT ---
    getCandidates: (): RecruitmentCandidate[] => getFromDisk(KEYS.CANDIDATES, []),
    saveCandidates: (c: RecruitmentCandidate[]) => saveToDisk(KEYS.CANDIDATES, c),

    // --- GOALS ---
    getObjectives: (): Objective[] => getFromDisk(KEYS.OBJECTIVES, []),
    saveObjectives: (o: Objective[]) => saveToDisk(KEYS.OBJECTIVES, o),

    // --- TASKS ---
    getTasks: (): KanbanTask[] => getFromDisk(KEYS.TASKS, []),
    saveTasks: (t: KanbanTask[]) => saveToDisk(KEYS.TASKS, t),

    // --- COMMUNICATION ---
    getAnnouncements: (): Announcement[] => getFromDisk(KEYS.ANNOUNCEMENTS, []),
    saveAnnouncements: (a: Announcement[]) => saveToDisk(KEYS.ANNOUNCEMENTS, a),

    getChatMessages: (): ChatMessage[] => getFromDisk(KEYS.CHAT, []),
    saveChatMessages: (m: ChatMessage[]) => saveToDisk(KEYS.CHAT, m),
    
    getSocialFeed: (): SocialFeedPost[] => getFromDisk(KEYS.FEED, []),
    saveSocialFeedPost: (p: SocialFeedPost) => {
        const feed = getFromDisk<SocialFeedPost[]>(KEYS.FEED, []);
        saveToDisk(KEYS.FEED, [p, ...feed]);
    },
    toggleLikePost: (postId: string) => {
        const feed = getFromDisk<SocialFeedPost[]>(KEYS.FEED, []);
        const updated = feed.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p);
        saveToDisk(KEYS.FEED, updated);
    },

    // --- RESOURCES ---
    getDocuments: (): TeamDocument[] => getFromDisk(KEYS.DOCUMENTS, []),
    saveDocuments: (d: TeamDocument[]) => saveToDisk(KEYS.DOCUMENTS, d),

    getInventory: (): EquipmentItem[] => getFromDisk(KEYS.INVENTORY, []),
    saveInventory: (i: EquipmentItem[]) => saveToDisk(KEYS.INVENTORY, i),

    // --- COMMERCIAL ---
    getSponsors: (): SponsorDeal[] => getFromDisk(KEYS.SPONSORS, []),
    saveSponsors: (s: SponsorDeal[]) => saveToDisk(KEYS.SPONSORS, s),

    getSocialPosts: (): SocialPost[] => getFromDisk(KEYS.SOCIAL_POSTS, []),
    saveSocialPosts: (p: SocialPost[]) => saveToDisk(KEYS.SOCIAL_POSTS, p),

    getMarketplaceItems: (): MarketplaceItem[] => getFromDisk(KEYS.MARKETPLACE, []),
    saveMarketplaceItems: (i: MarketplaceItem[]) => saveToDisk(KEYS.MARKETPLACE, i),

    getEventSales: (): EventSale[] => getFromDisk(KEYS.SALES, []),
    saveEventSales: (s: EventSale[]) => saveToDisk(KEYS.SALES, s),
    
    // --- DIGITAL STORE & DRM ---
    getEntitlements: (): Entitlement[] => getFromDisk(KEYS.ENTITLEMENTS, []),
    checkAccess: (userId: string, productId: string): boolean => {
        const entitlements = getFromDisk<Entitlement[]>(KEYS.ENTITLEMENTS, []);
        return entitlements.some(e => e.userId === userId && e.productId === productId && new Date(e.expiresAt) > new Date());
    },
    purchaseDigitalProduct: (userId: string, product: DigitalProduct) => {
        const entitlements = getFromDisk<Entitlement[]>(KEYS.ENTITLEMENTS, []);
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + product.durationHours);
        
        const newEntitlement: Entitlement = {
            id: `ent-${Date.now()}`,
            userId,
            productId: product.id,
            purchaseDate: new Date(),
            expiresAt,
            status: 'ACTIVE'
        };
        saveToDisk(KEYS.ENTITLEMENTS, [...entitlements, newEntitlement]);
    },

    // --- ACADEMY ---
    getCourses: (): Course[] => getFromDisk(KEYS.COURSES, []),
    saveCourses: (c: Course[]) => saveToDisk(KEYS.COURSES, c),
    
    savePlayerWorkout: (playerId: number, content: string, title: string) => {
        const players = getFromDisk<Player[]>(KEYS.PLAYERS, []);
        const updated = players.map(p => {
            if(p.id === playerId) {
                const workouts = p.savedWorkouts || [];
                workouts.push({ id: `w-${Date.now()}`, date: new Date(), title, content, category: 'GYM' });
                return { ...p, savedWorkouts: workouts };
            }
            return p;
        });
        saveToDisk(KEYS.PLAYERS, updated, 'players');
    },

    // --- TACTICAL ---
    getTacticalPlays: (): TacticalPlay[] => getFromDisk(KEYS.PLAYS, []),
    saveTacticalPlays: (t: TacticalPlay[]) => saveToDisk(KEYS.PLAYS, t),

    // --- VIDEO ---
    getClips: (): VideoClip[] => getFromDisk(KEYS.CLIPS, []),
    saveClips: (c: VideoClip[]) => saveToDisk(KEYS.CLIPS, c),

    getPlaylists: (): VideoPlaylist[] => getFromDisk(KEYS.PLAYLISTS, []),
    savePlaylists: (p: VideoPlaylist[]) => saveToDisk(KEYS.PLAYLISTS, p),

    // --- YOUTH ---
    getYouthClasses: (): YouthClass[] => getFromDisk(KEYS.YOUTH, []),
    saveYouthClasses: (c: YouthClass[]) => saveToDisk(KEYS.YOUTH, c),
    getYouthStudents: (): YouthStudent[] => {
        const classes = getFromDisk<YouthClass[]>(KEYS.YOUTH, []);
        let allStudents: YouthStudent[] = [];
        classes.forEach(c => allStudents = [...allStudents, ...c.students]);
        return allStudents;
    },

    // --- COACH ---
    getCoachGameNotes: (): CoachGameNote[] => getFromDisk(KEYS.COACH_NOTES, []),
    saveCoachGameNotes: (n: CoachGameNote[]) => saveToDisk(KEYS.COACH_NOTES, n),
    
    getCoachProfile: (id: string): CoachCareer | null => {
        const profiles = getFromDisk<Record<string, CoachCareer>>(KEYS.COACH_PROFILES, {});
        return profiles[id] || null;
    },
    saveCoachProfile: (id: string, p: CoachCareer) => {
        const profiles = getFromDisk<Record<string, CoachCareer>>(KEYS.COACH_PROFILES, {});
        profiles[id] = p;
        saveToDisk(KEYS.COACH_PROFILES, profiles);
    },

    // --- LOGS ---
    getAuditLogs: (): AuditLog[] => getFromDisk(KEYS.LOGS, []),
    logAuditAction: (action: string, detail: string) => {
        const logs = getFromDisk<AuditLog[]>(KEYS.LOGS, []);
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
        saveToDisk(KEYS.LOGS, [newLog, ...logs]);
    },
    
    // --- OFFICIATING & LEAGUE ---
    getReferees: (): RefereeProfile[] => getFromDisk(KEYS.REFEREES, []),
    getRefereeProfile: (id: string): RefereeProfile | null => {
        const refs = getFromDisk<RefereeProfile[]>(KEYS.REFEREES, []);
        return refs.find(r => r.id === id) || null;
    },
    getCrewLogistics: (gameId: number): CrewLogistics | null => null, // Mock
    getAssociationFinancials: (): AssociationFinance => ({ totalReceivableFromLeagues: 0, totalPayableToReferees: 0, cashBalance: 0 }),
    
    // --- CONFEDERATION ---
    getConfederationStats: (): any => ({ totalAthletes: 12500, totalTeams: 142, totalGamesThisYear: 320, activeAffiliates: 18, growthRate: 15 }),
    getNationalTeamScouting: (): NationalTeamCandidate[] => [],
    getAffiliatesStatus: (): Affiliate[] => [],
    getTransferRequests: (): TransferRequest[] => getFromDisk(KEYS.TRANSFERS, []),
    processTransfer: (id: string, decision: 'APPROVE' | 'REJECT', by: string) => {
        const reqs = getFromDisk<TransferRequest[]>(KEYS.TRANSFERS, []);
        const updated = reqs.map(r => r.id === id ? { ...r, status: decision === 'APPROVE' ? 'APPROVED' : 'REJECTED' } : r);
        saveToDisk(KEYS.TRANSFERS, updated);
    },
    
    getPublicLeagueStats: (): any => {
        return {
            name: "Liga Nacional",
            season: "2025",
            leagueTable: [],
            leaders: { passing: [], rushing: [], defense: [] }
        };
    },
    
    createChampionship: (name: string, year: number, division: string) => {
        console.log("Creating championship", name);
    },
    
    checkDocumentSigned: (docId: string) => true, // Mock
    addTeamXP: (xp: number) => console.log("Team XP +", xp),
    
};

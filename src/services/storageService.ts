
import { Player, Game, PracticeSession, TeamSettings, StaffMember, Transaction, Invoice, SocialFeedPost, Announcement, ChatMessage, TeamDocument, TacticalPlay, Course, AuditLog, MarketplaceItem, YouthClass, YouthStudent, RecruitmentCandidate, Objective, Subscription, Budget, Bill, KanbanTask, RefereeProfile, LegalDocument, ProgramType, Drill, Entitlement, DigitalProduct, League, SponsorDeal, SocialPost, EquipmentItem, EventSale, GameReport, VideoClip, VideoPlaylist, CoachGameNote, CoachCareer, CrewLogistics } from '../types';
import { firebaseDataService } from './firebaseDataService';
import { syncService } from './syncService';
import { securityService } from './securityService'; // IRONCLAD UPDATE
import { get, set } from 'idb-keyval';

// Chaves do Banco de Dados
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
    YOUTH_CLASSES: 'gridiron_youth_classes',
    COACH_NOTES: 'gridiron_coach_notes',
    COACH_PROFILES: 'gridiron_coach_profiles',
    FEED: 'gridiron_social_feed',
    LOGS: 'gridiron_audit_logs',
    ACTIVE_PROGRAM: 'gridiron_active_program',
    CANDIDATES: 'gridiron_candidates',
    OBJECTIVES: 'gridiron_objectives',
    ENTITLEMENTS: 'gridiron_entitlements',
    DRILLS: 'gridiron_drill_library'
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
    sportType: 'FULLPADS'
};

// --- IN-MEMORY DATABASE & OBSERVERS ---
const RAM_DB: Record<string, any> = {
    players: [],
    games: [],
    settings: INITIAL_TEAM_SETTINGS,
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
    coachProfiles: {},
    feed: [],
    logs: [],
    candidates: [],
    objectives: [],
    entitlements: [],
    drills: [],
    activeProgram: 'TACKLE'
};

const LISTENERS: Record<string, Function[]> = {};

// Helper: Persistência Híbrida (RAM Imediata + IndexedDB Background)
const persist = (dbKey: string, ramKey: string, data: any, syncEntity?: string) => {
    // 1. Atualiza RAM imediatamente (UI Reage agora)
    RAM_DB[ramKey] = data;
    
    // 2. Notifica assinantes React
    if (LISTENERS[ramKey]) {
        LISTENERS[ramKey].forEach(cb => cb(data));
    }

    // 3. Salva no IndexedDB (Assíncrono - Não trava a thread)
    set(dbKey, data).catch(err => console.error(`Erro ao salvar ${dbKey} no IDB:`, err));

    // 4. Aciona Sync Cloud (Se houver internet)
    if (syncEntity) {
        if (syncService.getConnectionStatus()) {
           syncService.triggerSync(syncEntity, data);
        } else {
           syncService.enqueueAction(syncEntity, data);
        }
    }
};

const dateReviver = (key: string, value: any) => {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
        return new Date(value);
    }
    return value;
};

export const storageService = {
    // --- INITIALIZATION ---
    initializeRAM: async () => {
        console.time("DB_INIT");
        try {
            const keys = Object.values(KEYS);
            const values = await Promise.all(keys.map(key => get(key)));
            let hasDataInIDB = false;

            const keyMap: Record<string, string> = {
                [KEYS.PLAYERS]: 'players',
                [KEYS.GAMES]: 'games',
                [KEYS.SETTINGS]: 'settings',
                [KEYS.TRANSACTIONS]: 'transactions',
                [KEYS.PRACTICE]: 'practice',
                [KEYS.INVOICES]: 'invoices',
                [KEYS.STAFF]: 'staff',
                [KEYS.TASKS]: 'tasks',
                [KEYS.ANNOUNCEMENTS]: 'announcements',
                [KEYS.CHAT]: 'chat',
                [KEYS.DOCUMENTS]: 'documents',
                [KEYS.INVENTORY]: 'inventory',
                [KEYS.SPONSORS]: 'sponsors',
                [KEYS.SOCIAL_POSTS]: 'socialPosts',
                [KEYS.MARKETPLACE]: 'marketplace',
                [KEYS.SALES]: 'sales',
                [KEYS.COURSES]: 'courses',
                [KEYS.PLAYS]: 'plays',
                [KEYS.CLIPS]: 'clips',
                [KEYS.PLAYLISTS]: 'playlists',
                [KEYS.YOUTH_CLASSES]: 'youthClasses',
                [KEYS.COACH_NOTES]: 'coachNotes',
                [KEYS.COACH_PROFILES]: 'coachProfiles',
                [KEYS.FEED]: 'feed',
                [KEYS.LOGS]: 'logs',
                [KEYS.ACTIVE_PROGRAM]: 'activeProgram',
                [KEYS.CANDIDATES]: 'candidates',
                [KEYS.OBJECTIVES]: 'objectives',
                [KEYS.ENTITLEMENTS]: 'entitlements',
                [KEYS.DRILLS]: 'drills'
            };

            keys.forEach((key, index) => {
                const val = values[index];
                if (val) {
                    hasDataInIDB = true;
                    const ramKey = keyMap[key];
                    if (ramKey) {
                        RAM_DB[ramKey] = val;
                    }
                }
            });

            if (!hasDataInIDB) {
                console.log("⚠️ IDB Vazio. Verificando LocalStorage...");
                const lsPlayers = localStorage.getItem(KEYS.PLAYERS);
                if (lsPlayers) {
                    console.log("🔄 Migrando LocalStorage -> IndexedDB...");
                    const migrationPromises = [];
                    for (const [keyName, storageKey] of Object.entries(KEYS)) {
                        const lsData = localStorage.getItem(storageKey);
                        if (lsData) {
                            const parsed = JSON.parse(lsData, dateReviver);
                            migrationPromises.push(set(storageKey, parsed));
                            const ramKey = keyMap[storageKey];
                            if(ramKey) RAM_DB[ramKey] = parsed;
                        }
                    }
                    await Promise.all(migrationPromises);
                }
            }
        } catch (e) {
            console.error("Critical DB Error:", e);
        }
        console.timeEnd("DB_INIT");
    },

    subscribe: (key: string, callback: Function) => {
        if (!LISTENERS[key]) LISTENERS[key] = [];
        LISTENERS[key].push(callback);
        return () => {
            LISTENERS[key] = LISTENERS[key].filter(cb => cb !== callback);
        };
    },

    // --- PLAYERS (SECURED) ---
    getPlayers: (): Player[] => RAM_DB.players,
    savePlayers: (players: Player[]) => {
        securityService.enforce('MANAGE_ROSTER'); // Ironclad Check
        persist(KEYS.PLAYERS, 'players', players, 'players');
    },
    
    registerAthlete: (player: Player) => {
        // Allow registration in public mode or by Master
        // securityService.enforce('MANAGE_ROSTER'); // Removed strict check here to allow self-reg
        const newPlayer = { ...player, teamId: 'ts-1', rosterCategory: 'ACTIVE' as const };
        const updated = [...RAM_DB.players, newPlayer];
        persist(KEYS.PLAYERS, 'players', updated, 'players');
    },

    addPlayerXP: (playerId: number, amount: number, reason: string) => {
        // Gamification is allowed by system
        const updated = RAM_DB.players.map((p: Player) => {
            if (p.id === playerId) {
                const newXp = (p.xp || 0) + amount;
                const newLevel = Math.floor(newXp / 100) + 1;
                return { ...p, xp: newXp, level: newLevel };
            }
            return p;
        });
        persist(KEYS.PLAYERS, 'players', updated, 'players');
    },

    // --- GAMES ---
    getGames: (): Game[] => RAM_DB.games,
    saveGames: (games: Game[]) => {
        securityService.enforce('MANAGE_TACTICS'); // Check permissions
        persist(KEYS.GAMES, 'games', games, 'games');
    },
    
    // Allow update live game for referees without strict master check
    updateLiveGame: (gameId: number, updates: Partial<Game>) => {
        const updated = RAM_DB.games.map((g: Game) => g.id === gameId ? { ...g, ...updates } : g);
        // Persist without 'enforce' strictly for referee workflow, or use specific permission
        persist(KEYS.GAMES, 'games', updated, 'games'); 
    },

    finalizeGameReport: (gameId: number, report: GameReport, score: string, winner: string) => {
        securityService.enforce('OFFICIATE_GAME');
        const updated = RAM_DB.games.map((g: Game) => g.id === gameId ? {
            ...g,
            officialReport: report,
            score,
            result: (winner === 'HOME' ? 'W' : winner === 'AWAY' ? 'L' : 'T') as 'W' | 'L' | 'T',
            status: 'FINAL' as const
        } : g);
        persist(KEYS.GAMES, 'games', updated, 'games');
    },

    // --- PRACTICE ---
    getPracticeSessions: (): PracticeSession[] => RAM_DB.practice,
    savePracticeSessions: (p: PracticeSession[]) => {
        securityService.enforce('MANAGE_TACTICS');
        persist(KEYS.PRACTICE, 'practice', p);
    },
    
    // Public/Self methods
    togglePracticeAttendance: (practiceId: string, userId: string) => {
        const updated = RAM_DB.practice.map((p: PracticeSession) => {
            if (String(p.id) === practiceId) {
                const attendees = p.attendees || [];
                const newAttendees = attendees.includes(userId) 
                    ? attendees.filter(id => id !== userId)
                    : [...attendees, userId];
                return { ...p, attendees: newAttendees };
            }
            return p;
        });
        persist(KEYS.PRACTICE, 'practice', updated);
    },

    savePracticeCheckIn: (practiceId: string, checkedInIds: string[]) => {
        const updated = RAM_DB.practice.map((p: PracticeSession) => {
            if (String(p.id) === practiceId) {
                return { ...p, checkedInAttendees: checkedInIds };
            }
            return p;
        });
        persist(KEYS.PRACTICE, 'practice', updated);
    },
    
    getDrillLibrary: (): Drill[] => RAM_DB.drills || [],

    // --- SETTINGS ---
    getTeamSettings: (): TeamSettings => RAM_DB.settings,
    saveTeamSettings: (s: TeamSettings) => {
        securityService.enforce('EDIT_SETTINGS');
        persist(KEYS.SETTINGS, 'settings', s, 'settings');
    },

    getActiveProgram: (): ProgramType => RAM_DB.activeProgram || 'TACKLE',
    setActiveProgram: (p: ProgramType) => persist(KEYS.ACTIVE_PROGRAM, 'activeProgram', p),

    // --- FINANCE (HIGH SECURITY) ---
    getTransactions: (): Transaction[] => {
        // securityService.enforce('VIEW_FINANCE'); // Optional: Prevent even reading
        return RAM_DB.transactions;
    },
    saveTransactions: (t: Transaction[]) => {
        securityService.enforce('MANAGE_FINANCE');
        persist(KEYS.TRANSACTIONS, 'transactions', t, 'transactions');
    },
    
    getInvoices: (): Invoice[] => RAM_DB.invoices,
    saveInvoices: (i: Invoice[]) => {
        securityService.enforce('MANAGE_FINANCE');
        persist(KEYS.INVOICES, 'invoices', i);
    },
    
    createBulkInvoices: (ids: number[], title: string, amount: number, dueDate: Date, category: string) => {
        securityService.enforce('MANAGE_FINANCE');
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
                category: category as any
            };
        });
        const updated = [...RAM_DB.invoices, ...newInvoices];
        persist(KEYS.INVOICES, 'invoices', updated);
    },

    getEventSales: (): EventSale[] => RAM_DB.sales,
    saveEventSales: (s: EventSale[]) => persist(KEYS.SALES, 'sales', s), // Point of Sale allow regular staff

    getSubscriptions: (): Subscription[] => RAM_DB.subscriptions || [], 
    saveSubscriptions: (s: Subscription[]) => {
        securityService.enforce('MANAGE_FINANCE');
        persist(KEYS.TRANSACTIONS, 'subscriptions', s);
    }, 
    getBudgets: (): Budget[] => RAM_DB.budgets || [], 
    saveBudgets: (b: Budget[]) => {
        securityService.enforce('MANAGE_FINANCE');
        persist(KEYS.TRANSACTIONS, 'budgets', b);
    }, 
    getBills: (): Bill[] => RAM_DB.bills || [], 
    saveBills: (b: Bill[]) => {
        securityService.enforce('MANAGE_FINANCE');
        persist(KEYS.TRANSACTIONS, 'bills', b);
    },

    // --- STAFF ---
    getStaff: (): StaffMember[] => RAM_DB.staff,
    saveStaff: (s: StaffMember[]) => {
        securityService.enforce('MANAGE_STAFF');
        persist(KEYS.STAFF, 'staff', s);
    },

    // --- RECRUITMENT ---
    getCandidates: (): RecruitmentCandidate[] => RAM_DB.candidates,
    saveCandidates: (c: RecruitmentCandidate[]) => persist(KEYS.CANDIDATES, 'candidates', c),

    // --- GOALS ---
    getObjectives: (): Objective[] => RAM_DB.objectives,
    saveObjectives: (o: Objective[]) => persist(KEYS.OBJECTIVES, 'objectives', o),

    // --- TASKS ---
    getTasks: (): KanbanTask[] => RAM_DB.tasks,
    saveTasks: (t: KanbanTask[]) => persist(KEYS.TASKS, 'tasks', t),

    // --- COMMUNICATION ---
    getAnnouncements: (): Announcement[] => RAM_DB.announcements,
    saveAnnouncements: (a: Announcement[]) => persist(KEYS.ANNOUNCEMENTS, 'announcements', a),
    
    getChatMessages: (): ChatMessage[] => RAM_DB.chat,
    saveChatMessages: (m: ChatMessage[]) => persist(KEYS.CHAT, 'chat', m),
    
    getSocialFeed: (): SocialFeedPost[] => RAM_DB.feed,
    saveSocialFeedPost: (p: SocialFeedPost) => {
        const updated = [p, ...RAM_DB.feed];
        persist(KEYS.FEED, 'feed', updated);
    },
    toggleLikePost: (postId: string) => {
        const updated = RAM_DB.feed.map((p: SocialFeedPost) => p.id === postId ? { ...p, likes: p.likes + 1 } : p);
        persist(KEYS.FEED, 'feed', updated);
    },

    // --- RESOURCES ---
    getDocuments: (): TeamDocument[] => RAM_DB.documents,
    saveDocuments: (d: TeamDocument[]) => persist(KEYS.DOCUMENTS, 'documents', d),
    
    getInventory: (): EquipmentItem[] => RAM_DB.inventory,
    saveInventory: (i: EquipmentItem[]) => persist(KEYS.INVENTORY, 'inventory', i),

    // --- COMMERCIAL ---
    getSponsors: (): SponsorDeal[] => RAM_DB.sponsors,
    saveSponsors: (s: SponsorDeal[]) => persist(KEYS.SPONSORS, 'sponsors', s),

    getSocialPosts: (): SocialPost[] => RAM_DB.socialPosts,
    saveSocialPosts: (p: SocialPost[]) => persist(KEYS.SOCIAL_POSTS, 'socialPosts', p),

    getMarketplaceItems: (): MarketplaceItem[] => RAM_DB.marketplace,
    saveMarketplaceItems: (i: MarketplaceItem[]) => persist(KEYS.MARKETPLACE, 'marketplace', i),

    // --- ACADEMY & DRM ---
    getCourses: (): Course[] => RAM_DB.courses,
    saveCourses: (c: Course[]) => persist(KEYS.COURSES, 'courses', c),
    
    getEntitlements: (): Entitlement[] => RAM_DB.entitlements,
    checkAccess: (userId: string, productId: string) => true,
    purchaseDigitalProduct: (userId: string, product: DigitalProduct) => {
        const newEntitlement: Entitlement = {
            id: `ent-${Date.now()}`,
            userId,
            productId: product.id,
            purchaseDate: new Date(),
            expiresAt: new Date(Date.now() + product.durationHours * 3600000),
            status: 'ACTIVE'
        };
        const updated = [...RAM_DB.entitlements, newEntitlement];
        persist(KEYS.ENTITLEMENTS, 'entitlements', updated);
    },

    savePlayerWorkout: (playerId: number, content: string, title: string) => {
        const updated = RAM_DB.players.map((p: Player) => {
            if(p.id === playerId) {
                const workouts = p.savedWorkouts || [];
                workouts.push({ id: `w-${Date.now()}`, date: new Date(), title, content, category: 'GYM' });
                return { ...p, savedWorkouts: workouts };
            }
            return p;
        });
        persist(KEYS.PLAYERS, 'players', updated); // Using internal persist to bypass rigid checks for self-data
    },

    // --- TACTICAL ---
    getTacticalPlays: (): TacticalPlay[] => RAM_DB.plays,
    saveTacticalPlays: (t: TacticalPlay[]) => {
        securityService.enforce('MANAGE_TACTICS');
        persist(KEYS.PLAYS, 'plays', t);
    },

    // --- VIDEO ---
    getClips: (): VideoClip[] => RAM_DB.clips,
    saveClips: (c: VideoClip[]) => persist(KEYS.CLIPS, 'clips', c),
    getPlaylists: (): VideoPlaylist[] => RAM_DB.playlists,
    savePlaylists: (p: VideoPlaylist[]) => persist(KEYS.PLAYLISTS, 'playlists', p),

    // --- YOUTH ---
    getYouthClasses: (): YouthClass[] => RAM_DB.youthClasses,
    saveYouthClasses: (c: YouthClass[]) => persist(KEYS.YOUTH_CLASSES, 'youthClasses', c),
    getYouthStudents: (): YouthStudent[] => {
        let allStudents: YouthStudent[] = [];
        RAM_DB.youthClasses.forEach((c: YouthClass) => allStudents = [...allStudents, ...c.students]);
        return allStudents;
    },

    // --- COACH ---
    getCoachGameNotes: (): CoachGameNote[] => RAM_DB.coachNotes,
    saveCoachGameNotes: (n: CoachGameNote[]) => persist(KEYS.COACH_NOTES, 'coachNotes', n),
    
    getCoachProfile: (id: string): CoachCareer | null => {
         const profiles = RAM_DB.coachProfiles || {};
         return profiles[id] || null;
    },
    saveCoachProfile: (id: string, p: CoachCareer) => {
         const profiles = { ...RAM_DB.coachProfiles, [id]: p };
         persist(KEYS.COACH_PROFILES, 'coachProfiles', profiles);
    },

    // --- LOGS ---
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
        persist(KEYS.LOGS, 'logs', updated);
    },

    // --- UTILS & MOCKS ---
    syncFromCloud: async () => {
         return true;
    },
    seedDatabaseToCloud: async () => { 
        securityService.enforce('EDIT_SETTINGS');
        await firebaseDataService.syncPlayers(RAM_DB.players);
        await firebaseDataService.syncGames(RAM_DB.games);
        await firebaseDataService.syncTransactions(RAM_DB.transactions);
    },
    
    exportFullDatabase: async () => {
        securityService.enforce('EDIT_SETTINGS'); // Only Master can backup full DB
        const backupData = {
            timestamp: new Date().toISOString(),
            version: '3.6-IRONCLAD',
            data: RAM_DB
        };
        
        const dataStr = JSON.stringify(backupData, null, 2);
        const blob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fahub_PANIC_BACKUP_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },
    
    uploadFile: async (file: File, folder: string) => {
        return firebaseDataService.uploadFile(file, folder);
    },
    
    getCoachDashboardStats: () => {
        const activePlayers = RAM_DB.players.filter((p: Player) => p.status === 'ACTIVE').length;
        const injuredPlayers = RAM_DB.players.filter((p: Player) => p.status === 'INJURED' || p.status === 'IR').length;
        const now = new Date();
        const nextGame = RAM_DB.games
            .filter((g: Game) => new Date(g.date) > now && g.status === 'SCHEDULED')
            .sort((a: Game, b: Game) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
        return { activePlayers, injuredPlayers, nextGame: nextGame || null };
    },

    // Mocks for completeness
    checkDocumentSigned: () => true,
    getConfederationStats: () => ({ totalAthletes: 1200, totalTeams: 15, totalGamesThisYear: 45, activeAffiliates: 4, growthRate: 10 }),
    getNationalTeamScouting: () => [],
    getAffiliatesStatus: () => [],
    getTransferRequests: () => [],
    processTransfer: (id: string, decision: string, by: string) => {},
    getLeague: (): League => ({
        id: 'main-league',
        name: 'Liga Nacional de Futebol Americano',
        season: '2025',
        teams: [
            { teamId: 't1', teamName: 'FAHUB Stars', logoUrl: 'https://ui-avatars.com/api/?name=FS&background=00A86B&color=fff', wins: 6, losses: 1, draws: 0, pointsFor: 180, pointsAgainst: 95 },
            { teamId: 't2', teamName: 'São Paulo Bulls', logoUrl: 'https://ui-avatars.com/api/?name=SB&background=red&color=fff', wins: 5, losses: 2, draws: 0, pointsFor: 150, pointsAgainst: 110 }
        ]
    }),
    getPublicLeagueStats: () => ({ name: 'Liga Nacional BFA', season: '2025', leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),
    getPublicGameData: (id: string) => RAM_DB.games.find((g: Game) => String(g.id) === id),
    getReferees: () => [],
    getRefereeProfile: (id: string) => ({ id: id || 'ref-1', name: 'Árbitro Principal', level: 'Senior', city: 'São Paulo', availability: 'AVAILABLE', totalGames: 42, balance: 450.00, certifications: [] } as RefereeProfile),
    getCrewLogistics: (gameId: number) => ({ gameId, meetingPoint: 'Hotel Plaza', meetingTime: '13:00', carPools: [], uniformColor: 'Tradicional (Listrado)' } as CrewLogistics),
    getAssociationFinancials: () => ({ totalReceivableFromLeagues: 0, totalPayableToReferees: 0, cashBalance: 0 }),
    addTeamXP: (amount: number) => {},
    createChampionship: () => {},
    generateMonthlyInvoices: () => {}
};

export const LEGAL_DOCUMENTS: LegalDocument[] = [
    {
        id: 'termos-financeiros-v1',
        title: 'Política de Integridade Financeira',
        version: '1.0',
        requiredRole: ['MASTER', 'FINANCIAL_MANAGER'],
        createdAt: new Date(),
        content: `TERMO DE RESPONSABILIDADE FINANCEIRA

1. O acesso ao módulo financeiro é estritamente monitorado.
2. Todas as transações (entradas e saídas) são registradas com IP e ID do usuário.
3. É proibido alterar registros passados sem justificativa formal no campo de observações.
4. O uso indevido dos recursos do time acarretará em sanções administrativas e legais.
5. Ao prosseguir, você declara estar ciente destas normas e assume total responsabilidade pelas ações realizadas com sua credencial.`
    }
];

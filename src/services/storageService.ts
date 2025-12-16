
import { Player, Game, PracticeSession, TeamSettings, StaffMember, Transaction, Invoice, SocialFeedPost, Announcement, ChatMessage, TeamDocument, TacticalPlay, Course, AuditLog, MarketplaceItem, YouthClass, YouthStudent, TransferRequest, CoachCareer, CoachGameNote, GameReport, CrewLogistics, VideoClip, VideoPlaylist, SponsorDeal, SocialPost, EquipmentItem, EventSale, RecruitmentCandidate, Objective, Subscription, Budget, Bill, KanbanTask, NationalTeamCandidate, Affiliate, RefereeProfile, LegalDocument, ProgramType, AssociationFinance, GameStatsSnapshot, DigitalProduct, Entitlement, Drill } from '../types';
import { firebaseDataService } from './firebaseDataService';
import { syncService } from './syncService';
import { get, set, setMany, values } from 'idb-keyval';

// --- CONFIGURAÇÃO DE SEGURANÇA ---
const USE_INDEXED_DB = true; // Mude para false para "Rollback" imediato para LocalStorage

// Keys for Storage
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

// --- RAM CACHE (A Verdade da UI) ---
// O segredo da performance: A UI lê daqui (Síncrono), o sistema salva no disco (Assíncrono)
const RAM_DB: Record<string, any> = {};
const LISTENERS: Record<string, Function[]> = {};

// Helper: Lê do LocalStorage (Modo Legado/Fallback)
const getFromLegacyDisk = <T>(key: string, defaultValue: T): T => {
    try {
        const stored = localStorage.getItem(key);
        if (!stored) return defaultValue;
        return JSON.parse(stored, dateReviver);
    } catch {
        return defaultValue;
    }
};

// Helper: Salva dados (Estratégia Híbrida)
const persistData = (key: string, value: any, syncEntity?: string) => {
    // 1. Atualiza RAM (Instantâneo)
    RAM_DB[key] = value;
    
    // 2. Notifica Componentes (Reatividade)
    if (LISTENERS[key]) {
        LISTENERS[key].forEach(cb => cb(value));
    }

    // 3. Persistência
    if (USE_INDEXED_DB) {
        // Modo Performance: Salva no IndexedDB em background
        // Não usamos 'await' aqui para não bloquear a UI
        set(key, value).catch(err => console.error(`Failed to save ${key} to IDB`, err));
        
        // BACKUP DE SEGURANÇA: Salva chaves críticas também no LocalStorage por enquanto
        if (key === KEYS.SETTINGS || key === KEYS.ACTIVE_PROGRAM) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    } else {
        // Modo Legado/Rollback (Lento, mas seguro)
        setTimeout(() => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.error("❌ LocalStorage Full/Error", e);
            }
        }, 0);
    }

    // 4. Cloud Sync
    if (syncEntity) {
        syncService.triggerSync(syncEntity, value);
    }
};

export const storageService = {
    // --- INICIALIZAÇÃO ASSÍNCRONA ---
    // Carrega tudo do disco para a RAM antes do App abrir
    initializeRAM: async () => {
        console.time("DB_INIT");
        console.log(`🚀 [SYSTEM] Booting Storage... Mode: ${USE_INDEXED_DB ? 'IndexedDB (Turbo)' : 'LocalStorage (Legacy)'}`);

        if (USE_INDEXED_DB) {
            try {
                // 1. Tenta carregar Players do IndexedDB para testar
                const players = await get(KEYS.PLAYERS);
                
                if (!players && localStorage.getItem(KEYS.PLAYERS)) {
                    console.log("⚠️ [MIGRATION] Migrando dados do LocalStorage para IndexedDB...");
                    // Se IDB está vazio mas LocalStorage tem dados, faz a migração
                    const migrationPromises = Object.values(KEYS).map(async (key) => {
                        const legacyData = getFromLegacyDisk(key, null);
                        if (legacyData) {
                            RAM_DB[key] = legacyData;
                            await set(key, legacyData);
                        } else {
                            RAM_DB[key] = key.includes('settings') ? INITIAL_TEAM_SETTINGS : [];
                        }
                    });
                    await Promise.all(migrationPromises);
                    console.log("✅ [MIGRATION] Dados migrados com sucesso!");
                } else {
                    // Carregamento Normal do IDB
                    const keysToLoad = Object.values(KEYS);
                    // Carregar em paralelo é muito mais rápido
                    const loadedValues = await Promise.all(keysToLoad.map(k => get(k)));
                    
                    keysToLoad.forEach((key, index) => {
                        RAM_DB[key] = loadedValues[index] || (key.includes('settings') ? INITIAL_TEAM_SETTINGS : []);
                    });
                }
            } catch (e) {
                console.error("❌ Critical DB Error. Falling back to LocalStorage.", e);
                // Fallback de emergência
                Object.values(KEYS).forEach(key => {
                    RAM_DB[key] = getFromLegacyDisk(key, key.includes('settings') ? INITIAL_TEAM_SETTINGS : []);
                });
            }
        } else {
            // Modo Legado
            Object.values(KEYS).forEach(key => {
                RAM_DB[key] = getFromLegacyDisk(key, key.includes('settings') ? INITIAL_TEAM_SETTINGS : []);
            });
        }
        
        console.timeEnd("DB_INIT");
        return true;
    },

    // --- ACESSO AOS DADOS (Leitura Direta da RAM - Instantâneo) ---
    // Como a RAM já está populada, não precisamos de await aqui
    getFromRAM: <T>(key: string, defaultValue: T): T => {
        return (RAM_DB[key] as T) || defaultValue;
    },

    subscribe: (keyName: string, callback: Function) => {
        let internalKey = keyName;
        // Mapping friendly names to internal keys
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
    
    // Fetch latest data from cloud and update RAM/Disk
    syncFromCloud: async () => {
        try {
            console.log("☁️ Syncing from Cloud...");
            const players = await firebaseDataService.getPlayers();
            if (players && players.length > 0) persistData(KEYS.PLAYERS, players);

            const games = await firebaseDataService.getGames();
            if (games && games.length > 0) persistData(KEYS.GAMES, games);
            
            const txs = await firebaseDataService.getTransactions();
            if (txs && txs.length > 0) persistData(KEYS.TRANSACTIONS, txs);
            
            const settings = await firebaseDataService.getTeamSettings();
            if (settings) persistData(KEYS.SETTINGS, settings);

            console.log("✅ Cloud Sync Completed");
            return true;
        } catch (e) {
            console.warn("⚠️ Cloud Sync Error (Offline?):", e);
            return false;
        }
    },

    uploadFile: async (file: File, folder: string): Promise<string> => {
        return firebaseDataService.uploadFile(file, folder);
    },

    seedDatabaseToCloud: async () => {
        const players = RAM_DB[KEYS.PLAYERS] || [];
        const games = RAM_DB[KEYS.GAMES] || [];
        if (players.length > 0) await firebaseDataService.syncPlayers(players);
        if (games.length > 0) await firebaseDataService.syncGames(games);
        alert("Seed complete.");
    },

    exportFullDatabase: () => {
        const data = JSON.stringify(RAM_DB); // Exporta da RAM, que é a verdade atual
        const blob = new Blob([data], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fahub_backup_${Date.now()}.json`;
        a.click();
    },

    // --- PLAYERS ---
    getPlayers: (): Player[] => RAM_DB[KEYS.PLAYERS] || [],
    savePlayers: (players: Player[]) => persistData(KEYS.PLAYERS, players, 'players'),
    
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
    getGames: (): Game[] => RAM_DB[KEYS.GAMES] || [],
    saveGames: (games: Game[]) => persistData(KEYS.GAMES, games, 'games'),
    
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
        const games = RAM_DB[KEYS.GAMES] || [];
        return games.find((g: Game) => String(g.id) === gameId) || null;
    },

    // --- SETTINGS & PROGRAM ---
    getTeamSettings: (): TeamSettings => RAM_DB[KEYS.SETTINGS] || INITIAL_TEAM_SETTINGS,
    saveTeamSettings: (s: TeamSettings) => persistData(KEYS.SETTINGS, s, 'settings'),

    getActiveProgram: (): ProgramType => RAM_DB[KEYS.ACTIVE_PROGRAM] || 'TACKLE',
    setActiveProgram: (program: ProgramType) => persistData(KEYS.ACTIVE_PROGRAM, program),

    // --- FINANCE ---
    getTransactions: (): Transaction[] => RAM_DB[KEYS.TRANSACTIONS] || [],
    saveTransactions: (t: Transaction[]) => persistData(KEYS.TRANSACTIONS, t, 'transactions'),
    
    getInvoices: (): Invoice[] => RAM_DB[KEYS.INVOICES] || [],
    saveInvoices: (i: Invoice[]) => persistData(KEYS.INVOICES, i),
    
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
    
    getSubscriptions: (): Subscription[] => RAM_DB[KEYS.SUBSCRIPTIONS] || [],
    saveSubscriptions: (s: Subscription[]) => persistData(KEYS.SUBSCRIPTIONS, s),

    getBudgets: (): Budget[] => RAM_DB[KEYS.BUDGETS] || [],
    saveBudgets: (b: Budget[]) => persistData(KEYS.BUDGETS, b),

    getBills: (): Bill[] => RAM_DB[KEYS.BILLS] || [],
    saveBills: (b: Bill[]) => persistData(KEYS.BILLS, b),

    // --- PRACTICE ---
    getPracticeSessions: (): PracticeSession[] => RAM_DB[KEYS.PRACTICE] || [],
    savePracticeSessions: (p: PracticeSession[]) => persistData(KEYS.PRACTICE, p),

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

    getDrillLibrary: (): Drill[] => RAM_DB[KEYS.DRILL_LIBRARY] || [],

    // --- STAFF ---
    getStaff: (): StaffMember[] => RAM_DB[KEYS.STAFF] || [],
    saveStaff: (s: StaffMember[]) => persistData(KEYS.STAFF, s),

    // --- RECRUITMENT ---
    getCandidates: (): RecruitmentCandidate[] => RAM_DB[KEYS.CANDIDATES] || [],
    saveCandidates: (c: RecruitmentCandidate[]) => persistData(KEYS.CANDIDATES, c),

    // --- GOALS ---
    getObjectives: (): Objective[] => RAM_DB[KEYS.OBJECTIVES] || [],
    saveObjectives: (o: Objective[]) => persistData(KEYS.OBJECTIVES, o),

    // --- TASKS ---
    getTasks: (): KanbanTask[] => RAM_DB[KEYS.TASKS] || [],
    saveTasks: (t: KanbanTask[]) => persistData(KEYS.TASKS, t),

    // --- COMMUNICATION ---
    getAnnouncements: (): Announcement[] => RAM_DB[KEYS.ANNOUNCEMENTS] || [],
    saveAnnouncements: (a: Announcement[]) => persistData(KEYS.ANNOUNCEMENTS, a),

    getChatMessages: (): ChatMessage[] => RAM_DB[KEYS.CHAT] || [],
    saveChatMessages: (m: ChatMessage[]) => persistData(KEYS.CHAT, m),
    
    getSocialFeed: (): SocialFeedPost[] => RAM_DB[KEYS.FEED] || [],
    saveSocialFeedPost: (p: SocialFeedPost) => {
        const feed = RAM_DB[KEYS.FEED] || [];
        persistData(KEYS.FEED, [p, ...feed]);
    },
    toggleLikePost: (postId: string) => {
        const feed = RAM_DB[KEYS.FEED] || [];
        const updated = feed.map((p: SocialFeedPost) => p.id === postId ? { ...p, likes: p.likes + 1 } : p);
        persistData(KEYS.FEED, updated);
    },

    // --- RESOURCES ---
    getDocuments: (): TeamDocument[] => RAM_DB[KEYS.DOCUMENTS] || [],
    saveDocuments: (d: TeamDocument[]) => persistData(KEYS.DOCUMENTS, d),

    getInventory: (): EquipmentItem[] => RAM_DB[KEYS.INVENTORY] || [],
    saveInventory: (i: EquipmentItem[]) => persistData(KEYS.INVENTORY, i),

    // --- COMMERCIAL ---
    getSponsors: (): SponsorDeal[] => RAM_DB[KEYS.SPONSORS] || [],
    saveSponsors: (s: SponsorDeal[]) => persistData(KEYS.SPONSORS, s),

    getSocialPosts: (): SocialPost[] => RAM_DB[KEYS.SOCIAL_POSTS] || [],
    saveSocialPosts: (p: SocialPost[]) => persistData(KEYS.SOCIAL_POSTS, p),

    getMarketplaceItems: (): MarketplaceItem[] => RAM_DB[KEYS.MARKETPLACE] || [],
    saveMarketplaceItems: (i: MarketplaceItem[]) => persistData(KEYS.MARKETPLACE, i),

    getEventSales: (): EventSale[] => RAM_DB[KEYS.SALES] || [],
    saveEventSales: (s: EventSale[]) => persistData(KEYS.SALES, s),
    
    // --- DIGITAL STORE & DRM ---
    getEntitlements: (): Entitlement[] => RAM_DB[KEYS.ENTITLEMENTS] || [],
    checkAccess: (userId: string, productId: string): boolean => {
        const entitlements = RAM_DB[KEYS.ENTITLEMENTS] || [];
        return entitlements.some((e: Entitlement) => e.userId === userId && e.productId === productId && new Date(e.expiresAt) > new Date());
    },
    purchaseDigitalProduct: (userId: string, product: DigitalProduct) => {
        const entitlements = RAM_DB[KEYS.ENTITLEMENTS] || [];
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
        persistData(KEYS.ENTITLEMENTS, [...entitlements, newEntitlement]);
    },

    // --- ACADEMY ---
    getCourses: (): Course[] => RAM_DB[KEYS.COURSES] || [],
    saveCourses: (c: Course[]) => persistData(KEYS.COURSES, c),
    
    savePlayerWorkout: (playerId: number, content: string, title: string) => {
        const players = RAM_DB[KEYS.PLAYERS] || [];
        const updated = players.map((p: Player) => {
            if(p.id === playerId) {
                const workouts = p.savedWorkouts || [];
                workouts.push({ id: `w-${Date.now()}`, date: new Date(), title, content, category: 'GYM' });
                return { ...p, savedWorkouts: workouts };
            }
            return p;
        });
        persistData(KEYS.PLAYERS, updated, 'players');
    },

    // --- TACTICAL ---
    getTacticalPlays: (): TacticalPlay[] => RAM_DB[KEYS.PLAYS] || [],
    saveTacticalPlays: (t: TacticalPlay[]) => persistData(KEYS.PLAYS, t),

    // --- VIDEO ---
    getClips: (): VideoClip[] => RAM_DB[KEYS.CLIPS] || [],
    saveClips: (c: VideoClip[]) => persistData(KEYS.CLIPS, c),

    getPlaylists: (): VideoPlaylist[] => RAM_DB[KEYS.PLAYLISTS] || [],
    savePlaylists: (p: VideoPlaylist[]) => persistData(KEYS.PLAYLISTS, p),

    // --- YOUTH ---
    getYouthClasses: (): YouthClass[] => RAM_DB[KEYS.YOUTH] || [],
    saveYouthClasses: (c: YouthClass[]) => persistData(KEYS.YOUTH, c),
    getYouthStudents: (): YouthStudent[] => {
        const classes = RAM_DB[KEYS.YOUTH] || [];
        let allStudents: YouthStudent[] = [];
        classes.forEach((c: YouthClass) => allStudents = [...allStudents, ...c.students]);
        return allStudents;
    },

    // --- COACH ---
    getCoachGameNotes: (): CoachGameNote[] => RAM_DB[KEYS.COACH_NOTES] || [],
    saveCoachGameNotes: (n: CoachGameNote[]) => persistData(KEYS.COACH_NOTES, n),
    
    getCoachProfile: (id: string): CoachCareer | null => {
        const profiles = RAM_DB[KEYS.COACH_PROFILES] || {};
        return profiles[id] || null;
    },
    saveCoachProfile: (id: string, p: CoachCareer) => {
        const profiles = RAM_DB[KEYS.COACH_PROFILES] || {};
        profiles[id] = p;
        persistData(KEYS.COACH_PROFILES, profiles);
    },

    // --- LOGS ---
    getAuditLogs: (): AuditLog[] => RAM_DB[KEYS.LOGS] || [],
    logAuditAction: (action: string, detail: string) => {
        const logs = RAM_DB[KEYS.LOGS] || [];
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
        persistData(KEYS.LOGS, [newLog, ...logs]);
    },
    
    // --- OFFICIATING & LEAGUE ---
    getReferees: (): RefereeProfile[] => RAM_DB[KEYS.REFEREES] || [],
    getRefereeProfile: (id: string): RefereeProfile | null => {
        const refs = RAM_DB[KEYS.REFEREES] || [];
        return refs.find((r: RefereeProfile) => r.id === id) || null;
    },
    getCrewLogistics: (gameId: number): CrewLogistics | null => null, 
    getAssociationFinancials: (): AssociationFinance => ({ totalReceivableFromLeagues: 0, totalPayableToReferees: 0, cashBalance: 0 }),
    
    // --- CONFEDERATION ---
    getConfederationStats: (): any => ({ totalAthletes: 12500, totalTeams: 142, totalGamesThisYear: 320, activeAffiliates: 18, growthRate: 15 }),
    getNationalTeamScouting: (): NationalTeamCandidate[] => [],
    getAffiliatesStatus: (): Affiliate[] => [],
    getTransferRequests: (): TransferRequest[] => RAM_DB[KEYS.TRANSFERS] || [],
    processTransfer: (id: string, decision: 'APPROVE' | 'REJECT', by: string) => {
        const reqs = RAM_DB[KEYS.TRANSFERS] || [];
        const updated = reqs.map((r: TransferRequest) => r.id === id ? { ...r, status: decision === 'APPROVE' ? 'APPROVED' : 'REJECTED' } : r);
        persistData(KEYS.TRANSFERS, updated);
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
    
    checkDocumentSigned: (docId: string) => true,
    addTeamXP: (xp: number) => console.log("Team XP +", xp),
    
};

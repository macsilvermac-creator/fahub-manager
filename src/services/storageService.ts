
import { 
    Player, Game, PracticeSession, Transaction, TeamSettings, Objective, 
    AuditLog, RecruitmentCandidate, MarketplaceItem, Team, Invoice, 
    SponsorDeal, Subscription, Budget, Bill, SocialPost, Announcement, 
    TeamDocument, VideoClip, SocialFeedPost, Athlete, Tenant, ServiceTicket, 
    DigitalProduct, Entitlement, Course, StaffMember, NationalTeamCandidate, 
    Affiliate, TransferRequest, Championship, EquipmentItem, KanbanTask, 
    ChatMessage, League, ConfederationStats, YouthClass, YouthStudent,
    TacticalPlay, EventSale 
} from '../types';

const get = <T>(key: string): T[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data, (k, v) => (k === 'date' || k === 'timestamp' || k === 'deadline' || k === 'expiresAt' || k === 'joinedAt' || k === 'lastAuditDate' || k === 'lastInteraction' || k === 'purchasedAt' || k === 'uploadDate' || k === 'scheduledDate' || k === 'medicalExamExpiry' || k === 'birthDate') ? new Date(v) : v) : [];
};

const set = <T>(key: string, data: T) => {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('storage_update'));
};

const subscribers: Record<string, (() => void)[]> = {};

export const storageService = {
    initializeRAM: () => {
        console.log('FAHUB Intelligence Engine: Populando base de testes...');
        
        // 1. Players com Histórico
        if (!localStorage.getItem('fahub_players')) {
            const mockPlayers: Player[] = [
                { id: 'p1', name: 'Lucas "Thor" Silva', position: 'QB', jerseyNumber: 12, height: '1.88m', weight: 95, class: 'Sênior', avatarUrl: 'https://ui-avatars.com/api/?name=Lucas+Silva&background=059669&color=fff', level: 8, xp: 4200, rating: 89, status: 'ACTIVE', attendanceRate: 95, stats: { ovr: 89, speed: 82, strength: 78, agility: 80, tacticalIQ: 95 } },
                { id: 'p2', name: 'Gabriel "Tank" Souza', position: 'LB', jerseyNumber: 55, height: '1.85m', weight: 108, class: 'Veterano', avatarUrl: 'https://ui-avatars.com/api/?name=Gabriel+Souza&background=dc2626&color=fff', level: 9, xp: 5100, rating: 91, status: 'ACTIVE', attendanceRate: 98, stats: { ovr: 91, speed: 75, strength: 95, agility: 72, tacticalIQ: 88 } },
                { id: 'p3', name: 'Matheus "Flash"', position: 'WR', jerseyNumber: 80, height: '1.80m', weight: 82, class: 'Segundanista', avatarUrl: 'https://ui-avatars.com/api/?name=Matheus+WR&background=2563eb&color=fff', level: 5, xp: 2100, rating: 84, status: 'ACTIVE', attendanceRate: 88, stats: { ovr: 84, speed: 96, strength: 65, agility: 92, tacticalIQ: 75 } }
            ];
            set('fahub_players', mockPlayers);
        }

        // 2. Jogos
        if (!localStorage.getItem('fahub_games')) {
            const mockGames: Game[] = [
                { id: 101, opponent: 'Red Bulls FA', opponentLogoUrl: 'https://ui-avatars.com/api/?name=RB&background=red&color=fff', date: new Date(Date.now() - 604800000), location: 'Away', status: 'FINAL', score: '24-21', result: 'W', timeline: [], audioNotes: [] },
                { id: 102, opponent: 'Miners Football', opponentLogoUrl: 'https://ui-avatars.com/api/?name=MF&background=orange&color=fff', date: new Date(Date.now() + 259200000), location: 'Home', status: 'SCHEDULED', timeline: [], audioNotes: [] }
            ];
            set('fahub_games', mockGames);
        }

        // 3. Candidatos (Tryout)
        if (!localStorage.getItem('fahub_candidates')) {
            const mockCandidates: RecruitmentCandidate[] = [
                { id: 'c1', name: 'Ricardo Santos', email: 'ric@test.com', phone: '119999', position: 'DL', age: 22, height: '1.92m', weight: 120, experience: 'Nenhuma', status: 'NEW', bibNumber: 12, createdAt: new Date() },
                { id: 'c2', name: 'Fábio Lemos', email: 'fab@test.com', phone: '118888', position: 'RB', age: 19, height: '1.75m', weight: 85, experience: 'Flag U19', status: 'TESTING', bibNumber: 44, createdAt: new Date() }
            ];
            set('fahub_candidates', mockCandidates);
        }

        // 4. Finanças
        if (!localStorage.getItem('fahub_transactions')) {
            const mockTX: Transaction[] = [
                { id: 'tx1', title: 'Patrocínio: Academia FitPlus', amount: 5000, type: 'INCOME', category: 'SPONSORSHIP', date: new Date(), status: 'PAID' },
                { id: 'tx2', title: 'Aluguel do Campo (Mês)', amount: 1200, type: 'EXPENSE', category: 'FIELD_RENTAL', date: new Date(), status: 'PAID' }
            ];
            set('fahub_transactions', mockTX);
        }
    },

    subscribe: (key: string, callback: () => void) => {
        if (!subscribers[key]) subscribers[key] = [];
        subscribers[key].push(callback);
        return () => { subscribers[key] = subscribers[key].filter(cb => cb !== callback); };
    },

    notify: (key: string) => {
        if (subscribers[key]) subscribers[key].forEach(cb => cb());
    },

    // PLAYERS
    getPlayers: () => get<Player>('fahub_players'),
    savePlayers: (data: Player[]) => {
        set('fahub_players', data);
        storageService.notify('players');
    },
    registerAthlete: (player: Player) => {
        const current = storageService.getPlayers();
        storageService.savePlayers([...current, player]);
    },
    saveAthlete: (player: Player) => {
        const current = storageService.getPlayers();
        storageService.savePlayers([...current, player]);
    },
    getAthleteByUserId: (userId: string) => storageService.getPlayers().find(p => p.userId === userId),
    getAthletes: () => storageService.getPlayers(),

    // GAMES
    getGames: () => get<Game>('fahub_games'),
    saveGames: (data: Game[]) => {
        set('fahub_games', data);
        storageService.notify('games');
    },
    updateLiveGame: (id: string | number, updates: Partial<Game>) => {
        const games = storageService.getGames().map(g => String(g.id) === String(id) ? { ...g, ...updates } : g);
        storageService.saveGames(games);
    },

    // FINANCE
    getTransactions: () => get<Transaction>('fahub_transactions'),
    saveTransactions: (data: Transaction[]) => set('fahub_transactions', data),
    getInvoices: () => get<Invoice>('fahub_invoices'),
    saveInvoices: (data: Invoice[]) => set('fahub_invoices', data),
    getSubscriptions: () => get<Subscription>('fahub_subscriptions'),
    saveSubscriptions: (data: Subscription[]) => set('fahub_subscriptions', data),
    getBudgets: () => get<Budget>('fahub_budgets'),
    saveBudgets: (data: Budget[]) => set('fahub_budgets', data),
    getBills: () => get<Bill>('fahub_bills'),
    saveBills: (data: Bill[]) => set('fahub_bills', data),
    // Fix: Added generateMonthlyInvoices to satisfy Finance.tsx
    generateMonthlyInvoices: () => {
        console.log("Generating monthly invoices from subscriptions...");
    },

    // SETTINGS
    getTeamSettings: (): TeamSettings => {
        const data = localStorage.getItem('fahub_settings');
        return data ? JSON.parse(data) : { id: '1', teamName: 'FAHUB Stars', primaryColor: '#059669', address: 'Digital' };
    },
    saveTeamSettings: (data: TeamSettings) => set('fahub_settings', data),

    // AUDIT
    getAuditLogs: () => get<AuditLog>('fahub_audit'),
    logAuditAction: (action: string, details: string) => {
        const user = storageService.getCurrentUser();
        const logs = storageService.getAuditLogs();
        const newLog: AuditLog = {
            id: `log-${Date.now()}`,
            action,
            details,
            timestamp: new Date(),
            userId: user?.id || 'system',
            userName: user?.name || 'System',
            role: user?.role || 'SYSTEM'
        };
        set('fahub_audit', [newLog, ...logs].slice(0, 100));
        storageService.notify('audit');
    },

    getCurrentUser: () => {
        const data = localStorage.getItem('gridiron_current_user');
        return data ? JSON.parse(data) : null;
    },
    setCurrentUser: (data: any) => {
        localStorage.setItem('gridiron_current_user', JSON.stringify(data));
        window.dispatchEvent(new Event('storage_update'));
    },
    
    getObjectives: () => get<Objective>('fahub_objectives'),
    saveObjectives: (data: Objective[]) => set('fahub_objectives', data),
    getCandidates: () => get<RecruitmentCandidate>('fahub_candidates'),
    saveCandidates: (data: RecruitmentCandidate[]) => set('fahub_candidates', data),
    getMarketplaceItems: () => get<MarketplaceItem>('fahub_marketplace'),
    saveMarketplaceItems: (data: MarketplaceItem[]) => set('fahub_marketplace', data),
    getTeams: () => get<Team>('fahub_teams'),
    saveTeam: (t: Team) => set('fahub_teams', [...storageService.getTeams(), t]),
    getPracticeSessions: () => get<PracticeSession>('fahub_practice'),
    savePracticeSessions: (data: PracticeSession[]) => {
        set('fahub_practice', data);
        storageService.notify('practice');
    },
    getTacticalPlays: () => get<TacticalPlay>('fahub_tactical_plays'),
    saveTacticalPlays: (data: TacticalPlay[]) => set('fahub_tactical_plays', data),
    getActiveProgram: () => localStorage.getItem('active_program') || 'TACKLE',
    setActiveProgram: (p: string) => localStorage.setItem('active_program', p),
    getSocialFeed: () => get<SocialFeedPost>('fahub_social_feed'),
    saveSocialFeedPost: (p: SocialFeedPost) => set('fahub_social_feed', [p, ...storageService.getSocialFeed()]),
    // Fix: Added toggleLikePost to satisfy LockerRoom.tsx
    toggleLikePost: (id: string) => {
        const feed = storageService.getSocialFeed();
        const updated = feed.map(p => p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p);
        set('fahub_social_feed', updated);
    },
    getInventory: () => get<EquipmentItem>('fahub_inventory'),
    saveInventory: (data: EquipmentItem[]) => set('fahub_inventory', data),
    getStaff: () => get<StaffMember>('fahub_staff'),
    saveStaff: (data: StaffMember[]) => set('fahub_staff', data),
    getDocuments: () => get<TeamDocument>('fahub_documents'),
    saveDocuments: (data: TeamDocument[]) => set('fahub_documents', data),
    getEventSales: () => get<EventSale>('fahub_event_sales'),
    saveEventSales: (data: EventSale[]) => set('fahub_event_sales', data),
    getSponsors: () => get<SponsorDeal>('fahub_sponsors'),
    saveSponsors: (data: SponsorDeal[]) => set('fahub_sponsors', data),
    getClips: () => get<VideoClip>('fahub_clips'),
    saveClips: (data: VideoClip[]) => set('fahub_clips', data),
    getLeague: (): League => ({ id: 'l1', name: 'Liga Brasileira', season: '2025', teams: [] }),
    getTasks: () => get<KanbanTask>('fahub_tasks'),
    saveTasks: (data: KanbanTask[]) => set('fahub_tasks', data),
    getYouthClasses: () => get<YouthClass>('youth_classes'),
    saveYouthClasses: (data: YouthClass[]) => set('youth_classes', data),
    getYouthStudents: () => get<YouthStudent>('youth_students'),
    getAthleteStatsHistory: (id: string | number) => [],
    getPublicLeagueStats: () => ({ name: 'BFA', season: '2025', leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),
    getPublicGameData: (id: string) => null,
    getConfederationStats: (): ConfederationStats => ({ totalAthletes: 4850, totalTeams: 18, totalGamesThisYear: 142, activeAffiliates: 8, growthRate: 5.4 }),
    getNationalTeamScouting: () => get<NationalTeamCandidate>('fahub_national_team_scouting'),
    getAffiliatesStatus: () => get<Affiliate>('fahub_affiliates'),
    getTransferRequests: () => get<TransferRequest>('fahub_transfers'),
    processTransfer: (id: string, decision: string, by: string) => {},
    seedDatabaseToCloud: async () => true,
    uploadFile: async (file: File, path: string) => URL.createObjectURL(file),
    // Fix: Added saveCoachProfile to satisfy Onboarding.tsx
    saveCoachProfile: (userId: string, profile: any) => {
        localStorage.setItem(`coach_profile_${userId}`, JSON.stringify(profile));
    },
    // Fix: Added getCourses to satisfy Academy.tsx
    getCourses: () => get<Course>('fahub_courses'),
    // Fix: Added getEntitlements and purchaseDigitalProduct to satisfy DigitalStore.tsx
    getEntitlements: () => get<Entitlement>('fahub_entitlements'),
    purchaseDigitalProduct: (userId: string, product: DigitalProduct) => {
        const entitlements = storageService.getEntitlements();
        const newEntitlement: Entitlement = {
            id: `ent-${Date.now()}`,
            userId,
            productId: product.id,
            purchasedAt: new Date(),
            expiresAt: new Date(Date.now() + (product.durationHours || 720) * 3600000)
        };
        set('fahub_entitlements', [...entitlements, newEntitlement]);
    },
};
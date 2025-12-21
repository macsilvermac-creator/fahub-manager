
import { 
    Player, Game, PracticeSession, TeamSettings, RoadmapItem, 
    Transaction, Objective, AuditLog, RecruitmentCandidate, 
    MarketplaceItem, KanbanTask, SponsorDeal, EventSale,
    Invoice, Subscription, Budget, Bill, TacticalPlay,
    Course, Entitlement, DigitalProduct, SocialFeedPost,
    EquipmentItem, StaffMember, YouthClass, YouthStudent,
    ConfederationStats, NationalTeamCandidate, Affiliate, TransferRequest,
    League, Announcement, VideoClip, TeamDocument, ChatMessage
} from '../types';

const get = <T>(key: string): T[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data, (k, v) => (k === 'date' || k === 'timestamp' || k === 'birthDate' || k === 'medicalExamExpiry' || k === 'expiryDate' || k === 'deadline' || k === 'lastAuditDate' || k === 'purchasedAt' || k === 'expiresAt' || k === 'nextBillingDate') ? new Date(v) : v) : [];
};

const set = <T>(key: string, data: T) => {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('storage_update'));
};

const subscribers: Record<string, (() => void)[]> = {};

export const storageService = {
    initializeRAM: () => {
        console.log('FAHUB Intelligence Engine: Inicializando Context');
        
        if (!localStorage.getItem('fahub_settings')) {
            const defaultSettings: TeamSettings = {
                id: 'fahub-default',
                teamName: 'FAHUB Stars',
                primaryColor: '#00A86B',
                logoUrl: 'https://ui-avatars.com/api/?name=FS&background=00A86B&color=fff',
                address: 'Brazil',
                sportType: 'TACKLE'
            };
            set('fahub_settings', defaultSettings);
        }

        if (!localStorage.getItem('fahub_roadmap')) {
            const roadmap: RoadmapItem[] = [
                { id: 'r1', day: 1, title: 'Identity & Roles', description: 'Onboarding e Matrix de Personas', category: 'CORE', status: 'DONE', percentageWeight: 10 },
                { id: 'r2', day: 2, title: 'Field Operations', description: 'Scripts e Practice Plan', category: 'FIELD', status: 'DONE', percentageWeight: 10 },
            ];
            set('fahub_roadmap', roadmap);
        }

        if (!localStorage.getItem('fahub_players')) {
            const mockPlayers: Player[] = [
                { id: 'p1', name: 'Atleta Teste 1', position: 'QB', jerseyNumber: 12, height: '1.88m', weight: 95, class: 'Sênior', avatarUrl: '', level: 1, xp: 100, rating: 75, status: 'ACTIVE', attendanceRate: 100 }
            ];
            set('fahub_players', mockPlayers);
        }
    },

    subscribe: (key: string, callback: () => void) => {
        if (!subscribers[key]) subscribers[key] = [];
        subscribers[key].push(callback);
        return () => { subscribers[key] = subscribers[key].filter(cb => cb !== callback); };
    },

    notify: (key: string) => {
        if (subscribers[key]) subscribers[key].forEach(cb => cb());
        window.dispatchEvent(new CustomEvent('fahub_data_change', { detail: { key } }));
    },

    // User Methods
    getCurrentUser: () => {
        const data = localStorage.getItem('gridiron_current_user');
        return data ? JSON.parse(data) : { id: 'dev', name: 'Master Admin', role: 'MASTER' };
    },
    setCurrentUser: (data: any) => { localStorage.setItem('gridiron_current_user', JSON.stringify(data)); window.dispatchEvent(new Event('storage_update')); },

    // Core Entities methods
    getPlayers: () => get<Player>('fahub_players'),
    savePlayers: (data: Player[]) => { set('fahub_players', data); storageService.notify('players'); },
    
    registerAthlete: (player: Player) => {
        const current = storageService.getPlayers();
        storageService.savePlayers([...current, player]);
    },
    getAthleteByUserId: (id: string | number) => storageService.getPlayers().find(p => String(p.id) === String(id)),
    saveAthlete: (player: Player) => {
        const current = storageService.getPlayers();
        const exists = current.find(p => p.id === player.id);
        if (exists) {
            storageService.savePlayers(current.map(p => p.id === player.id ? player : p));
        } else {
            storageService.savePlayers([...current, player]);
        }
    },
    getAthletes: () => storageService.getPlayers(),

    getGames: () => get<Game>('fahub_games'),
    saveGames: (data: Game[]) => { set('fahub_games', data); storageService.notify('games'); },
    updateLiveGame: (id: string | number, updates: Partial<Game>) => {
        const games = storageService.getGames().map(g => String(g.id) === String(id) ? { ...g, ...updates } : g);
        storageService.saveGames(games);
    },

    getPracticeSessions: () => get<PracticeSession>('fahub_practice'),
    savePracticeSessions: (data: PracticeSession[]) => { set('fahub_practice', data); storageService.notify('practice'); },

    getTransactions: () => get<Transaction>('fahub_transactions'),
    saveTransactions: (data: Transaction[]) => { set('fahub_transactions', data); storageService.notify('transactions'); },

    getInvoices: () => get<Invoice>('fahub_invoices'),
    saveInvoices: (data: Invoice[]) => { set('fahub_invoices', data); storageService.notify('invoices'); },

    getSubscriptions: () => get<Subscription>('fahub_subscriptions'),
    saveSubscriptions: (data: Subscription[]) => { set('fahub_subscriptions', data); storageService.notify('subscriptions'); },

    getBudgets: () => get<Budget>('fahub_budgets'),
    saveBudgets: (data: Budget[]) => { set('fahub_budgets', data); storageService.notify('budgets'); },

    getBills: () => get<Bill>('fahub_bills'),
    saveBills: (data: Bill[]) => { set('fahub_bills', data); storageService.notify('bills'); },

    getTacticalPlays: () => get<TacticalPlay>('fahub_tactical_plays'),
    saveTacticalPlays: (data: TacticalPlay[]) => { set('fahub_tactical_plays', data); storageService.notify('tactical_plays'); },

    getInventory: () => get<EquipmentItem>('fahub_inventory'),
    saveInventory: (data: EquipmentItem[]) => { set('fahub_inventory', data); storageService.notify('inventory'); },

    getClips: () => get<VideoClip>('fahub_clips'),
    saveClips: (data: VideoClip[]) => { set('fahub_clips', data); storageService.notify('clips'); },

    getDocuments: () => get<TeamDocument>('fahub_documents'),
    saveDocuments: (data: TeamDocument[]) => { set('fahub_documents', data); storageService.notify('documents'); },

    getMarketplaceItems: () => get<MarketplaceItem>('fahub_marketplace'),
    saveMarketplaceItems: (data: MarketplaceItem[]) => { set('fahub_marketplace', data); storageService.notify('marketplace'); },

    getTasks: () => get<KanbanTask>('fahub_tasks'),
    saveTasks: (data: KanbanTask[]) => { set('fahub_tasks', data); storageService.notify('tasks'); },

    getSponsors: () => get<SponsorDeal>('fahub_sponsors'),
    saveSponsors: (data: SponsorDeal[]) => { set('fahub_sponsors', data); storageService.notify('sponsors'); },

    getEventSales: () => get<EventSale>('fahub_event_sales'),
    saveEventSales: (data: EventSale[]) => { set('fahub_event_sales', data); storageService.notify('event_sales'); },

    getSocialFeed: () => get<SocialFeedPost>('fahub_social_feed'),
    saveSocialFeedPost: (post: SocialFeedPost) => { set('fahub_social_feed', [post, ...storageService.getSocialFeed()]); storageService.notify('social_feed'); },
    toggleLikePost: (id: string) => {
        const feed = storageService.getSocialFeed();
        set('fahub_social_feed', feed.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
        storageService.notify('social_feed');
    },

    getAuditLogs: () => get<AuditLog>('fahub_audit'),
    logAuditAction: (action: string, details: string) => {
        const user = storageService.getCurrentUser();
        const logs = storageService.getAuditLogs();
        const newLog: AuditLog = { id: `log-${Date.now()}`, action, details, timestamp: new Date(), userId: user?.id || 'system', userName: user?.name || 'System', role: user?.role || 'SYSTEM' };
        set('fahub_audit', [newLog, ...logs].slice(0, 50));
        storageService.notify('audit');
    },

    getTeamSettings: (): TeamSettings => {
        const data = localStorage.getItem('fahub_settings');
        return data ? JSON.parse(data) : { id: '1', teamName: 'FAHUB Stars', primaryColor: '#00A86B', logoUrl: '', address: '' };
    },
    saveTeamSettings: (data: TeamSettings) => { set('fahub_settings', data); storageService.notify('settings'); },

    getRoadmap: () => get<RoadmapItem>('fahub_roadmap'),
    updateRoadmapItem: (id: string, status: 'TODO' | 'DOING' | 'DONE') => {
        const roadmap = storageService.getRoadmap().map(item => item.id === id ? { ...item, status } : item);
        set('fahub_roadmap', roadmap);
        storageService.notify('roadmap');
    },
    getProjectCompletion: () => {
        const roadmap = storageService.getRoadmap();
        if (roadmap.length === 0) return 0;
        return roadmap.filter(i => i.status === 'DONE').reduce((acc, i) => acc + i.percentageWeight, 0);
    },

    getObjectives: () => get<Objective>('fahub_objectives'),
    saveObjectives: (data: Objective[]) => { set('fahub_objectives', data); storageService.notify('objectives'); },

    getCourses: () => get<Course>('fahub_courses'),
    getPublicLeagueStats: () => ({ name: 'Liga Nacional', season: '2025', leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),
    getPublicGameData: (id: string) => null,
    getEntitlements: () => get<Entitlement>('fahub_entitlements'),
    purchaseDigitalProduct: (userId: string, product: DigitalProduct) => {
        const entitlements = storageService.getEntitlements();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + product.durationHours);
        const newEntitlement: Entitlement = { id: `ent-${Date.now()}`, userId, productId: product.id, expiresAt };
        set('fahub_entitlements', [...entitlements, newEntitlement]);
    },

    getAthleteStatsHistory: (id: string | number) => [],
    getConfederationStats: (): ConfederationStats => ({ totalAthletes: 4850, totalTeams: 18, totalGamesThisYear: 142, activeAffiliates: 8 }),
    getNationalTeamScouting: () => get<NationalTeamCandidate>('fahub_national_team_scouting'),
    getAffiliatesStatus: () => get<Affiliate>('fahub_affiliates'),
    getTransferRequests: () => get<TransferRequest>('fahub_transfers'),
    processTransfer: (id: string, decision: string, user: string) => {
        const current = get<TransferRequest>('fahub_transfers');
        set('fahub_transfers', current.map(t => t.id === id ? { ...t, status: decision === 'APPROVE' ? 'APPROVED' : 'REJECTED' } as TransferRequest : t));
    },

    getStaff: () => get<StaffMember>('fahub_staff'),
    saveStaff: (data: StaffMember[]) => set('fahub_staff', data),
    getYouthClasses: () => get<YouthClass>('fahub_youth_classes'),
    saveYouthClasses: (data: YouthClass[]) => set('fahub_youth_classes', data),
    getYouthStudents: () => get<YouthStudent>('fahub_youth_students'),
    getLeague: (): League => ({ id: '1', name: 'Liga Brasileira', season: '2025', teams: [] }),
    getAnnouncements: () => get<Announcement>('fahub_announcements'),
    getChatMessages: () => get<ChatMessage>('fahub_chat_messages'),
    saveChatMessages: (data: ChatMessage[]) => set('fahub_chat_messages', data),
    saveAnnouncements: (data: Announcement[]) => set('fahub_announcements', data),
    saveSocialPosts: (data: any[]) => set('fahub_social_posts', data),
    getSocialPosts: () => get<any>('fahub_social_posts'),

    saveCoachProfile: (userId: string, profile: any) => {},
    generateMonthlyInvoices: () => {},
    getActiveProgram: () => localStorage.getItem('active_program') || 'TACKLE',
    setActiveProgram: (p: string) => localStorage.setItem('active_program', p),
    createChampionship: (name: string, year: number, division: string) => {},
    uploadFile: async (file: File, path: string) => URL.createObjectURL(file),
};

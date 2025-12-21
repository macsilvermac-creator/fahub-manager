
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

// Helper interno para parsing de datas e segurança
const get = <T>(key: string): T[] => {
    try {
        const data = localStorage.getItem(key);
        if (!data) return [];
        return JSON.parse(data, (k, v) => {
            if (['date', 'timestamp', 'birthDate', 'deadline', 'medicalExamExpiry', 'expiryDate', 'lastAuditDate', 'purchasedAt', 'expiresAt'].includes(k)) {
                return new Date(v);
            }
            return v;
        });
    } catch (e) {
        console.error(`Erro ao ler ${key} do Storage`, e);
        return [];
    }
};

const set = <T>(key: string, data: T) => {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('storage_update'));
};

const subscribers: Record<string, (() => void)[]> = {};

export const storageService = {
    initializeRAM: () => {
        console.log('FAHUB Intelligence Engine: Inicializando Contexto Joinville Gladiators...');
        
        // Configuração de Marca dos Gladiators
        if (!localStorage.getItem('fahub_settings')) {
            const settings: TeamSettings = {
                id: 'joinville-gladiators',
                teamName: 'Joinville Gladiators',
                primaryColor: '#000000',
                logoUrl: 'https://ui-avatars.com/api/?name=JG&background=000&color=fff',
                address: 'Joinville, SC',
                sportType: 'TACKLE'
            };
            set('fahub_settings', settings);
        }

        // População do Roadmap Estratégico (Meta 30/12)
        if (!localStorage.getItem('fahub_roadmap')) {
            const roadmap: RoadmapItem[] = [
                { id: 'r1', day: 16, title: 'Estabilização Core', description: 'Correção de erros de métodos e infra de dados', category: 'CORE', status: 'DONE', percentageWeight: 10 },
                { id: 'r2', day: 17, title: 'Roster Gladiators', description: 'Bio completa: shoulder, validade de capacete e CPF', category: 'CORE', status: 'TODO', percentageWeight: 15 },
                { id: 'r3', day: 18, title: 'Protocolo de Campo', description: 'Check-in via QR Code e cronômetro de Drills', category: 'FIELD', status: 'TODO', percentageWeight: 15 },
                { id: 'r4', day: 19, title: 'Financeiro Pro', description: 'Mensalidades automáticas via PIX e Fluxo de Caixa', category: 'FINANCE', status: 'TODO', percentageWeight: 15 },
                { id: 'r5', day: 22, title: 'Logística & Viagem', description: 'Mapa de ônibus e quartos de hotel', category: 'CORE', status: 'TODO', percentageWeight: 10 },
                { id: 'r6', day: 25, title: 'Fan Portal', description: 'Venda de ingressos e camisas Gladiators', category: 'FANS', status: 'TODO', percentageWeight: 15 },
                { id: 'r7', day: 30, title: 'STRESS TEST KICKOFF', description: 'Entrada oficial de todo o time no sistema', category: 'CORE', status: 'TODO', percentageWeight: 20 },
            ];
            set('fahub_roadmap', roadmap);
        }

        // Mock de Candidatos para evitar erro inicial no Recruitment
        if (!localStorage.getItem('fahub_candidates')) {
            const mockCandidates: RecruitmentCandidate[] = [
                { id: 'c1', name: 'Atleta Teste Gladiators', position: 'DL', weight: 120, experience: 'Nenhuma', status: 'NEW', bibNumber: 1 }
            ];
            set('fahub_candidates', mockCandidates);
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

    // USER & PERSONA
    getCurrentUser: () => {
        const data = localStorage.getItem('gridiron_current_user');
        return data ? JSON.parse(data) : { id: 'dev', name: 'Master Gladiators', role: 'MASTER' };
    },
    setCurrentUser: (data: any) => {
        localStorage.setItem('gridiron_current_user', JSON.stringify(data));
        window.dispatchEvent(new Event('storage_update'));
    },

    // CORE ENTITIES (CRITICAL)
    getPlayers: () => get<Player>('fahub_players'),
    savePlayers: (data: Player[]) => { set('fahub_players', data); storageService.notify('players'); },
    
    getAthletes: () => get<Player>('fahub_players'), // Alias para compatibilidade
    saveAthlete: (player: Player) => {
        const current = storageService.getPlayers();
        const updated = current.some(p => p.id === player.id) 
            ? current.map(p => p.id === player.id ? player : p)
            : [...current, player];
        storageService.savePlayers(updated);
    },
    registerAthlete: (player: Player) => storageService.saveAthlete(player),
    getAthleteByUserId: (userId: string) => storageService.getPlayers().find(p => p.id === userId),

    // RECRUITMENT (TRYOUT)
    getCandidates: () => get<RecruitmentCandidate>('fahub_candidates'),
    saveCandidates: (data: RecruitmentCandidate[]) => { set('fahub_candidates', data); storageService.notify('candidates'); },

    // GAMES & PRACTICE
    getGames: () => get<Game>('fahub_games'),
    saveGames: (data: Game[]) => { set('fahub_games', data); storageService.notify('games'); },
    updateLiveGame: (id: string | number, updates: Partial<Game>) => {
        const games = storageService.getGames().map(g => String(g.id) === String(id) ? { ...g, ...updates } : g);
        storageService.saveGames(games);
    },
    getPracticeSessions: () => get<PracticeSession>('fahub_practice'),
    savePracticeSessions: (data: PracticeSession[]) => { set('fahub_practice', data); storageService.notify('practice'); },

    // FINANCE
    getTransactions: () => get<Transaction>('fahub_transactions'),
    saveTransactions: (data: Transaction[]) => { set('fahub_transactions', data); storageService.notify('transactions'); },
    getInvoices: () => get<Invoice>('fahub_invoices'),
    saveInvoices: (data: Invoice[]) => set('fahub_invoices', data),
    getSubscriptions: () => get<Subscription>('fahub_subscriptions'),
    saveSubscriptions: (data: Subscription[]) => set('fahub_subscriptions', data),
    getBudgets: () => get<Budget>('fahub_budgets'),
    saveBudgets: (data: Budget[]) => set('fahub_budgets', data),
    getBills: () => get<Bill>('fahub_bills'),
    saveBills: (data: Bill[]) => set('fahub_bills', data),

    // ROADMAP & STRATEGY
    getRoadmap: () => get<RoadmapItem>('fahub_roadmap'),
    updateRoadmapItem: (id: string, status: 'TODO' | 'DOING' | 'DONE') => {
        const roadmap = storageService.getRoadmap().map(item => item.id === id ? { ...item, status } : item);
        set('fahub_roadmap', roadmap);
        storageService.notify('roadmap');
    },
    getProjectCompletion: () => {
        const roadmap = storageService.getRoadmap();
        if (roadmap.length === 0) return 0;
        const done = roadmap.filter(i => i.status === 'DONE').reduce((acc, i) => acc + i.percentageWeight, 0);
        return done;
    },

    // OTHER ENTITIES
    getObjectives: () => get<Objective>('fahub_objectives'),
    saveObjectives: (data: Objective[]) => { set('fahub_objectives', data); storageService.notify('objectives'); },
    getSponsors: () => get<SponsorDeal>('fahub_sponsors'),
    saveSponsors: (data: SponsorDeal[]) => set('fahub_sponsors', data),
    getEventSales: () => get<EventSale>('fahub_event_sales'),
    saveEventSales: (data: EventSale[]) => set('fahub_event_sales', data),
    getInventory: () => get<EquipmentItem>('fahub_inventory'),
    saveInventory: (data: EquipmentItem[]) => set('fahub_inventory', data),
    getClips: () => get<VideoClip>('fahub_clips'),
    saveClips: (data: VideoClip[]) => set('fahub_clips', data),
    getTacticalPlays: () => get<TacticalPlay>('fahub_tactical_plays'),
    saveTacticalPlays: (data: TacticalPlay[]) => set('fahub_tactical_plays', data),
    getStaff: () => get<StaffMember>('fahub_staff'),
    saveStaff: (data: StaffMember[]) => set('fahub_staff', data),
    getDocuments: () => get<TeamDocument>('fahub_documents'),
    saveDocuments: (data: TeamDocument[]) => set('fahub_documents', data),
    getTeamSettings: (): TeamSettings => {
        const data = localStorage.getItem('fahub_settings');
        return data ? JSON.parse(data) : { id: '1', teamName: 'Joinville Gladiators', primaryColor: '#000', logoUrl: '', address: '' };
    },
    saveTeamSettings: (data: TeamSettings) => set('fahub_settings', data),
    
    // UTILS
    logAuditAction: (action: string, details: string) => {
        const user = storageService.getCurrentUser();
        const logs = get<AuditLog>('fahub_audit');
        const newLog: AuditLog = {
            id: `log-${Date.now()}`,
            action,
            details,
            timestamp: new Date(),
            userId: user.id,
            userName: user.name,
            role: user.role
        };
        set('fahub_audit', [newLog, ...logs].slice(0, 50));
        storageService.notify('audit');
    },

    // Fix: Added missing methods for multiple pages
    getAuditLogs: () => get<AuditLog>('fahub_audit'),

    getTasks: () => get<KanbanTask>('fahub_tasks'),
    saveTasks: (data: KanbanTask[]) => {
        set('fahub_tasks', data);
        storageService.notify('tasks');
    },

    getTeams: () => get<Team>('fahub_teams'),
    saveTeam: (team: Team) => {
        const current = storageService.getTeams();
        set('fahub_teams', [...current, team]);
        storageService.notify('teams');
    },

    getSocialFeed: () => get<SocialFeedPost>('fahub_social_feed'),
    saveSocialFeedPost: (post: SocialFeedPost) => {
        const current = storageService.getSocialFeed();
        set('fahub_social_feed', [post, ...current]);
        storageService.notify('social_feed');
    },
    toggleLikePost: (id: string) => {
        const feed = storageService.getSocialFeed();
        const updated = feed.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p);
        set('fahub_social_feed', updated);
        storageService.notify('social_feed');
    },

    getMarketplaceItems: () => get<MarketplaceItem>('fahub_marketplace'),
    saveMarketplaceItems: (data: MarketplaceItem[]) => {
        set('fahub_marketplace', data);
        storageService.notify('marketplace');
    },

    getActiveProgram: () => localStorage.getItem('active_program') || 'TACKLE',
    setActiveProgram: (p: string) => localStorage.setItem('active_program', p),
    getPublicLeagueStats: () => ({ name: 'BFA', season: '2025', leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),
    getPublicGameData: (id: string) => null,
    getCourses: () => get<Course>('fahub_courses'),
    getEntitlements: () => get<Entitlement>('fahub_entitlements'),
    purchaseDigitalProduct: (userId: string, p: any) => {},
    getConfederationStats: () => ({ totalAthletes: 4850, totalTeams: 18, totalGamesThisYear: 142, activeAffiliates: 8 }),
    getNationalTeamScouting: () => [],
    getAffiliatesStatus: () => [],
    getTransferRequests: () => [],
    processTransfer: (id: string, decision: string, user: string) => {},
    getYouthClasses: () => [],
    saveYouthClasses: (d: any) => {},
    getYouthStudents: () => [],
    getLeague: () => ({ id: '1', name: 'Liga Catarinense', season: '2025', teams: [] }),
    getAthleteStatsHistory: (id: any) => [],
    uploadFile: async (file: File, path: string) => URL.createObjectURL(file),
    saveCoachProfile: (uid: string, p: any) => {},
    generateMonthlyInvoices: () => {},
    createChampionship: (n: string, y: number, d: string) => {},
    seedDatabaseToCloud: async () => true,
};

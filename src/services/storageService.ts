
import { 
    Player, PracticeSession, RoadmapItem, RecruitmentCandidate, 
    ProgramType, TeamSettings, AuditLog, ConfederationStats, NationalTeamCandidate,
    Affiliate, TransferRequest, VideoClip, DigitalProduct, Entitlement, Team,
    TeamDocument, Invoice, Subscription, Budget, Bill, Transaction, KanbanTask,
    SponsorDeal, EventSale, SocialPost, Objective, TacticalPlay, League
} from '../types';

const get = <T>(key: string): T[] => {
    try {
        const data = localStorage.getItem(key);
        if (!data) return [];
        return JSON.parse(data, (k, v) => {
            if (['date', 'timestamp', 'birthDate', 'deadline', 'expiryDate', 'lastAuditDate', 'expiresAt'].includes(k)) return new Date(v);
            return v;
        });
    } catch { return []; }
};

const set = <T>(key: string, data: T) => {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('storage_update'));
};

const subscribers: Record<string, (() => void)[]> = {};

export const storageService = {
    initializeRAM: () => {
        if (!localStorage.getItem('fahub_active_program')) {
            localStorage.setItem('fahub_active_program', 'TACKLE');
        }
        
        if (!localStorage.getItem('fahub_roadmap')) {
            const roadmap: RoadmapItem[] = [
                { id: 'r1', day: 16, title: 'Estabilização Core', description: 'Isolamento de modalidades e fluxo de novatos', category: 'CORE', status: 'DONE', percentageWeight: 10 },
                { id: 'r2', day: 17, title: 'Portal do Novato', description: 'Incubação 0 a 100% e check de cultura', category: 'FIELD', status: 'DOING', percentageWeight: 15 },
                { id: 'r3', day: 18, title: 'Command Switcher', description: 'Troca rápida entre unidades Gladiators', category: 'CORE', status: 'TODO', percentageWeight: 15 },
            ];
            set('fahub_roadmap', roadmap);
        }
    },

    subscribe: (key: string, callback: () => void) => {
        if (!subscribers[key]) subscribers[key] = [];
        subscribers[key].push(callback);
        
        const handler = (e: any) => { if (!key || e.detail?.key === key) callback(); };
        window.addEventListener('storage_update', callback);
        window.addEventListener('fahub_data_change', handler);
        return () => {
            subscribers[key] = (subscribers[key] || []).filter(cb => cb !== callback);
            window.removeEventListener('storage_update', callback);
            window.removeEventListener('fahub_data_change', handler);
        };
    },

    notify: (key: string) => {
        if (subscribers[key]) subscribers[key].forEach(cb => cb());
        window.dispatchEvent(new CustomEvent('fahub_data_change', { detail: { key } }));
    },

    // CONTEXTO DE MODALIDADE
    getActiveProgram: (): ProgramType => (localStorage.getItem('fahub_active_program') as ProgramType) || 'TACKLE',
    setActiveProgram: (p: ProgramType) => {
        localStorage.setItem('fahub_active_program', p);
        storageService.notify('activeProgram');
        window.dispatchEvent(new Event('storage_update'));
    },

    // ATLETAS (FILTRADOS POR CONTEXTO)
    getPlayers: () => {
        const prog = storageService.getActiveProgram();
        const all = get<Player>('fahub_players');
        if (prog === 'BOTH') return all;
        return all.filter(p => p.program === prog || p.program === 'BOTH');
    },
    savePlayers: (data: Player[]) => { set('fahub_players', data); storageService.notify('players'); },

    // Fix: Added getAthletes for TeamManagement compatibility
    getAthletes: () => get<Player>('fahub_players'),

    // CONVERSÃO CANDIDATO -> NOVATO
    approveCandidate: (candidateId: string) => {
        const candidates = get<RecruitmentCandidate>('fahub_candidates');
        const cand = candidates.find(c => c.id === candidateId);
        if (!cand) return;

        const newPlayer: Player = {
            id: `ath-${Date.now()}`,
            name: cand.name,
            position: cand.position,
            jerseyNumber: 0,
            height: cand.height || 'N/A',
            weight: cand.weight,
            class: 'ROOKIE',
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(cand.name)}&background=random`,
            level: 1,
            xp: 0,
            rating: cand.rating || 70,
            status: 'INCUBATING',
            program: cand.program,
            attendanceRate: 100,
            incubation: {
                cultureAccepted: false,
                fundamentalsProgress: 0,
                fieldEvaluationScore: cand.rating || 0,
                status: 'CULTURE'
            }
        };

        const currentPlayers = get<Player>('fahub_players');
        storageService.savePlayers([...currentPlayers, newPlayer]);

        const updatedCands = candidates.map(c => c.id === candidateId ? { ...c, status: 'SELECTED' as const } : c);
        set('fahub_candidates', updatedCands);
        storageService.notify('candidates');
    },

    // RECRUTAMENTO
    getCandidates: () => {
        const prog = storageService.getActiveProgram();
        const all = get<RecruitmentCandidate>('fahub_candidates');
        if (prog === 'BOTH') return all;
        return all.filter(c => c.program === prog);
    },
    saveCandidates: (data: RecruitmentCandidate[]) => { set('fahub_candidates', data); storageService.notify('candidates'); },

    // FEDERATION
    // Fix: Added missing methods
    getConfederationStats: (): ConfederationStats => ({ totalAthletes: 4850, totalTeams: 18, totalGamesThisYear: 142, activeAffiliates: 8 }),
    getNationalTeamScouting: (): NationalTeamCandidate[] => get<NationalTeamCandidate>('fahub_national_scouting'),
    getAffiliatesStatus: (): Affiliate[] => get<Affiliate>('fahub_affiliates'),
    getTransferRequests: (): TransferRequest[] => get<TransferRequest>('fahub_transfers'),
    processTransfer: (id: string, decision: string, user: string) => {
        const current = get<TransferRequest>('fahub_transfers');
        const updated = current.map(t => t.id === id ? { ...t, status: decision === 'APPROVE' ? 'APPROVED' : 'REJECTED' } : t);
        set('fahub_transfers', updated);
    },

    // VIDEO
    // Fix: Added missing methods
    getClips: (): VideoClip[] => get<VideoClip>('fahub_clips'),
    saveClips: (data: VideoClip[]) => set('fahub_clips', data),

    // DIGITAL PRODUCTS
    // Fix: Added missing methods
    getEntitlements: (): Entitlement[] => get<Entitlement>('fahub_entitlements'),
    purchaseDigitalProduct: (userId: string, product: DigitalProduct) => {
        const current = storageService.getEntitlements();
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + (product.durationHours || 720));
        const newEnt: Entitlement = {
            id: `ent-${Date.now()}`,
            userId,
            productId: product.id,
            expiresAt: expiry
        };
        set('fahub_entitlements', [...current, newEnt]);
    },

    // TEAMS
    // Fix: Added missing methods
    getTeams: (): Team[] => get<Team>('fahub_teams'),
    saveTeam: (t: Team) => set('fahub_teams', [...storageService.getTeams(), t]),

    // DOCUMENTS
    // Fix: Added missing methods
    getDocuments: (): TeamDocument[] => get<TeamDocument>('fahub_documents'),
    saveDocuments: (data: TeamDocument[]) => set('fahub_documents', data),

    // COACH
    // Fix: Added missing methods
    saveCoachProfile: (userId: string, profile: any) => set(`coach_profile_${userId}`, profile),

    // FINANCE
    // Fix: Added missing methods
    getInvoices: (): Invoice[] => get<Invoice>('fahub_invoices'),
    saveInvoices: (data: Invoice[]) => set('fahub_invoices', data),
    getSubscriptions: (): Subscription[] => get<Subscription>('fahub_subscriptions'),
    saveSubscriptions: (data: Subscription[]) => set('fahub_subscriptions', data),
    getBudgets: (): Budget[] => get<Budget>('fahub_budgets'),
    saveBudgets: (data: Budget[]) => set('fahub_budgets', data),
    getBills: (): Bill[] => get<Bill>('fahub_bills'),
    saveBills: (data: Bill[]) => set('fahub_bills', data),
    getTransactions: (): Transaction[] => get<Transaction>('fahub_transactions'),
    saveTransactions: (data: Transaction[]) => set('fahub_transactions', data),
    generateMonthlyInvoices: () => {
        console.log("Monthly invoices generated locally.");
    },

    // TASKS
    // Fix: Added missing methods
    getTasks: (): KanbanTask[] => get<KanbanTask>('fahub_tasks'),
    saveTasks: (data: KanbanTask[]) => set('fahub_tasks', data),

    // SPONSORS & SALES
    // Fix: Added missing methods
    getSponsors: (): SponsorDeal[] => get<SponsorDeal>('fahub_sponsors'),
    saveSponsors: (data: SponsorDeal[]) => set('fahub_sponsors', data),
    getEventSales: (): EventSale[] => get<EventSale>('fahub_event_sales'),
    saveEventSales: (data: EventSale[]) => set('fahub_event_sales', data),

    // MARKETING
    // Fix: Added missing methods
    getSocialPosts: (): SocialPost[] => get<SocialPost>('fahub_social_posts'),
    saveSocialPosts: (data: SocialPost[]) => set('fahub_social_posts', data),

    // GOALS
    // Fix: Added missing methods
    getObjectives: (): Objective[] => get<Objective>('fahub_objectives'),
    saveObjectives: (data: Objective[]) => { set('fahub_objectives', data); storageService.notify('objectives'); },

    // TACTICAL
    // Fix: Added missing methods
    getTacticalPlays: (): TacticalPlay[] => get<TacticalPlay>('fahub_tactical_plays'),
    saveTacticalPlays: (data: TacticalPlay[]) => set('fahub_tactical_plays', data),

    // LEAGUE
    // Fix: Added missing methods
    getLeague: (): League => {
        const stored = localStorage.getItem('fahub_league');
        return stored ? JSON.parse(stored) : { id: 'l1', name: 'FCFA', season: '2025', teams: [] };
    },

    // OTHER METHODS
    getPracticeSessions: () => get<PracticeSession>('fahub_practice'),
    savePracticeSessions: (data: PracticeSession[]) => { set('fahub_practice', data); storageService.notify('gridiron_practice'); },
    getRoadmap: () => get<RoadmapItem>('fahub_roadmap'),
    getProjectCompletion: () => {
        const roadmap = get<RoadmapItem>('fahub_roadmap');
        return roadmap.filter(i => i.status === 'DONE').reduce((acc, i) => acc + i.percentageWeight, 0);
    },
    getAuditLogs: () => get<AuditLog>('fahub_audit'),
    logAuditAction: (action: string, details: string) => {
        const user = JSON.parse(localStorage.getItem('gridiron_current_user') || '{"name":"System","id":"sys","role":"SYSTEM"}');
        const logs = get<AuditLog>('fahub_audit');
        const newLog: AuditLog = { id: `log-${Date.now()}`, action, details, timestamp: new Date(), userId: user.id, userName: user.name, role: user.role };
        set('fahub_audit', [newLog, ...logs].slice(0, 50));
        storageService.notify('audit');
    },
    getTeamSettings: (): TeamSettings => {
        const data = localStorage.getItem('fahub_settings');
        return data ? JSON.parse(data) : { id: '1', teamName: 'Gladiators', primaryColor: '#000' };
    },
    saveTeamSettings: (d: TeamSettings) => set('fahub_settings', d),
    getCourses: () => get<any>('fahub_courses'),
    getSocialFeed: () => get<any>('fahub_social_feed'),
    saveSocialFeedPost: (p: any) => set('fahub_social_feed', [p, ...get<any>('fahub_social_feed')]),
    toggleLikePost: (id: string) => {
        const feed = storageService.getSocialFeed();
        const updated = feed.map((p: any) => p.id === id ? { ...p, likes: p.likes + 1 } : p);
        set('fahub_social_feed', updated);
    },
    getInventory: () => get<any>('fahub_inventory'),
    saveInventory: (d: any) => set('fahub_inventory', d),
    getStaff: () => get<any>('fahub_staff'),
    saveStaff: (d: any) => set('fahub_staff', d),
    getYouthClasses: () => get<any>('fahub_youth_classes'),
    saveYouthClasses: (d: any) => set('fahub_youth_classes', d),
    getYouthStudents: () => get<any>('fahub_youth_students'),
    getAthleteStatsHistory: (id: any) => [],
    getCurrentUser: () => JSON.parse(localStorage.getItem('gridiron_current_user') || 'null'),
    setCurrentUser: (u: any) => { localStorage.setItem('gridiron_current_user', JSON.stringify(u)); window.dispatchEvent(new Event('storage_update')); },
    registerAthlete: (p: any) => { const c = get<any>('fahub_players'); set('fahub_players', [...c, p]); },
    saveAthlete: (p: any) => {
        const current = get<Player>('fahub_players');
        const updated = current.map(pl => pl.id === p.id ? p : pl);
        if (!current.some(pl => pl.id === p.id)) updated.push(p);
        set('fahub_players', updated);
    },
    getAthleteByUserId: (id: string) => get<Player>('fahub_players').find(p => p.userId === id),
    updateLiveGame: (id: any, u: any) => {
        const games = storageService.getGames();
        const updated = games.map((g: any) => String(g.id) === String(id) ? { ...g, ...u } : g);
        storageService.saveGames(updated);
    },
    saveGames: (d: any) => set('fahub_games', d),
    getGames: () => get<any>('fahub_games'),
    getAuditLogsByAction: (a: string) => [],
    uploadFile: async (f: any, p: any) => "",
    getPublicLeagueStats: () => ({ name: 'FCFA', season: '2025', leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),
    getPublicGameData: (id: string) => {
        const games = storageService.getGames();
        return games.find((g: any) => String(g.id) === id) || null;
    },
    createChampionship: (n: any, y: any, d: any) => {},
    seedDatabaseToCloud: async () => true,
    getMarketplaceItems: () => get<any>('fahub_marketplace'),
    saveMarketplaceItems: (d: any) => set('fahub_marketplace', d),
    getAnnouncements: () => get<any>('fahub_announcements'),
    saveAnnouncements: (d: any) => set('fahub_announcements', d),
};
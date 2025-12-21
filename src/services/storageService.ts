
import { 
    Player, Game, PracticeSession, TeamSettings, AuditLog, RecruitmentCandidate, 
    Team, Transaction, Invoice, Subscription, Budget, Bill, Announcement, 
    ChatMessage, TeamDocument, VideoClip, TacticalPlay, MarketplaceItem, 
    KanbanTask, SocialPost, SponsorDeal, EventSale, SocialFeedPost, 
    EquipmentItem, StaffMember, YouthClass, YouthStudent, ConfederationStats, 
    NationalTeamCandidate, Affiliate, TransferRequest, League, Objective, 
    Course, DigitalProduct, Entitlement, RoadmapItem, OKR, ObjectiveSignal, 
    ProgramType, Championship 
} from '../types';

// Helper de persistência - Corrigido para sintaxe padrão JS (return/data)
const get = <T>(key: string): T[] => {
    const data = localStorage.getItem(key);
    // Vercel fix: 'return' and 'data' are reserved keywords
    return data ? JSON.parse(data, (k, v) => {
        if (typeof v === 'string' && (k.toLowerCase().includes('date') || k === 'timestamp' || k === 'expiresat' || k === 'birthdate' || k === 'deadline')) {
            return new Date(v);
        }
        return v;
    }) : [];
};

const set = <T>(key: string, data: T) => {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('storage_update'));
};

const subscribers: Record<string, (() => void)[]> = {};

const notifyInternal = (key: string) => {
    if (subscribers[key]) subscribers[key].forEach(cb => cb());
    window.dispatchEvent(new CustomEvent('fahub_data_change', { detail: { key } }));
};

export const storageService = {
    initializeRAM: () => {
        if (!localStorage.getItem('fahub_players')) {
            const mockPlayers: Player[] = [
                { id: 'p1', name: 'Lucas "Thor"', position: 'QB', jerseyNumber: 12, height: '1.85m', weight: 92, class: 'Sênior', avatarUrl: '', level: 5, xp: 850, rating: 88, status: 'ACTIVE', stats: { ovr: 88, speed: 82, strength: 75, agility: 78, tacticalIQ: 95 }, financialStatus: 'OK', documentStatus: 'OK', attendanceRate: 100 },
                { id: 'p2', name: 'Gabriel Silva', position: 'LB', jerseyNumber: 55, height: '1.82m', weight: 105, class: 'Veterano', avatarUrl: '', level: 7, xp: 2100, rating: 91, status: 'ACTIVE', stats: { ovr: 91, speed: 78, strength: 95, agility: 72, tacticalIQ: 88 }, financialStatus: 'OK', documentStatus: 'OK', attendanceRate: 100 }
            ];
            set('fahub_players', mockPlayers);
        }
        if (!localStorage.getItem('fahub_okrs')) {
            const initialOkrs: OKR[] = [
                { id: '1', title: 'Sustentabilidade Financeira', description: 'Meta macro da presidência', ownerRole: 'PRESIDENT', targetValue: 100, currentValue: 45, unit: '%', category: 'FINANCE', status: 'ON_TRACK', subordinatesCheck: true },
                { id: '2', title: 'Reduzir Inadimplência', description: 'Meta tática financeira', ownerRole: 'FINANCIAL_DIRECTOR', targetValue: 5, currentValue: 12, unit: '%', category: 'FINANCE', status: 'AT_RISK', parentOkrId: '1', subordinatesCheck: false }
            ];
            set('fahub_okrs', initialOkrs);
        }
    },

    subscribe: (key: string, callback: () => void) => {
        if (!subscribers[key]) subscribers[key] = [];
        subscribers[key].push(callback);
        return () => { subscribers[key] = subscribers[key].filter(cb => cb !== callback); };
    },

    notify: notifyInternal,

    getCurrentUser: () => {
        const data = localStorage.getItem('gridiron_current_user');
        return data ? JSON.parse(data) : { id: 'dev', name: 'Master Admin', role: 'MASTER' };
    },

    setCurrentUser: (user: any) => set('gridiron_current_user', user),

    // ATLETAS & ROSTER
    getPlayers: () => get<Player>('fahub_players'),
    savePlayers: (data: Player[]) => {
        set('fahub_players', data);
        notifyInternal('players');
    },
    getAthleteByUserId: (id: string) => storageService.getPlayers().find(p => String(p.id) === id || (p as any).userId === id),
    saveAthlete: (athlete: Player) => {
        const current = storageService.getPlayers();
        const exists = current.findIndex(a => String(a.id) === String(athlete.id));
        if (exists >= 0) current[exists] = athlete;
        else current.push(athlete);
        storageService.savePlayers(current);
    },
    registerAthlete: (player: Player) => {
        const current = storageService.getPlayers();
        storageService.savePlayers([...current, player]);
    },
    getAthletes: () => get<Player>('fahub_players'),
    getAthleteStatsHistory: (id: string | number) => [],

    // GOVERNANÇA (OKR & SINAIS)
    getOKRs: () => get<OKR>('fahub_okrs'),
    saveOKRs: (data: OKR[]) => {
        set('fahub_okrs', data);
        notifyInternal('okrs');
    },
    getObjectives: () => get<Objective>('fahub_objectives'),
    saveObjectives: (data: Objective[]) => {
        set('fahub_objectives', data);
        notifyInternal('objectives');
    },
    sendSignal: (signal: Omit<ObjectiveSignal, 'id' | 'timestamp' | 'status'>) => {
        const current = get<ObjectiveSignal>('fahub_signals');
        const newSignal: ObjectiveSignal = {
            ...signal,
            id: `sig-${Date.now()}`,
            timestamp: new Date(),
            status: 'UNREAD'
        };
        set('fahub_signals', [newSignal, ...current].slice(0, 50));
        notifyInternal('signals');
    },

    // FINANCEIRO
    getTransactions: () => get<Transaction>('fahub_transactions'),
    saveTransactions: (data: Transaction[]) => {
        set('fahub_transactions', data);
        notifyInternal('transactions');
    },
    getInvoices: () => get<Invoice>('fahub_invoices'),
    saveInvoices: (data: Invoice[]) => set('fahub_invoices', data),
    getSubscriptions: () => get<Subscription>('fahub_subscriptions'),
    saveSubscriptions: (data: Subscription[]) => set('fahub_subscriptions', data),
    getBudgets: () => get<Budget>('fahub_budgets'),
    saveBudgets: (data: Budget[]) => set('fahub_budgets', data),
    getBills: () => get<Bill>('fahub_bills'),
    saveBills: (data: Bill[]) => set('fahub_bills', data),

    // OPERACIONAL & TREINO
    getGames: () => get<Game>('fahub_games'),
    saveGames: (data: Game[]) => {
        set('fahub_games', data);
        notifyInternal('games');
    },
    updateLiveGame: (id: string | number, updates: Partial<Game>) => {
        const games = storageService.getGames().map(g => String(g.id) === String(id) ? { ...g, ...updates } : g);
        storageService.saveGames(games);
    },
    getPracticeSessions: () => get<PracticeSession>('fahub_practice'),
    savePracticeSessions: (data: PracticeSession[]) => {
        set('fahub_practice', data);
        notifyInternal('practice');
    },
    togglePracticeAttendance: (practiceId: string, playerId: string) => {
        const current = storageService.getPracticeSessions();
        const updated = current.map(p => {
            if (String(p.id) === practiceId) {
                const attendees = p.attendees || [];
                const index = attendees.indexOf(playerId);
                if (index > -1) attendees.splice(index, 1);
                else attendees.push(playerId);
                return { ...p, attendees: [...attendees] };
            }
            return p;
        });
        storageService.savePracticeSessions(updated as any);
    },

    // RECRUTAMENTO & INCUBADORA
    getCandidates: () => get<RecruitmentCandidate>('fahub_candidates'),
    saveCandidates: (data: RecruitmentCandidate[]) => set('fahub_candidates', data),
    approveCandidate: (id: string) => {
        const candidates = storageService.getCandidates();
        const candidate = candidates.find(c => c.id === id);
        if (candidate) {
            const players = storageService.getPlayers();
            const newPlayer: Player = {
                id: `p-${Date.now()}`,
                name: candidate.name,
                position: candidate.position,
                jerseyNumber: 0,
                height: candidate.height || '0.00m',
                weight: candidate.weight,
                class: 'Rookie',
                avatarUrl: '',
                level: 1,
                xp: 0,
                rating: candidate.rating || 70,
                status: 'INCUBATING',
                program: storageService.getActiveProgram(),
                incubation: {
                    cultureAccepted: false,
                    fundamentalsProgress: 0,
                    fieldEvaluationScore: 0,
                    status: 'CULTURE'
                },
                attendanceRate: 100
            };
            storageService.savePlayers([...players, newPlayer]);
            storageService.saveCandidates(candidates.filter(c => c.id !== id));
        }
    },

    // CONFIGURAÇÕES
    getTeamSettings: (): TeamSettings => {
        const data = localStorage.getItem('fahub_settings');
        return data ? JSON.parse(data) : { id: '1', teamName: 'Gladiators FA', primaryColor: '#059669', plan: 'ALL_PRO' };
    },
    saveTeamSettings: (data: TeamSettings) => {
        localStorage.setItem('fahub_settings', JSON.stringify(data));
        notifyInternal('settings');
    },

    // ROADMAP & PROJETO
    getRoadmap: () => get<RoadmapItem>('fahub_roadmap'),
    getProjectCompletion: () => 75,

    // DIVERSOS
    getActiveProgram: () => (localStorage.getItem('active_program') || 'TACKLE') as ProgramType,
    setActiveProgram: (p: ProgramType) => {
        localStorage.setItem('active_program', p);
        notifyInternal('activeProgram');
    },
    getTeams: () => get<Team>('fahub_teams'),
    getStaff: () => get<StaffMember>('fahub_staff'),
    getDocuments: () => get<TeamDocument>('fahub_documents'),
    saveDocuments: (data: TeamDocument[]) => {
        set('fahub_documents', data);
        notifyInternal('documents');
    },
    getTasks: () => get<KanbanTask>('fahub_tasks'),
    saveTasks: (data: KanbanTask[]) => set('fahub_tasks', data),
    getSocialFeed: () => get<SocialFeedPost>('fahub_social_feed'),
    saveSocialFeedPost: (post: SocialFeedPost) => set('fahub_social_feed', [post, ...get<SocialFeedPost>('fahub_social_feed')]),
    toggleLikePost: (id: string) => {
        const feed = get<SocialFeedPost>('fahub_social_feed');
        set('fahub_social_feed', feed.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    },
    getMarketplaceItems: () => get<MarketplaceItem>('fahub_marketplace'),
    saveMarketplaceItems: (data: MarketplaceItem[]) => {
        set('fahub_marketplace', data);
        notifyInternal('marketplace');
    },
    getAuditLogs: () => get<AuditLog>('fahub_audit'),
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
        set('fahub_audit', [newLog, ...logs].slice(0, 100));
        notifyInternal('audit');
    },
    getConfederationStats: () => ({ totalAthletes: 4850, totalTeams: 18, totalGamesThisYear: 142, activeAffiliates: 8 }),
    getNationalTeamScouting: () => get<NationalTeamCandidate>('fahub_national_team_scouting'),
    getAffiliatesStatus: () => get<Affiliate>('fahub_affiliates'),
    getTransferRequests: () => get<TransferRequest>('fahub_transfers'),
    processTransfer: (id: string, decision: string, user: string) => {
        const current = get<TransferRequest>('fahub_transfers');
        const updated = current.map(t => t.id === id ? { ...t, status: (decision === 'APPROVE' ? 'APPROVED' : 'REJECTED') as any } : t);
        set('fahub_transfers', updated);
    },
    getAnnouncements: () => get<Announcement>('fahub_announcements'),
    saveAnnouncements: (data: Announcement[]) => {
        set('fahub_announcements', data);
        notifyInternal('announcements');
    },
    getChatMessages: () => get<ChatMessage>('fahub_chat'),
    saveChatMessages: (data: ChatMessage[]) => {
        set('fahub_chat', data);
        notifyInternal('chat');
    },
    getTacticalPlays: () => get<TacticalPlay>('fahub_tactical_plays'),
    saveTacticalPlays: (data: TacticalPlay[]) => {
        set('fahub_tactical_plays', data);
        notifyInternal('tactical');
    },
    getClips: () => get<VideoClip>('fahub_clips'),
    getCourses: () => get<Course>('fahub_courses'),
    getLeague: () => {
        const data = localStorage.getItem('fahub_league');
        return data ? JSON.parse(data) : { id: '1', name: 'Liga Brasileira', season: '2025', teams: [] };
    },
    getSocialPosts: () => get<SocialPost>('fahub_social_posts'),
    saveSocialPosts: (data: SocialPost[]) => {
        set('fahub_social_posts', data);
        notifyInternal('social_posts');
    },
    getSponsors: () => get<SponsorDeal>('fahub_sponsors'),
    saveSponsors: (data: SponsorDeal[]) => {
        set('fahub_sponsors', data);
        notifyInternal('sponsors');
    },
    getEventSales: () => get<EventSale>('fahub_event_sales'),
    saveEventSales: (data: EventSale[]) => {
        set('fahub_event_sales', data);
        notifyInternal('event_sales');
    },
    getInventory: () => get<EquipmentItem>('fahub_inventory'),
    saveInventory: (data: EquipmentItem[]) => {
        set('fahub_inventory', data);
        notifyInternal('inventory');
    },
    getYouthClasses: () => get<YouthClass>('fahub_youth_classes'),
    getYouthStudents: () => get<YouthStudent>('fahub_youth_students'),
    saveYouthClasses: (data: YouthClass[]) => {
        set('fahub_youth_classes', data);
        notifyInternal('youth_classes');
    },
    getPublicGameData: (gameId: string) => storageService.getGames().find(g => String(g.id) === gameId),
    getPublicLeagueStats: () => ({ name: "Liga Brasileira", season: "2025", leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),
    getEntitlements: () => get<Entitlement>('fahub_entitlements'),
    purchaseDigitalProduct: (userId: string, product: DigitalProduct) => {
        const current = storageService.getEntitlements();
        const newEnt: Entitlement = { id: `ent-${Date.now()}`, userId, productId: product.id, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) };
        set('fahub_entitlements', [...current, newEnt]);
    },
    saveTeam: (team: Team) => {
        const current = storageService.getTeams();
        const index = current.findIndex(t => t.id === team.id);
        if (index > -1) current[index] = team;
        else current.push(team);
        set('fahub_teams', current);
    },
    saveCoachProfile: (userId: string, profile: any) => {
        const profiles = JSON.parse(localStorage.getItem('fahub_coach_profiles') || '{}');
        profiles[userId] = profile;
        localStorage.setItem('fahub_coach_profiles', JSON.stringify(profiles));
    },
    seedDatabaseToCloud: async () => {},
    uploadFile: async (file: File, path: string): Promise<string> => URL.createObjectURL(file),
    createChampionship: (name: string, year: number, division: string) => {},
    generateMonthlyInvoices: () => {},
    logAction: (action: string, details: string) => storageService.logAuditAction(action, details)
};

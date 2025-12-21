
import { 
    Player, Game, PracticeSession, TeamSettings, AuditLog, RecruitmentCandidate, 
    Team, Transaction, Invoice, Subscription, Budget, Bill, Announcement, 
    ChatMessage, TeamDocument, VideoClip, TacticalPlay, MarketplaceItem, 
    KanbanTask, SocialPost, SponsorDeal, EventSale, SocialFeedPost, 
    EquipmentItem, StaffMember, YouthClass, YouthStudent, ConfederationStats, 
    NationalTeamCandidate, Affiliate, TransferRequest, League, Objective, 
    Course, DigitalProduct, Entitlement, RoadmapItem, OKR, ObjectiveSignal, 
    ProgramType 
} from '../types';

const get = <T>(key: string): T[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data, (k, v) => {
        if (typeof v === 'string' && (k.toLowerCase().includes('date') || k === 'timestamp' || k === 'expiresat')) {
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

export const storageService = {
    initializeRAM: () => {
        if (!localStorage.getItem('fahub_players')) {
            const mockPlayers: Player[] = [
                { id: 'p1', name: 'Lucas "Thor"', position: 'QB', jerseyNumber: 12, height: '1.85m', weight: 92, class: 'Sênior', avatarUrl: '', level: 5, xp: 850, rating: 88, status: 'ACTIVE', stats: { ovr: 88, speed: 82, strength: 75, agility: 78, tacticalIQ: 95 } },
                { id: 'p2', name: 'Gabriel Silva', position: 'LB', jerseyNumber: 55, height: '1.82m', weight: 105, class: 'Veterano', avatarUrl: '', level: 7, xp: 2100, rating: 91, status: 'ACTIVE', stats: { ovr: 91, speed: 78, strength: 95, agility: 72, tacticalIQ: 88 } }
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

    notify: (key: string) => {
        if (subscribers[key]) subscribers[key].forEach(cb => cb());
        window.dispatchEvent(new CustomEvent('fahub_data_change', { detail: { key } }));
    },

    getCurrentUser: () => {
        const data = localStorage.getItem('gridiron_current_user');
        return data ? JSON.parse(data) : { id: 'dev', name: 'Master Admin', role: 'MASTER' };
    },

    setCurrentUser: (user: any) => set('gridiron_current_user', user),

    // PLAYERS
    getPlayers: () => get<Player>('fahub_players'),
    savePlayers: (data: Player[]) => {
        set('fahub_players', data);
        storageService.notify('players');
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
    getAthleteStatsHistory: (id: string | number) => [],

    // CANDIDATES (TRYOUT)
    getCandidates: () => get<RecruitmentCandidate>('fahub_candidates'),
    saveCandidates: (data: RecruitmentCandidate[]) => {
        set('fahub_candidates', data);
        storageService.notify('candidates');
    },
    approveCandidate: (id: string) => {
        const candidates = storageService.getCandidates();
        const cand = candidates.find(c => c.id === id);
        if (cand) {
            const player: Player = {
                id: Date.now(),
                name: cand.name,
                position: cand.position,
                jerseyNumber: 0,
                height: cand.height || '',
                weight: cand.weight,
                class: 'Rookie',
                avatarUrl: '',
                level: 1,
                xp: 0,
                rating: cand.rating || 70,
                status: 'ACTIVE'
            };
            storageService.registerAthlete(player);
            storageService.saveCandidates(candidates.filter(c => c.id !== id));
        }
    },

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
    getPublicGameData: (id: string) => storageService.getGames().find(g => String(g.id) === id),

    // OKRS & GOVERNANÇA
    getOKRs: () => get<OKR>('fahub_okrs'),
    saveOKRs: (data: OKR[]) => set('fahub_okrs', data),
    getSignals: () => get<ObjectiveSignal>('fahub_signals'),
    sendSignal: (signal: Omit<ObjectiveSignal, 'id' | 'timestamp' | 'status'>) => {
        const current = get<ObjectiveSignal>('fahub_signals');
        const newSignal: ObjectiveSignal = {
            ...signal,
            id: `sig-${Date.now()}`,
            timestamp: new Date(),
            status: 'UNREAD'
        };
        set('fahub_signals', [newSignal, ...current].slice(0, 50));
    },

    // TEAMS
    getTeams: () => get<Team>('fahub_teams'),
    saveTeam: (t: Team) => set('fahub_teams', [...storageService.getTeams(), t]),

    // FINANCE
    getTransactions: () => get<Transaction>('fahub_transactions'),
    saveTransactions: (data: Transaction[]) => {
        set('fahub_transactions', data);
        storageService.notify('transactions');
    },
    getInvoices: () => get<Invoice>('fahub_invoices'),
    saveInvoices: (data: Invoice[]) => set('fahub_invoices', data),
    getSubscriptions: () => get<Subscription>('fahub_subscriptions'),
    saveSubscriptions: (data: Subscription[]) => set('fahub_subscriptions', data),
    getBudgets: () => get<Budget>('fahub_budgets'),
    saveBudgets: (data: Budget[]) => set('fahub_budgets', data),
    getBills: () => get<Bill>('fahub_bills'),
    saveBills: (data: Bill[]) => set('fahub_bills', data),
    generateMonthlyInvoices: () => {
        const subs = storageService.getSubscriptions().filter(s => s.active);
        const invoices = storageService.getInvoices();
        const players = storageService.getPlayers();
        const newInvoices: Invoice[] = [];
        subs.forEach(s => {
            s.assignedTo.forEach(pid => {
                const p = players.find(player => player.id === pid);
                newInvoices.push({
                    id: `inv-${Date.now()}-${pid}`,
                    status: 'PENDING',
                    amount: s.amount,
                    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    playerName: p?.name || 'Atleta',
                    title: s.title,
                    playerId: pid,
                    category: 'TUITION'
                });
            });
        });
        storageService.saveInvoices([...invoices, ...newInvoices]);
    },

    // SETTINGS
    getTeamSettings: (): TeamSettings => {
        const data = localStorage.getItem('fahub_settings');
        return data ? JSON.parse(data) : { id: '1', teamName: 'Gladiators FA', primaryColor: '#059669', plan: 'ALL_PRO' };
    },
    saveTeamSettings: (data: TeamSettings) => set('fahub_settings', data),

    // AUDIT
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
        storageService.notify('audit');
    },

    // OTHERS
    getActiveProgram: () => (localStorage.getItem('active_program') || 'TACKLE') as ProgramType,
    setActiveProgram: (p: ProgramType) => {
        localStorage.setItem('active_program', p);
        storageService.notify('activeProgram');
    },
    getPracticeSessions: () => get<PracticeSession>('fahub_practice'),
    savePracticeSessions: (data: PracticeSession[]) => {
        set('fahub_practice', data);
        storageService.notify('practice');
    },
    getSponsors: () => get<SponsorDeal>('fahub_sponsors'),
    saveSponsors: (data: SponsorDeal[]) => set('fahub_sponsors', data),
    getMarketplaceItems: () => get<MarketplaceItem>('fahub_marketplace'),
    saveMarketplaceItems: (data: MarketplaceItem[]) => set('fahub_marketplace', data),
    getEventSales: () => get<EventSale>('fahub_event_sales'),
    saveEventSales: (data: EventSale[]) => set('fahub_event_sales', data),
    getInventory: () => get<EquipmentItem>('fahub_inventory'),
    saveInventory: (data: EquipmentItem[]) => set('fahub_inventory', data),
    getConfederationStats: () => ({ totalAthletes: 4850, totalTeams: 18, totalGamesThisYear: 142, activeAffiliates: 8 }),
    getNationalTeamScouting: () => get<NationalTeamCandidate>('fahub_national_team_scouting'),
    getAffiliatesStatus: () => get<Affiliate>('fahub_affiliates'),
    getTransferRequests: () => get<TransferRequest>('fahub_transfers'),
    processTransfer: (id: string, decision: string, user: string) => {
        const current = get<TransferRequest>('fahub_transfers');
        const updated = current.map(t => t.id === id ? { ...t, status: (decision === 'APPROVE' ? 'APPROVED' : 'REJECTED') as any } : t);
        set('fahub_transfers', updated);
    },
    getClips: () => get<VideoClip>('fahub_clips'),
    saveCoachProfile: (userId: string, profile: any) => set(`coach_profile_${userId}`, profile),
    getTacticalPlays: () => get<TacticalPlay>('fahub_tactical_plays'),
    saveTacticalPlays: (data: TacticalPlay[]) => set('fahub_tactical_plays', data),
    getCourses: () => get<Course>('fahub_courses'),
    getPublicLeagueStats: () => get<any>('fahub_public_league_stats'),
    getEntitlements: () => get<Entitlement>('fahub_entitlements'),
    purchaseDigitalProduct: (userId: string, product: DigitalProduct) => {
        const entitlements = get<Entitlement>('fahub_entitlements');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + product.durationHours);
        const newEnt: Entitlement = { id: `ent-${Date.now()}`, userId, productId: product.id, expiresAt };
        set('fahub_entitlements', [...entitlements, newEnt]);
    },
    getLeague: (): League => {
        const data = localStorage.getItem('fahub_league');
        return data ? JSON.parse(data) : { id: '1', name: 'Liga Brasileira', season: '2025', teams: [] };
    },
    getTasks: () => get<KanbanTask>('fahub_tasks'),
    saveTasks: (data: KanbanTask[]) => set('fahub_tasks', data),
    getDocuments: () => get<TeamDocument>('fahub_documents'),
    saveDocuments: (data: TeamDocument[]) => set('fahub_documents', data),
    getRoadmap: () => get<RoadmapItem>('fahub_roadmap'),
    getProjectCompletion: () => {
        const roadmap = get<RoadmapItem>('fahub_roadmap');
        if (roadmap.length === 0) return 0;
        return Math.round((roadmap.filter(i => i.status === 'DONE').length / roadmap.length) * 100);
    },
    getSocialFeed: () => get<SocialFeedPost>('fahub_social_feed'),
    saveSocialFeedPost: (post: SocialFeedPost) => set('fahub_social_feed', [post, ...get<SocialFeedPost>('fahub_social_feed')]),
    toggleLikePost: (id: string) => {
        const feed = get<SocialFeedPost>('fahub_social_feed');
        set('fahub_social_feed', feed.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    },
    getStaff: () => get<StaffMember>('fahub_staff'),
    validateAthleteEligibility: (athleteId: string | number): { eligible: boolean, reasons: string[] } => {
        const athletes = get<Player>('fahub_players');
        const athlete = athletes.find(a => String(a.id) === String(athleteId));
        if (!athlete) return { eligible: false, reasons: ['Atleta não encontrado'] };
        const reasons: string[] = [];
        if (athlete.financialStatus !== 'OK' && athlete.financialStatus) reasons.push('Pendência Financeira');
        if (athlete.documentStatus !== 'OK' && athlete.documentStatus) reasons.push('Documentação Vencida/Ausente (BID)');
        return { eligible: reasons.length === 0, reasons };
    },
    getAthletes: () => get<Player>('fahub_players'),
};

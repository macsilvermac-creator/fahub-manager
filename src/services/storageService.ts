
import { 
    Player, PracticeSession, OKR, ObjectiveSignal, 
    UserRole, ProgramType, Transaction, TeamSettings, AuditLog,
    RecruitmentCandidate, Invoice, Subscription, Budget, Bill,
    SponsorDeal, MarketplaceItem, EventSale, ConfederationStats,
    NationalTeamCandidate, Affiliate, TransferRequest, League,
    VideoClip, TacticalPlay, RoadmapItem, Entitlement, DigitalProduct, Course, StaffMember, Game, EquipmentItem, KanbanTask, TeamDocument, Team, SocialFeedPost
} from '../types';

const get = <T>(key: string): T[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data, (k, v) => (k.toLowerCase().includes('date') || k === 'timestamp' || k === 'expiresat') ? new Date(v) : v) : [];
};

const set = <T>(key: string, data: T) => {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('storage_update'));
};

const subscribers: Record<string, (() => void)[]> = {};

export const storageService = {
    initializeRAM: () => {
        if (!localStorage.getItem('fahub_okrs')) {
            const initialOkrs: OKR[] = [
                { id: '1', title: 'Sustentabilidade Financeira', description: 'Meta macro da presidência', ownerRole: 'PRESIDENT', targetValue: 100, currentValue: 45, unit: '%', category: 'FINANCE', status: 'ON_TRACK', subordinatesCheck: true },
                { id: '2', title: 'Reduzir Inadimplência', description: 'Meta tática financeira', ownerRole: 'FINANCIAL_DIRECTOR', targetValue: 5, currentValue: 12, unit: '%', category: 'FINANCE', status: 'AT_RISK', parentOkrId: '1', subordinatesCheck: false }
            ];
            set('fahub_okrs', initialOkrs);
        }
        
        if (!localStorage.getItem('fahub_roadmap')) {
            const initialRoadmap: RoadmapItem[] = [
                { id: '1', day: 15, title: 'Protocolo de Sinais', description: 'Geração de alertas automáticos da diretoria para presidência.', status: 'DONE' },
                { id: '2', day: 16, title: 'Motor de OKRs', description: 'Hierarquia de metas e cascateamento base-topo.', status: 'DOING' },
                { id: '3', day: 17, title: 'Modo Sideline High-Contrast', description: 'UI otimizada para sol e chuva no campo.', status: 'TODO' }
            ];
            set('fahub_roadmap', initialRoadmap);
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

    setCurrentUser: (user: any) => {
        set('gridiron_current_user', user);
        storageService.notify('currentUser');
    },

    // OKRS & GOVERNANÇA
    getOKRs: () => get<OKR>('fahub_okrs'),
    saveOKRs: (data: OKR[]) => {
        set('fahub_okrs', data);
        storageService.notify('okrs');
    },
    
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
        storageService.notify('signals');
    },

    // TRAVAS DE PROTOCOLO
    validateAthleteEligibility: (athleteId: string | number): { eligible: boolean, reasons: string[] } => {
        const athletes = get<Player>('fahub_players');
        const athlete = athletes.find(a => String(a.id) === String(athleteId));
        if (!athlete) return { eligible: false, reasons: ['Atleta não encontrado'] };

        const reasons: string[] = [];
        if (athlete.financialStatus !== 'OK') reasons.push('Pendência Financeira');
        if (athlete.documentStatus !== 'OK') reasons.push('Documentação Vencida/Ausente (BID)');
        
        return {
            eligible: reasons.length === 0,
            reasons
        };
    },

    // PLAYERS / ATHLETES
    getPlayers: () => get<Player>('fahub_players'),
    getAthletes: () => get<Player>('fahub_players'),
    savePlayers: (data: Player[]) => {
        set('fahub_players', data);
        storageService.notify('players');
    },
    registerAthlete: (athlete: Player) => {
        const current = storageService.getPlayers();
        storageService.savePlayers([...current, athlete]);
    },
    saveAthlete: (athlete: Player) => {
        const current = storageService.getPlayers();
        const updated = current.map(p => String(p.id) === String(athlete.id) ? athlete : p);
        if (!updated.some(p => String(p.id) === String(athlete.id))) {
            updated.push(athlete);
        }
        storageService.savePlayers(updated);
    },
    getAthleteByUserId: (userId: string) => {
        return storageService.getPlayers().find(p => String((p as any).userId) === userId || String(p.id) === userId);
    },
    getAthleteStatsHistory: (id: string | number) => {
        // Mock data for athlete stats history
        return [
            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90), rating: 70 },
            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), rating: 75 },
            { date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), rating: 82 },
            { date: new Date(), rating: 88 }
        ];
    },

    // RECRUITMENT / CANDIDATES
    getCandidates: () => get<RecruitmentCandidate>('fahub_candidates'),
    saveCandidates: (data: RecruitmentCandidate[]) => {
        set('fahub_candidates', data);
        storageService.notify('candidates');
    },
    approveCandidate: (id: string) => {
        const candidates = storageService.getCandidates();
        const updated = candidates.map(c => c.id === id ? { ...c, status: 'SELECTED' as const } : c);
        storageService.saveCandidates(updated);
    },

    // FINANCE
    getTransactions: () => get<Transaction>('fahub_transactions'),
    saveTransactions: (data: Transaction[]) => {
        set('fahub_transactions', data);
        storageService.notify('transactions');
    },
    getInvoices: () => get<Invoice>('fahub_invoices'),
    saveInvoices: (data: Invoice[]) => {
        set('fahub_invoices', data);
        storageService.notify('invoices');
    },
    getSubscriptions: () => get<Subscription>('fahub_subscriptions'),
    saveSubscriptions: (data: Subscription[]) => {
        set('fahub_subscriptions', data);
        storageService.notify('subscriptions');
    },
    getBudgets: () => get<Budget>('fahub_budgets'),
    saveBudgets: (data: Budget[]) => {
        set('fahub_budgets', data);
        storageService.notify('budgets');
    },
    getBills: () => get<Bill>('fahub_bills'),
    getEventSales: () => get<EventSale>('fahub_event_sales'),
    saveEventSales: (data: EventSale[]) => {
        set('fahub_event_sales', data);
        storageService.notify('event_sales');
    },
    generateMonthlyInvoices: () => {
        const subscriptions = storageService.getSubscriptions();
        const players = storageService.getPlayers();
        const invoices = storageService.getInvoices();
        
        const newInvoices: Invoice[] = [];
        subscriptions.filter(s => s.active).forEach(sub => {
            sub.assignedTo.forEach(pid => {
                const player = players.find(p => String(p.id) === String(pid));
                if (player) {
                    newInvoices.push({
                        id: `inv-${Date.now()}-${pid}`,
                        playerId: pid,
                        playerName: player.name,
                        title: sub.title,
                        amount: sub.amount,
                        dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
                        status: 'PENDING',
                        category: 'TUITION'
                    });
                }
            });
        });
        storageService.saveInvoices([...invoices, ...newInvoices]);
    },

    // SPONSORS & MARKETPLACE
    getSponsors: () => get<SponsorDeal>('fahub_sponsors'),
    saveSponsors: (data: SponsorDeal[]) => {
        set('fahub_sponsors', data);
        storageService.notify('sponsors');
    },
    getMarketplaceItems: () => get<MarketplaceItem>('fahub_marketplace'),
    saveMarketplaceItems: (data: MarketplaceItem[]) => {
        set('fahub_marketplace', data);
        storageService.notify('marketplace');
    },

    // INVENTORY
    getInventory: () => get<EquipmentItem>('fahub_inventory'),
    saveInventory: (data: EquipmentItem[]) => {
        set('fahub_inventory', data);
        storageService.notify('inventory');
    },

    // GAMES & PRACTICE
    getGames: () => get<Game>('fahub_games'),
    saveGames: (data: Game[]) => {
        set('fahub_games', data);
        storageService.notify('games');
    },
    updateLiveGame: (gameId: string | number, updates: Partial<Game>) => {
        const games = storageService.getGames();
        const updated = games.map(g => String(g.id) === String(gameId) ? { ...g, ...updates } : g);
        storageService.saveGames(updated);
    },
    getPublicGameData: (id: string) => {
        return storageService.getGames().find(g => String(g.id) === id) || null;
    },
    getPracticeSessions: () => get<PracticeSession>('fahub_practice'),
    savePracticeSessions: (data: PracticeSession[]) => {
        set('fahub_practice', data);
        storageService.notify('practice');
    },

    // FEDERATION / LEAGUE
    getLeague: (): League => {
        const data = localStorage.getItem('fahub_league');
        return data ? JSON.parse(data) : { id: '1', name: 'Liga Brasileira', season: '2025', teams: [] };
    },
    getPublicLeagueStats: () => {
        const league = storageService.getLeague();
        return {
            leagueTable: league.teams || [],
            name: league.name,
            season: league.season,
            leaders: {
                passing: [],
                rushing: [],
                defense: []
            }
        };
    },
    getConfederationStats: (): ConfederationStats => ({ totalAthletes: 4850, totalTeams: 18, totalGamesThisYear: 142, activeAffiliates: 8 }),
    getNationalTeamScouting: () => get<NationalTeamCandidate>('fahub_national_scouting'),
    getAffiliatesStatus: () => get<Affiliate>('fahub_affiliates'),
    getTransferRequests: () => get<TransferRequest>('fahub_transfers'),
    processTransfer: (id: string, decision: string, user: string) => {
        const current = get<TransferRequest>('fahub_transfers');
        const updated = current.map(t => t.id === id ? { ...t, status: decision === 'APPROVE' ? 'APPROVED' : 'REJECTED' } as TransferRequest : t);
        set('fahub_transfers', updated);
    },

    // TACTICAL & VIDEO
    getTacticalPlays: () => get<TacticalPlay>('fahub_tactical_plays'),
    saveTacticalPlays: (data: TacticalPlay[]) => {
        set('fahub_tactical_plays', data);
        storageService.notify('tactical_plays');
    },
    getClips: () => get<VideoClip>('fahub_clips'),

    // ROADMAP & COMPLETION
    getRoadmap: () => get<RoadmapItem>('fahub_roadmap'),
    getProjectCompletion: () => 75,

    // SETTINGS
    getTeamSettings: (): TeamSettings => {
        const data = localStorage.getItem('fahub_settings');
        return data ? JSON.parse(data) : { id: '1', teamName: 'Gladiators FA', primaryColor: '#059669', plan: 'ALL_PRO' };
    },
    saveTeamSettings: (data: TeamSettings) => {
        set('fahub_settings', data);
        storageService.notify('settings');
    },

    // ADM & STAFF
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
    },
    getTasks: () => get<KanbanTask>('fahub_tasks'),
    saveTasks: (data: KanbanTask[]) => {
        set('fahub_tasks', data);
        storageService.notify('tasks');
    },
    getDocuments: () => get<TeamDocument>('fahub_documents'),
    saveDocuments: (data: TeamDocument[]) => {
        set('fahub_documents', data);
        storageService.notify('documents');
    },
    getStaff: () => get<StaffMember>('fahub_staff'),
    saveCoachProfile: (userId: string, profile: any) => {
        const profiles = JSON.parse(localStorage.getItem('fahub_coach_profiles') || '{}');
        profiles[userId] = profile;
        localStorage.setItem('fahub_coach_profiles', JSON.stringify(profiles));
    },

    // MISC
    getActiveProgram: () => (localStorage.getItem('active_program') || 'TACKLE') as ProgramType,
    setActiveProgram: (p: ProgramType) => {
        localStorage.setItem('active_program', p);
        storageService.notify('activeProgram');
    },
    getTeams: () => get<Team>('fahub_teams'),
    saveTeam: (team: Team) => {
        const teams = storageService.getTeams();
        const updated = teams.map(t => t.id === team.id ? team : t);
        if (!updated.some(t => t.id === team.id)) {
            updated.push(team);
        }
        set('fahub_teams', updated);
        storageService.notify('teams');
    },

    // ACADEMY
    getCourses: () => get<Course>('fahub_courses'),

    // DIGITAL PRODUCTS & ENTITLEMENTS
    getEntitlements: () => get<Entitlement>('fahub_entitlements'),
    purchaseDigitalProduct: (userId: string, product: DigitalProduct) => {
        const entitlements = storageService.getEntitlements();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + product.durationHours);
        
        const newEntitlement: Entitlement = {
            id: `ent-${Date.now()}`,
            userId,
            productId: product.id,
            expiresAt
        };
        set('fahub_entitlements', [...entitlements, newEntitlement]);
        storageService.notify('entitlements');
    },

    // SOCIAL
    getSocialFeed: () => get<SocialFeedPost>('fahub_social_feed'),
    saveSocialFeedPost: (post: SocialFeedPost) => {
        const feed = storageService.getSocialFeed();
        set('fahub_social_feed', [post, ...feed]);
        storageService.notify('social_feed');
    },
    toggleLikePost: (postId: string) => {
        const feed = storageService.getSocialFeed();
        const updated = feed.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p);
        set('fahub_social_feed', updated);
        storageService.notify('social_feed');
    },
};


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

const get = <T>(key: string): T[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
};

const set = <T>(key: string, data: T) => {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('storage_update'));
};

export const storageService = {
    initializeRAM: () => {
        // SEED: CONFIGURAÇÕES DO TIME
        if (!localStorage.getItem('fahub_settings')) {
            set('fahub_settings', {
                id: '1',
                teamName: 'Joinville Gladiators',
                logoUrl: 'https://ui-avatars.com/api/?name=JG&background=059669&color=fff',
                primaryColor: '#059669',
                address: 'Joinville, SC',
                plan: 'ALL_PRO'
            });
        }

        // SEED: ATLETAS (MIX DE MODALIDADES)
        if (!localStorage.getItem('fahub_players')) {
            const mockPlayers: Player[] = [
                { id: 'p1', name: 'Lucas "Thor"', position: 'QB', jerseyNumber: 12, height: '1.85m', weight: 92, class: 'Veterano', avatarUrl: 'https://i.pravatar.cc/150?u=p1', level: 8, xp: 4500, rating: 88, status: 'ACTIVE', program: 'TACKLE', commitmentLevel: 95, attendanceRate: 100 },
                { id: 'p2', name: 'Mariana Silva', position: 'WR', jerseyNumber: 80, height: '1.70m', weight: 65, class: 'Sênior', avatarUrl: 'https://i.pravatar.cc/150?u=p2', level: 6, xp: 2200, rating: 82, status: 'ACTIVE', program: 'FLAG', commitmentLevel: 88, attendanceRate: 100 },
                { id: 'p3', name: 'Roberto Carlos', position: 'LB', jerseyNumber: 55, height: '1.82m', weight: 105, class: 'Sênior', avatarUrl: 'https://i.pravatar.cc/150?u=p3', level: 7, xp: 3100, rating: 85, status: 'ACTIVE', program: 'TACKLE', commitmentLevel: 90, attendanceRate: 100 },
                { id: 'p4', name: 'Julia Costa', position: 'DB', jerseyNumber: 21, height: '1.65m', weight: 60, class: 'Rookie', avatarUrl: 'https://i.pravatar.cc/150?u=p4', level: 2, xp: 400, rating: 72, status: 'INCUBATING', program: 'FLAG', incubation: { cultureAccepted: true, fundamentalsProgress: 45, fieldEvaluationScore: 0, status: 'FUNDAMENTALS' }, attendanceRate: 100 }
            ];
            set('fahub_players', mockPlayers);
        }

        // SEED: NOVATOS (10 CANDIDATOS)
        if (!localStorage.getItem('fahub_candidates')) {
            const candidates: RecruitmentCandidate[] = Array.from({ length: 10 }).map((_, i) => ({
                id: `cand-${i}`,
                name: `Recruta ${i + 1}`,
                position: i % 2 === 0 ? 'OL' : 'WR',
                weight: 70 + (i * 5),
                height: '1.80m',
                status: (i < 3 ? 'EVALUATED' : 'NEW') as any,
                bibNumber: 100 + i,
                rating: 60 + i
            }));
            set('fahub_candidates', candidates);
        }

        // SEED: JOGOS E CALENDÁRIO
        if (!localStorage.getItem('fahub_games')) {
            const games: Game[] = [
                { id: 101, opponent: 'Istepuôs FA', date: new Date('2025-06-15T14:00:00'), location: 'Home', status: 'SCHEDULED', homeTeamName: 'Gladiators' },
                { id: 102, opponent: 'Silverhawks', date: new Date('2025-05-20T10:00:00'), location: 'Away', status: 'SCHEDULED', homeTeamName: 'Gladiators' },
                { id: 103, opponent: 'Timbó Rex', date: new Date('2024-11-10T15:00:00'), location: 'Away', status: 'FINAL', score: '24-21', result: 'W' }
            ];
            set('fahub_games', games);
        }

        // SEED: FEDERAÇÕES E LIGA
        if (!localStorage.getItem('fahub_league')) {
            set('fahub_league', {
                id: 'l1',
                name: 'Campeonato Catarinense 2025',
                season: '2025',
                teams: [
                    { teamId: 't1', teamName: 'Gladiators', wins: 3, losses: 0, pointsFor: 120, pointsAgainst: 45 },
                    { teamId: 't2', teamName: 'Istepuôs', wins: 2, losses: 1, pointsFor: 90, pointsAgainst: 80 },
                    { teamId: 't3', teamName: 'Timbó Rex', wins: 1, losses: 2, pointsFor: 70, pointsAgainst: 95 }
                ]
            });
        }

        // SEED: OKRs (METAS MASTER)
        if (!localStorage.getItem('fahub_okrs')) {
            set('fahub_okrs', [
                { id: 'okr1', title: 'Sustentabilidade Financeira', ownerRole: 'PRESIDENT', targetValue: 100000, currentValue: 45800, unit: 'R$', category: 'FINANCE', status: 'ON_TRACK', subordinatesCheck: false },
                { id: 'okr2', title: 'Expansão Feminina (Flag)', ownerRole: 'SPORTS_DIRECTOR', targetValue: 20, currentValue: 12, unit: 'Atletas', category: 'SPORTS', status: 'ON_TRACK', subordinatesCheck: false }
            ]);
        }

        // SEED: AUDITORIA
        if (!localStorage.getItem('fahub_audit')) {
            set('fahub_audit', [
                { id: 'a1', action: 'LOGIN', details: 'Presidente acessou o War Room', timestamp: new Date(), userId: 'dev', userName: 'Presidente', role: 'MASTER' }
            ]);
        }
    },

    subscribe: (key: string, callback: () => void) => {
        const handler = () => callback();
        window.addEventListener('storage_update', handler);
        return () => window.removeEventListener('storage_update', handler);
    },

    notify: (key: string) => {
        window.dispatchEvent(new Event('storage_update'));
        return true;
    },

    getCurrentUser: () => JSON.parse(localStorage.getItem('gridiron_current_user') || '{"id":"dev","role":"MASTER","name":"Admin"}'),
    setCurrentUser: (user: any) => localStorage.setItem('gridiron_current_user', JSON.stringify(user)),

    getPlayers: () => get<Player>('fahub_players'),
    savePlayers: (data: Player[]) => set('fahub_players', data),
    getAthletes: () => get<Player>('fahub_players'),
    registerAthlete: (p: Player) => {
        const players = get<Player>('fahub_players');
        set('fahub_players', [...players, p]);
    },
    getAthleteByUserId: (id: string) => storageService.getPlayers().find(p => String(p.id) === id),
    saveAthlete: (p: Player) => set('fahub_players', [...get<Player>('fahub_players').filter(x => x.id !== p.id), p]),
    
    getCandidates: () => get<RecruitmentCandidate>('fahub_candidates'),
    saveCandidates: (data: RecruitmentCandidate[]) => set('fahub_candidates', data),
    approveCandidate: (id: string) => {
        const candidates = storageService.getCandidates();
        const cand = candidates.find(c => c.id === id);
        if (cand) {
            const players = storageService.getPlayers();
            const newPlayer: Player = { id: Date.now(), name: cand.name, position: cand.position, jerseyNumber: 0, height: '1.80m', weight: cand.weight, class: 'Rookie', avatarUrl: '', level: 1, xp: 0, rating: cand.rating || 60, status: 'INCUBATING', program: 'TACKLE', attendanceRate: 100 };
            set('fahub_players', [...players, newPlayer]);
            set('fahub_candidates', candidates.filter(c => c.id !== id));
        }
    },

    getGames: () => get<Game>('fahub_games'),
    saveGames: (data: Game[]) => set('fahub_games', data),
    updateLiveGame: (id: any, updates: any) => {
        const games = storageService.getGames();
        set('fahub_games', games.map(g => String(g.id) === String(id) ? { ...g, ...updates } : g));
    },

    getPracticeSessions: () => get<PracticeSession>('fahub_practice'),
    savePracticeSessions: (data: PracticeSession[]) => set('fahub_practice', data),
    togglePracticeAttendance: (practiceId: string, playerId: string) => {
        const sessions = get<PracticeSession>('fahub_practice');
        const updated = sessions.map(s => {
            if (String(s.id) === practiceId) {
                const attendees = s.attendees || [];
                return {
                    ...s,
                    attendees: attendees.includes(playerId) 
                        ? attendees.filter(a => a !== playerId) 
                        : [...attendees, playerId]
                };
            }
            return s;
        });
        set('fahub_practice', updated);
    },

    getOKRs: () => get<OKR>('fahub_okrs'),
    saveOKRs: (data: OKR[]) => set('fahub_okrs', data),
    getObjectives: () => get<Objective>('fahub_objectives'),
    saveObjectives: (data: Objective[]) => set('fahub_objectives', data),

    getTransactions: () => get<Transaction>('fahub_transactions'),
    saveTransactions: (data: Transaction[]) => set('fahub_transactions', data),
    getInvoices: () => get<Invoice>('fahub_invoices'),
    getSubscriptions: () => get<Subscription>('fahub_subscriptions'),
    saveSubscriptions: (data: Subscription[]) => set('fahub_subscriptions', data),
    getBudgets: () => get<Budget>('fahub_budgets'),
    saveBudgets: (data: Budget[]) => set('fahub_budgets', data),
    getBills: () => get<Bill>('fahub_bills'),
    generateMonthlyInvoices: () => { console.log('Monthly invoices generated'); },

    getAuditLogs: () => get<AuditLog>('fahub_audit'),
    logAuditAction: (action: string, details: string) => {
        const user = storageService.getCurrentUser();
        const logs = get<AuditLog>('fahub_audit');
        set('fahub_audit', [{ id: Date.now().toString(), action, details, timestamp: new Date(), userId: user.id, userName: user.name, role: user.role }, ...logs]);
    },
    logAction: (action: string, details: string) => storageService.logAuditAction(action, details),

    getTeamSettings: () => JSON.parse(localStorage.getItem('fahub_settings') || '{}'),
    saveTeamSettings: (data: any) => localStorage.setItem('fahub_settings', JSON.stringify(data)),
    
    getRoadmap: () => [
        { id: '1', day: 1, title: 'Fundação', description: 'Base de dados e Persona Matrix', status: 'DONE' },
        { id: '2', day: 2, title: 'IA Scouting', description: 'Integração Gemini 3.0 Pro', status: 'DONE' },
        { id: '3', day: 3, title: 'Broadcast', description: 'Overlay e Spotter Chart', status: 'DOING' }
    ],
    getProjectCompletion: () => 85,

    getStaff: () => get<StaffMember>('fahub_staff').length ? get<StaffMember>('fahub_staff') : [
        { id: 's1', name: 'Coach Guto', role: 'HEAD_COACH', email: 'guto@gladiators.com', phone: '47 9999-0000', contract: { active: true, type: 'PAID', value: 2500, signed: true }, documentsPending: false }
    ],
    getSponsors: () => get<SponsorDeal>('fahub_sponsors').length ? get<SponsorDeal>('fahub_sponsors') : [
        { id: 'sp1', companyName: 'Academia Iron', contactPerson: 'Marcos', status: 'CLOSED_WON', value: 12000, lastInteraction: new Date() }
    ],
    saveSponsors: (data: SponsorDeal[]) => set('fahub_sponsors', data),
    getMarketplaceItems: () => get<MarketplaceItem>('fahub_marketplace').length ? get<MarketplaceItem>('fahub_marketplace') : [
        { id: 'm1', title: 'Camiseta Oficial 2025', description: 'Edição Especial Joinville', price: 89.90, category: 'MERCH', sellerType: 'TEAM_STORE', sellerName: 'Gladiators', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', isSold: false }
    ],
    saveMarketplaceItems: (data: MarketplaceItem[]) => set('fahub_marketplace', data),
    getEventSales: () => get<EventSale>('fahub_event_sales').length ? get<EventSale>('fahub_event_sales') : [
        { id: 'e1', type: 'TICKET', itemName: 'Ingresso vs Istepuôs', quantity: 2, totalAmount: 40, timestamp: new Date() }
    ],
    saveEventSales: (data: EventSale[]) => set('fahub_event_sales', data),
    getInventory: () => get<EquipmentItem>('fahub_inventory').length ? get<EquipmentItem>('fahub_inventory') : [
        { id: 'i1', name: 'Capacete Riddell Speed', category: 'HELMET', quantity: 15, condition: 'USED', forSale: false, acquisitionDate: new Date() }
    ],
    saveInventory: (data: EquipmentItem[]) => set('fahub_inventory', data),
    getPublicGameData: (id: string) => storageService.getGames().find(g => String(g.id) === id),
    getConfederationStats: () => ({ totalAthletes: 4850, totalTeams: 18, totalGamesThisYear: 142, activeAffiliates: 8 }),
    getNationalTeamScouting: () => [],
    getAffiliatesStatus: () => [],
    getTransferRequests: () => [],
    getActiveProgram: () => (localStorage.getItem('active_program') || 'TACKLE') as ProgramType,
    setActiveProgram: (p: ProgramType) => localStorage.setItem('active_program', p),
    getLeague: () => JSON.parse(localStorage.getItem('fahub_league') || '{}'),

    getAnnouncements: () => get<Announcement>('fahub_announcements'),
    saveAnnouncements: (data: Announcement[]) => set('fahub_announcements', data),
    getChatMessages: () => get<ChatMessage>('fahub_chat'),
    saveChatMessages: (data: ChatMessage[]) => set('fahub_chat', data),
    getDocuments: () => get<TeamDocument>('fahub_documents'),
    saveDocuments: (data: TeamDocument[]) => set('fahub_documents', data),
    getClips: () => get<VideoClip>('fahub_clips'),
    getTacticalPlays: () => get<TacticalPlay>('fahub_plays'),
    saveTacticalPlays: (data: TacticalPlay[]) => set('fahub_plays', data),
    getCourses: () => get<Course>('fahub_courses'),
    getTasks: () => get<KanbanTask>('fahub_tasks'),
    saveTasks: (data: KanbanTask[]) => set('fahub_tasks', data),
    getSocialPosts: () => get<SocialPost>('fahub_social_posts'),
    saveSocialPosts: (data: SocialPost[]) => set('fahub_social_posts', data),
    seedDatabaseToCloud: async () => { console.log('Seeding...'); },
    uploadFile: async (file: File, folder: string) => `https://mock.url/${folder}/${file.name}`,
    getSocialFeed: () => get<SocialFeedPost>('fahub_social_feed'),
    saveSocialFeedPost: (p: SocialFeedPost) => set('fahub_social_feed', [p, ...get<SocialFeedPost>('fahub_social_feed')]),
    toggleLikePost: (id: string) => {
        const feed = get<SocialFeedPost>('fahub_social_feed');
        set('fahub_social_feed', feed.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    },
    getYouthClasses: () => get<YouthClass>('fahub_youth_classes'),
    saveYouthClasses: (data: YouthClass[]) => set('fahub_youth_classes', data),
    getYouthStudents: () => get<YouthStudent>('fahub_youth_students'),
    processTransfer: (id: string, decision: string, actor: string) => { console.log(`${actor} processed transfer ${id}: ${decision}`); },
    getAthleteStatsHistory: (id: string | number) => [],
    getPublicLeagueStats: () => ({ leagueTable: [], name: 'Liga', season: '2025', leaders: { passing: [], rushing: [], defense: [] } }),
    createChampionship: (name: string, year: number, div: string) => { console.log(`Created ${name}`); },
    sendSignal: (signal: any) => { console.log('Signal sent', signal); },
    getEntitlements: () => get<Entitlement>('fahub_entitlements'),
    purchaseDigitalProduct: (userId: string, product: DigitalProduct) => { 
        const e = get<Entitlement>('fahub_entitlements');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + product.durationHours);
        set('fahub_entitlements', [...e, { id: `ent-${Date.now()}`, userId, productId: product.id, expiresAt }]);
    },
    saveCoachProfile: (userId: string, profile: any) => { localStorage.setItem(`coach_profile_${userId}`, JSON.stringify(profile)); },
    getTeams: () => get<Team>('fahub_teams'),
    saveTeam: (team: Team) => set('fahub_teams', [...get<Team>('fahub_teams'), team])
};
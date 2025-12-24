
import { 
    Player, Game, PracticeSession, TeamSettings, 
    AuditLog, Objective, Transaction, Invoice, 
    MarketplaceItem, SponsorDeal, EventSale, OKR, RoadmapItem,
    VideoClip, Course, SocialFeedPost, UserRole, Subscription, Budget, Bill, 
    Announcement, ChatMessage, TeamDocument, TacticalPlay, League, KanbanTask,
    SocialPost, EquipmentItem, StaffMember, YouthClass, YouthStudent, 
    ConfederationStats, NationalTeamCandidate, Affiliate, TransferRequest, RecruitmentCandidate,
    Entitlement, DigitalProduct, ObjectiveSignal, LeagueRanking, Team
} from '../types';

// Cache em memória para evitar parses constantes que consomem RAM
const memoryCache: Record<string, any> = {};

const set = (key: string, data: any) => {
    const stringified = JSON.stringify(data);
    localStorage.setItem(key, stringified);
    memoryCache[key] = data; // Atualiza cache de referência
    window.dispatchEvent(new Event('storage_update'));
};

const get = <T>(key: string): T[] => {
    // Retorna do cache se disponível para poupar CPU/RAM
    if (memoryCache[key]) return memoryCache[key];
    
    const data = localStorage.getItem(key);
    const parsed = data ? JSON.parse(data) : [];
    memoryCache[key] = parsed;
    return parsed;
};

export const storageService = {
    initializeRAM: () => {
        // Inicialização preguiçosa (Lazy) apenas se necessário
        if (!localStorage.getItem('fahub_settings')) {
            storageService.saveTeamSettings({
                id: '1',
                teamName: 'Joinville Gladiators',
                logoUrl: 'https://ui-avatars.com/api/?name=JG&background=059669&color=fff',
                primaryColor: '#059669',
                address: 'Joinville, SC',
                plan: 'ALL_PRO',
                sportType: 'TACKLE'
            });
        }
        
        if (get('fahub_players').length === 0) {
            set('fahub_players', [
                { 
                    id: 'u1', 
                    name: 'Lucas Thor', 
                    position: 'QB', 
                    jerseyNumber: 12, 
                    level: 15, 
                    xp: 450, 
                    rating: 88, 
                    status: 'ACTIVE',
                    height: "1.85m",
                    weight: 92,
                    avatarUrl: "https://ui-avatars.com/api/?name=LT&background=059669&color=fff",
                    registration: {
                        cpf: '000.000.000-00',
                        fullLegalName: 'Lucas da Silva Thor',
                        birthDate: new Date('1998-05-15'),
                        documentStatus: 'COMPLETE'
                    },
                    stats: { ovr: 88, speed: 85, strength: 80, agility: 75, tacticalIQ: 95 }
                }
            ]);
        }
    },

    subscribe: (key: string, callback: () => void) => {
        const handler = () => callback();
        window.addEventListener('storage_update', handler);
        return () => window.removeEventListener('storage_update', handler);
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('gridiron_current_user');
        return user ? JSON.parse(user) : { role: 'MASTER', name: 'Lucas Thor', id: 'u1', program: 'TACKLE' };
    },
    
    setCurrentUser: (u: any) => set('gridiron_current_user', u),
    
    getPracticeSessions: () => get<PracticeSession>('fahub_practice'),
    savePracticeSessions: (data: PracticeSession[]) => set('fahub_practice', data),

    getPlayers: () => get<Player>('fahub_players'),
    savePlayers: (data: Player[]) => set('fahub_players', data),
    registerAthlete: (player: Player) => set('fahub_players', [...get<Player>('fahub_players'), player]),

    getGames: () => get<Game>('fahub_games'),
    saveGames: (data: Game[]) => set('fahub_games', data),
    updateLiveGame: (id: any, updates: any) => {
        const games = get<Game>('fahub_games');
        set('fahub_games', games.map(g => g.id === id ? { ...g, ...updates } : g));
    },

    getTeamSettings: (): TeamSettings => {
        if (memoryCache['fahub_settings']) return memoryCache['fahub_settings'];
        const data = localStorage.getItem('fahub_settings');
        const parsed = data ? JSON.parse(data) : { id: '1', teamName: 'Gladiators', logoUrl: '', primaryColor: '#059669' };
        memoryCache['fahub_settings'] = parsed;
        return parsed;
    },

    saveTeamSettings: (data: TeamSettings) => set('fahub_settings', data),
    
    getAuditLogs: () => get<AuditLog>('fahub_audit'),
    logAuditAction: (action: string, details: string) => {
        const logs = get<AuditLog>('fahub_audit');
        const user = storageService.getCurrentUser();
        set('fahub_audit', [{ id: Date.now().toString(), action, details, timestamp: new Date(), userName: user.name, role: user.role }, ...logs.slice(0, 49)]); // Limita a 50 logs para poupar RAM
    },

    getTransactions: () => get<Transaction>('fahub_transactions'),
    saveTransactions: (data: Transaction[]) => set('fahub_transactions', data),
    getInvoices: () => get<Invoice>('fahub_invoices'),
    saveInvoices: (data: Invoice[]) => set('fahub_invoices', data),
    getObjectives: () => get<Objective>('fahub_objectives'),
    saveObjectives: (data: Objective[]) => set('fahub_objectives', data),
    getOKRs: () => get<OKR>('fahub_okrs'),
    saveOKRs: (data: OKR[]) => set('fahub_okrs', data),
    getTacticalPlays: () => get<TacticalPlay>('fahub_tactical_plays'),
    saveTacticalPlays: (data: TacticalPlay[]) => set('fahub_tactical_plays', data),
    getCourses: () => get<Course>('fahub_courses'),
    saveCourses: (data: Course[]) => set('fahub_courses', data),
    getSponsors: () => get<SponsorDeal>('fahub_sponsors'),
    saveSponsors: (data: SponsorDeal[]) => set('fahub_sponsors', data),
    getEventSales: () => get<EventSale>('fahub_event_sales'),
    saveEventSales: (data: EventSale[]) => set('fahub_event_sales', data),
    getClips: () => get<VideoClip>('fahub_clips'),
    saveClips: (data: VideoClip[]) => set('fahub_clips', data),
    getSocialFeed: () => get<SocialFeedPost>('fahub_social_feed'),
    saveSocialFeedPost: (post: SocialFeedPost) => set('fahub_social_feed', [post, ...get<SocialFeedPost>('fahub_social_feed')].slice(0, 19)), // Limita feed
    toggleLikePost: (id: string) => {
        const feed = get<SocialFeedPost>('fahub_social_feed');
        set('fahub_social_feed', feed.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    },

    getAthleteStatsHistory: (id: any) => [
        { date: '2023-10-01', ovr: 70 },
        { date: '2023-11-01', ovr: 75 },
        { date: '2023-12-01', ovr: 88 }
    ],

    getActiveProgram: () => 'TACKLE',
    getPublicLeagueStats: () => ({ name: 'Liga Catarinense', season: '2025', leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),
    getPublicGameData: (id: string) => ({ id, opponent: 'Bulls', score: '21-0', status: 'IN_PROGRESS' }),
    getEntitlements: () => get<Entitlement>('fahub_entitlements'),
    purchaseDigitalProduct: (userId: string, product: DigitalProduct) => {
        const entries = get<Entitlement>('fahub_entitlements');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + product.durationHours);
        const newEnt: Entitlement = { id: `ent-${Date.now()}`, userId, productId: product.id, expiresAt };
        set('fahub_entitlements', [...entries, newEnt]);
    },
    togglePracticeAttendance: (practiceId: string, playerId: string) => {
        const sessions = get<PracticeSession>('fahub_practice');
        set('fahub_practice', sessions.map(s => {
            if (String(s.id) === practiceId) {
                const attendees = s.attendees || [];
                return {
                    ...s,
                    attendees: attendees.includes(playerId) ? attendees.filter(a => a !== playerId) : [...attendees, playerId]
                };
            }
            return s;
        }));
    },
    getSubscriptions: () => get<Subscription>('fahub_subs'),
    getBudgets: () => get<Budget>('fahub_budgets'),
    getBills: () => get<Bill>('fahub_bills'),
    getAnnouncements: () => get<Announcement>('fahub_announcements'),
    saveAnnouncements: (data: Announcement[]) => set('fahub_announcements', data),
    getChatMessages: () => get<ChatMessage>('fahub_chat'),
    saveChatMessages: (data: ChatMessage[]) => set('fahub_chat', data),
    getDocuments: () => get<TeamDocument>('fahub_docs'),
    saveDocuments: (data: TeamDocument[]) => set('fahub_docs', data),
    getLeague: () => {
        if (memoryCache['fahub_league']) return memoryCache['fahub_league'];
        const data = localStorage.getItem('fahub_league');
        const parsed = data ? JSON.parse(data) : { id: 'l1', name: 'Liga Brasileira', season: '2025', teams: [] };
        memoryCache['fahub_league'] = parsed;
        return parsed;
    },
    getMarketplaceItems: () => get<MarketplaceItem>('fahub_marketplace'),
    saveMarketplaceItems: (data: MarketplaceItem[]) => set('fahub_marketplace', data),
    getTasks: () => get<KanbanTask>('fahub_tasks'),
    saveTasks: (data: KanbanTask[]) => set('fahub_tasks', data),
    getSocialPosts: () => get<SocialPost>('fahub_social_posts'),
    saveSocialPostsV2: (data: SocialPost[]) => set('fahub_social_posts', data),
    uploadFile: async (file: File, folder: string) => URL.createObjectURL(file),
    getInventory: () => get<EquipmentItem>('fahub_inventory'),
    saveInventory: (data: EquipmentItem[]) => set('fahub_inventory', data),
    getStaff: () => get<StaffMember>('fahub_staff'),
    getYouthClasses: () => get<YouthClass>('fahub_youth_classes'),
    getYouthStudents: () => get<YouthStudent>('fahub_youth_students'),
    saveYouthClasses: (data: YouthClass[]) => set('fahub_youth_classes', data),
    getConfederationStats: (): ConfederationStats => ({ totalAthletes: 4850, totalTeams: 120, totalGamesThisYear: 350, activeAffiliates: 18 }),
    getNationalTeamScouting: () => get<NationalTeamCandidate>('fahub_national_scouting'),
    getAffiliatesStatus: () => get<Affiliate>('fahub_affiliates'),
    getTransferRequests: () => get<TransferRequest>('fahub_transfers'),
    processTransfer: (id: string, decision: 'APPROVE' | 'REJECT', admin: string) => {
        const transfers = get<TransferRequest>('fahub_transfers');
        set('fahub_transfers', transfers.map(t => t.id === id ? { ...t, status: decision === 'APPROVE' ? 'APPROVED' : 'REJECTED' } : t));
    },
    createChampionship: (name: string, year: number, division: string) => console.log("Championship created", name),
    getRankings: (): LeagueRanking[] => [{ position: 1, teamName: 'Gladiators', record: '8-0' }, { position: 2, teamName: 'Bulls', record: '7-1' }],
    notify: (channel: string) => console.log("Notify", channel),
    getCandidates: () => get<RecruitmentCandidate>('fahub_candidates'),
    saveCandidates: (data: RecruitmentCandidate[]) => set('fahub_candidates', data),
    getAthletes: () => get<Player>('fahub_players'),
    getTeams: () => get<Team>('fahub_teams'),
    saveTeam: (team: Team) => set('fahub_teams', [...get<Team>('fahub_teams'), team]),
    saveCoachProfile: (userId: string, profile: any) => localStorage.setItem(`coach_profile_${userId}`, JSON.stringify(profile)),
    saveSocialPosts: (data: SocialPost[]) => set('fahub_social_posts', data),
    saveBudgets: (data: Budget[]) => set('fahub_budgets', data),
    saveSubscriptions: (data: Subscription[]) => set('fahub_subs', data),
    generateMonthlyInvoices: () => console.log("Generating monthly invoices..."),
    getAthleteByUserId: (userId: string) => {
        const players = get<Player>('fahub_players');
        return players.find(p => p.name.includes('User')) || players[0];
    },
    sendSignal: (signal: Partial<ObjectiveSignal>) => console.log("Signal sent", signal),
    getRoadmap: () => get<RoadmapItem>('fahub_roadmap'),
    getProjectCompletion: () => 75
};

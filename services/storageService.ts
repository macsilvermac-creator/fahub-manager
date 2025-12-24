
import { 
    Player, Game, PracticeSession, TeamSettings, 
    AuditLog, Objective, Transaction, Invoice, 
    MarketplaceItem, SponsorDeal, EventSale, OKR, RoadmapItem,
    VideoClip, Course, SocialFeedPost, UserRole, Subscription, Budget, Bill, 
    Announcement, ChatMessage, TeamDocument, TacticalPlay, League, KanbanTask,
    SocialPost, EquipmentItem, StaffMember, YouthClass, YouthStudent, 
    ConfederationStats, NationalTeamCandidate, Affiliate, TransferRequest, RecruitmentCandidate,
    Entitlement, DigitalProduct
} from '../types';

const set = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('storage_update'));
};

const get = <T>(key: string): T[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
};

export const storageService = {
    initializeRAM: () => {
        if (!localStorage.getItem('fahub_settings')) {
            set('fahub_settings', {
                id: '1',
                teamName: 'Gladiators',
                logoUrl: 'https://ui-avatars.com/api/?name=JG&background=059669&color=fff',
                primaryColor: '#059669',
                address: 'Joinville, SC',
                plan: 'ALL_PRO',
                sportType: 'TACKLE'
            });
        }
        
        if (get('fahub_courses').length === 0) {
            set('fahub_courses', [
                { id: 'c1', title: 'Fundamentos de Bloqueio', description: 'Técnica de mãos e alinhamento para OL/DL.', thumbnailUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&q=80', priority: true, level: 'BÁSICO' },
                { id: 'c2', title: 'Leitura de Cobertura Cover 3', description: 'Como identificar janelas contra zona.', thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80', priority: true, level: 'AVANÇADO' },
                { id: 'c3', title: 'Route Tree: O Manual WR', description: 'Execução de rotas precisas.', thumbnailUrl: 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=800&q=80', priority: false, level: 'ALL-PRO' },
                { id: 'c4', title: 'Tackle Seguro (Heads Up)', description: 'Segurança em primeiro lugar no contato.', thumbnailUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80', priority: false, level: 'BÁSICO' },
                { id: 'c5', title: 'Estratégias de Redzone', description: 'Minimizando erros na linha de 20 jardas.', thumbnailUrl: 'https://images.unsplash.com/photo-1529900245061-5ef3f72423c1?w=800&q=80', priority: false, level: 'AVANÇADO' }
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
        return user ? JSON.parse(user) : { role: 'MASTER', name: 'Diretor', id: 'u1', program: 'TACKLE' };
    },
    
    setCurrentUser: (u: any) => set('gridiron_current_user', u),
    
    getPracticeSessions: () => get<PracticeSession>('fahub_practice'),
    savePracticeSessions: (data: PracticeSession[]) => set('fahub_practice', data),

    togglePracticeAttendance: (practiceId: string, playerId: string) => {
        const sessions = get<PracticeSession>('fahub_practice');
        const updated = sessions.map(s => {
            if (String(s.id) === practiceId) {
                const attendees = s.attendees || [];
                const isPresent = attendees.includes(playerId);
                return {
                    ...s,
                    attendees: isPresent ? attendees.filter(id => id !== playerId) : [...attendees, playerId]
                };
            }
            return s;
        });
        set('fahub_practice', updated);
    },

    getPlayers: () => get<Player>('fahub_players'),
    savePlayers: (data: Player[]) => set('fahub_players', data),
    registerAthlete: (player: Player) => set('fahub_players', [...get<Player>('fahub_players'), player]),

    getGames: () => get<Game>('fahub_games'),
    saveGames: (data: Game[]) => set('fahub_games', data),
    updateLiveGame: (id: any, updates: any) => {
        const games = get<Game>('fahub_games');
        set('fahub_games', games.map(g => g.id === id ? { ...g, ...updates } : g));
    },

    getRankings: () => [
        { position: 1, teamName: 'Gladiators', record: '4-0' },
        { position: 2, teamName: 'Istepôs', record: '3-1' },
        { position: 3, teamName: 'Rex', record: '3-1' }
    ],

    getTeamSettings: (): TeamSettings => {
        const data = localStorage.getItem('fahub_settings');
        return data ? JSON.parse(data) : { id: '1', teamName: 'Gladiators', logoUrl: '', primaryColor: '#059669' };
    },

    saveTeamSettings: (data: TeamSettings) => set('fahub_settings', data),
    
    uploadFile: async (file: File, folder: string): Promise<string> => {
        return `https://storage.mock/${folder}/${file.name}`;
    },

    getAuditLogs: () => get<AuditLog>('fahub_audit'),
    logAuditAction: (action: string, details: string) => {
        const logs = get<AuditLog>('fahub_audit');
        const user = storageService.getCurrentUser();
        set('fahub_audit', [{ id: Date.now().toString(), action, details, timestamp: new Date(), userName: user.name, role: user.role }, ...logs]);
    },
    
    logAction: (action: string, details: string) => storageService.logAuditAction(action, details),

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

    getMarketplaceItems: () => get<MarketplaceItem>('fahub_marketplace'),
    saveMarketplaceItems: (data: MarketplaceItem[]) => set('fahub_marketplace', data),

    getSponsors: () => get<SponsorDeal>('fahub_sponsors'),
    saveSponsors: (data: SponsorDeal[]) => set('fahub_sponsors', data),

    getEventSales: () => get<EventSale>('fahub_event_sales'),
    saveEventSales: (data: EventSale[]) => set('fahub_event_sales', data),

    getObjectives: () => get<Objective>('fahub_objectives'),
    saveObjectives: (data: Objective[]) => set('fahub_objectives', data),

    getOKRs: () => get<OKR>('fahub_okrs'),
    saveOKRs: (data: OKR[]) => set('fahub_okrs', data),

    getRoadmap: () => get<RoadmapItem>('fahub_roadmap'),
    getProjectCompletion: () => 85,

    getClips: () => get<VideoClip>('fahub_clips'),
    saveClips: (data: VideoClip[]) => set('fahub_clips', data),

    getTacticalPlays: () => get<TacticalPlay>('fahub_tactical_plays'),
    saveTacticalPlays: (data: TacticalPlay[]) => set('fahub_tactical_plays', data),

    getCourses: () => get<Course>('fahub_courses'),
    saveCourses: (data: Course[]) => set('fahub_courses', data),

    getSocialPosts: () => get<SocialPost>('fahub_social_posts'),
    saveSocialPosts: (data: SocialPost[]) => set('fahub_social_posts', data),

    getSocialFeed: () => get<SocialFeedPost>('fahub_social_feed'),
    saveSocialFeedPost: (post: SocialFeedPost) => set('fahub_social_feed', [post, ...get<SocialFeedPost>('fahub_social_feed')]),
    toggleLikePost: (id: string) => {
        const feed = get<SocialFeedPost>('fahub_social_feed');
        set('fahub_social_feed', feed.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    },

    getAnnouncements: () => get<Announcement>('fahub_announcements'),
    saveAnnouncements: (data: Announcement[]) => set('fahub_announcements', data),
    getChatMessages: () => get<ChatMessage>('fahub_chat'),
    saveChatMessages: (data: ChatMessage[]) => set('fahub_chat', data),

    getDocuments: () => get<TeamDocument>('fahub_docs'),
    saveDocuments: (data: TeamDocument[]) => set('fahub_docs', data),

    getTasks: () => get<KanbanTask>('fahub_tasks'),
    saveTasks: (data: KanbanTask[]) => set('fahub_tasks', data),

    getInventory: () => get<EquipmentItem>('fahub_inventory'),
    saveInventory: (data: EquipmentItem[]) => set('fahub_inventory', data),

    getStaff: () => get<StaffMember>('fahub_staff'),
    saveStaff: (data: StaffMember[]) => set('fahub_staff', data),

    getYouthClasses: () => get<YouthClass>('fahub_youth_classes'),
    saveYouthClasses: (data: YouthClass[]) => set('fahub_youth_classes', data),
    getYouthStudents: () => get<YouthStudent>('fahub_youth_students'),
    saveYouthStudents: (data: YouthStudent[]) => set('fahub_youth_students', data),

    getCandidates: () => get<RecruitmentCandidate>('fahub_candidates'),
    saveCandidates: (data: RecruitmentCandidate[]) => set('fahub_candidates', data),

    getLeague: (): League => {
        const data = localStorage.getItem('fahub_league');
        return data ? JSON.parse(data) : { 
            id: 'l1', 
            name: 'Liga Catarinense', 
            season: '2025', 
            teams: [
                { teamId: '1', teamName: 'Gladiators', wins: 4, losses: 0, pointsFor: 120, pointsAgainst: 45, logoUrl: 'https://ui-avatars.com/api/?name=JG' },
                { teamId: '2', teamName: 'Istepôs', wins: 3, losses: 1, pointsFor: 98, pointsAgainst: 62, logoUrl: 'https://ui-avatars.com/api/?name=IS' },
                { teamId: '3', teamName: 'Rex', wins: 3, losses: 1, pointsFor: 115, pointsAgainst: 40, logoUrl: 'https://ui-avatars.com/api/?name=RX' }
            ] 
        };
    },

    getConfederationStats: (): ConfederationStats => ({ 
        totalAthletes: 4850, 
        totalTeams: 86, 
        totalGamesThisYear: 312, 
        activeAffiliates: 18 
    }),
    getNationalTeamScouting: () => get<NationalTeamCandidate>('fahub_national_scouting'),
    getAffiliatesStatus: () => get<Affiliate>('fahub_affiliates'),
    getTransferRequests: () => get<TransferRequest>('fahub_transfers'),
    processTransfer: (id: string, decision: 'APPROVE' | 'REJECT', adminName: string) => {
        const transfers = get<TransferRequest>('fahub_transfers');
        const updated = transfers.map(t => t.id === id ? { ...t, status: (decision === 'APPROVE' ? 'APPROVED' : 'REJECTED') as any } : t);
        set('fahub_transfers', updated);
        storageService.logAuditAction('TRANSFER_PROCESS', `Transferência ${id} ${decision} por ${adminName}`);
    },

    createChampionship: (name: string, year: number, division: string) => {
        console.log(`Campeonato criado: ${name} (${year}) - ${division}`);
    },

    getAthleteStatsHistory: (id: any) => [
        { date: '2023-10-01', ovr: 70 },
        { date: '2023-11-01', ovr: 75 },
        { date: '2023-12-01', ovr: 88 }
    ],

    getActiveProgram: () => 'TACKLE',
    notify: (key: string) => window.dispatchEvent(new Event('storage_update')),
    getPublicLeagueStats: () => ({ name: 'Liga Catarinense', season: '2025', leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),
    getPublicGameData: (id: string) => ({ id, opponent: 'Bulls', score: '21-0', status: 'IN_PROGRESS' }),
    getEntitlements: () => get<Entitlement>('fahub_entitlements'),
    purchaseDigitalProduct: (userId: string, product: DigitalProduct) => {
        const ents = get<Entitlement>('fahub_entitlements');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + product.durationHours);
        const newEnt: Entitlement = {
            id: `ent-${Date.now()}`,
            userId,
            productId: product.id,
            expiresAt
        };
        set('fahub_entitlements', [...ents, newEnt]);
    }
};

import { 
    Player, Game, PracticeSession, RecruitmentCandidate, TeamSettings, 
    OKR, AuditLog, TacticalPlay, Transaction, Invoice, Subscription, 
    Budget, Bill, Announcement, ChatMessage, TeamDocument, VideoClip, 
    MarketplaceItem, KanbanTask, SocialPost, SponsorDeal, EventSale, 
    SocialFeedPost, StaffMember, YouthClass, YouthStudent, 
    ConfederationStats, NationalTeamCandidate, Affiliate, TransferRequest,
    RoadmapItem, Drill, DigitalProduct, Entitlement, ObjectiveSignal, ProgramType
} from '../types';

const get = <T>(key: string): T[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
};

const set = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('storage_update'));
    // Trigger specific key update for useAppStore hook
    window.dispatchEvent(new CustomEvent('storage_update_key', { detail: { key } }));
};

export const storageService = {
    initializeRAM: () => {
        // SETTINGS
        if (!localStorage.getItem('fahub_settings')) {
            set('fahub_settings', {
                id: '1',
                teamName: 'Joinville Gladiators',
                logoUrl: 'https://ui-avatars.com/api/?name=JG&background=059669&color=fff',
                primaryColor: '#059669',
                sportType: 'TACKLE',
                plan: 'ALL_PRO'
            });
        }

        // PLAYERS (SEED DATA)
        if (!localStorage.getItem('fahub_players')) {
            const players: Player[] = [
                { id: 1, name: 'Lucas Thor', position: 'QB', jerseyNumber: 12, height: '1.85m', weight: 92, class: 'Veterano', avatarUrl: 'https://i.pravatar.cc/150?u=1', level: 8, xp: 4500, rating: 88, status: 'ACTIVE', commitmentLevel: 95, stats: { ovr: 88, speed: 82, strength: 75, agility: 78, tacticalIQ: 92 }, attendanceRate: 98 },
                { id: 2, name: 'Matheus Tank', position: 'OL', jerseyNumber: 77, height: '1.92m', weight: 130, class: 'Sênior', avatarUrl: 'https://i.pravatar.cc/150?u=2', level: 6, xp: 2200, rating: 84, status: 'ACTIVE', commitmentLevel: 88, stats: { ovr: 84, speed: 45, strength: 98, agility: 40, tacticalIQ: 70 }, attendanceRate: 95 },
                { id: 3, name: 'Gabriel Fly', position: 'WR', jerseyNumber: 80, height: '1.80m', weight: 85, class: 'Júnior', avatarUrl: 'https://i.pravatar.cc/150?u=3', level: 5, xp: 1800, rating: 82, status: 'ACTIVE', commitmentLevel: 92, stats: { ovr: 82, speed: 95, strength: 55, agility: 92, tacticalIQ: 75 }, attendanceRate: 90 },
                { id: 4, name: 'Bruno Beast', position: 'LB', jerseyNumber: 52, height: '1.82m', weight: 105, class: 'Veterano', avatarUrl: 'https://i.pravatar.cc/150?u=4', level: 7, xp: 3200, rating: 86, status: 'ACTIVE', commitmentLevel: 90, stats: { ovr: 86, speed: 78, strength: 88, agility: 75, tacticalIQ: 85 }, attendanceRate: 92 }
            ];
            set('fahub_players', players);
        }

        // CANDIDATOS TRYOUT
        if (!localStorage.getItem('fahub_candidates')) {
            const candidates: RecruitmentCandidate[] = [
                { id: 'c1', name: 'Ricardo Alvo', position: 'WR', weight: 88, height: '1.82m', status: 'NEW', bibNumber: 101 },
                { id: 'c2', name: 'Marcos Mão', position: 'DB', weight: 82, height: '1.78m', status: 'TESTING', bibNumber: 102 }
            ];
            set('fahub_candidates', candidates);
        }

        // PRACTICES
        if (!localStorage.getItem('fahub_practice')) {
            const practices: PracticeSession[] = [
                { 
                    id: 'p1', title: 'Ajuste de Blitz (Week 4)', focus: 'Defensivo', date: new Date(), attendees: ['1','2','3','4'], 
                    script: [
                        { id: 's1', startTime: '19:00', durationMinutes: 20, activityName: 'Alongamento Dinâmico', type: 'WARMUP' },
                        { id: 's2', startTime: '19:20', durationMinutes: 40, activityName: 'Indy Drills (Posição)', type: 'TECHNICAL' }
                    ] 
                }
            ];
            set('fahub_practice', practices);
        }

        // PLAYS
        if (!localStorage.getItem('fahub_plays')) {
            const plays: TacticalPlay[] = [
                { id: 'pl1', name: 'Slant 77', concept: 'Quick Pass', elements: [], program: 'TACKLE', createdAt: new Date() },
                { id: 'pl2', name: 'Inside Zone', concept: 'Run Game', elements: [], program: 'TACKLE', createdAt: new Date() }
            ];
            set('fahub_plays', plays);
        }

        // GAMES
        if (!localStorage.getItem('fahub_games')) {
            set('fahub_games', [
                { id: 1, opponent: 'Timbó Rex', date: new Date('2025-07-20T15:00:00'), location: 'Away', status: 'SCHEDULED', score: '0-0' },
                { id: 2, opponent: 'Istepuôs', date: new Date('2025-08-05T14:00:00'), location: 'Home', status: 'SCHEDULED', score: '0-0' }
            ]);
        }
    },

    subscribe: (key: string, callback: () => void) => {
        const handler = (e: any) => {
            if (e.type === 'storage_update' || (e.detail && e.detail.key === key)) {
                callback();
            }
        };
        window.addEventListener('storage_update', handler);
        window.addEventListener('storage_update_key', handler);
        return () => {
            window.removeEventListener('storage_update', handler);
            window.removeEventListener('storage_update_key', handler);
        };
    },

    getCurrentUser: () => JSON.parse(localStorage.getItem('gridiron_current_user') || '{"role":"HEAD_COACH","name":"Coach Guto","id":"user-default"}'),
    setCurrentUser: (u: any) => localStorage.setItem('gridiron_current_user', JSON.stringify(u)),
    
    getPlayers: () => get<Player>('fahub_players'),
    savePlayers: (data: Player[]) => set('fahub_players', data),
    
    getPracticeSessions: () => get<PracticeSession>('fahub_practice'),
    savePracticeSessions: (data: PracticeSession[]) => set('fahub_practice', data),
    
    getGames: () => get<Game>('fahub_games'),
    saveGames: (data: Game[]) => set('fahub_games', data),
    updateLiveGame: (id: any, updates: any) => set('fahub_games', get<Game>('fahub_games').map(g => g.id === id ? {...g, ...updates} : g)),

    getCandidates: () => get<RecruitmentCandidate>('fahub_candidates'),
    saveCandidates: (data: RecruitmentCandidate[]) => set('fahub_candidates', data),
    approveCandidate: (id: string) => {
        const list = get<RecruitmentCandidate>('fahub_candidates');
        const cand = list.find(c => c.id === id);
        if (cand) {
            const players = get<Player>('fahub_players');
            const newP: Player = { id: Date.now(), name: cand.name, position: cand.position, jerseyNumber: 0, height: '1.80m', weight: cand.weight, class: 'Rookie', avatarUrl: '', level: 1, xp: 0, rating: 65, status: 'INCUBATING', attendanceRate: 100 };
            set('fahub_players', [...players, newP]);
            set('fahub_candidates', list.filter(c => c.id !== id));
        }
    },

    getTacticalPlays: () => get<TacticalPlay>('fahub_plays'),
    saveTacticalPlays: (data: TacticalPlay[]) => set('fahub_plays', data),

    getTeamSettings: (): TeamSettings => JSON.parse(localStorage.getItem('fahub_settings') || '{}'),
    saveTeamSettings: (settings: TeamSettings) => set('fahub_settings', settings),
    
    getAuditLogs: () => get<AuditLog>('fahub_audit'),
    logAuditAction: (action: string, details: string) => {
        const logs = get<AuditLog>('fahub_audit');
        const user = storageService.getCurrentUser();
        set('fahub_audit', [{ id: Date.now().toString(), action, details, timestamp: new Date(), userName: user.name, role: user.role }, ...logs]);
    },
    
    getOKRs: () => get<OKR>('fahub_okrs'),
    saveOKRs: (data: OKR[]) => set('fahub_okrs', data),
    
    getObjectives: () => get<any>('fahub_objectives'),
    saveObjectives: (data: any[]) => set('fahub_objectives', data),
    
    getActiveProgram: () => 'TACKLE',
    
    registerAthlete: (player: Player) => {
        const players = storageService.getPlayers();
        set('fahub_players', [...players, player]);
    },
    
    togglePracticeAttendance: (practiceId: string, playerId: string) => {
        const sessions = storageService.getPracticeSessions();
        const updated = sessions.map(s => {
            if (String(s.id) === practiceId) {
                const attendees = s.attendees || [];
                if (attendees.includes(playerId)) {
                    return { ...s, attendees: attendees.filter(id => id !== playerId) };
                } else {
                    return { ...s, attendees: [...attendees, playerId] };
                }
            }
            return s;
        });
        storageService.savePracticeSessions(updated);
    },

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

    getAnnouncements: () => get<Announcement>('fahub_announcements'),
    saveAnnouncements: (data: Announcement[]) => set('fahub_announcements', data),

    getChatMessages: () => get<ChatMessage>('fahub_chat'),
    saveChatMessages: (data: ChatMessage[]) => set('fahub_chat', data),

    getDocuments: () => get<TeamDocument>('fahub_documents'),
    saveDocuments: (data: TeamDocument[]) => set('fahub_documents', data),

    getClips: () => get<VideoClip>('fahub_clips'),
    saveClips: (data: VideoClip[]) => set('fahub_clips', data),

    getCourses: () => get<any>('fahub_courses'),
    saveCourses: (data: any[]) => set('fahub_courses', data),

    getLeague: () => JSON.parse(localStorage.getItem('fahub_league') || '{}'),
    saveLeague: (data: any) => set('fahub_league', data),

    getMarketplaceItems: () => get<MarketplaceItem>('fahub_marketplace'),
    saveMarketplaceItems: (data: MarketplaceItem[]) => set('fahub_marketplace', data),

    getTasks: () => get<KanbanTask>('fahub_tasks'),
    saveTasks: (data: KanbanTask[]) => set('fahub_tasks', data),

    getSocialPosts: () => get<SocialPost>('fahub_social_posts'),
    saveSocialPosts: (data: SocialPost[]) => set('fahub_social_posts', data),

    getSponsors: () => get<SponsorDeal>('fahub_sponsors'),
    saveSponsors: (data: SponsorDeal[]) => set('fahub_sponsors', data),

    getEventSales: () => get<EventSale>('fahub_event_sales'),
    saveEventSales: (data: EventSale[]) => set('fahub_event_sales', data),

    getSocialFeed: () => get<SocialFeedPost>('fahub_social_feed'),
    saveSocialFeedPost: (post: SocialFeedPost) => {
        const feed = storageService.getSocialFeed();
        set('fahub_social_feed', [post, ...feed]);
    },
    toggleLikePost: (postId: string) => {
        const feed = storageService.getSocialFeed();
        const updated = feed.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p);
        set('fahub_social_feed', updated);
    },

    getInventory: () => get<EquipmentItem>('fahub_inventory'),
    saveInventory: (data: EquipmentItem[]) => set('fahub_inventory', data),

    getStaff: () => get<StaffMember>('fahub_staff'),
    saveStaff: (data: StaffMember[]) => set('fahub_staff', data),

    getYouthClasses: () => get<YouthClass>('fahub_youth_classes'),
    saveYouthClasses: (data: YouthClass[]) => set('fahub_youth_classes', data),

    getYouthStudents: () => get<YouthStudent>('fahub_youth_students'),
    saveYouthStudents: (data: YouthStudent[]) => set('fahub_youth_students', data),

    getConfederationStats: (): ConfederationStats => ({ totalAthletes: 4850, totalTeams: 120, totalGamesThisYear: 342, activeAffiliates: 18 }),
    getNationalTeamScouting: () => get<NationalTeamCandidate>('fahub_national_scouting'),
    getAffiliatesStatus: () => get<Affiliate>('fahub_affiliates'),
    getTransferRequests: () => get<TransferRequest>('fahub_transfers'),
    processTransfer: (id: string, decision: 'APPROVE' | 'REJECT', adminName: string) => {
        const transfers = storageService.getTransferRequests();
        const updated = transfers.map(t => t.id === id ? { ...t, status: decision === 'APPROVE' ? 'APPROVED' : 'REJECTED' } : t);
        set('fahub_transfers', updated);
        storageService.logAuditAction('TRANSFER_PROCESS', `${adminName} processou transferência ${id} como ${decision}`);
    },

    getPublicGameData: (gameId: string) => {
        const games = storageService.getGames();
        const g = games.find(gm => String(gm.id) === gameId);
        return g ? { ...g, sponsors: storageService.getSponsors().filter(s => s.status === 'CLOSED_WON') } : null;
    },

    getAthleteStatsHistory: (playerId: string | number) => [],
    getPublicLeagueStats: () => ({ name: 'BFA', season: '2025', leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),
    createChampionship: (name: string, year: number, division: string) => {},
    generateMonthlyInvoices: () => {},
    sendSignal: (signal: Partial<ObjectiveSignal>) => {},
    getAthleteByUserId: (userId: string) => storageService.getPlayers().find(p => p.userId === userId),
    getAthletes: () => storageService.getPlayers(),
    getTeams: () => get<Team>('fahub_teams'),
    saveTeam: (team: Team) => {
        const teams = storageService.getTeams();
        set('fahub_teams', [...teams, team]);
    },
    saveCoachProfile: (userId: string, profile: any) => {},
    getRoadmap: () => get<RoadmapItem>('fahub_roadmap'),
    getProjectCompletion: () => 85,
    seedDatabaseToCloud: async () => { console.log('Seeding...'); },
    logAction: (action: string, details: string) => storageService.logAuditAction(action, details),
    uploadFile: async (file: File, path: string) => 'https://example.com/file.png',
    notify: (key: string) => {
        window.dispatchEvent(new CustomEvent('storage_notify', { detail: { key } }));
    },
    getEntitlements: () => get<Entitlement>('fahub_entitlements'),
    purchaseDigitalProduct: (userId: string, product: DigitalProduct) => {
        const entitlements = storageService.getEntitlements();
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + product.durationHours);
        const newEntitlement: Entitlement = {
            id: `ent-${Date.now()}`,
            userId,
            productId: product.id,
            expiresAt: expiry
        };
        set('fahub_entitlements', [...entitlements, newEntitlement]);
    }
};

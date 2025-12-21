
import { Player, Game, PracticeSession, Transaction, TeamSettings, Objective, AuditLog, RecruitmentCandidate, MarketplaceItem, Team, Invoice, SponsorDeal, Subscription, Budget, Bill, SocialPost, Announcement, TeamDocument, VideoClip, SocialFeedPost, Athlete, Tenant, ServiceTicket, DigitalProduct, Entitlement, Course, StaffMember, NationalTeamCandidate, Affiliate, TransferRequest, Championship, EquipmentItem, KanbanTask, ChatMessage, League, ConfederationStats, YouthClass, YouthStudent } from '../types';

const get = <T>(key: string): T[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data, (k, v) => (k === 'date' || k === 'timestamp' || k === 'deadline' || k === 'expiresAt' || k === 'joinedAt' || k === 'lastAuditDate' || k === 'lastInteraction' || k === 'purchasedAt' || k === 'uploadDate' || k === 'scheduledDate' || k === 'medicalExamExpiry' || k === 'birthDate') ? new Date(v) : v) : [];
};

const set = <T>(key: string, data: T) => {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('storage_update'));
};

const subscribers: Record<string, (() => void)[]> = {};

export const storageService = {
    initializeRAM: () => console.log('FAHUB RAM Engine: Online & Unified'),

    subscribe: (key: string, callback: () => void) => {
        if (!subscribers[key]) subscribers[key] = [];
        subscribers[key].push(callback);
        return () => { subscribers[key] = subscribers[key].filter(cb => cb !== callback); };
    },

    notify: (key: string) => {
        if (subscribers[key]) subscribers[key].forEach(cb => cb());
    },

    // PLAYERS
    getPlayers: () => get<Player>('fahub_players'),
    savePlayers: (data: Player[]) => {
        set('fahub_players', data);
        storageService.notify('players');
    },
    registerAthlete: (player: Player) => {
        const current = storageService.getPlayers();
        storageService.savePlayers([...current, player]);
    },
    
    // RECRUITMENT TO ROSTER BRIDGE (O GATILHO)
    promoteCandidate: (candidate: RecruitmentCandidate) => {
        const players = storageService.getPlayers();
        const newPlayer: Player = {
            id: `p-${Date.now()}`,
            name: candidate.name,
            position: candidate.position,
            jerseyNumber: 0, // A definir no roster
            height: candidate.height,
            weight: candidate.weight,
            class: 'Rookie',
            avatarUrl: candidate.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}`,
            level: 1,
            xp: 0,
            rating: candidate.rating || 70,
            status: 'ACTIVE',
            attendanceRate: 100,
            combineStats: candidate.combineStats,
            program: storageService.getActiveProgram() as any,
            cpf: candidate.cpf,
            rosterCategory: 'ACTIVE',
            badges: ['Novato']
        };
        storageService.savePlayers([...players, newPlayer]);
        
        // Remove da lista de candidatos
        const candidates = storageService.getCandidates();
        storageService.saveCandidates(candidates.filter(c => c.id !== candidate.id));
        
        storageService.logAuditAction('CANDIDATE_PROMOTED', `Atleta ${candidate.name} promovido do Tryout para o Roster Oficial.`);
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

    // FINANCE
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

    // SETTINGS
    getTeamSettings: (): TeamSettings => {
        const data = localStorage.getItem('fahub_settings');
        return data ? JSON.parse(data) : { id: '1', teamName: 'FAHUB Stars', primaryColor: '#059669', address: 'Digital' };
    },
    saveTeamSettings: (data: TeamSettings) => set('fahub_settings', data),

    // AUDIT
    getAuditLogs: () => get<AuditLog>('fahub_audit'),
    logAuditAction: (action: string, details: string) => {
        const user = storageService.getCurrentUser();
        const logs = storageService.getAuditLogs();
        const newLog: AuditLog = {
            id: `log-${Date.now()}`,
            action,
            details,
            timestamp: new Date(),
            userId: user?.id || 'system',
            userName: user?.name || 'System',
            role: user?.role || 'SYSTEM'
        };
        set('fahub_audit', [newLog, ...logs].slice(0, 100));
        storageService.notify('audit');
    },

    // HELPERS
    getCurrentUser: () => {
        const data = localStorage.getItem('gridiron_current_user');
        return data ? JSON.parse(data) : null;
    },
    setCurrentUser: (data: any) => {
        localStorage.setItem('gridiron_current_user', JSON.stringify(data));
        window.dispatchEvent(new Event('storage_update'));
    },
    
    getCandidates: () => get<RecruitmentCandidate>('fahub_candidates'),
    saveCandidates: (data: RecruitmentCandidate[]) => {
        set('fahub_candidates', data);
        storageService.notify('candidates');
    },
    getMarketplaceItems: () => get<MarketplaceItem>('fahub_marketplace'),
    saveMarketplaceItems: (data: MarketplaceItem[]) => set('fahub_marketplace', data),
    getPracticeSessions: () => get<PracticeSession>('fahub_practice'),
    savePracticeSessions: (data: PracticeSession[]) => {
        set('fahub_practice', data);
        storageService.notify('gridiron_practice');
    },
    getInventory: () => get<EquipmentItem>('fahub_inventory'),
    saveInventory: (data: EquipmentItem[]) => set('fahub_inventory', data),
    getClips: () => get<VideoClip>('fahub_clips'),
    saveClips: (data: VideoClip[]) => set('fahub_clips', data),
    getDocuments: () => get<TeamDocument>('fahub_documents'),
    saveDocuments: (data: TeamDocument[]) => set('fahub_documents', data),
    getTasks: () => get<KanbanTask>('fahub_tasks'),
    saveTasks: (data: KanbanTask[]) => set('fahub_tasks', data),
    getSocialPosts: () => get<SocialPost>('fahub_social_posts'),
    saveSocialPosts: (data: SocialPost[]) => set('fahub_social_posts', data),
    getAnnouncements: () => get<Announcement>('fahub_announcements'),
    saveAnnouncements: (data: Announcement[]) => set('fahub_announcements', data),
    getChatMessages: () => get<ChatMessage>('chat_messages'),
    saveChatMessages: (data: ChatMessage[]) => set('chat_messages', data),
    getActiveProgram: () => localStorage.getItem('active_program') || 'TACKLE',
    setActiveProgram: (p: string) => localStorage.setItem('active_program', p),
    getTacticalPlays: () => get<any>('fahub_tactical_plays'),
    saveTacticalPlays: (data: any[]) => set('fahub_tactical_plays', data),
    getPublicLeagueStats: () => ({ name: 'BFA', season: '2025', leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),
    getEntitlements: () => get<Entitlement>('fahub_entitlements'),
    getCourses: () => get<Course>('fahub_courses'),
    getSocialFeed: () => get<SocialFeedPost>('fahub_social_feed'),
    saveSocialFeedPost: (p: SocialFeedPost) => {
        const current = get<SocialFeedPost>('fahub_social_feed');
        set('fahub_social_feed', [p, ...current]);
    },
    getSponsors: () => get<SponsorDeal>('fahub_sponsors'),
    saveSponsors: (data: SponsorDeal[]) => set('fahub_sponsors', data),
    getEventSales: () => get<any>('fahub_event_sales'),
    saveEventSales: (data: any[]) => set('fahub_event_sales', data),
    getStaff: () => get<StaffMember>('fahub_staff'),
    saveStaff: (data: StaffMember[]) => set('fahub_staff', data),
    getYouthClasses: () => get<YouthClass>('youth_classes'),
    saveYouthClasses: (data: YouthClass[]) => set('youth_classes', data),
    getYouthStudents: () => get<YouthStudent>('youth_students'),
    processTransfer: (id: string, decision: string, by: string) => {
        const current = get<TransferRequest>('fahub_transfers');
        const updated = current.map((t: TransferRequest) => t.id === id ? { ...t, status: decision === 'APPROVE' ? 'APPROVED' : 'REJECTED' } as TransferRequest : t);
        set('fahub_transfers', updated);
    },
    getConfederationStats: (): ConfederationStats => ({ totalAthletes: 4850, totalTeams: 18, totalGamesThisYear: 142, activeAffiliates: 8, growthRate: 5.4 }),
    getNationalTeamScouting: () => get<NationalTeamCandidate>('fahub_national_team_scouting'),
    getAffiliatesStatus: () => get<Affiliate>('fahub_affiliates'),
    getTransferRequests: () => get<TransferRequest>('fahub_transfers'),
    getObjectives: () => get<Objective>('fahub_objectives'),
    saveObjectives: (data: Objective[]) => {
        set('fahub_objectives', data);
        storageService.notify('objectives');
    },
    getAthleteStatsHistory: (id: string | number) => [],
    getPublicGameData: (id: string) => null,
    purchaseDigitalProduct: (uid: string, p: DigitalProduct) => null,
    saveCoachProfile: (id: string, p: any) => null,
    seedDatabaseToCloud: async () => true,
    createChampionship: (name: string, year: number, division: string) => null,
    uploadFile: async (file: File, path: string) => URL.createObjectURL(file),

    // Fix: added missing togglePracticeAttendance used in pages/Schedule.tsx
    togglePracticeAttendance: (practiceId: string, playerId: string) => {
        const sessions = storageService.getPracticeSessions();
        const updated = sessions.map(s => {
            if (String(s.id) === practiceId) {
                const attendees = s.attendees || [];
                const newAttendees = attendees.includes(playerId) 
                    ? attendees.filter(id => id !== playerId)
                    : [...attendees, playerId];
                return { ...s, attendees: newAttendees };
            }
            return s;
        });
        storageService.savePracticeSessions(updated);
    },

    // Fix: added missing getLeague used in pages/LeagueManager.tsx
    getLeague: (): League => ({ id: '1', name: 'Liga Brasileira', season: '2025', teams: [] }),

    // Fix: added missing logAction used in pages/AdminPanel.tsx
    logAction: (action: string, details: string, user: any) => {
        const logs = storageService.getAuditLogs();
        const newLog: AuditLog = {
            id: `log-${Date.now()}`,
            action,
            details,
            timestamp: new Date(),
            userId: user?.id || 'system',
            userName: user?.name || 'System',
            role: user?.role || 'SYSTEM'
        };
        set('fahub_audit', [newLog, ...logs].slice(0, 100));
        storageService.notify('audit');
    },

    // Fix: added missing toggleLikePost used in pages/LockerRoom.tsx
    toggleLikePost: (id: string) => {
        const current = get<SocialFeedPost>('fahub_social_feed');
        const updated = current.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p);
        set('fahub_social_feed', updated);
    },
};
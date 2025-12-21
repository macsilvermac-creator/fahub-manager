
import { Player, Game, PracticeSession, TeamSettings, AuditLog, RecruitmentCandidate, Team, Transaction, Invoice, Subscription, Budget, Bill, Announcement, ChatMessage, TeamDocument, VideoClip, TacticalPlay, MarketplaceItem, KanbanTask, SocialPost, SponsorDeal, EventSale, SocialFeedPost, EquipmentItem, StaffMember, YouthClass, YouthStudent, ConfederationStats, NationalTeamCandidate, Affiliate, TransferRequest, League, Objective, Course } from '../types';

const get = <T>(key: string): T[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data, (k, v) => (k === 'date' || k === 'timestamp' || k === 'birthDate' || k === 'deadline') ? new Date(v) : v) : [];
};

const set = <T>(key: string, data: T) => {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('storage_update'));
};

const subscribers: Record<string, (() => void)[]> = {};

export const storageService = {
    initializeRAM: () => {
        console.log('FAHUB Intelligence Engine: Online');
        if (!localStorage.getItem('fahub_players')) {
            const mockPlayers: Player[] = [
                { id: 'p1', name: 'Lucas "Thor"', position: 'QB', jerseyNumber: 12, height: '1.85m', weight: 92, class: 'Sênior', avatarUrl: '', level: 5, xp: 850, rating: 88, status: 'ACTIVE', stats: { ovr: 88, speed: 82, strength: 75, agility: 78, tacticalIQ: 95 } },
                { id: 'p2', name: 'Gabriel Silva', position: 'LB', jerseyNumber: 55, height: '1.82m', weight: 105, class: 'Veterano', avatarUrl: '', level: 7, xp: 2100, rating: 91, status: 'ACTIVE', stats: { ovr: 91, speed: 78, strength: 95, agility: 72, tacticalIQ: 88 } }
            ];
            set('fahub_players', mockPlayers);
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

    setCurrentUser: (data: any) => {
        localStorage.setItem('gridiron_current_user', JSON.stringify(data));
        window.dispatchEvent(new Event('storage_update'));
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

    getAthleteByUserId: (id: string) => storageService.getPlayers().find(p => p.id === id),

    // OBJECTIVES (METAS E ESTATISTICAS)
    getObjectives: () => get<Objective>('fahub_objectives'),
    saveObjectives: (data: Objective[]) => {
        set('fahub_objectives', data);
        storageService.notify('objectives');
    },

    // CANDIDATES (TRYOUT)
    getCandidates: () => get<RecruitmentCandidate>('fahub_candidates'),
    saveCandidates: (data: RecruitmentCandidate[]) => {
        set('fahub_candidates', data);
        storageService.notify('candidates');
    },

    // TEAMS
    getTeams: () => get<Team>('fahub_teams'),
    saveTeam: (t: Team) => set('fahub_teams', [...storageService.getTeams(), t]),

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

    // PRACTICES
    getPracticeSessions: () => get<PracticeSession>('fahub_practice'),
    savePracticeSessions: (data: PracticeSession[]) => {
        set('fahub_practice', data);
        storageService.notify('practice');
    },

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

    // AUDIT & LOGS
    getAuditLogs: () => get<AuditLog>('fahub_audit'),
    logAuditAction: (action: string, details: string) => {
        const user = storageService.getCurrentUser();
        const logs = storageService.getAuditLogs();
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

    /* Fix: Added logAction to support AdminPanel persona switching */
    logAction: (action: string, details: string, user: any) => {
        const logs = storageService.getAuditLogs();
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

    // FINANCE
    getTransactions: () => get<Transaction>('fahub_transactions'),
    saveTransactions: (data: Transaction[]) => set('fahub_transactions', data),
    getInvoices: () => get<Invoice>('fahub_invoices'),
    saveInvoices: (data: Invoice[]) => set('fahub_invoices', data),
    getSubscriptions: () => get<Subscription>('fahub_subscriptions'),
    saveSubscriptions: (data: Subscription[]) => set('fahub_subscriptions', data),
    getBudgets: () => get<Budget>('fahub_budgets'),
    saveBudgets: (data: Budget[]) => set('fahub_budgets', data),
    /* Fix: Added getBills */
    getBills: () => get<Bill>('fahub_bills'),

    // SETTINGS
    getTeamSettings: (): TeamSettings => {
        const data = localStorage.getItem('fahub_settings');
        return data ? JSON.parse(data) : { id: '1', teamName: 'FAHUB Stars', primaryColor: '#059669', logoUrl: '', address: '' };
    },
    saveTeamSettings: (data: TeamSettings) => set('fahub_settings', data),

    /* Fix: Added uploadFile mock */
    uploadFile: async (file: File, path: string) => URL.createObjectURL(file),

    getActiveProgram: () => localStorage.getItem('active_program') || 'TACKLE',
    setActiveProgram: (p: string) => localStorage.setItem('active_program', p),

    // TACTICAL
    getTacticalPlays: () => get<TacticalPlay>('fahub_tactical_plays'),
    saveTacticalPlays: (data: TacticalPlay[]) => set('fahub_tactical_plays', data),
    
    // PUBLIC / FAN
    getPublicLeagueStats: () => ({ name: 'BFA', season: '2025', leagueTable: [], leaders: { passing: [], rushing: [], defense: [] } }),
    getPublicGameData: (id: string) => null,
    
    // ACADEMY
    getCourses: () => get<Course>('fahub_courses'),
    
    // FEDERATION
    getConfederationStats: () => ({ totalAthletes: 4850, totalTeams: 18, totalGamesThisYear: 142, activeAffiliates: 8 }),
    getNationalTeamScouting: () => get<NationalTeamCandidate>('fahub_national_team_scouting'),
    getAffiliatesStatus: () => get<Affiliate>('fahub_affiliates'),
    getTransferRequests: () => get<TransferRequest>('fahub_transfers'),
    processTransfer: (id: string, decision: string, user: string) => {
        const current = get<TransferRequest>('fahub_transfers');
        const updated = current.map(t => t.id === id ? { ...t, status: decision === 'APPROVE' ? 'APPROVED' : 'REJECTED' } as TransferRequest : t);
        set('fahub_transfers', updated);
    },

    /* Fix: Added missing storage methods for various pages */
    getAnnouncements: () => get<Announcement>('fahub_announcements'),
    saveAnnouncements: (data: Announcement[]) => set('fahub_announcements', data),
    getChatMessages: () => get<ChatMessage>('fahub_chat_messages'),
    saveChatMessages: (data: ChatMessage[]) => set('fahub_chat_messages', data),
    getDocuments: () => get<TeamDocument>('fahub_documents'),
    saveDocuments: (data: TeamDocument[]) => set('fahub_documents', data),
    getClips: () => get<VideoClip>('fahub_clips'),
    saveClips: (data: VideoClip[]) => set('fahub_clips', data),
    getLeague: (): League => ({ id: '1', name: 'Liga Brasileira', season: '2025', teams: [] }),
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
    seedDatabaseToCloud: async () => true,
    getSocialFeed: () => get<SocialFeedPost>('fahub_social_feed'),
    saveSocialFeedPost: (p: SocialFeedPost) => set('fahub_social_feed', [p, ...storageService.getSocialFeed()]),
    toggleLikePost: (id: string) => {
        const feed = storageService.getSocialFeed();
        const updated = feed.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p);
        set('fahub_social_feed', updated);
    },
    getInventory: () => get<EquipmentItem>('fahub_inventory'),
    saveInventory: (data: EquipmentItem[]) => set('fahub_inventory', data),
    getStaff: () => get<StaffMember>('fahub_staff'),
    saveStaff: (data: StaffMember[]) => set('fahub_staff', data),
    getYouthClasses: () => get<YouthClass>('fahub_youth_classes'),
    saveYouthClasses: (data: YouthClass[]) => set('fahub_youth_classes', data),
    getYouthStudents: () => get<YouthStudent>('fahub_youth_students'),
    getAthleteStatsHistory: (id: string | number) => [],
    createChampionship: (name: string, year: number, division: string) => {
        console.log(`Championship Created: ${name}`);
    },
};

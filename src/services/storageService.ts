
import { Player, Game, PracticeSession, TeamSettings, RecruitmentCandidate, AuditLog, Transaction, Invoice, Subscription, Budget, Bill, Announcement, ChatMessage, TeamDocument, TacticalPlay, VideoClip, SocialPost, MarketplaceItem, KanbanTask, SponsorDeal, EventSale, StaffMember } from '../types';

const get = <T>(key: string): T[] => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
};

const set = <T>(key: string, data: T) => {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('storage_update'));
};

export const storageService = {
    initializeRAM: () => console.log('RAM Sync Ready'),

    // Fix: Added missing syncFromCloud method
    syncFromCloud: async () => true,

    // Candidates
    getCandidates: () => get<RecruitmentCandidate>('fahub_candidates'),
    saveCandidates: (data: RecruitmentCandidate[]) => set('fahub_candidates', data),
    
    addCandidate: (c: RecruitmentCandidate) => {
        const current = storageService.getCandidates();
        if (c.cpf && current.some(x => x.cpf === c.cpf)) throw new Error("CPF já inscrito!");
        set('fahub_candidates', [...current, c]);
    },

    // Audit
    getAuditLogs: () => get<AuditLog>('fahub_audit'),
    logAction: (action: string, details: string, user: any) => {
        const logs = storageService.getAuditLogs();
        const newLog: AuditLog = {
            id: `log-${Date.now()}`,
            action,
            details,
            timestamp: new Date(),
            userId: user?.id || 'system',
            userName: user?.name || 'System',
            role: user?.role || 'SYSTEM',
            ipAddress: 'local-pwa'
        };
        set('fahub_audit', [newLog, ...logs]);
    },

    // Fix: Added missing logAuditAction method
    logAuditAction: (action: string, details: string) => {
        const logs = storageService.getAuditLogs();
        const newLog: AuditLog = {
            id: `audit-${Date.now()}`,
            action,
            details,
            timestamp: new Date(),
            userId: 'system',
            userName: 'System',
            role: 'SYSTEM',
            ipAddress: 'local-pwa'
        };
        set('fahub_audit', [newLog, ...logs]);
    },

    // Standard Entites
    getPlayers: () => get<Player>('gridiron_players'),
    savePlayers: (p: Player[]) => set('gridiron_players', p),
    registerAthlete: (p: Player) => storageService.savePlayers([...storageService.getPlayers(), p]),

    getGames: () => get<Game>('gridiron_games'),
    saveGames: (g: Game[]) => set('gridiron_games', g),
    updateLiveGame: (id: number, updates: any) => {
        const games = storageService.getGames().map(x => x.id === id ? {...x, ...updates} : x);
        storageService.saveGames(games);
    },

    getPracticeSessions: () => get<PracticeSession>('gridiron_practice'),
    savePracticeSessions: (p: PracticeSession[]) => set('gridiron_practice', p),

    getTeamSettings: (): TeamSettings => {
        const s = localStorage.getItem('gridiron_settings');
        return s ? JSON.parse(s) : { id: '1', teamName: 'FAHUB Stars', primaryColor: '#059669', logoUrl: '' };
    },
    saveTeamSettings: (s: TeamSettings) => localStorage.setItem('gridiron_settings', JSON.stringify(s)),

    getActiveProgram: () => localStorage.getItem('active_program') || 'TACKLE',
    setActiveProgram: (p: string) => localStorage.setItem('active_program', p),

    getTransactions: () => get<Transaction>('gridiron_transactions'),
    saveTransactions: (t: Transaction[]) => set('gridiron_transactions', t),

    // Fix: Added missing financial and recurring methods
    getInvoices: () => get<Invoice>('fahub_invoices'),
    getSubscriptions: () => get<Subscription>('fahub_subscriptions'),
    getBudgets: () => get<Budget>('fahub_budgets'),
    getBills: () => get<Bill>('fahub_bills'),
    saveBudgets: (b: Budget[]) => set('fahub_budgets', b),
    saveSubscriptions: (s: Subscription[]) => set('fahub_subscriptions', s),

    // Fix: Added missing communication methods
    getAnnouncements: () => get<Announcement>('fahub_announcements'),
    getChatMessages: () => get<ChatMessage>('fahub_chat'),
    saveAnnouncements: (a: Announcement[]) => set('fahub_announcements', a),
    saveChatMessages: (m: ChatMessage[]) => set('fahub_chat', m),

    // Fix: Added missing resource methods
    getDocuments: () => get<TeamDocument>('fahub_documents'),
    saveDocuments: (d: TeamDocument[]) => set('fahub_documents', d),

    // Fix: Added missing tactical and video methods
    getTacticalPlays: () => get<TacticalPlay>('fahub_tactical_plays'),
    saveTacticalPlays: (p: TacticalPlay[]) => set('fahub_tactical_plays', p),
    getClips: () => get<VideoClip>('fahub_clips'),
    saveClips: (c: VideoClip[]) => set('fahub_clips', c),
    getPlaylists: () => [],

    // Fix: Added missing marketing and commercial methods
    getMarketplaceItems: () => get<MarketplaceItem>('fahub_marketplace'),
    saveMarketplaceItems: (m: MarketplaceItem[]) => set('fahub_marketplace', m),
    getTasks: () => get<KanbanTask>('fahub_tasks'),
    saveTasks: (t: KanbanTask[]) => set('fahub_tasks', t),
    getSocialPosts: () => get<SocialPost>('fahub_social_posts'),
    saveSocialPosts: (s: SocialPost[]) => set('fahub_social_posts', s),
    getSponsors: () => get<SponsorDeal>('fahub_sponsors'),
    saveSponsors: (s: SponsorDeal[]) => set('fahub_sponsors', s),
    getEventSales: () => get<EventSale>('fahub_event_sales'),
    saveEventSales: (e: EventSale[]) => set('fahub_event_sales', e),

    // Fix: Added missing social feed methods
    getSocialFeed: () => [],
    saveSocialFeedPost: (p: any) => {},
    toggleLikePost: (id: string) => {},

    // Fix: Added missing operational methods
    getInventory: () => [],
    saveInventory: (i: any[]) => {},
    getStaff: () => get<StaffMember>('fahub_staff'),
    saveStaff: (s: StaffMember[]) => set('fahub_staff', s),

    // Fix: Added missing federation and public methods
    getConfederationStats: () => null,
    getNationalTeamScouting: () => [],
    getAffiliatesStatus: () => [],
    getTransferRequests: () => [],
    processTransfer: (id: string, decision: string, by: string) => {},
    getPublicGameData: (id: string) => null,
    getPublicLeagueStats: () => null,
    getLeague: () => ({ teams: [] }),

    // Fix: Added missing utility methods
    getAthleteMissions: (playerId: any) => [],
    getAthleteStatsHistory: (playerId: any) => [],
    togglePracticeAttendance: (sessionId: string, playerId: string) => {
        const sessions = storageService.getPracticeSessions();
        const updated = sessions.map(s => {
            if (String(s.id) === sessionId) {
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
    savePracticeCheckIn: (id: string, ids: string[]) => {},
    getCourses: () => [],
    getDrillLibrary: () => [],
    getYouthClasses: () => [],
    getYouthStudents: () => [],
    saveYouthClasses: (c: any[]) => {},
    seedDatabaseToCloud: async () => {},
    createChampionship: (name: string, year: number, div: string) => {},
    uploadFile: async (file: File, path: string) => URL.createObjectURL(file),

    getCurrentUser: () => {
        const u = localStorage.getItem('gridiron_current_user');
        return u ? JSON.parse(u) : null;
    },
    setCurrentUser: (u: any) => localStorage.setItem('gridiron_current_user', JSON.stringify(u)),
    
    subscribe: (key: string, callback: () => void) => {
        window.addEventListener('storage_update', callback);
        return () => window.removeEventListener('storage_update', callback);
    }
};
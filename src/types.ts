
export type UserRole = 'MASTER' | 'HEAD_COACH' | 'OFFENSIVE_COORD' | 'DEFENSIVE_COORD' | 'MEDICAL_STAFF' | 'FINANCIAL_MANAGER' | 'MARKETING_MANAGER' | 'COMMERCIAL_MANAGER' | 'PLAYER' | 'REFEREE' | 'SPORTS_DIRECTOR' | 'EQUIPMENT_MANAGER' | 'CANDIDATE' | 'PLATFORM_OWNER' | 'BROADCASTER' | 'SYSTEM' | 'ADMIN' | 'FAN' | 'STUDENT';

export type RosterCategory = 'ACTIVE' | 'PRACTICE_SQUAD' | 'IR' | 'SUSPENDED';
export type ProgramType = 'TACKLE' | 'FLAG' | 'BOTH' | 'YOUTH';

export interface CombineStats {
    date: Date;
    fortyYards?: number;
    benchPress?: number;
    verticalJump?: number;
    broadJump?: number;
    shuttle?: number;
    lDrill?: number;
}

export interface RoadmapItem {
    id: string;
    day: number;
    title: string;
    description: string;
    category: 'CORE' | 'FIELD' | 'FINANCE' | 'FANS';
    status: 'TODO' | 'DOING' | 'DONE';
    percentageWeight: number;
}

export interface DevelopmentPlan {
    id: string;
    playerId: string | number;
    title: string;
    generatedContent: string;
    createdAt: Date;
    deadline?: Date;
    status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export interface WellnessEntry {
    date: string;
    sleepQuality: number;
    fatigue: number;
    soreness: number;
    stress: number;
    rpe: number;
}

export interface RecruitmentCandidate {
    id: string;
    name: string;
    position: string;
    weight: number;
    // Fix: Added missing properties requested by geminiService and Recruitment page
    height?: string;
    age?: number;
    experience: string;
    behaviorTags?: string[];
    notes?: string;
    bibNumber?: number;
    status: 'NEW' | 'TESTING' | 'EVALUATED' | 'SELECTED';
    combineStats?: CombineStats;
    aiAnalysis?: string;
    rating?: number;
}

export interface Player {
    id: string | number;
    // Fix: Added userId to handle Login.tsx requirements
    userId?: string;
    name: string;
    position: string;
    jerseyNumber: number;
    height: string;
    weight: number;
    class: string;
    avatarUrl: string;
    level: number;
    xp: number;
    rating: number;
    status: 'ACTIVE' | 'INJURED' | 'SUSPENDED' | 'IR' | 'INACTIVE';
    attendanceRate: number;
    // Fix: Added missing optional properties requested by components
    medicalExamExpiry?: Date;
    // Fix: Added combineStats to resolve AddPlayerModal Omit error
    combineStats?: CombineStats;
    stats?: { ovr: number; speed: number; strength: number; agility: number; tacticalIQ: number };
    badges?: string[];
    rosterCategory?: RosterCategory;
    rosterHistory?: any[];
    depthChartOrder?: number;
    developmentPlans?: DevelopmentPlan[];
    cpf?: string;
    nationality?: string;
    birthDate?: Date;
    commitmentLevel?: number;
    program?: ProgramType;
    medicalReports?: any[];
    verificationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface PracticeScriptItem {
    id: string;
    startTime: string;
    durationMinutes: number;
    activityName: string;
    description: string;
    type: 'WARMUP' | 'TECHNICAL' | 'TACTICAL' | 'LIVE' | 'PHYSICAL' | 'INDY' | 'GROUP' | 'TEAM' | 'CONDITIONING';
}

export interface PracticeSession {
    id: string | number;
    title: string;
    focus: string;
    date: Date;
    attendees: string[];
    // Fix: Added missing properties
    checkedInAttendees?: string[];
    script?: PracticeScriptItem[];
    category?: 'PHYSICAL' | 'TACTICAL' | 'MENTAL';
    deadlineDate?: Date;
    performances?: any[];
}

export interface GameScoutingReport {
    offenseAnalysis: string;
    defenseAnalysis: string;
    keyPlayersToWatch: string;
    lastUpdate: Date;
    summary?: string;
    keysToVictory?: string[];
}

export interface PlayerPerformance {
    playerId: string | number;
    grade: number;
    notes: string;
}

export interface CallSheetSection {
    title: string;
    plays: string[];
}

export interface GameReport {
    infrastructure?: any;
    officialReport?: any;
    score?: string;
    result?: string;
    fouls?: any[];
    ejections?: any[];
    notes?: string;
    crew?: string[];
    isFinalized?: boolean;
}

export interface Game {
    id: string | number;
    opponent: string;
    opponentLogoUrl: string;
    date: Date;
    location: 'Home' | 'Away';
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'HALFTIME' | 'FINAL';
    score?: string;
    result?: 'W' | 'L' | 'T';
    currentQuarter?: number;
    clock?: string;
    timeline: any[];
    audioNotes: any[];
    rotation?: any[];
    // Fix: Added missing properties
    scoutingReport?: GameScoutingReport;
    playerGrades?: PlayerPerformance[];
    callSheet?: CallSheetSection[];
    officialReport?: GameReport;
    homeTeamName?: string;
}

export interface TeamSettings {
    id: string;
    teamName: string;
    logoUrl: string;
    primaryColor: string;
    address: string;
    sportType?: 'TACKLE' | 'FLAG' | 'BOTH';
    website?: string;
    contactEmail?: string;
}

export interface Transaction {
    id: string;
    title: string;
    // Fix: Added description
    description?: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    category: TransactionCategory | string;
    date: Date;
    status: 'PAID' | 'PENDING';
    aiGenerated?: boolean;
    verifiedBy?: string;
    attachments?: string[];
}

export type TransactionCategory = 'TRANSPORT' | 'EQUIPMENT' | 'REFEREE' | 'FIELD_RENTAL' | 'EVENT' | 'SPONSORSHIP' | 'TUITION' | 'STORE' | 'OTHER';

export interface Objective {
    id: string;
    title: string;
    progress: number;
    status: 'IN_PROGRESS' | 'COMPLETED' | 'ON_TRACK' | 'BEHIND';
    ownerRole: string;
    // Fix: Added missing properties
    category?: 'SPORTING' | 'FINANCIAL' | 'MARKETING';
    deadline?: Date;
    description?: string;
    keyResults?: KeyResult[];
}

export interface KeyResult {
    id: string;
    title: string;
    currentValue: number;
    targetValue: number;
    unit: string;
    lastUpdated: Date;
}

export interface AuditLog {
    id: string;
    action: string;
    details: string;
    timestamp: Date;
    userId: string;
    userName: string;
    role: string;
    // Fix: Added ipAddress
    ipAddress?: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    cpf: string;
    avatarUrl: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    program?: ProgramType;
    isProfileComplete: boolean;
}

export interface Team {
    id: string;
    name: string;
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
    rosterIds: (string | number)[];
    coachIds: string[];
}

export interface VideoClip {
    id: string;
    title: string;
    videoUrl: string;
    startTime: number;
    tags: VideoTag;
}

export interface VideoTag {
    down: number;
    distance: number;
    offensivePlayCall: string;
    result: string;
    yardLine?: number;
    hash?: 'LEFT' | 'MIDDLE' | 'RIGHT';
    offensiveFormation?: string;
    defensiveFormation?: string;
    defensivePlayCall?: string;
    personnel?: string;
    gain?: number;
    involvedPlayerIds?: (string | number)[];
    startX?: number;
    startY?: number;
}

export interface Invoice {
    id: string;
    status: 'PENDING' | 'PAID' | 'OVERDUE';
    amount: number;
    dueDate: Date;
    playerName: string;
    title: string;
    category?: TransactionCategory;
    playerId?: string | number;
    inventoryItemId?: string;
}

export interface Subscription {
    id: string;
    title: string;
    amount: number;
    active: boolean;
    assignedTo: (string | number)[];
    frequency?: 'MONTHLY' | 'YEARLY';
    nextBillingDate?: Date;
}

export interface Budget {
    category: string;
    spent: number;
    limit: number;
}

export interface Bill {
    id: string;
    status: 'PENDING' | 'PAID';
    amount: number;
    title?: string;
}

export interface League {
    id: string;
    name: string;
    season: string;
    teams: {
        teamId: string;
        teamName: string;
        wins: number;
        losses: number;
        pointsFor: number;
        pointsAgainst: number;
        logoUrl?: string;
        draws?: number;
    }[];
}

export interface TacticalPlay {
    id: string;
    name: string;
    concept: string;
    elements: PlayElement[];
    frames?: TacticalFrame[];
    routes?: any[];
    aiAnalysis?: string;
    createdAt?: Date;
    program?: string;
}

export interface PlayElement {
    id: string;
    type: 'OFFENSE' | 'DEFENSE';
    label: string;
    x: number;
    y: number;
}

export interface TacticalFrame {
    id: number;
    elements: PlayElement[];
}

export interface InstallMatrixItem {
    id: string;
    day: string;
    category: string;
    concept: string;
}

export interface DigitalProduct {
    id: string;
    title: string;
    description: string;
    price: number;
    type: 'SCOUT_REPORT' | 'GAME_VIDEO' | 'DOCUMENT' | 'COURSE';
    durationHours: number;
    coverUrl: string;
}

export interface Entitlement {
    id: string;
    userId: string;
    productId: string;
    expiresAt: Date;
}

export interface Tenant {
    id: string;
    name: string;
    plan: 'ROOKIE' | 'STARTER' | 'ALL_PRO';
    status: 'ACTIVE' | 'DELINQUENT';
    mrr: number;
    joinedAt: Date;
    logoUrl: string;
    contactEmail: string;
}

export interface ServiceTicket {
    id: string;
    tenantId: string;
    tenantName: string;
    serviceName: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'DELIVERED';
    purchasedAt: Date;
    assignedTo: string;
    deliverableUrl?: string;
}

export interface PlatformMetric {
    totalRevenue: number;
    activeTeams: number;
    pendingServices: number;
    churnRate: number;
}

export interface Drill {
    id: string;
    name: string;
    description: string;
    durationMinutes: number;
    videoSearchTerm?: string;
}

export interface SocialPost {
    id: string;
    platform: 'INSTAGRAM' | 'TIKTOK' | 'WEBSITE' | 'WHATSAPP';
    topic: string;
    content: string;
    status: 'SCHEDULED' | 'POSTED';
    scheduledDate: Date;
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    priority: 'NORMAL' | 'HIGH' | 'URGENT';
    date: Date;
    authorRole: UserRole;
    readBy?: string[];
}

export interface TeamDocument {
    id: string;
    title: string;
    type: 'PDF' | 'DOC' | 'IMG';
    category: 'CONTRACTS' | 'PLAYBOOK' | 'MEDICAL' | 'ADMIN' | 'SCOUT';
    uploadDate: Date;
    size: string;
    url: string;
}

export interface PlayerRotation {
    playerId: string | number;
    status: 'ON_FIELD' | 'BENCH';
    minutesPlayed: number;
    fatigueLevel: number;
}

export interface SocialFeedPost {
    id: string;
    authorName: string;
    authorAvatar: string;
    authorRole: string;
    isOfficialTeamPost: boolean;
    isPinned: boolean;
    content: string;
    likes: number;
    comments: any[];
    timestamp: Date;
}

export interface EquipmentItem {
    id: string;
    name: string;
    brand?: string;
    size?: string;
    category: 'HELMET' | 'PADS' | 'JERSEY' | 'BALL' | 'DRINK' | 'FOOD' | 'MERCH';
    quantity: number;
    condition: 'NEW' | 'USED' | 'DAMAGED';
    forSale: boolean;
    salePrice?: number;
    assignedToPlayerId?: number | string;
    expiryDate?: Date;
    cost?: number;
    acquisitionDate: Date;
    qrCodeUrl?: string;
}

export interface StaffMember {
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    contract: {
        active: boolean;
        type: 'VOLUNTEER' | 'PAID';
        value: number;
        signed: boolean;
    };
    documentsPending: boolean;
}

export interface YouthClass {
    id: string;
    name: string;
    ageGroup: string;
    schedule: string;
    coachId: string;
    students: string[];
    maxCapacity: number;
}

export interface YouthStudent {
    id: string;
    name: string;
    isSocialProject: boolean;
}

export interface ConfederationStats {
    totalAthletes: number;
    totalTeams: number;
    totalGamesThisYear: number;
    activeAffiliates: number;
}

export interface NationalTeamCandidate {
    id: number | string;
    name: string;
    position: string;
    rating: number;
    avatarUrl: string;
    teamName: string;
    teamLogo: string;
    combineStats: CombineStats;
}

export interface Affiliate {
    id: string;
    name: string;
    region: string;
    president: string;
    status: 'REGULAR' | 'PENDING' | 'IRREGULAR';
    athletesCount: number;
    teamsCount: number;
    lastAuditDate: Date;
}

export interface TransferRequest {
    id: string;
    playerName: string;
    originTeamName: string;
    destinationTeamName: string;
    fee: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Course {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    priority?: boolean;
    level?: string;
}

export interface LegalDocument {
    id: string;
    title: string;
    content: string;
    version: string;
}

// Added missing members to resolve storageService and other component imports
export interface MarketplaceItem {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    sellerType: 'TEAM_STORE' | 'PLAYER';
    sellerName: string;
    imageUrl: string;
    isSold: boolean;
    qrCodeDelivery?: string;
}

export interface KanbanTask {
    id: string;
    title: string;
    description?: string;
    status: 'TODO' | 'DOING' | 'DONE';
    assignedToDepartment: 'MARKETING' | 'COMMERCIAL' | 'TECHNICAL' | 'FINANCE' | 'GENERAL';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate: Date;
}

export interface SponsorDeal {
    id: string;
    companyName: string;
    contactPerson: string;
    status: 'PROSPECT' | 'NEGOTIATION' | 'CLOSED_WON' | 'REJECTED';
    value: number;
    lastInteraction: Date;
}

export interface EventSale {
    id: string;
    type: 'TICKET' | 'BAR';
    itemName: string;
    quantity: number;
    totalAmount: number;
    timestamp: Date;
}

export interface ChatMessage {
    id: string;
    senderName: string;
    senderRole: string;
    content: string;
    timestamp: Date;
    channel?: 'GENERAL' | 'OFFENSE' | 'DEFENSE';
}


export type UserRole = 'MASTER' | 'HEAD_COACH' | 'OFFENSIVE_COORD' | 'DEFENSIVE_COORD' | 'MEDICAL_STAFF' | 'FINANCIAL_MANAGER' | 'MARKETING_MANAGER' | 'COMMERCIAL_MANAGER' | 'PLAYER' | 'REFEREE' | 'SPORTS_DIRECTOR' | 'EQUIPMENT_MANAGER' | 'CANDIDATE' | 'PLATFORM_OWNER' | 'BROADCASTER' | 'SYSTEM' | 'ADMIN' | 'FAN' | 'STUDENT';

export type RosterCategory = 'ACTIVE' | 'PRACTICE_SQUAD' | 'IR' | 'SUSPENDED' | 'YOUTH';
export type ProgramType = 'TACKLE' | 'FLAG' | 'BOTH' | 'YOUTH';
export type IncubationStatus = 'CULTURE' | 'FUNDAMENTALS' | 'READY';
export type TransactionCategory = 'TRANSPORT' | 'EQUIPMENT' | 'REFEREE' | 'FIELD_RENTAL' | 'EVENT' | 'SPONSORSHIP' | 'TUITION' | 'STORE' | 'OTHER';

export interface CombineStats {
    date: Date;
    fortyYards?: number;
    benchPress?: number;
    verticalJump?: number;
    broadJump?: number;
    shuttle?: number;
    lDrill?: number;
}

export interface IncubationProgress {
    cultureAccepted: boolean;
    fundamentalsProgress: number; // 0-100
    fieldEvaluationScore: number; // Média dos drills
    status: IncubationStatus;
    mentorNotes?: string;
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

export interface Player {
    id: string | number;
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
    status: 'ACTIVE' | 'INJURED' | 'SUSPENDED' | 'IR' | 'INACTIVE' | 'INCUBATING';
    program: ProgramType;
    incubation?: IncubationProgress;
    birthDate?: Date;
    attendanceRate: number;
    stats?: { ovr: number; speed: number; strength: number; agility: number; tacticalIQ: number };
    careerHistory?: { team: string, year: number, achievement: string }[];
    // Fix: Added missing properties to satisfy component and page errors
    cpf?: string;
    badges?: string[];
    rosterCategory?: RosterCategory;
    commitmentLevel?: number;
    medicalExamExpiry?: Date;
    developmentPlans?: DevelopmentPlan[];
    nationality?: string;
    depthChartOrder?: number;
    // Added combineStats property
    combineStats?: CombineStats;
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

export interface RecruitmentCandidate {
    id: string;
    name: string;
    position: string;
    weight: number;
    height?: string;
    age?: number;
    experience: string;
    status: 'NEW' | 'TESTING' | 'EVALUATED' | 'SELECTED' | 'REJECTED';
    program: ProgramType;
    bibNumber?: number;
    combineStats?: CombineStats;
    aiAnalysis?: string;
    rating?: number;
    behaviorTags?: string[];
    // Fix: Added missing property
    notes?: string;
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

export interface PracticeScriptItem {
    id: string;
    startTime: string;
    durationMinutes: number;
    activityName: string;
    type: 'WARMUP' | 'TECHNICAL' | 'TACTICAL' | 'LIVE' | 'PHYSICAL' | 'INDY' | 'GROUP' | 'TEAM' | 'CONDITIONING';
    description?: string;
}

export interface PracticeSession {
    id: string | number;
    title: string;
    focus: string;
    date: Date;
    program?: ProgramType;
    attendees: string[];
    script?: PracticeScriptItem[];
    // Fix: Added missing properties
    checkedInAttendees?: string[];
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

export interface Game {
    id: string | number;
    opponent: string;
    date: Date;
    location: 'Home' | 'Away';
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'FINAL' | 'HALFTIME';
    score?: string;
    currentQuarter?: number;
    clock?: string;
    rotation?: any[];
    result?: 'W' | 'L' | 'T';
    opponentLogoUrl?: string;
    timeline?: any[];
    audioNotes?: any[];
    scoutingReport?: GameScoutingReport;
    playerGrades?: PlayerPerformance[];
    callSheet?: CallSheetSection[];
    homeTeamName?: string;
    officialReport?: any;
}

export interface Team {
    id: string;
    name: string;
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
    rosterIds: string[];
    coachIds: string[];
}

export interface TeamSettings {
    id: string;
    teamName: string;
    logoUrl: string;
    primaryColor: string;
    sportType?: 'TACKLE' | 'FLAG' | 'BOTH';
    address?: string;
    website?: string;
    contactEmail?: string;
}

export interface AuditLog {
    id: string;
    action: string;
    details: string;
    timestamp: Date;
    userId: string;
    userName: string;
    role: string;
    // Fix: Added missing property
    ipAddress?: string;
}

export interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    category: TransactionCategory | string;
    date: Date;
    status: 'PAID' | 'PENDING';
    aiGenerated?: boolean;
    verifiedBy?: string;
    description?: string;
}

export interface Subscription {
    id: string;
    title: string;
    amount: number;
    active: boolean;
    assignedTo: (string | number)[];
    frequency?: string;
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

export interface Announcement {
    id: string;
    title: string;
    content: string;
    priority: 'NORMAL' | 'HIGH' | 'URGENT' | string;
    date: Date;
    authorRole: string;
    readBy?: string[];
}

export interface ChatMessage {
    id: string;
    senderName: string;
    senderRole: string;
    content: string;
    timestamp: Date;
    channel?: 'GENERAL' | 'OFFENSE' | 'DEFENSE' | string;
}

export interface TeamDocument {
    id: string;
    title: string;
    type: 'PDF' | 'DOC' | 'IMG' | string;
    category: 'CONTRACTS' | 'PLAYBOOK' | 'MEDICAL' | 'ADMIN' | 'SCOUT' | string;
    uploadDate: Date;
    size: string;
    url: string;
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

export interface TacticalPlay {
    id: string;
    name: string;
    concept: string;
    elements: PlayElement[];
    // Fix: Added missing property
    frames?: TacticalFrame[];
    routes?: any[];
    aiAnalysis?: string;
    createdAt?: Date;
    program?: string;
}

export interface VideoClip {
    id: string;
    title: string;
    videoUrl: string;
    startTime: number;
    tags: any;
}

export interface InstallMatrixItem {
    id: string;
    day: string;
    category: string;
    concept: string;
}

export interface MarketplaceItem {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    sellerType: 'TEAM_STORE' | 'PLAYER' | string;
    sellerName: string;
    imageUrl: string;
    isSold: boolean;
    // Fix: Added missing property
    qrCodeDelivery?: string;
}

export interface KanbanTask {
    id: string;
    title: string;
    description?: string;
    status: 'TODO' | 'DOING' | 'DONE';
    assignedToDepartment: 'MARKETING' | 'COMMERCIAL' | 'TECHNICAL' | 'FINANCE' | 'GENERAL' | string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | string;
    dueDate: Date;
}

export interface SocialPost {
    id: string;
    platform: 'INSTAGRAM' | 'TIKTOK' | 'WEBSITE' | string;
    topic: string;
    content: string;
    status: 'SCHEDULED' | 'POSTED' | string;
    scheduledDate: Date;
}

export interface SponsorDeal {
    id: string;
    companyName: string;
    contactPerson: string;
    status: 'PROSPECT' | 'NEGOTIATION' | 'CLOSED_WON' | 'REJECTED' | string;
    value: number;
    lastInteraction: Date;
}

export interface EventSale {
    id: string;
    type: 'TICKET' | 'BAR' | string;
    itemName: string;
    quantity: number;
    totalAmount: number;
    timestamp: Date;
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

export interface LegalDocument {
    id: string;
    title: string;
    content: string;
    version: string;
}

export interface EquipmentItem {
    id: string;
    name: string;
    brand?: string;
    size?: string;
    category: 'HELMET' | 'PADS' | 'JERSEY' | 'BALL' | 'DRINK' | 'FOOD' | 'MERCH' | string;
    quantity: number;
    condition: 'NEW' | 'USED' | 'DAMAGED' | string;
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
        type: 'VOLUNTEER' | 'PAID' | string;
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
    status: 'REGULAR' | 'PENDING' | 'IRREGULAR' | string;
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
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
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
        draws?: number;
        logoUrl?: string;
    }[];
}

export interface PlayerRotation {
    playerId: string | number;
    status: 'ON_FIELD' | 'BENCH';
    minutesPlayed: number;
    fatigueLevel: number;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    priority?: boolean;
    level?: string;
}

export interface Objective {
    id: string;
    title: string;
    description?: string;
    category: string;
    status: 'IN_PROGRESS' | 'COMPLETED' | 'ON_TRACK' | 'BEHIND' | string;
    progress: number;
    deadline?: Date;
    ownerRole: string;
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

export interface DigitalProduct {
    id: string;
    title: string;
    description: string;
    price: number;
    type: 'SCOUT_REPORT' | 'GAME_VIDEO' | 'DOCUMENT' | 'COURSE' | string;
    durationHours?: number;
    coverUrl?: string;
}

export interface Entitlement {
    id: string;
    userId: string;
    productId: string;
    expiresAt: Date;
}

export interface PlatformMetric {
    totalRevenue: number;
    activeTeams: number;
    pendingServices: number;
    churnRate: number;
}

export interface Tenant {
    id: string;
    name: string;
    plan: 'ROOKIE' | 'STARTER' | 'ALL_PRO' | string;
    status: 'ACTIVE' | 'DELINQUENT' | string;
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
    status: 'PENDING' | 'IN_PROGRESS' | 'DELIVERED' | string;
    purchasedAt: Date;
    assignedTo?: string;
    deliverableUrl?: string;
}

export interface Drill {
    id: string;
    name: string;
    description: string;
    durationMinutes: number;
    videoSearchTerm?: string;
}

export interface GameReport {
    infrastructure?: {
        ambulancePresent: boolean;
        fieldMarkingOk: boolean;
    };
    officialReport?: any;
    score?: string;
    result?: string;
    fouls?: any[];
    ejections?: any[];
    notes?: string;
    crew?: string[];
    isFinalized?: boolean;
}

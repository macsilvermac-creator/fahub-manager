
export type UserRole = 'MASTER' | 'HEAD_COACH' | 'OFFENSIVE_COORD' | 'DEFENSIVE_COORD' | 'MEDICAL_STAFF' | 'FINANCIAL_MANAGER' | 'MARKETING_MANAGER' | 'COMMERCIAL_MANAGER' | 'PLAYER' | 'REFEREE' | 'SPORTS_DIRECTOR' | 'EQUIPMENT_MANAGER' | 'CANDIDATE' | 'PLATFORM_OWNER' | 'BROADCASTER' | 'SYSTEM' | 'ADMIN' | 'FAN' | 'STUDENT' | 'PRESIDENT' | 'VICE_PRESIDENT' | 'FINANCIAL_DIRECTOR' | 'COMMERCIAL_DIRECTOR' | 'MARKETING_DIRECTOR' | 'POSITION_COACH' | 'PHYSICAL_TRAINER' | 'STAFF';

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

export interface CoordinatorTask {
    id: string;
    title: string;
    description: string;
    assignedTo: 'OFFENSE' | 'DEFENSE' | 'ST';
    status: 'TODO' | 'DOING' | 'DONE';
}

export interface LeagueRanking {
    position: number;
    teamName: string;
    record: string; // ex: 4-0
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
    height?: string;
    age?: number;
    experience?: string;
    bibNumber?: number;
    status: 'NEW' | 'TESTING' | 'EVALUATED' | 'SELECTED';
    combineStats?: CombineStats;
    aiAnalysis?: string;
    rating?: number;
    behaviorTags?: string[];
    notes?: string;
}

export type IncubationStatus = 'CULTURE' | 'FUNDAMENTALS' | 'EVALUATION' | 'GRADUATED';

export interface Player {
    id: string | number;
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
    attendanceRate?: number;
    stats?: { ovr: number; speed: number; strength: number; agility: number; tacticalIQ: number };
    program?: ProgramType;
    rosterCategory?: RosterCategory;
    combineStats?: CombineStats;
    badges?: string[];
    commitmentLevel?: number;
    incubation?: {
        cultureAccepted: boolean;
        fundamentalsProgress: number;
        fieldEvaluationScore: number;
        status: IncubationStatus;
    };
    medicalExamExpiry?: Date;
    developmentPlans?: DevelopmentPlan[];
    wellnessHistory?: WellnessEntry[];
    // Fix: Added missing properties to Player interface
    cpf?: string;
    nationality?: string;
    rosterHistory?: any[];
    depthChartOrder?: number;
    birthDate?: Date;
}

export interface PracticeScriptItem {
    id: string;
    startTime: string;
    durationMinutes: number;
    activityName: string;
    type: 'WARMUP' | 'INDY' | 'GROUP' | 'TEAM' | 'CONDITIONING' | 'TECHNICAL' | 'TACTICAL' | 'LIVE' | 'PHYSICAL';
    description?: string;
}

export interface PracticeSession {
    id: string | number;
    title: string;
    focus: string;
    date: Date;
    attendees: string[];
    checkedInAttendees?: string[];
    script?: PracticeScriptItem[];
    // Fix: Added missing properties to PracticeSession interface
    deadlineDate?: Date;
    category?: 'PHYSICAL' | 'TACTICAL' | 'MENTAL';
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
    result?: 'W' | 'L' | 'T';
    opponentLogoUrl?: string;
    scoutingReport?: GameScoutingReport;
    playerGrades?: PlayerPerformance[];
    callSheet?: CallSheetSection[];
    homeTeamName?: string;
    officialReport?: any;
    currentQuarter?: number;
    clock?: string;
    rotation?: any[];
    // Fix: Added missing properties to Game interface
    timeline?: any[];
    audioNotes?: any[];
}

export interface TeamSettings {
    id: string;
    teamName: string;
    logoUrl: string;
    primaryColor: string;
    address?: string;
    plan?: string;
    sportType?: 'TACKLE' | 'FLAG' | 'BOTH';
    website?: string;
    contactEmail?: string;
}

export interface AuditLog {
    id: string;
    action: string;
    details: string;
    timestamp: Date;
    userName: string;
    userId?: string;
    role?: string;
    ipAddress?: string;
}

export interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    category: string;
    date: Date;
    status: 'PAID' | 'PENDING';
    description?: string;
    aiGenerated?: boolean;
    verifiedBy?: string;
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
}

export type TransactionCategory = 'TRANSPORT' | 'EQUIPMENT' | 'REFEREE' | 'FIELD_RENTAL' | 'EVENT' | 'SPONSORSHIP' | 'TUITION' | 'STORE' | 'OTHER';

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
    priority: 'NORMAL' | 'HIGH' | 'URGENT';
    date: Date;
    authorRole: UserRole;
    readBy?: string[];
}

export interface ChatMessage {
    id: string;
    senderName: string;
    senderRole: string;
    content: string;
    timestamp: Date;
    channel?: 'GENERAL' | 'OFFENSE' | 'DEFENSE';
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

export interface TacticalPlay {
    id: string;
    name: string;
    concept: string;
    elements: PlayElement[];
    frames?: TacticalFrame[];
    routes?: any[];
    aiAnalysis?: string;
    program?: string;
    createdAt?: Date;
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
    hash?: string;
    offensiveFormation?: string;
    defensiveFormation?: string;
    defensivePlayCall?: string;
    personnel?: string;
    gain?: number;
    involvedPlayerIds?: string[];
    startX?: number;
    startY?: number;
    [key: string]: any;
}

export interface Objective {
    id: string;
    title: string;
    description?: string;
    category: string;
    status: 'IN_PROGRESS' | 'COMPLETED' | 'ON_TRACK' | 'BEHIND';
    progress: number;
    deadline: Date;
    ownerRole: UserRole;
    keyResults: KeyResult[];
}

export interface KeyResult {
    id: string;
    title: string;
    currentValue: number;
    targetValue: number;
    unit: string;
    lastUpdated: Date;
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
    priority: 'HIGH' | 'LOW' | 'MEDIUM';
    dueDate: Date;
}

export interface SocialPost {
    id: string;
    platform: 'INSTAGRAM' | 'TIKTOK' | 'WEBSITE' | 'WHATSAPP';
    topic: string;
    content: string;
    status: 'SCHEDULED' | 'POSTED';
    scheduledDate: Date;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    priority?: boolean;
    level?: string;
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
    category: 'HELMET' | 'PADS' | 'JERSEY' | 'BALL' | 'DRINK' | 'FOOD' | 'MERCH' | 'CLEATS' | 'ACCESSORIES';
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
    id: number;
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

export interface OKR {
    id: string;
    title: string;
    description: string;
    ownerRole: UserRole;
    targetValue: number;
    currentValue: number;
    unit: string;
    category: 'ADMIN' | 'FINANCE' | 'COMMERCIAL' | 'MARKETING' | 'SPORTS' | 'TECHNICAL';
    status: 'ON_TRACK' | 'AT_RISK' | 'BEHIND' | 'COMPLETED';
    parentOkrId?: string;
    subordinatesCheck: boolean;
}

export interface RoadmapItem {
    id: string;
    day: number;
    title: string;
    description: string;
    status: 'DONE' | 'DOING' | 'TODO';
}

export interface Drill {
    id: string;
    name: string;
    description: string;
    durationMinutes: number;
    videoSearchTerm?: string;
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
    status: 'ACTIVE' | 'DELINQUENT' | 'SUSPENDED';
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
    assignedTo?: string;
    deliverableUrl?: string;
}

export interface PlatformMetric {
    totalRevenue: number;
    activeTeams: number;
    pendingServices: number;
    churnRate: number;
}

export interface ObjectiveSignal {
    id: string;
    timestamp: Date;
    fromRole: UserRole;
    fromName: string;
    type: 'MILESTONE_REACHED' | 'APPROVAL_REQUIRED' | 'STATUS_UPDATE' | 'ALERT';
    message: string;
    status: 'UNREAD' | 'READ' | 'ACTIONED';
    data?: any;
}

export type PaymentMethod = 'PIX' | 'CREDIT_CARD';

export interface PaymentTransaction {
    id: string;
    amount: number;
    method: PaymentMethod;
    status: 'APPROVED' | 'PENDING' | 'REJECTED';
    createdAt: Date;
    platformFee: number;
    netAmount: number;
}

export interface LegalDocument {
    id: string;
    title: string;
    content: string;
    version: string;
    lastUpdated: Date;
}

export interface CoachGameNote {
    id: string;
    gameId: string | number;
    coachId: string;
    content: string;
    timestamp: Date;
}

export interface GameReport {
    gameId: string | number;
    officialId: string;
    infrastructure: {
        ambulancePresent: boolean;
        fieldCondition: string;
    };
    incidents: any[];
}

export interface Championship {
    id: string;
    name: string;
    year: number;
    division: string;
}

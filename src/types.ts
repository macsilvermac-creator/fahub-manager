
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
    bibNumber?: number;
    name: string;
    email: string;
    phone: string;
    cpf?: string;
    position: string;
    age: number;
    height: string;
    weight: number;
    experience: string;
    status: 'NEW' | 'CHECKED_IN' | 'TESTING' | 'EVALUATED' | 'SELECTED' | 'ONBOARDING' | 'TRYOUT';
    createdAt: Date;
    notes?: string;
    behaviorTags?: string[];
    avatarUrl?: string;
    rating?: number;
    aiAnalysis?: string;
    combineStats?: CombineStats;
}

export interface AuditLog {
    id: string;
    action: string;
    details: string;
    timestamp: Date;
    userId: string;
    userName: string;
    role: string;
    ipAddress: string;
}

export interface Objective {
    id: string;
    title: string;
    description?: string;
    category: 'SPORTING' | 'FINANCIAL' | 'MARKETING' | 'OPERATIONAL';
    status: 'PLANNED' | 'IN_PROGRESS' | 'BEHIND' | 'COMPLETED' | 'AT_RISK';
    progress: number;
    deadline: Date;
    owner?: string;
    ownerRole: UserRole;
    keyResults: KeyResult[];
    parentObjectiveId?: string;
}

export interface KeyResult {
    id: string;
    title: string;
    currentValue: number;
    targetValue: number;
    unit: string;
    lastUpdated: Date;
    updatedBy?: string;
}

export interface Player {
    id: number;
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
    rosterCategory?: RosterCategory;
    program?: ProgramType;
    combineStats?: CombineStats;
    combineHistory?: CombineStats[];
    savedWorkouts?: any[];
    developmentPlans?: DevelopmentPlan[];
    gameLogs?: any[];
    highlights?: any[];
    achievements?: any[];
    wellnessHistory?: WellnessEntry[];
    medicalReports?: any[];
    rosterHistory?: any[];
    hcNotes?: string;
    commitmentLevel?: number;
    medicalExamExpiry?: Date;
    cpf?: string;
    teamId?: string;
    depthChartOrder?: number;
    verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
    badges?: string[];
    nationality?: string;
    birthDate?: Date;
}

export interface DevelopmentPlan {
    id: string;
    playerId: number;
    title: string;
    generatedContent: string;
    createdAt: Date;
    deadline?: Date;
    status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export interface Game {
    id: number;
    opponent: string;
    opponentLogoUrl: string;
    date: Date;
    location: 'Home' | 'Away';
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'HALFTIME' | 'FINAL';
    score?: string;
    result?: 'W' | 'L' | 'T';
    currentQuarter?: number;
    clock?: string;
    timeline: GameTimelineEvent[];
    audioNotes: SidelineAudioNote[];
    gameRoster?: string[];
    scoutingReport?: GameScoutingReport;
    playerGrades?: PlayerPerformance[];
    callSheet?: CallSheetSection[];
    rotation?: PlayerRotation[];
    officialReport?: GameReport;
    homeTeamName?: string;
}

export interface GameScoutingReport {
    offenseAnalysis: string;
    defenseAnalysis: string;
    keyPlayersToWatch: string;
    lastUpdate: Date;
}

export interface PlayerPerformance {
    playerId: number;
    grade: number;
    notes: string;
}

export interface CallSheetSection {
    title: string;
    plays: string[];
}

export interface PlayerRotation {
    playerId: number;
    status: 'ON_FIELD' | 'BENCH';
    minutesPlayed: number;
    fatigueLevel: number;
}

export interface PracticeSession {
    id: string | number;
    title: string;
    focus: string;
    date: Date;
    category?: PracticeCategory;
    attendees?: string[];
    checkedInAttendees?: string[];
    script?: PracticeScriptItem[];
    deadlineDate?: Date;
    locationType?: string;
    performances?: any[];
    instructor?: string;
    notes?: string;
    drills?: any[];
}

export type PracticeCategory = 'PHYSICAL' | 'TACTICAL' | 'MENTAL';

export interface PracticeScriptItem {
    id: string;
    startTime: string;
    durationMinutes: number;
    activityName: string;
    description: string;
    type: string;
}

export type TransactionCategory = 'TRANSPORT' | 'EQUIPMENT' | 'REFEREE' | 'FIELD_RENTAL' | 'EVENT' | 'SPONSORSHIP' | 'TUITION' | 'STORE' | 'OTHER';

export interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    category: string;
    date: Date;
    status: 'PAID' | 'PENDING';
    aiGenerated?: boolean;
    verifiedBy?: string;
    description?: string;
    attachments?: any[];
}

export interface Subscription {
    id: string;
    title: string;
    amount: number;
    active: boolean;
    assignedTo: any[];
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

export interface Invoice {
    id: string;
    status: 'PENDING' | 'PAID' | 'OVERDUE';
    amount: number;
    dueDate: Date;
    playerName: string;
    title: string;
    playerId?: number;
    category?: TransactionCategory;
    inventoryItemId?: string;
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    priority: 'NORMAL' | 'HIGH' | 'URGENT';
    date: Date;
    readBy?: string[];
    authorRole?: UserRole;
}

export interface ChatMessage {
    id: string;
    content: string;
    senderName?: string;
    senderRole?: UserRole;
    timestamp?: Date;
    channel?: 'GENERAL' | 'OFFENSE' | 'DEFENSE';
}

export interface TeamDocument {
    id: string;
    title: string;
    category: string;
    type: string;
    uploadDate: Date;
    size: string;
    url: string;
}

export interface VideoClip {
    id: string;
    title: string;
    startTime: number;
    videoUrl: string;
    endTime?: number;
    gameId?: string;
    tags: VideoTag;
}

export interface VideoTag {
    down: 1 | 2 | 3 | 4;
    distance: number;
    yardLine: number;
    hash?: 'LEFT' | 'MIDDLE' | 'RIGHT';
    offensiveFormation: string;
    defensiveFormation: string;
    offensivePlayCall: string;
    defensivePlayCall: string;
    personnel: string;
    result: string;
    gain: number;
    involvedPlayerIds: number[];
    startX?: number;
    startY?: number;
}

export interface PlayElement {
    id: string;
    x: number;
    y: number;
    label: string;
    type: 'OFFENSE' | 'DEFENSE';
}

export interface TacticalPlay {
    id: string;
    name: string;
    elements: PlayElement[];
    concept?: string;
    frames?: TacticalFrame[];
    routes?: any[];
    aiAnalysis?: string;
    program?: ProgramType;
    createdAt?: Date;
}

export interface TacticalFrame {
    id: number;
    elements: PlayElement[];
}

export interface SocialPost {
    id: string;
    platform: 'INSTAGRAM' | 'TIKTOK' | 'WEBSITE' | 'WHATSAPP';
    topic: string;
    content: string;
    status: 'SCHEDULED' | 'POSTED';
    scheduledDate: Date;
}

export interface MarketplaceItem {
    id: string;
    price: number;
    isSold: boolean;
    sellerType: 'TEAM_STORE' | 'PLAYER';
    title: string;
    description: string;
    category: string;
    sellerName: string;
    imageUrl: string;
    qrCodeDelivery?: string;
}

export interface KanbanTask {
    id: string;
    status: 'TODO' | 'DOING' | 'DONE';
    title: string;
    description?: string;
    assignedToDepartment: 'MARKETING' | 'COMMERCIAL' | 'TECHNICAL' | 'FINANCE' | 'GENERAL';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate: Date;
}

export interface SponsorDeal {
    id: string;
    status: 'CLOSED_WON' | 'PENDING' | 'REJECTED' | 'PROSPECT' | 'NEGOTIATION' | 'CLOSED_LOST';
    value: number;
    companyName: string;
    contactPerson?: string;
    lastInteraction: Date;
}

export interface EventSale {
    id: string;
    totalAmount: number;
    type: 'TICKET' | 'BAR';
    itemName: string;
    timestamp: Date;
    quantity?: number;
}

export interface WellnessEntry {
    date: string;
    sleepQuality: number;
    fatigue: number;
    soreness: number;
    stress: number;
    rpe: number;
}

export interface StaffMember {
    id: string;
    name: string;
    role?: string;
    email?: string;
    phone?: string;
    contract: StaffContract;
    documentsPending?: boolean;
}

export interface StaffContract {
    active: boolean;
    type: 'VOLUNTEER' | 'PAID';
    value: number;
    signed: boolean;
}

export interface SidelineAudioNote {
    id: string;
    timestamp: Date;
    gameTime: string; 
    unit: 'ATAQUE' | 'DEFESA' | 'ST' | 'GERAL';
    rawTranscript: string;
    analysis?: {
        playerNumber?: number;
        action?: string;
        insight?: string;
    };
}

export interface GameTimelineEvent {
    id: string;
    timestamp: Date;
    gameTime: string;
    quarter: number;
    down: number;
    distance: number;
    yardLine: string;
    playType: 'RUN' | 'PASS' | 'FOUL' | 'PUNT' | 'FG' | 'KICKOFF' | 'TIMEOUT';
    result: string;
}

export interface SocialFeedPost {
    id: string;
    authorName: string;
    authorAvatar: string;
    authorRole: UserRole;
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
    category: 'HELMET' | 'PADS' | 'JERSEY' | 'BALL' | 'DRINK' | 'FOOD' | 'MERCH' | 'CLEATS' | 'ACCESSORIES';
    quantity: number;
    condition: 'NEW' | 'USED' | 'DAMAGED';
    forSale: boolean;
    salePrice?: number;
    brand?: string;
    size?: string;
    acquisitionDate: Date;
    expiryDate?: Date;
    cost?: number;
    assignedToPlayerId?: number;
    qrCodeUrl?: string;
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
    age: number;
    isSocialProject: boolean;
}

export interface GameReport {
    infrastructure: GameInfrastructureChecklist;
    fouls: FoulRecord[];
    ejections: any[];
    notes: string;
    crew: string[];
    isFinalized: boolean;
}

export interface GameInfrastructureChecklist {
    ambulancePresent: boolean;
    ambulanceArrivalTime: string;
    visitorArrivalTime: string;
    lightingAdequate: boolean;
    fieldDimensionsOk: boolean;
    goalPostsOk: boolean;
    fieldMarkingsCorrect: boolean;
    visitorLockerRoom: { hasHotWater: boolean, secure: boolean };
    refereeLockerRoom: { hasHotWater: boolean, secure: boolean };
    ballsProvided: boolean;
    waterProvided: boolean;
}

export interface FoulRecord {
    id: string;
    playerNumber: number;
    team: 'HOME' | 'AWAY';
    type: FoulType;
    quarter: number;
}

export type FoulType = string;

export interface RefereeProfile {
    id: string;
    name: string;
}

export interface AssociationFinance {
    balance: number;
}

export interface CrewLogistics {
    id: string;
}

export interface ConfederationStats {
    totalAthletes: number;
    totalTeams: number;
    totalGamesThisYear: number;
    activeAffiliates: number;
    growthRate: number;
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

export interface Course {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    priority?: boolean;
    level?: string;
}

export interface Entitlement {
    id: string;
    userId: string;
    productId: string;
    purchasedAt: Date;
    expiresAt: Date;
}

export interface PlatformMetric {
    totalRevenue: number;
    activeTeams: number;
    pendingServices: number;
    churnRate: number;
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

export interface Drill {
    id: string;
    name: string;
    description: string;
    durationMinutes: number;
    videoSearchTerm?: string;
}

export interface InstallMatrixItem {
    id: string;
    day: string;
    category: string;
    concept: string;
}

export interface Athlete {
    id: string;
    userId: string;
    name: string;
    position: string;
    jerseyNumber: number;
    category: string;
    stats: { ovr: number; speed: number; strength: number; agility: number; tacticalIQ: number };
    attendanceRate: number;
    xp: number;
    level: number;
    status: 'ACTIVE' | 'INACTIVE';
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

export interface League {
    id: string;
    name: string;
    season: string;
    teams: LeagueTeamStanding[];
}

export interface LeagueTeamStanding {
    teamId: string;
    teamName: string;
    logoUrl: string;
    wins: number;
    losses: number;
    draws: number;
    pointsFor: number;
    pointsAgainst: number;
}

export interface TeamSettings {
    id: string;
    teamName: string;
    logoUrl: string;
    address: string;
    primaryColor: string;
    secondaryColor?: string;
    sportType?: 'TACKLE' | 'FLAG' | 'BOTH';
}

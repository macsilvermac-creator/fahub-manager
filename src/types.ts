
export type UserRole = 'MASTER' | 'HEAD_COACH' | 'OFFENSIVE_COORD' | 'DEFENSIVE_COORD' | 'MEDICAL_STAFF' | 'FINANCIAL_MANAGER' | 'MARKETING_MANAGER' | 'COMMERCIAL_MANAGER' | 'PLAYER' | 'REFEREE' | 'SPORTS_DIRECTOR' | 'EQUIPMENT_MANAGER' | 'CANDIDATE' | 'PLATFORM_OWNER' | 'BROADCASTER' | 'SYSTEM' | 'FAN' | 'STUDENT' | 'ADMIN';

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

export interface WellnessEntry {
    date: string;
    sleepQuality: number;
    fatigue: number;
    soreness: number;
    stress: number;
    rpe: number;
}

export interface SavedWorkout {
    id: string;
    date: Date;
    title: string;
    content: string;
    category: string;
}

export interface DevelopmentPlan {
    id: string;
    playerId: number;
    title: string;
    generatedContent: string;
    createdAt: Date;
    deadline?: Date;
    status: 'ACTIVE' | 'COMPLETED';
    coachFeedback?: string;
}

export interface MedicalReport {
    id: string;
    type: 'PHYSICAL' | 'PSYCHOLOGICAL';
    title: string;
    date: Date;
    content: string;
    author: string;
}

export interface GameLog {
    week: number;
    opponent: string;
    result: string;
    stats: any;
    grade: number;
}

export interface PlayerHighlight {
    id: string;
    title: string;
    url: string;
    thumbnailUrl: string;
    date: Date;
    views: number;
}

export interface PlayerAchievement {
    id: string;
    title: string;
    year: number;
    type: string;
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
    savedWorkouts?: SavedWorkout[];
    developmentPlans?: DevelopmentPlan[];
    gameLogs?: GameLog[];
    highlights?: PlayerHighlight[];
    achievements?: PlayerAchievement[];
    wellnessHistory?: WellnessEntry[];
    medicalReports?: MedicalReport[];
    rosterHistory?: any[];
    hcNotes?: string;
    commitmentLevel?: number;
    medicalExamExpiry?: Date;
    cpf?: string;
    teamId?: string;
    depthChartOrder: number;
    verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
    badges?: string[];
    nationality?: string;
    birthDate?: Date;
}

export type PracticeCategory = 'PHYSICAL' | 'TACTICAL' | 'MENTAL';

export interface PracticeScriptItem {
    id: string;
    startTime: string;
    durationMinutes: number;
    type: string;
    activityName: string;
    description: string;
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
    performances?: any[];
    deadlineDate?: Date;
    locationType?: string;
    instructor?: string;
    notes?: string;
    drills?: Drill[];
}

export interface Drill {
    id: string;
    name: string;
    description: string;
    durationMinutes: number;
    demoVideoUrl?: string;
    videoSearchTerm?: string;
}

export interface GameScoutingReport {
    offenseAnalysis: string;
    defenseAnalysis: string;
    keyPlayersToWatch: string;
    lastUpdate: Date;
    summary?: string;
    keysToVictory?: string[];
    suggestedConcepts?: string[];
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

export interface GameInfrastructureChecklist {
    ambulancePresent: boolean;
    ambulanceArrivalTime?: string;
    visitorArrivalTime?: string;
    lightingAdequate: boolean;
    fieldDimensionsOk: boolean;
    goalPostsOk: boolean;
    fieldMarkingsCorrect: boolean;
    visitorLockerRoom: { hasHotWater: boolean, secure: boolean };
    refereeLockerRoom: { hasHotWater: boolean, secure: boolean };
    ballsProvided: boolean;
    waterProvided: boolean;
}

export type FoulType = 'HOLDING' | 'FALSE_START' | 'OFFSIDES' | 'PASS_INTERFERENCE' | 'UNSPORTSMANLIKE' | 'PERSONAL_FOUL' | 'DELAY_OF_GAME' | 'BLOCK_IN_BACK';

export interface FoulRecord {
    type: string;
    label?: string;
    yards?: number;
    playerNumber?: number;
    team?: 'HOME' | 'AWAY';
    quarter?: number;
}

export interface OfficialAssignment {
    id: string;
    name: string;
    role: string;
}

export interface GameReport {
    infrastructure: GameInfrastructureChecklist;
    fouls: FoulRecord[];
    ejections: any[];
    notes: string;
    crew: OfficialAssignment[];
    isFinalized: boolean;
}

export interface Game {
    id: number;
    opponent: string;
    opponentLogoUrl: string;
    date: Date;
    location: 'Home' | 'Away';
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'HALFTIME' | 'FINAL';
    result?: 'W' | 'L' | 'T';
    score?: string;
    clock?: string;
    currentQuarter?: number;
    program?: ProgramType;
    scoutingReport?: GameScoutingReport;
    playerGrades?: PlayerPerformance[];
    callSheet?: CallSheetSection[];
    homeTeamName?: string;
    halftimeStats?: any;
    rotation?: PlayerRotation[];
    officialReport?: GameReport;
    sponsors?: any[];
}

export interface PlayerRotation {
    playerId: number;
    status: 'ON_FIELD' | 'BENCH';
    minutesPlayed: number;
    fatigueLevel: number;
}

export interface CourseLesson {
    id: string;
    title: string;
    content: string;
    videoSearchTerm?: string;
    completed: boolean;
}

export interface CourseModule {
    id: string;
    title: string;
    lessons: CourseLesson[];
}

export interface Course {
    id: string;
    title: string;
    description: string;
    level?: 'FAN' | 'PLAYER' | 'COACH';
    author?: string;
    createdAt?: Date;
    modules: CourseModule[];
    thumbnailUrl: string;
    priority: boolean;
    isPurchased?: boolean;
    price?: number;
}

export interface TeamSettings {
    id: string;
    teamName: string;
    logoUrl: string;
    address: string;
    primaryColor: string;
    secondaryColor?: string;
    level?: number;
    xp?: number;
    reputation?: number;
    badges?: string[];
    sportType?: 'TACKLE' | 'FLAG' | 'BOTH';
    website?: string;
    contactEmail?: string;
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
    email: string;
    phone: string;
    position: string;
    age: number;
    height: string;
    weight: number;
    experience: string;
    status: 'NEW' | 'TRYOUT' | 'SELECTED' | 'ONBOARDING';
    createdAt: Date;
    notes?: string;
    avatarUrl?: string;
    rating?: number;
    aiAnalysis?: string;
    combineStats?: CombineStats;
}

export interface SocialPost {
    id: string;
    platform: 'INSTAGRAM' | 'TIKTOK' | 'WEBSITE';
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
    authorRole?: UserRole;
    readBy?: string[];
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

export interface CoachGameNote {
    id: string;
    gameId: number;
    quarter: number;
    content: string;
    timestamp: Date;
    category: 'OFFENSE' | 'DEFENSE' | 'SPECIAL' | 'GENERAL';
    tags?: string[];
}

export interface Championship {
    id: string;
    name: string;
    year: number;
    division: string;
}

export interface Transaction {
    id: string;
    title: string;
    description?: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    category: TransactionCategory;
    date: Date;
    status: 'PAID' | 'PENDING';
    attachments?: any[];
    aiGenerated?: boolean;
    verifiedBy?: string;
}

export type TransactionCategory = 'TRANSPORT' | 'EQUIPMENT' | 'REFEREE' | 'FIELD_RENTAL' | 'EVENT' | 'SPONSORSHIP' | 'TUITION' | 'STORE' | 'OTHER';

export interface Invoice {
    id: string;
    playerId?: number;
    playerName: string;
    title: string;
    amount: number;
    dueDate: Date;
    status: 'PENDING' | 'PAID' | 'OVERDUE';
    category?: TransactionCategory;
    inventoryItemId?: string;
}

export interface Subscription {
    id: string;
    title: string;
    amount: number;
    frequency: 'MONTHLY' | 'YEARLY';
    active: boolean;
    nextBillingDate: Date;
    assignedTo: number[];
}

export interface Budget {
    category: TransactionCategory;
    limit: number;
    spent: number;
}

export interface Bill {
    id: string;
    title: string;
    amount: number;
    dueDate: Date;
    status: 'PENDING' | 'PAID' | 'OVERDUE';
    category: TransactionCategory;
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
    acquisitionDate?: Date;
    expiryDate?: Date;
    assignedToPlayerId?: number;
    cost?: number;
    size?: string;
    qrCodeUrl?: string;
}

export interface Objective {
    id: string;
    title: string;
    category: 'SPORTING' | 'FINANCIAL' | 'MARKETING';
    status: 'ON_TRACK' | 'BEHIND' | 'COMPLETED' | 'AT_RISK';
    progress: number;
    deadline: Date;
    owner: string;
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

export interface ConfederationStats {
    totalAthletes: number;
    totalTeams: number;
    totalGamesThisYear: number;
    activeAffiliates: number;
    growthRate: number;
}

export interface NationalTeamCandidate extends Player {
    teamName: string;
    teamLogo: string;
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
    playerId: number;
    playerName: string;
    originTeamId: string;
    originTeamName: string;
    destinationTeamId: string;
    destinationTeamName: string;
    fee: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
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

export interface EventSale {
    id: string;
    type: 'TICKET' | 'BAR';
    itemName: string;
    quantity: number;
    totalAmount: number;
    timestamp: Date;
}

export interface VideoClip {
    id: string;
    gameId: string;
    title: string;
    videoUrl: string;
    startTime: number;
    endTime: number;
    tags: any;
}

export interface TacticalFrame {
    id: number;
    elements: PlayElement[];
}

export interface PlayElement {
    id: string;
    type: 'OFFENSE' | 'DEFENSE';
    label: string;
    x: number;
    y: number;
}

export interface TacticalPlay {
    id: string;
    name: string;
    concept: string;
    elements: PlayElement[];
    frames?: TacticalFrame[];
    routes?: any[];
    aiAnalysis?: string;
    createdAt: Date;
    program?: ProgramType;
}

export interface InstallMatrixItem {
    id: string;
    day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';
    category: 'RUN' | 'PASS' | 'DEFENSE' | 'SITUATION';
    concept: string;
}

export interface DigitalProduct {
    id: string;
    title: string;
    description: string;
    price: number;
    type: 'COURSE' | 'DOCUMENT' | 'GAME_VIDEO' | 'SCOUT_REPORT';
    durationHours: number;
    coverUrl: string;
}

export interface Entitlement {
    id: string;
    userId: string;
    productId: string;
    purchasedAt: Date;
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

export interface LeagueTeam {
    teamId: string;
    teamName: string;
    logoUrl: string;
    wins: number;
    losses: number;
    draws: number;
    pointsFor: number;
    pointsAgainst: number;
}

export interface League {
    id: string;
    name: string;
    season: string;
    teams: LeagueTeam[];
}

export interface MarketplaceItem {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    sellerType: 'PLAYER' | 'TEAM_STORE';
    sellerName: string;
    imageUrl: string;
    isSold: boolean;
    qrCodeDelivery?: string;
}

export interface SocialFeedPost {
    id: string;
    authorName: string;
    authorAvatar: string;
    authorRole: string;
    isOfficialTeamPost: boolean;
    isPinned?: boolean;
    content: string;
    mediaType?: 'IMAGE' | 'VIDEO';
    mediaUrl?: string;
    likes: number;
    comments: any[];
    timestamp: Date;
}

export interface StaffContract {
    active: boolean;
    type: 'VOLUNTEER' | 'PAID';
    value: number;
    signed: boolean;
}

export interface StaffMember {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    documentsPending: boolean;
    contract: StaffContract;
    program?: ProgramType;
}

export interface CoachCareer {
    careerRecord: { wins: number, losses: number, ties: number };
    philosophy: string;
    achievements: PlayerAchievement[];
    specialties: string[];
}

export interface SponsorDeal {
    id: string;
    companyName: string;
    contactPerson: string;
    status: 'PROSPECT' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';
    value: number;
    lastInteraction: Date;
}

export interface CrewLogistics {
    gameId: number;
    meetingPoint: string;
    meetingTime: string;
    carPools: { driver: string, passengers: string[], vehicle: string }[];
    uniformColor: string;
}

export interface RefereeProfile {
    id: string;
    name: string;
    level: string;
    city: string;
    availability: 'AVAILABLE' | 'UNAVAILABLE';
    totalGames: number;
    balance: number;
    certifications: { id: string, name: string, expiryDate: Date }[];
}

export interface AssociationFinance {
    totalReceivableFromLeagues: number;
    totalPayableToReferees: number;
    cashBalance: number;
}

export interface LegalDocument {
    id: string;
    title: string;
    content: string;
    version: string;
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

export interface AffiliateEarnings {
    id: string;
    amount: number;
    date: Date;
    status: 'PAID' | 'PENDING';
}

export interface TeamDocument {
    id: string;
    title: string;
    type: string;
    category: string;
    uploadDate: Date;
    size: string;
    url: string;
}

export interface ChatMessage {
    id: string;
    senderName: string;
    senderRole: UserRole;
    content: string;
    timestamp: Date;
    channel: 'GENERAL' | 'OFFENSE' | 'DEFENSE';
}

export interface FinancialAttachment {
    id: string;
    name: string;
    url: string;
    type: string;
}

export interface VideoTag {
    down: 1 | 2 | 3 | 4;
    distance: number;
    yardLine: number;
    hash: 'LEFT' | 'MIDDLE' | 'RIGHT';
    offensiveFormation: string;
    defensiveFormation: string;
    offensivePlayCall: string;
    defensivePlayCall: string;
    personnel: string;
    result: 'GAIN' | 'LOSS' | 'TOUCHDOWN' | 'TURNOVER';
    gain: number;
    involvedPlayerIds: number[];
    startX: number;
    startY: number;
}

export interface VideoPlaylist {
    id: string;
    title: string;
    clipIds: string[];
}

export interface VideoPermissionGroup {
    id: string;
    name: string;
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

export interface CrewExpense {
    id: string;
    title: string;
    amount: number;
}

export interface PerformanceStats {
    ovr: number;
    speed: number;
    strength: number;
    agility: number;
    tacticalIQ: number;
}

export interface Athlete {
    id: string;
    userId: string;
    name: string;
    position: string;
    jerseyNumber: number;
    category: ProgramType;
    stats: PerformanceStats;
    attendanceRate: number;
    xp: number;
    level: number;
    status: 'ACTIVE' | 'INJURED' | 'INACTIVE';
}

export interface Coach {
    id: string;
    userId: string;
    name: string;
    specialty: string;
    experienceLevel: 'JUNIOR' | 'PRO' | 'ELITE';
    activeTeams: string[];
}

export interface Team {
    id: string;
    name: string;
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
    rosterIds: string[];
    coachIds: string[];
    settings: {
        isPublic: boolean;
        allowRegistration: boolean;
    };
}
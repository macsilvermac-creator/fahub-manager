
export type UserRole = 'MASTER' | 'HEAD_COACH' | 'OFFENSIVE_COORD' | 'DEFENSIVE_COORD' | 'MEDICAL_STAFF' | 'FINANCIAL_MANAGER' | 'MARKETING_MANAGER' | 'COMMERCIAL_MANAGER' | 'PLAYER' | 'REFEREE' | 'SPORTS_DIRECTOR' | 'EQUIPMENT_MANAGER' | 'CANDIDATE' | 'PLATFORM_OWNER' | 'BROADCASTER' | 'SYSTEM' | 'FAN' | 'STUDENT' | 'ADMIN';

export type RosterCategory = 'ACTIVE' | 'PRACTICE_SQUAD' | 'IR' | 'SUSPENDED';
export type ProgramType = 'TACKLE' | 'FLAG' | 'BOTH' | 'YOUTH';

// Fix: Added missing CombineStats interface
export interface CombineStats {
    date: Date;
    fortyYards?: number;
    benchPress?: number;
    verticalJump?: number;
    broadJump?: number;
    shuttle?: number;
    lDrill?: number;
}

// Fix: Added missing WellnessEntry interface
export interface WellnessEntry {
    date: string;
    sleepQuality: number;
    fatigue: number;
    soreness: number;
    stress: number;
    rpe: number;
}

// Fix: Added missing SavedWorkout interface
export interface SavedWorkout {
    id: string;
    date: Date;
    title: string;
    content: string;
    category: string;
}

// Fix: Added missing DevelopmentPlan interface
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

// Fix: Added missing MedicalReport interface
export interface MedicalReport {
    id: string;
    type: 'PHYSICAL' | 'PSYCHOLOGICAL';
    title: string;
    date: Date;
    content: string;
    author: string;
}

// Fix: Added missing GameLog interface
export interface GameLog {
    week: number;
    opponent: string;
    result: string;
    stats: any;
    grade: number;
}

// Fix: Added missing PlayerHighlight interface
export interface PlayerHighlight {
    id: string;
    title: string;
    url: string;
    thumbnailUrl: string;
    date: Date;
    views: number;
}

// Fix: Added missing PlayerAchievement interface
export interface PlayerAchievement {
    id: string;
    title: string;
    year: number;
    type: string;
}

// Fix: Restored detailed Player interface
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

// Fix: Added missing PracticeCategory type
export type PracticeCategory = 'PHYSICAL' | 'TACTICAL' | 'MENTAL';

// Fix: Added missing PracticeScriptItem interface
export interface PracticeScriptItem {
    id: string;
    startTime: string;
    durationMinutes: number;
    type: string;
    activityName: string;
    description: string;
}

// Fix: Restored detailed PracticeSession interface with drills
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

// Fix: Restored detailed Drill interface
export interface Drill {
    id: string;
    name: string;
    description: string;
    durationMinutes: number;
    demoVideoUrl?: string;
    videoSearchTerm?: string;
}

// Fix: Added missing GameScoutingReport interface
export interface GameScoutingReport {
    offenseAnalysis: string;
    defenseAnalysis: string;
    keyPlayersToWatch: string;
    lastUpdate: Date;
    summary?: string;
    keysToVictory?: string[];
    suggestedConcepts?: string[];
}

// Fix: Added missing PlayerPerformance interface
export interface PlayerPerformance {
    playerId: number;
    grade: number;
    notes: string;
}

// Fix: Added missing CallSheetSection interface
export interface CallSheetSection {
    title: string;
    plays: string[];
}

// Fix: Added missing GameInfrastructureChecklist interface
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

// Fix: Added missing FoulType type
export type FoulType = 'HOLDING' | 'FALSE_START' | 'OFFSIDES' | 'PASS_INTERFERENCE' | 'UNSPORTSMANLIKE' | 'PERSONAL_FOUL' | 'DELAY_OF_GAME' | 'BLOCK_IN_BACK';

// Fix: Added missing FoulRecord interface
export interface FoulRecord {
    type: string;
    label?: string;
    yards?: number;
    playerNumber?: number;
    team?: 'HOME' | 'AWAY';
    quarter?: number;
}

// Fix: Added missing OfficialAssignment interface
export interface OfficialAssignment {
    id: string;
    name: string;
    role: string;
}

// Fix: Added missing GameReport interface
export interface GameReport {
    infrastructure: GameInfrastructureChecklist;
    fouls: FoulRecord[];
    ejections: any[];
    notes: string;
    crew: OfficialAssignment[];
    isFinalized: boolean;
}

// Fix: Added missing PlayerRotation interface
export interface PlayerRotation {
    playerId: number;
    status: 'ON_FIELD' | 'BENCH';
    minutesPlayed: number;
    fatigueLevel: number;
}

// Fix: Added missing SidelineAudioNote interface
export interface SidelineAudioNote {
    id: string;
    timestamp: Date;
    gameTime?: string; // Ex: "Q2 05:30"
    unit: 'ATAQUE' | 'DEFESA' | 'ST' | 'GERAL';
    rawTranscript?: string;
    analysis?: {
        playerNumber?: number;
        action?: string;
        insight?: string;
    };
    audioBlobUrl?: string;
}

// Fix: Added missing GameTimelineEvent interface
export interface GameTimelineEvent {
    id: string;
    timestamp: Date;
    quarter: number;
    clock: string;
    down?: number;
    distance?: number;
    yardLine?: string;
    type: 'RUN' | 'PASS' | 'FOUL' | 'PUNT' | 'FG' | 'KICKOFF' | 'TIMEOUT';
    result?: string;
}

// Fix: Restored detailed Game interface
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
    timeline?: GameTimelineEvent[];
    audioNotes?: SidelineAudioNote[];
}

// Fix: Added missing CourseLesson interface
export interface CourseLesson {
    id: string;
    title: string;
    content: string;
    videoSearchTerm?: string;
    completed: boolean;
}

// Fix: Added missing CourseModule interface
export interface CourseModule {
    id: string;
    title: string;
    lessons: CourseLesson[];
}

// Fix: Added missing Course interface
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

// Fix: Restored detailed TeamSettings interface
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

// Fix: Restored detailed User interface
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

// Fix: Added missing RecruitmentCandidate interface
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

// Fix: Added missing SocialPost interface
export interface SocialPost {
    id: string;
    platform: 'INSTAGRAM' | 'TIKTOK' | 'WEBSITE';
    topic: string;
    content: string;
    status: 'SCHEDULED' | 'POSTED';
    scheduledDate: Date;
}

// Fix: Added missing Announcement interface
export interface Announcement {
    id: string;
    title: string;
    content: string;
    priority: 'NORMAL' | 'HIGH' | 'URGENT';
    date: Date;
    authorRole?: UserRole;
    readBy?: string[];
}

// Fix: Added missing KanbanTask interface
export interface KanbanTask {
    id: string;
    title: string;
    description?: string;
    status: 'TODO' | 'DOING' | 'DONE';
    assignedToDepartment: 'MARKETING' | 'COMMERCIAL' | 'TECHNICAL' | 'FINANCE' | 'GENERAL';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate: Date;
}

// Fix: Added missing CoachGameNote interface
export interface CoachGameNote {
    id: string;
    gameId: number;
    quarter: number;
    content: string;
    timestamp: Date;
    category: 'OFFENSE' | 'DEFENSE' | 'SPECIAL' | 'GENERAL';
    tags?: string[];
}

// Fix: Added missing Championship interface
export interface Championship {
    id: string;
    name: string;
    year: number;
    division: string;
}

// Fix: Added missing TransactionCategory type
export type TransactionCategory = 'TRANSPORT' | 'EQUIPMENT' | 'REFEREE' | 'FIELD_RENTAL' | 'EVENT' | 'SPONSORSHIP' | 'TUITION' | 'STORE' | 'OTHER';

// Fix: Added missing Transaction interface
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

// Fix: Added missing Invoice interface
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

// Fix: Restored detailed Subscription interface
export interface Subscription {
    id: string;
    title: string;
    amount: number;
    frequency: 'MONTHLY' | 'YEARLY';
    active: boolean;
    nextBillingDate: Date;
    assignedTo: number[];
}

// Fix: Restored detailed Budget interface
export interface Budget {
    category: TransactionCategory;
    limit: number;
    spent: number;
}

// Fix: Restored detailed Bill interface
export interface Bill {
    id: string;
    title: string;
    amount: number;
    dueDate: Date;
    status: 'PENDING' | 'PAID' | 'OVERDUE';
    category: TransactionCategory;
}

// Fix: Restored detailed EquipmentItem interface
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

// Fix: Restored detailed Objective interface
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

// Fix: Added missing KeyResult interface
export interface KeyResult {
    id: string;
    title: string;
    currentValue: number;
    targetValue: number;
    unit: string;
    lastUpdated: Date;
}

// Fix: Added missing ConfederationStats interface
export interface ConfederationStats {
    totalAthletes: number;
    totalTeams: number;
    totalGamesThisYear: number;
    activeAffiliates: number;
    growthRate: number;
}

// Fix: Added missing NationalTeamCandidate interface
export interface NationalTeamCandidate extends Player {
    teamName: string;
    teamLogo: string;
}

// Fix: Added missing Affiliate interface
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

// Fix: Added missing TransferRequest interface
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

// Fix: Added missing AuditLog interface
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

// Fix: Added missing EventSale interface
export interface EventSale {
    id: string;
    type: 'TICKET' | 'BAR';
    itemName: string;
    quantity: number;
    totalAmount: number;
    timestamp: Date;
}

// Fix: Restored detailed VideoClip interface
export interface VideoClip {
    id: string;
    gameId: string;
    title: string;
    videoUrl: string;
    startTime: number;
    endTime: number;
    tags: any;
}

// Fix: Added missing TacticalFrame interface
export interface TacticalFrame {
    id: number;
    elements: PlayElement[];
}

// Fix: Added missing PlayElement interface
export interface PlayElement {
    id: string;
    type: 'OFFENSE' | 'DEFENSE';
    label: string;
    x: number;
    y: number;
}

// Fix: Restored detailed TacticalPlay interface
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

// Fix: Added missing InstallMatrixItem interface
export interface InstallMatrixItem {
    id: string;
    day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';
    category: 'RUN' | 'PASS' | 'DEFENSE' | 'SITUATION';
    concept: string;
}

// Fix: Added missing DigitalProduct interface
export interface DigitalProduct {
    id: string;
    title: string;
    description: string;
    price: number;
    type: 'COURSE' | 'DOCUMENT' | 'GAME_VIDEO' | 'SCOUT_REPORT';
    durationHours: number;
    coverUrl: string;
}

// Fix: Added missing Entitlement interface
export interface Entitlement {
    id: string;
    userId: string;
    productId: string;
    purchasedAt: Date;
    expiresAt: Date;
}

// Fix: Added missing Tenant interface
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

// Fix: Added missing ServiceTicket interface
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

// Fix: Added missing PlatformMetric interface
export interface PlatformMetric {
    totalRevenue: number;
    activeTeams: number;
    pendingServices: number;
    churnRate: number;
}

// Fix: Added missing LeagueTeam interface
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

// Fix: Added missing League interface
export interface League {
    id: string;
    name: string;
    season: string;
    teams: LeagueTeam[];
}

// Fix: Restored detailed MarketplaceItem interface
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

// Fix: Added missing SocialFeedPost interface
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

// Fix: Added missing StaffContract interface
export interface StaffContract {
    active: boolean;
    type: 'VOLUNTEER' | 'PAID';
    value: number;
    signed: boolean;
}

// Fix: Added missing StaffMember interface
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

// Fix: Added missing CoachCareer interface
export interface CoachCareer {
    careerRecord: { wins: number, losses: number, ties: number };
    philosophy: string;
    achievements: PlayerAchievement[];
    specialties: string[];
}

// Fix: Added missing SponsorDeal interface
export interface SponsorDeal {
    id: string;
    companyName: string;
    contactPerson: string;
    status: 'PROSPECT' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';
    value: number;
    lastInteraction: Date;
}

// Fix: Added missing CrewLogistics interface
export interface CrewLogistics {
    gameId: number;
    meetingPoint: string;
    meetingTime: string;
    carPools: { driver: string, passengers: string[], vehicle: string }[];
    uniformColor: string;
}

// Fix: Added missing RefereeProfile interface
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

// Fix: Added missing AssociationFinance interface
export interface AssociationFinance {
    totalReceivableFromLeagues: number;
    totalPayableToReferees: number;
    cashBalance: number;
}

// Fix: Added missing LegalDocument interface
export interface LegalDocument {
    id: string;
    title: string;
    content: string;
    version: string;
}

// Fix: Added missing YouthClass interface
export interface YouthClass {
    id: string;
    name: string;
    ageGroup: string;
    schedule: string;
    coachId: string;
    students: string[];
    maxCapacity: number;
}

// Fix: Added missing YouthStudent interface
export interface YouthStudent {
    id: string;
    name: string;
    age: number;
    isSocialProject: boolean;
}

// Fix: Added missing AffiliateEarnings interface
export interface AffiliateEarnings {
    id: string;
    amount: number;
    date: Date;
    status: 'PAID' | 'PENDING';
}

// Fix: Added missing TeamDocument interface
export interface TeamDocument {
    id: string;
    title: string;
    type: string;
    category: string;
    uploadDate: Date;
    size: string;
    url: string;
}

// Fix: Added missing ChatMessage interface
export interface ChatMessage {
    id: string;
    senderName: string;
    senderRole: UserRole;
    content: string;
    timestamp: Date;
    channel: 'GENERAL' | 'OFFENSE' | 'DEFENSE';
}

// Fix: Added missing FinancialAttachment interface
export interface FinancialAttachment {
    id: string;
    name: string;
    url: string;
    type: string;
}

// Fix: Added missing VideoTag interface
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

// Fix: Added missing VideoPlaylist interface
export interface VideoPlaylist {
    id: string;
    title: string;
    clipIds: string[];
}

// Fix: Added missing VideoPermissionGroup interface
export interface VideoPermissionGroup {
    id: string;
    name: string;
}

// Fix: Added missing PaymentMethod type
export type PaymentMethod = 'PIX' | 'CREDIT_CARD';

// Fix: Added missing PaymentTransaction interface
export interface PaymentTransaction {
    id: string;
    amount: number;
    method: PaymentMethod;
    status: 'APPROVED' | 'PENDING' | 'REJECTED';
    createdAt: Date;
    platformFee: number;
    netAmount: number;
}

// Fix: Added missing CrewExpense interface
export interface CrewExpense {
    id: string;
    title: string;
    amount: number;
}

// Fix: Added missing PerformanceStats interface
export interface PerformanceStats {
    ovr: number;
    speed: number;
    strength: number;
    agility: number;
    tacticalIQ: number;
}

// Fix: Added missing Athlete interface
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

// Fix: Added missing Coach interface
export interface Coach {
    id: string;
    userId: string;
    name: string;
    specialty: string;
    experienceLevel: 'JUNIOR' | 'PRO' | 'ELITE';
    activeTeams: string[];
}

// Fix: Added missing Team interface
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

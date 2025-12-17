
export type UserRole = 'PLATFORM_OWNER' | 'MASTER' | 'HEAD_COACH' | 'OFFENSIVE_COORD' | 'DEFENSIVE_COORD' | 'MEDICAL_STAFF' | 'FINANCIAL_MANAGER' | 'MARKETING_MANAGER' | 'COMMERCIAL_MANAGER' | 'PLAYER' | 'REFEREE' | 'SPORTS_DIRECTOR' | 'EQUIPMENT_MANAGER' | 'CANDIDATE' | 'BROADCASTER';

export type RosterCategory = 'ACTIVE' | 'PRACTICE_SQUAD' | 'IR' | 'SUSPENDED';
export type ProgramType = 'TACKLE' | 'FLAG' | 'BOTH';

export interface CombineStats {
    fortyYards?: number;
    benchPress?: number;
    verticalJump?: number;
    broadJump?: number;
    shuttle?: number;
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

export interface WorkoutProof {
    id: string;
    imageUrl: string;
    aiValidation: 'PENDING' | 'VALID' | 'INVALID';
    coachValidation: 'PENDING' | 'APPROVED' | 'REJECTED';
    timestamp: Date;
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
    badges?: string[];
    rating: number;
    status: 'ACTIVE' | 'INJURED' | 'SUSPENDED' | 'IR' | 'QUESTIONABLE' | 'DOUBTFUL';
    rosterCategory: RosterCategory;
    depthChartOrder: number;
    combineStats?: CombineStats;
    bioVerified?: boolean;
    workoutProofs?: WorkoutProof[];
    wellnessHistory?: WellnessEntry[];
    savedWorkouts?: SavedWorkout[];
    developmentPlans?: DevelopmentPlan[];
    medicalReports?: MedicalReport[];
    program?: ProgramType;
    teamId?: string;
    cpf?: string;
    birthDate?: Date;
    verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
    nationality?: string;
    rosterHistory?: any[];
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

export interface GameReport {
    infrastructure: GameInfrastructureChecklist;
    fouls: FoulRecord[];
    ejections: any[];
    notes: string;
    crew: any[];
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
    usedPlays?: string[]; 
    homeTeamName?: string;
    sponsors?: any[];
    officialReport?: GameReport;
    halftimeStats?: any;
}

export interface TeamSettings {
    id: string;
    teamName: string;
    logoUrl: string;
    address: string;
    primaryColor: string;
    secondaryColor: string;
    level: number;
    xp: number;
    reputation: number;
    badges: string[];
    sportType: 'FULLPADS' | 'FLAG';
    legalAgreementsSigned?: any[];
    website?: string;
    contactEmail?: string;
}

export interface SocialFeedPost {
    id: string;
    authorName: string;
    authorAvatar: string;
    authorRole: string;
    isOfficialTeamPost: boolean;
    content: string;
    mediaType?: 'IMAGE' | 'VIDEO';
    mediaUrl?: string;
    likes: number;
    comments: any[];
    timestamp: Date;
    isPinned?: boolean;
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

export interface Transaction {
    id: string;
    title: string;
    description?: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    category: string;
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

export interface DigitalProduct {
    id: string;
    title: string;
    description: string;
    price: number;
    type: string;
    durationHours: number;
    coverUrl: string;
}

export interface Entitlement {
    id: string;
    userId: string;
    productId: string;
    purchaseDate: Date;
    expiresAt: Date;
    status: 'ACTIVE' | 'EXPIRED';
}

export interface PracticeScriptItem {
    id: string;
    startTime: string;
    durationMinutes: number;
    type: string;
    activityName: string;
    description: string;
}

export interface PracticeSession {
    id: string;
    title: string;
    focus: string;
    date: Date;
    category: any;
    script: PracticeScriptItem[];
    attendees: string[];
    checkedInAttendees?: string[];
    deadlineDate?: Date;
    locationType?: string;
    instructor?: string;
    notes?: string;
    drills?: Drill[];
    performances?: any[];
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatarUrl: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    program?: ProgramType;
    isProfileComplete?: boolean;
    cpf?: string;
}

export interface StaffMember {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    documentsPending: boolean;
    contract: {
        active: boolean;
        type: 'VOLUNTEER' | 'PAID';
        value: number;
        signed: boolean;
    };
    program?: ProgramType;
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
    senderRole: UserRole;
    content: string;
    timestamp: Date;
    channel?: 'GENERAL' | 'OFFENSE' | 'DEFENSE';
}

export interface TeamDocument {
    id: string;
    title: string;
    type: 'PDF' | 'DOC' | 'FILE';
    category: 'PLAYBOOK' | 'MEDICAL' | 'ADMIN' | 'SCOUT' | 'CONTRACTS';
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
    frames?: TacticalFrame[];
    routes?: any[];
    aiAnalysis?: string;
    createdAt: Date;
    program?: string;
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

export type CourseLevel = 'FAN' | 'PLAYER' | 'COACH';

export interface Course {
    id: string;
    title: string;
    description: string;
    level: CourseLevel;
    author: string;
    createdAt: Date;
    modules: CourseModule[];
    thumbnailUrl: string;
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

export interface YouthStudent {
    id: string;
    name?: string;
    isSocialProject: boolean;
}

export interface YouthClass {
    id: string;
    name: string;
    ageGroup: string;
    schedule: string;
    coachId: string;
    students: YouthStudent[];
    maxCapacity: number;
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
    notes: string;
    avatarUrl?: string;
    rating?: number;
    aiAnalysis?: string;
    combineStats?: CombineStats;
}

export interface KeyResult {
    id: string;
    title: string;
    currentValue: number;
    targetValue: number;
    unit: string;
    lastUpdated: Date;
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
    category: string;
    limit: number;
    spent: number;
}

export interface Bill {
    id: string;
    title: string;
    amount: number;
    dueDate: Date;
    status: 'PENDING' | 'PAID' | 'OVERDUE';
}

export interface KanbanTask {
    id: string;
    title: string;
    description?: string;
    status: 'TODO' | 'DOING' | 'DONE';
    assignedToDepartment: 'MARKETING' | 'COMMERCIAL' | 'TECHNICAL' | 'FINANCE' | 'GENERAL';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate?: Date;
}

export interface RefereeCertification {
    id: string;
    name: string;
    issueDate: Date;
    expiryDate: Date;
    status: 'ACTIVE' | 'EXPIRED';
}

export interface RefereeProfile {
    id: string;
    name: string;
    level: string;
    city: string;
    availability: 'AVAILABLE' | 'UNAVAILABLE';
    totalGames: number;
    balance: number;
    certifications: RefereeCertification[];
}

export interface LegalDocument {
    id: string;
    title: string;
    version: string;
    requiredRole: UserRole[];
    createdAt: Date;
    content: string;
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

export interface SponsorDeal {
    id: string;
    companyName: string;
    contactPerson: string;
    status: 'PROSPECT' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';
    value: number;
    lastInteraction: Date;
}

export interface SocialPost {
    id: string;
    platform: 'INSTAGRAM' | 'TIKTOK' | 'WEBSITE';
    topic: string;
    content: string;
    status: 'SCHEDULED' | 'POSTED';
    scheduledDate: Date;
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

export interface EventSale {
    id: string;
    type: 'TICKET' | 'BAR';
    itemName: string;
    quantity: number;
    totalAmount: number;
    timestamp: Date;
}

export interface VideoTag {
    down: number;
    distance: number;
    yardLine: number;
    hash: 'LEFT' | 'MIDDLE' | 'RIGHT';
    offensiveFormation: string;
    defensiveFormation: string;
    offensivePlayCall: string;
    defensivePlayCall: string;
    personnel: string;
    result: 'GAIN' | 'LOSS' | 'FIRST_DOWN' | 'TOUCHDOWN' | 'TURNOVER' | 'INCOMPLETE';
    gain: number;
    involvedPlayerIds: number[];
    startX?: number;
    startY?: number;
}

export interface VideoClip {
    id: string;
    gameId: string;
    title: string;
    videoUrl: string;
    startTime: number;
    endTime: number;
    tags: VideoTag;
}

export interface VideoPlaylist {
    id: string;
    title: string;
    description: string;
    clips: VideoClip[];
    assignedToGroups: string[];
    createdBy: string;
}

export interface CoachStats {
    wins: number;
    losses: number;
    ties: number;
}

export interface CoachCareer {
    careerRecord: CoachStats;
    philosophy: string;
    achievements: PlayerAchievement[];
    specialties: string[];
}

export interface PlayerAchievement {
    id: string;
    title: string;
    year: number;
    type: string;
}

export interface CrewLogistics {
    gameId: number;
    meetingPoint: string;
    meetingTime: string;
    carPools: { driver: string; passengers: string[]; vehicle: string }[];
    uniformColor: string;
}

export interface AssociationFinance {
    totalReceivableFromLeagues: number;
    totalPayableToReferees: number;
    cashBalance: number;
}

export interface Tenant {
    id: string;
    name: string;
    plan: string;
    status: string;
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

export interface Drill {
    id: string;
    name: string;
    description: string;
    durationMinutes: number;
    videoSearchTerm?: string;
}

export interface GymExercise {
    name: string;
    sets: string;
    reps: string;
    notes?: string;
}

export interface GymDay {
    title: string;
    focus: string;
    exercises: GymExercise[];
}

export interface Championship {
    id: string;
    name: string;
    year: number;
    division: string;
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

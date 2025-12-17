
export type UserRole = 'PLATFORM_OWNER' | 'MASTER' | 'HEAD_COACH' | 'OFFENSIVE_COORD' | 'DEFENSIVE_COORD' | 'MEDICAL_STAFF' | 'FINANCIAL_MANAGER' | 'MARKETING_MANAGER' | 'COMMERCIAL_MANAGER' | 'PLAYER' | 'REFEREE' | 'SPORTS_DIRECTOR' | 'EQUIPMENT_MANAGER' | 'CANDIDATE' | 'BROADCASTER' | 'SYSTEM';

export type RosterCategory = 'ACTIVE' | 'PRACTICE_SQUAD' | 'IR' | 'SUSPENDED';
export type ProgramType = 'TACKLE' | 'FLAG' | 'BOTH';
export type PracticeCategory = 'PHYSICAL' | 'TACTICAL' | 'MENTAL';
export type TransactionCategory = 'TRANSPORT' | 'EQUIPMENT' | 'REFEREE' | 'FIELD_RENTAL' | 'EVENT' | 'SPONSORSHIP' | 'TUITION' | 'STORE' | 'OTHER';
export type FoulType = 'HOLDING' | 'FALSE_START' | 'OFFSIDES' | 'PASS_INTERFERENCE' | 'UNSPORTSMANLIKE' | 'PERSONAL_FOUL' | 'DELAY_OF_GAME' | 'BLOCK_IN_BACK';

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

export interface FlagStats {
    flagPulls: number;
    targets: number;
    drops: number;
    interceptions?: number;
    deflections?: number;
    catchRadius?: number; // 0-100
    targetShare?: number; // %
    reactionTime?: number; // ms
}

export interface EquipmentLiability {
    itemId: string;
    itemName: string;
    category: string;
    acceptedAt?: Date;
    conditionOnDelivery: string;
    expiryDate: Date; // NOCSAE/Certificação
}

export interface SkillMatrix {
    reactionTime: number; // 0-100
    lateralAgility: number; // 0-100
    catchRadius: number; // 0-100
    strength: number; // 0-100
    footballIQ: number; // 0-100
}

export interface WorkoutProof {
    id: string;
    imageUrl: string;
    aiValidation: 'VALID' | 'INVALID';
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
    flagStats?: FlagStats;
    skillMatrix?: SkillMatrix;
    inventoryLiability?: EquipmentLiability[];
    medicalExamExpiry?: Date;
    nationality?: 'BRA' | 'USA' | 'MEX' | 'EUR' | 'JPN' | 'OTHER';
    cpf?: string;
    birthDate?: Date;
    affiliateCode?: string;
    verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
    teamId?: string;
    program?: ProgramType;
    gameLogs?: GameLog[];
    highlights?: PlayerHighlight[];
    achievements?: PlayerAchievement[];
    wellnessHistory?: WellnessEntry[];
    savedWorkouts?: SavedWorkout[];
    developmentPlans?: DevelopmentPlan[];
    medicalReports?: MedicalReport[];
    rosterHistory?: any[];
    hcNotes?: string;
    commitmentLevel?: number;
    workoutProofs?: WorkoutProof[];
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

export interface PlayerRotation {
    playerId: number;
    status: 'ON_FIELD' | 'BENCH' | 'WARMING_UP';
    minutesPlayed: number;
    fatigueLevel: number; // 0-100
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
    rotation?: PlayerRotation[];
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

export interface Drill {
    id: string;
    name: string;
    description: string;
    durationMinutes: number;
    demoVideoUrl: string;
    videoSearchTerm?: string;
}

export interface PracticeScriptItem {
    id: string;
    startTime: string;
    durationMinutes: number;
    type: 'WARMUP' | 'INDY' | 'GROUP' | 'TEAM' | 'SPECIAL';
    activityName: string;
    description: string;
}

export interface DrillExecutionAnalysis {
    id: string;
    playerId: number;
    drillId: string;
    coachObservation: string;
    athleteVideoUrl: string;
    aiFeedback: string;
    date: Date;
}

export interface PracticeSession {
    id: string;
    title: string;
    focus: string;
    date: Date;
    category: PracticeCategory;
    locationType: string;
    instructor: string;
    attendees: string[];
    checkedInAttendees?: string[];
    notes: string;
    drills: Drill[];
    script: PracticeScriptItem[];
    performances?: any[];
    drillExecutions?: DrillExecutionAnalysis[];
    deadlineDate?: Date;
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
    status?: string;
    topic?: string;
    platform?: string;
    scheduledDate?: Date;
}

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

export interface EventSale {
    id: string;
    type: 'TICKET' | 'BAR';
    itemName: string;
    quantity: number;
    totalAmount: number;
    timestamp: Date;
}

export type PaymentMethod = 'CREDIT_CARD' | 'PIX';

export interface FinancialAttachment {
    id: string;
    name: string;
    url: string;
    type: 'INVOICE' | 'RECEIPT' | 'CONTRACT';
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
    attachments?: FinancialAttachment[];
    platformFee?: number;
    netAmount?: number;
    method?: PaymentMethod;
    createdAt?: Date;
    aiGenerated?: boolean;
    verifiedBy?: string;
}

export interface Subscription {
    id: string;
    title: string;
    amount: number;
    frequency: 'MONTHLY';
    active: boolean;
    nextBillingDate: Date;
    assignedTo: number[];
}

export interface Budget {
    category: TransactionCategory;
    spent: number;
    limit: number;
}

export interface Bill {
    id: string;
    title: string;
    amount: number;
    dueDate: Date;
    status: 'PENDING' | 'PAID';
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

export interface InstallMatrixItem {
    id: string;
    day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';
    category: 'RUN' | 'PASS' | 'DEFENSE' | 'SITUATION';
    concept: string;
    notes?: string;
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
    program?: ProgramType;
}

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatarUrl: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    cpf?: string;
    program?: ProgramType;
    isProfileComplete?: boolean;
}

export type CourseLevel = 'FAN' | 'PLAYER' | 'COACH';

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
    level: CourseLevel;
    author: string;
    createdAt: Date;
    modules: CourseModule[];
    thumbnailUrl: string;
    isPurchased?: boolean;
    price?: number;
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
    coachProfile?: CoachCareer;
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

export interface LegalDocument {
    id: string;
    title: string;
    version: string;
    requiredRole: UserRole[];
    createdAt: Date;
    content: string;
}

export interface YouthStudent {
    id: string;
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

export interface AssociationFinance {
    totalReceivableFromLeagues: number;
    totalPayableToReferees: number;
    cashBalance: number;
}

export interface CarPool {
    driver: string;
    passengers: string[];
    vehicle: string;
}

export interface CrewLogistics {
    gameId: number;
    meetingPoint: string;
    meetingTime: string;
    carPools: CarPool[];
    uniformColor: string;
}

export interface CoachGameNote {
    id: string;
    gameId: number;
    quarter: number;
    content: string;
    timestamp: Date;
    category?: 'GENERAL' | 'HALFTIME' | 'POSTGAME';
    tags?: string[];
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

export interface Entitlement {
    id: string;
    userId: string;
    productId: string;
    purchaseDate: Date;
    expiresAt: Date;
    status: 'ACTIVE' | 'EXPIRED';
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

export interface GymExercise {
    name: string;
    sets: number;
    reps: string;
    notes: string;
}

export interface GymDay {
    title: string;
    exercises: GymExercise[];
}

export interface Tenant {
    id: string;
    name: string;
    plan: 'STARTER' | 'ROOKIE' | 'ALL_PRO';
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
    assignedTo: string;
    deliverableUrl?: string;
}

export interface PlatformMetric {
    totalRevenue: number;
    activeTeams: number;
    pendingServices: number;
    churnRate: number;
}


export type UserRole = 'PLATFORM_OWNER' | 'MASTER' | 'HEAD_COACH' | 'OFFENSIVE_COORD' | 'DEFENSIVE_COORD' | 'MEDICAL_STAFF' | 'FINANCIAL_MANAGER' | 'MARKETING_MANAGER' | 'COMMERCIAL_MANAGER' | 'PLAYER' | 'REFEREE' | 'SPORTS_DIRECTOR' | 'EQUIPMENT_MANAGER' | 'CANDIDATE' | 'BROADCASTER';

export type RosterCategory = 'ACTIVE' | 'PRACTICE_SQUAD' | 'IR' | 'SUSPENDED';
export type ProgramType = 'TACKLE' | 'FLAG' | 'BOTH';

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
    lastWeighIn?: Date;
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
    commitmentLevel?: number; // 0-100
    // Fix: Added missing properties referenced in roster and onboarding
    rosterHistory?: any[];
    nationality?: string;
}

export interface WellnessEntry {
    date: string;
    sleepQuality: number;
    fatigue: number;
    soreness: number;
    stress: number;
    rpe: number;
}

export interface CombineStats {
    fortyYards?: number;
    benchPress?: number;
    verticalJump?: number;
    broadJump?: number;
    shuttle?: number;
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
    // Fix: Updated to point to specific interfaces
    scoutingReport?: GameScoutingReport;
    playerGrades?: PlayerPerformance[];
    callSheet?: CallSheetSection[];
    // Fix: Added missing properties referenced in Officiating and LeagueManager
    officialReport?: GameReport;
    homeTeamName?: string;
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
    // Fix: Added missing property referenced in storageService
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
    isPinned?: boolean;
    content: string;
    likes: number;
    comments: any[];
    timestamp: Date;
    mediaType?: 'IMAGE' | 'VIDEO';
    mediaUrl?: string;
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
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    category: string;
    date: Date;
    status: 'PAID' | 'PENDING';
    // Fix: Added missing properties referenced in Finance.tsx
    description?: string;
    attachments?: any[];
    aiGenerated?: boolean;
    verifiedBy?: string;
}

export interface Invoice {
    id: string;
    playerId?: number;
    playerName: string;
    title: string;
    amount: number;
    dueDate: Date;
    status: 'PENDING' | 'PAID' | 'OVERDUE';
    // Fix: Added missing properties referenced in financeService
    category?: string;
    inventoryItemId?: string;
}

// Added missing interfaces referenced in multiple files

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
    deadlineDate?: Date;
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
    channel?: string;
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

export interface Course {
    id: string;
    title: string;
    description: string;
    level: string;
    author: string;
    createdAt: Date;
    modules: any[];
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

export interface YouthClass {
    id: string;
    name: string;
    ageGroup: string;
    schedule: string;
    coachId: string;
    students: YouthStudent[];
    maxCapacity: number;
}

export interface YouthStudent {
    id: string;
    isSocialProject: boolean;
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
    status: string;
    createdAt: Date;
    notes: string;
    rating?: number;
    aiAnalysis?: string;
    combineStats?: CombineStats;
    avatarUrl?: string;
}

export interface Objective {
    id: string;
    title: string;
    category: 'SPORTING' | 'FINANCIAL' | 'MARKETING';
    status: 'ON_TRACK' | 'BEHIND' | 'COMPLETED';
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
    spent: number;
    limit: number;
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
    assignedToDepartment: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate?: Date;
}

export interface RefereeProfile {
    id: string;
    name: string;
    level: string;
    city: string;
    availability: string;
    totalGames: number;
    balance: number;
    certifications: any[];
}

export interface LegalDocument {
    id: string;
    title: string;
    version: string;
    requiredRole: UserRole[];
    createdAt: Date;
    content: string;
}

export interface Drill {
    id: string;
    name: string;
    description: string;
    durationMinutes: number;
    videoSearchTerm?: string;
}

export interface Entitlement {
    id: string;
    userId: string;
    productId: string;
    purchaseDate: Date;
    expiresAt: Date;
    status: string;
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

export interface League {
    id: string;
    name: string;
    season: string;
    teams: any[];
}

export interface SponsorDeal {
    id: string;
    companyName: string;
    contactPerson: string;
    status: string;
    value: number;
    lastInteraction: Date;
}

export interface SocialPost {
    id: string;
    platform: string;
    topic: string;
    content: string;
    status: string;
    scheduledDate: Date;
}

export interface EquipmentItem {
    id: string;
    name: string;
    category: string;
    quantity: number;
    condition: string;
    for_sale: boolean; // Error fix: original used forSale, inventory.tsx uses forSale
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
    type: string;
    itemName: string;
    quantity: number;
    totalAmount: number;
    timestamp: Date;
}

export interface GameReport {
    infrastructure: GameInfrastructureChecklist;
    fouls: FoulRecord[];
    ejections: any[];
    notes: string;
    crew: any[];
    isFinalized: boolean;
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

export type FoulType = 'HOLDING' | 'FALSE_START' | 'OFFSIDES' | 'PASS_INTERFERENCE' | 'UNSPORTSMANLIKE' | 'PERSONAL_FOUL' | 'DELAY_OF_GAME' | 'BLOCK_IN_BACK';

export interface VideoClip {
    id: string;
    gameId: string;
    title: string;
    videoUrl: string;
    startTime: number;
    endTime: number;
    tags: VideoTag;
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

export interface VideoPlaylist {
    id: string;
    title: string;
    description: string;
    clips: VideoClip[];
}

export interface CoachGameNote {
    id: string;
    gameId: number;
    quarter: number;
    content: string;
    timestamp: Date;
    category?: string;
    tags?: string[];
}

export interface CoachCareer {
    careerRecord: { wins: number; losses: number; ties: number };
    philosophy: string;
    achievements: any[];
    specialties: string[];
}

export interface CrewLogistics {
    gameId: number;
    meetingPoint: string;
    meetingTime: string;
    carPools: any[];
    uniformColor: string;
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

export interface AssociationFinance {
    totalReceivableFromLeagues: number;
    totalPayableToReferees: number;
    cashBalance: number;
}

export interface InstallMatrixItem {
    id: string;
    day: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';
    category: 'RUN' | 'PASS' | 'DEFENSE' | 'SITUATION';
    concept: string;
}

export interface GymDay {
    title: string;
    focus: string;
    exercises: { name: string; sets: string; reps: string; notes: string }[];
}

export interface Tenant {
    id: string;
    name: string;
    plan: string;
    status: 'ACTIVE' | 'DELINQUENT' | 'INACTIVE';
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

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatarUrl: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    cpf: string;
    program?: ProgramType;
    isProfileComplete: boolean;
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

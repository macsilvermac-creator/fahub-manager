
export type UserRole = 
  | 'MASTER'               // Presidente (Acesso Total)
  | 'COMMERCIAL_DIRECTOR'  // Diretor Comercial
  | 'MARKETING_DIRECTOR'   // Diretor de Marketing
  | 'SPORTS_DIRECTOR'      // Diretor de Esportes (General Manager)
  | 'HEAD_COACH'           // Técnico Principal
  | 'PLAYER'               // Atleta
  | 'STAFF'                // Apoio Geral
  | 'FINANCIAL_MANAGER'    // Gerente Financeiro (Subordinado ao Comercial)
  | 'CANDIDATE'            // Candidato aguardando aprovação
  | 'PRESIDENT'
  | 'VICE_PRESIDENT'
  | 'FINANCIAL_DIRECTOR'
  | 'COMMERCIAL_MANAGER'
  | 'MARKETING_MANAGER'
  | 'OFFENSIVE_COORD'
  | 'DEFENSIVE_COORD'
  | 'POSITION_COACH'
  | 'PHYSICAL_TRAINER'
  | 'MEDICAL_STAFF'
  | 'REFEREE'
  | 'EQUIPMENT_MANAGER'
  | 'PLATFORM_OWNER'
  | 'BROADCASTER'
  | 'STUDENT'
  | 'FAN'
  | 'SYSTEM'
  | 'ADMIN';

export type ProgramType = 'TACKLE' | 'FLAG' | 'BOTH';
export type RosterCategory = 'ACTIVE' | 'PRACTICE_SQUAD' | 'IR' | 'INACTIVE';
export type GameUnit = 'OFFENSE' | 'DEFENSE' | 'ST';
export type PracticeTarget = 'FULL_TEAM' | 'OFFENSE' | 'DEFENSE' | 'UNIT' | 'POSITION';
export type IncubationStatus = 'CULTURE' | 'FUNDAMENTALS' | 'EVALUATION' | 'GRADUATED';
export type TransactionCategory = 'TUITION' | 'EQUIPMENT' | 'EVENT' | 'STORE' | 'OTHER';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatarUrl: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    program?: ProgramType;
    cpf: string;
    isProfileComplete?: boolean;
}

export interface Player {
    id: string | number;
    name: string;
    position: string;
    jerseyNumber: number;
    rating: number;
    status: string;
    avatarUrl: string;
    level?: number;
    class?: string;
    xp?: number;
    badges?: string[];
    program?: ProgramType;
    rosterCategory?: RosterCategory;
    medicalExamExpiry?: Date;
    height?: string;
    weight?: number;
    commitmentLevel?: number;
    stats?: {
        ovr: number;
        [key: string]: number;
    };
    attendanceRate?: number;
    incubation?: {
        status: IncubationStatus;
        cultureAccepted: boolean;
        fundamentalsProgress: number;
        fieldEvaluationScore: number;
    };
    cpf?: string;
    depthChartOrder?: number;
    rosterHistory?: any[];
    wellnessHistory?: WellnessEntry[];
    developmentPlans?: DevelopmentPlan[];
    // Fix: Added missing properties required by various components
    birthDate?: Date;
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

export interface DevelopmentPlan {
    id: string;
    playerId: string | number;
    title: string;
    generatedContent: string;
    createdAt: Date;
    deadline?: Date;
    status: 'ACTIVE' | 'COMPLETED';
}

export interface TeamSettings {
    id?: string;
    teamName: string;
    primaryColor: string;
    logoUrl: string;
    address?: string;
    website?: string;
    contactEmail?: string;
    plan?: 'ROOKIE' | 'STARTER' | 'ALL_PRO';
    sportType?: 'TACKLE' | 'FLAG' | 'BOTH';
}

export interface Game {
    id: number | string;
    opponent: string;
    opponentLogoUrl?: string;
    date: Date | string;
    location: 'Home' | 'Away';
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'HALFTIME' | 'FINAL';
    score?: string;
    currentQuarter?: number;
    clock?: string;
    timeline?: PlayEvent[];
    audioNotes?: string[];
    result?: 'W' | 'L' | 'T';
    homeTeamName?: string;
    scoutingReport?: GameScoutingReport;
    playerGrades?: PlayerPerformance[];
    callSheet?: CallSheetSection[];
    rotation?: PlayerRotation[];
    halftimeStats?: any;
    officialReport?: GameReport;
}

export interface GameScoutingReport {
    offenseAnalysis: string;
    defenseAnalysis: string;
    keyPlayersToWatch: string;
    lastUpdate: Date;
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

export interface PlayerRotation {
    playerId: string | number;
    status: 'ON_FIELD' | 'BENCH';
    minutesPlayed: number;
    fatigueLevel: number;
}

export interface PlayEvent {
    id: string;
    gameId: string | number;
    timestamp: Date;
    unit: GameUnit;
    playType: string;
    result: string;
    primaryJersey: number;
    yards?: number;
    isVerified?: boolean;
}

export interface PracticeSession {
    id: string | number;
    title: string;
    focus: string;
    date: Date | string;
    startTime?: string;
    category?: 'PHYSICAL' | 'TACTICAL' | 'MENTAL';
    target?: PracticeTarget;
    source?: 'AI' | 'MANUAL';
    attendees?: string[];
    checkedInAttendees?: string[];
    script?: PracticeScriptItem[];
    feedbacks?: PracticeFeedback[];
    deadlineDate?: Date | string;
    performances?: any[];
}

export interface PracticeScriptItem {
    id: string;
    startTime: string;
    durationMinutes: number;
    activityName: string;
    type: string;
    description?: string;
}

export interface PracticeFeedback {
    playerId: string | number;
    notes: string;
    timestamp: Date;
}

export interface TacticalPlay {
    id: string;
    name: string;
    concept: string;
    unit: GameUnit;
    category?: 'RUN' | 'PASS';
    elements: PlayElement[];
    frames?: TacticalFrame[];
    routes?: any[];
    aiAnalysis?: string;
    originalImageUrl?: string;
    program?: ProgramType;
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

export interface Transaction {
    id: string;
    title: string;
    description?: string;
    amount: number;
    type: 'INCOME' | 'EXPENSE';
    category: TransactionCategory;
    date: Date | string;
    status: 'PENDING' | 'PAID' | 'CANCELLED';
    aiGenerated?: boolean;
    verifiedBy?: string;
}

export interface Invoice {
    id: string;
    playerId: string | number;
    playerName: string;
    title: string;
    amount: number;
    dueDate: Date | string;
    status: 'PENDING' | 'PAID' | 'OVERDUE';
    category: TransactionCategory;
    inventoryItemId?: string;
}

export interface CombineStats {
    date: Date;
    fortyYards?: number;
    benchPress?: number;
    verticalJump?: number;
    broadJump?: number;
    shuttle?: number;
}

export interface AuditLog {
    id: string;
    action: string;
    details: string;
    timestamp: Date | string;
    userName: string;
    role: UserRole;
    ipAddress?: string;
}

export interface Objective {
    id: string;
    title: string;
    description: string;
    status: 'TODO' | 'DOING' | 'DONE';
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

export interface SponsorDeal {
    id: string;
    companyName: string;
    contactPerson: string;
    status: 'PROSPECT' | 'NEGOTIATION' | 'CLOSED_WON' | 'REJECTED';
    value: number;
    lastInteraction: Date | string;
}

export interface EventSale {
    id: string;
    type: 'TICKET' | 'BAR';
    itemName: string;
    quantity: number;
    totalAmount: number;
    timestamp: Date | string;
}

export interface OKR {
    id: string;
    title: string;
    description: string;
    category: 'FINANCE' | 'SPORTS' | 'MARKETING' | 'TECHNICAL';
    currentValue: number;
    targetValue: number;
    unit: string;
    status: 'ON_TRACK' | 'BEHIND' | 'COMPLETED';
    parentOkrId?: string;
}

export interface RoadmapItem {
    id: string;
    day: string;
    title: string;
    description: string;
    status: 'TODO' | 'DOING' | 'DONE';
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
    offensivePlayCall?: string;
    offensiveFormation?: string;
    personnel?: string;
    result: string;
}

export interface Course {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    priority?: boolean;
    level?: 'BEGINNER' | 'PRO' | 'ELITE';
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
    timestamp: Date | string;
}

export interface Subscription {
    id: string;
    title: string;
    amount: number;
    active: boolean;
    assignedTo: (string | number)[];
    frequency: 'MONTHLY' | 'YEARLY';
    nextBillingDate: Date | string;
}

export interface Budget {
    id: string;
    category: TransactionCategory;
    allocated: number;
    spent: number;
}

export interface Bill {
    id: string;
    title: string;
    amount: number;
    dueDate: Date | string;
    status: 'PENDING' | 'PAID';
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    priority: 'NORMAL' | 'HIGH' | 'URGENT';
    date: Date | string;
    authorRole: UserRole;
    readBy: string[];
}

export interface ChatMessage {
    id: string;
    senderName: string;
    senderRole: UserRole;
    content: string;
    timestamp: Date | string;
    channel?: 'GENERAL' | 'OFFENSE' | 'DEFENSE';
}

export interface TeamDocument {
    id: string;
    title: string;
    type: 'PDF' | 'DOC' | 'IMG';
    category: 'CONTRACTS' | 'PLAYBOOK' | 'MEDICAL' | 'ADMIN' | 'SCOUT';
    uploadDate: Date | string;
    size: string;
    url: string;
}

export interface League {
    id: string;
    name: string;
    season: string;
    teams: LeagueTeam[];
}

export interface LeagueTeam {
    teamId: string;
    teamName: string;
    logoUrl: string;
    wins: number;
    losses: number;
    draws?: number;
    pointsFor: number;
    pointsAgainst: number;
}

export interface KanbanTask {
    id: string;
    title: string;
    description: string;
    status: 'TODO' | 'DOING' | 'DONE';
    assignedToDepartment: string;
    priority: string;
    dueDate: Date | string;
}

export interface SocialPost {
    id: string;
    platform: 'INSTAGRAM' | 'TIKTOK' | 'WEBSITE' | 'WHATSAPP';
    topic: string;
    content: string;
    status: 'SCHEDULED' | 'POSTED';
    scheduledDate: Date | string;
}

export interface EquipmentItem {
    id: string;
    name: string;
    category: 'HELMET' | 'PADS' | 'JERSEY' | 'BALL' | 'DRINK' | 'FOOD' | 'MERCH' | 'CLEATS' | 'ACCESSORIES';
    quantity: number;
    condition: 'NEW' | 'USED' | 'DAMAGED';
    forSale: boolean;
    salePrice?: number;
    cost?: number;
    brand?: string;
    size?: string;
    acquisitionDate: Date | string;
    expiryDate?: Date | string;
    assignedToPlayerId?: string | number;
    qrCodeUrl?: string;
}

export interface StaffMember {
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    documentsPending: boolean;
    contract: {
        type: 'PAID' | 'VOLUNTEER';
        value: number;
        signed: boolean;
        active: boolean;
    };
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

export interface NationalTeamCandidate extends Player {
    teamName: string;
    teamLogo: string;
    combineStats: CombineStats;
}

export interface Affiliate {
    id: string;
    name: string;
    region: string;
    president: string;
    status: 'REGULAR' | 'PENDING' | 'SUSPENDED';
    athletesCount: number;
    teamsCount: number;
    lastAuditDate: Date | string;
}

export interface TransferRequest {
    id: string;
    playerName: string;
    originTeamName: string;
    destinationTeamName: string;
    fee: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface Entitlement {
    id: string;
    userId: string;
    productId: string;
    expiresAt: Date | string;
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

export interface ObjectiveSignal {
    fromRole: UserRole;
    fromName: string;
    type: string;
    message: string;
}

export interface LeagueRanking {
    position: number;
    teamName: string;
    record: string;
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

export interface LegalDocument {
    id: string;
    title: string;
    content: string;
    version: string;
}

export interface GameReport {
    infrastructure: {
        ambulancePresent: boolean;
    };
}

export interface CoachGameNote {
    id: string;
    gameId: string | number;
    note: string;
}

export interface Championship {
    id: string;
    name: string;
    year: number;
    division: string;
}

export interface PaymentTransaction {
    id: string;
    amount: number;
    method: 'CREDIT_CARD' | 'PIX';
    status: 'APPROVED' | 'PENDING' | 'REJECTED';
    createdAt: Date;
    platformFee: number;
    netAmount: number;
}

export type PaymentMethod = 'CREDIT_CARD' | 'PIX';

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

// Fix: Added missing interfaces required by components
export interface RecruitmentCandidate {
    id: string | number;
    name: string;
    bibNumber?: string;
    position: string;
    weight: number;
    status: 'TESTING' | 'EVALUATED';
    combineStats?: CombineStats;
    aiAnalysis?: string;
    rating?: number;
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
    playId: string;
    day: string;
    status: 'TODO' | 'DONE';
}

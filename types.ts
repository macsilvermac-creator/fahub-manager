
export type UserRole = 'MASTER' | 'HEAD_COACH' | 'OFFENSIVE_COORD' | 'DEFENSIVE_COORD' | 'MEDICAL_STAFF' | 'FINANCIAL_MANAGER' | 'MARKETING_MANAGER' | 'COMMERCIAL_MANAGER' | 'PLAYER' | 'REFEREE' | 'SPORTS_DIRECTOR' | 'EQUIPMENT_MANAGER' | 'CANDIDATE' | 'PLATFORM_OWNER' | 'BROADCASTER' | 'SYSTEM' | 'ADMIN' | 'FAN' | 'STUDENT' | 'PRESIDENT' | 'VICE_PRESIDENT' | 'FINANCIAL_DIRECTOR' | 'COMMERCIAL_DIRECTOR' | 'MARKETING_DIRECTOR' | 'POSITION_COACH' | 'PHYSICAL_TRAINER' | 'STAFF';

export type RosterCategory = 'ACTIVE' | 'PRACTICE_SQUAD' | 'IR' | 'SUSPENDED';
export type ProgramType = 'TACKLE' | 'FLAG' | 'BOTH' | 'YOUTH';
export type PracticeSource = 'MANUAL' | 'AI';
export type PracticeTarget = 'FULL_TEAM' | 'UNIT' | 'POSITION' | 'OFFENSE' | 'DEFENSE';

export type GameUnit = 'OFFENSE' | 'DEFENSE' | 'ST';

export interface PlayEvent {
    id: string;
    gameId: string | number;
    timestamp: Date;
    unit: GameUnit;
    down?: number;
    distance?: number;
    yardLine?: number;
    playType: 'PASS' | 'RUN' | 'PUNT' | 'FG' | 'KICKOFF' | 'PAT';
    result: 'CATCH' | 'DROP' | 'INT' | 'SACK' | 'FUMBLE' | 'TACKLE' | 'TOUCHDOWN' | 'SAFETY' | 'GOOD' | 'NO_GOOD' | 'MUFF' | 'COMPLETE';
    primaryPlayerId?: string | number;
    primaryJersey?: number;
    yards?: number;
    isVerified?: boolean;
}

export interface TacticalPlay {
    id: string;
    name: string;
    concept: string;
    unit: GameUnit;
    category: 'RUN' | 'PASS' | 'BLITZ' | 'COVERAGE' | 'ST';
    elements: PlayElement[];
    // Fix: Added routes to TacticalPlay interface
    routes?: any[];
    originalImageUrl?: string;
    aiAnalysis?: string;
    program?: string;
    createdAt?: Date;
    frames?: TacticalFrame[];
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
    route?: { x: number, y: number }[];
}

export interface PracticeSession {
    id: string | number;
    title: string;
    focus: string;
    date: Date;
    startTime?: string;
    attendees: string[]; 
    checkedInAttendees?: string[];
    script?: PracticeScriptItem[];
    source?: 'MANUAL' | 'AI';
    target?: PracticeTarget;
    category?: 'PHYSICAL' | 'TACTICAL' | 'MENTAL';
    deadlineDate?: Date;
    performances?: any[];
    feedbacks?: PracticeFeedback[];
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

export interface TeamSettings {
    id: string;
    teamName: string;
    logoUrl: string;
    primaryColor: string;
    address?: string;
    sportType?: 'TACKLE' | 'FLAG' | 'BOTH';
    website?: string;
    contactEmail?: string;
    plan?: string;
}

export interface AuditLog {
    id: string;
    action: string;
    details: string;
    timestamp: Date;
    userName: string;
    role?: string;
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

export interface Game {
    id: string | number;
    opponent: string;
    opponentLogoUrl?: string;
    date: Date;
    location: 'Home' | 'Away';
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'FINAL' | 'HALFTIME';
    score?: string;
    clock?: string;
    currentQuarter?: number;
    timeline?: PlayEvent[];
    scoutingReport?: GameScoutingReport;
    playerGrades?: PlayerPerformance[];
    callSheet?: CallSheetSection[];
    result?: 'W' | 'L' | 'T';
    rotation?: PlayerRotation[];
    officialReport?: GameReport;
    homeTeamName?: string;
    audioNotes?: any[];
    halftimeStats?: any;
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

export interface PlayerRotation {
  playerId: string | number;
  status: 'ON_FIELD' | 'BENCH';
  minutesPlayed: number;
  fatigueLevel: number;
}

export interface Player {
    id: string | number;
    name: string;
    // Fix: Added birthDate to Player interface
    birthDate?: Date;
    position: string;
    jerseyNumber: number;
    level: number;
    xp: number;
    rating: number;
    status: string;
    avatarUrl: string;
    height?: string;
    weight?: number;
    class?: string;
    badges?: string[];
    rosterCategory?: RosterCategory;
    program?: ProgramType;
    attendanceRate?: number;
    medicalExamExpiry?: Date;
    registration?: {
      documentStatus: string;
    };
    combineStats?: CombineStats;
    developmentPlans?: DevelopmentPlan[];
    wellnessHistory?: WellnessEntry[];
    commitmentLevel?: number;
    incubation?: {
      cultureAccepted: boolean;
      fundamentalsProgress: number;
      fieldEvaluationScore: number;
      status: IncubationStatus;
    };
    stats?: {
      ovr: number;
      [key: string]: number;
    };
    nationality?: string;
    depthChartOrder?: number;
    rosterHistory?: any[];
    cpf?: string;
}

export type IncubationStatus = 'FUNDAMENTALS' | 'CULTURE' | 'STRENGTH' | 'GRADUATED';

export interface CombineStats {
  date: Date;
  fortyYards?: number;
  benchPress?: number;
  verticalJump?: number;
  broadJump?: number;
  shuttle?: number;
}

export interface DevelopmentPlan {
  id: string;
  playerId: string | number;
  title: string;
  generatedContent: string;
  createdAt: Date;
  deadline?: Date;
  status: string;
}

export interface WellnessEntry {
  date: string;
  sleepQuality: number;
  fatigue: number;
  soreness: number;
  stress: number;
  rpe: number;
}

export interface Transaction {
  id: string;
  title: string;
  description?: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: TransactionCategory;
  date: Date;
  status: string;
  aiGenerated?: boolean;
  verifiedBy?: string;
}

export type TransactionCategory = 'TUITION' | 'EQUIPMENT' | 'EVENT' | 'STORE' | 'OTHER' | 'SALARY';

export interface Invoice {
  id: string;
  playerId: string | number;
  playerName: string;
  title: string;
  amount: number;
  dueDate: Date;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  category?: TransactionCategory;
  inventoryItemId?: string;
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
  status: 'REJECTED' | 'PROSPECT' | 'NEGOTIATION' | 'CLOSED_WON';
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

export interface OKR {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'ON_TRACK' | 'COMPLETED' | 'AT_RISK';
  currentValue: number;
  targetValue: number;
  unit: string;
  parentOkrId?: string;
}

export interface RoadmapItem {
  id: string | number;
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
  level?: string;
}

export interface SocialFeedPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  isOfficialTeamPost?: boolean;
  isPinned?: boolean;
  content: string;
  likes: number;
  comments: any[];
  timestamp: Date;
}

export interface Subscription {
  id: string;
  title: string;
  amount: number;
  active: boolean;
  assignedTo: (string | number)[];
  frequency: 'MONTHLY' | 'YEARLY';
  nextBillingDate: Date;
}

export interface Budget {
  id: string;
  category: TransactionCategory;
  limit: number;
  spent: number;
}

export interface Bill {
  id: string;
  title: string;
  amount: number;
  dueDate: Date;
  status: 'PENDING' | 'PAID';
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
  channel: string;
}

export interface TeamDocument {
  id: string;
  title: string;
  type: string;
  category: 'PLAYBOOK' | 'CONTRACTS' | 'MEDICAL' | 'SCOUT' | 'ADMIN';
  uploadDate: Date;
  size: string;
  url: string;
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
    draws?: number;
    pointsFor: number;
    pointsAgainst: number;
  }[];
}

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'DOING' | 'DONE';
  assignedToDepartment: string;
  priority: string;
  dueDate: Date;
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
  category: 'HELMET' | 'PADS' | 'JERSEY' | 'BALL' | 'DRINK' | 'FOOD' | 'MERCH';
  quantity: number;
  condition: 'NEW' | 'USED' | 'DAMAGED';
  forSale: boolean;
  salePrice?: number;
  cost?: number;
  brand?: string;
  size?: string;
  acquisitionDate: Date;
  expiryDate?: Date;
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
    signed: boolean;
    active: boolean;
    type: 'PAID' | 'VOLUNTEER';
    value: number;
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

export interface NationalTeamCandidate {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  position: string;
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

export interface RecruitmentCandidate {
  id: string;
  name: string;
  bibNumber?: string;
  position: string;
  weight: number;
  status: 'PENDING' | 'TESTING' | 'EVALUATED';
  combineStats?: CombineStats;
  aiAnalysis?: string;
  rating?: number;
}

export interface Entitlement {
  id: string;
  userId: string;
  productId: string;
  expiresAt: Date;
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

export interface LeagueRanking {
  teamName: string;
  position: number;
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

export interface GameReport {
  infrastructure?: {
    ambulancePresent: boolean;
  };
}

export interface LegalDocument {
  id: string;
  title: string;
  content: string;
  version: string;
}

export interface CoachGameNote {
  id: string;
  gameId: string | number;
  text: string;
}

export interface Championship {
  id: string;
  name: string;
  year: number;
}

export interface InstallMatrixItem {
  id: string;
  title: string;
  status: string;
}

export interface Objective {
  id: string;
  title: string;
  description?: string;
}

export interface ObjectiveSignal {
  id: string;
  fromRole: UserRole;
  fromName: string;
  type: string;
  message: string;
}

export interface PaymentTransaction {
  id: string;
  amount: number;
  method: PaymentMethod;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  platformFee: number;
  netAmount: number;
}

export type PaymentMethod = 'PIX' | 'CREDIT_CARD';

export interface Drill {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  videoSearchTerm?: string;
}

export interface Tenant {
  id: string;
  name: string;
  plan: string;
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

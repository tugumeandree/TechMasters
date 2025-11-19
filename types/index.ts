// User Types
export type UserRole = 'participant' | 'mentor' | 'partner' | 'admin';

export type MentorType = 'technical' | 'industry' | 'investor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Participant extends User {
  role: 'participant';
  phone?: string;
  location?: string;
  bio?: string;
  skills: string[];
  teamId?: string;
  cohortId?: string;
  applicationId?: string;
  currentStage?: ProgramStage;
  profileImage?: string;
}

export interface Mentor extends User {
  role: 'mentor';
  mentorType: MentorType;
  expertise: string[];
  company?: string;
  position?: string;
  bio?: string;
  availability: AvailabilitySlot[];
  cohorts: string[];
  profileImage?: string;
  linkedIn?: string;
  rating?: number;
  sessionsCompleted?: number;
}

export interface Partner extends User {
  role: 'partner';
  companyName: string;
  industry: string;
  contactPerson: string;
  sponsorshipTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  challenges: string[];
  logo?: string;
}

export interface Admin extends User {
  role: 'admin';
  permissions: string[];
}

// Application Types
export type ApplicationStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'accepted' 
  | 'rejected' 
  | 'waitlisted';

export interface Application {
  id: string;
  userId: string;
  cohortId: string;
  status: ApplicationStatus;
  personalInfo: PersonalInfo;
  projectIdea: ProjectIdea;
  skillsAssessment: SkillsAssessment;
  teamPreferences: TeamPreferences;
  documents: ApplicationDocument[];
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  reviewNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  location: string;
  education: string;
  currentRole?: string;
  linkedIn?: string;
  github?: string;
  portfolio?: string;
}

export interface ProjectIdea {
  title: string;
  description: string;
  problemStatement: string;
  proposedSolution: string;
  targetMarket: string;
  category: string;
  stage: 'idea' | 'prototype' | 'mvp' | 'launched';
}

export interface SkillsAssessment {
  technicalSkills: string[];
  businessSkills: string[];
  softSkills: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  areasOfInterest: string[];
}

export interface TeamPreferences {
  hasTeam: boolean;
  teamSize?: number;
  lookingForMembers: boolean;
  desiredRoles?: string[];
  willingToJoinExistingTeam: boolean;
}

export interface ApplicationDocument {
  id: string;
  type: 'resume' | 'proposal' | 'pitch_deck' | 'other';
  name: string;
  url: string;
  uploadedAt: Date;
}

// Program Types
export type ProgramStage = 
  | 'research'           // Stage 1: Research & Ideation
  | 'skilling'           // Stage 2: Skilling & Capacity Building
  | 'development'        // Stage 3: Product Development & Prototyping
  | 'business';          // Stage 4: Business Development & Commercialization

export type PillarType = 
  | 'research'           // Research & Ideation pillar
  | 'skilling'           // Skilling & Capacity Building pillar
  | 'development'        // Product Development & Prototyping pillar
  | 'business';          // Business Development & Commercialization pillar

export interface Pillar {
  id: PillarType;
  name: string;
  description: string;
  icon: string;
  color: string;
  benefits: string[];
}

export interface CohortBasic {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  applicationDeadline: Date;
  maxParticipants: number;
  maxTeams?: number;
  currentParticipants: number;
  status: 'upcoming' | 'active' | 'completed';
  description: string;
  format?: 'virtual' | 'in-person' | 'hybrid';
  location?: string;
  weeklySchedule?: {
    buildingDays: number;
    learningDays: number;
    schedule?: string;
  };
}

export interface Team {
  id: string;
  name: string;
  projectName: string;
  cohortId: string;
  members: string[];
  leaderId: string;
  currentStage: ProgramStage;
  mentors: string[];
  createdAt: Date;
}

export interface Project {
  id: string;
  teamId: string;
  name: string;
  description: string;
  category: string;
  stage: ProgramStage;
  progress: StageProgress;
  milestones: Milestone[];
  outputs?: StageOutput[];
  outcomes?: StageOutcome[];
  resources: Resource[];
  pitchDeck?: string;
  demoUrl?: string;
  repositoryUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StageProgress {
  ideation?: number;
  validation?: number;
  development?: number;
  scaling?: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  stage: ProgramStage;
  outputType?: 'deliverable' | 'artifact' | 'competency';
  outcomeType?: 'mindset' | 'skill' | 'credential' | 'network';
}

export interface GateReview {
  id: string;
  projectId: string;
  teamId: string;
  stage: ProgramStage;
  status: 'scheduled' | 'submitted' | 'under-review' | 'approved' | 'rejected' | 'revision-requested';
  scheduledDate: Date;
  submittedAt?: Date;
  reviewedAt?: Date;
  submission?: {
    presentationUrl?: string;
    demoUrl?: string;
    documentation: string[];
    keyAchievements: string[];
    challenges: string[];
    nextStepsPlan?: string;
    additionalNotes?: string;
  };
  criteria?: {
    problemValidation: { score: number; comments: string };
    technicalExecution: { score: number; comments: string };
    businessViability: { score: number; comments: string };
    teamReadiness: { score: number; comments: string };
    overallScore: number;
  };
  reviewPanel: Array<{
    reviewerId: string;
    role: string;
    status: 'pending' | 'completed';
    recommendation?: 'approve' | 'reject' | 'request-revision';
    feedback?: string;
    completedAt?: Date;
  }>;
  decision?: {
    outcome: 'approved' | 'rejected' | 'revision-requested';
    feedback: string;
    actionItems: string[];
    decisionMaker: string;
    decisionDate: Date;
  };
  revisionDeadline?: Date;
  revisionCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StageOutput {
  id: string;
  stage: ProgramStage;
  title: string;
  description: string;
  type: 'deliverable' | 'artifact' | 'competency' | 'documentation';
  status: 'not-started' | 'in-progress' | 'completed';
  completedAt?: Date;
  fileUrl?: string;
  notes?: string;
}

export interface StageOutcome {
  id: string;
  stage: ProgramStage;
  title: string;
  description: string;
  category: 'mindset' | 'skill' | 'credential' | 'network' | 'leadership' | 'career';
  achieved: boolean;
  achievedAt?: Date;
  evidence?: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'video' | 'document' | 'link' | 'tool';
  url: string;
  stage?: ProgramStage;
  pillar?: PillarType;
  description?: string;
}

// Mentoring Types
export interface MentorSession {
  id: string;
  mentorId: string;
  participantId?: string;
  teamId?: string;
  date: Date;
  duration: number;
  type: 'one-on-one' | 'group' | 'workshop';
  status: 'scheduled' | 'completed' | 'cancelled';
  topic?: string;
  notes?: string;
  meetingLink?: string;
  feedback?: SessionFeedback;
  createdAt: Date;
}

export interface SessionFeedback {
  rating: number;
  comment?: string;
  submittedBy: string;
  submittedAt: Date;
}

export interface AvailabilitySlot {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string;
}

// Challenge Types
export interface Challenge {
  id: string;
  partnerId: string;
  title: string;
  description: string;
  category: string;
  prize?: number;
  deadline: Date;
  requirements: string[];
  submissions: string[];
  status: 'open' | 'closed' | 'judging' | 'completed';
  createdAt: Date;
}

// Analytics Types
export interface DashboardStats {
  totalParticipants: number;
  activeProjects: number;
  mentorSessions: number;
  successRate: number;
  fundingRaised?: number;
}

// Form Types
export interface MultiStepFormData {
  currentStep: number;
  totalSteps: number;
  data: Partial<Application>;
  savedAt?: Date;
}

export interface FormStep {
  id: number;
  title: string;
  description: string;
  isComplete: boolean;
}

// New feature types for comprehensive platform

// Cohort & Alumni - Extended version
export interface CohortExtended {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  applicationDeadline: Date;
  maxParticipants: number;
  participants: string[];
  teams: string[];
  mentors: string[];
  programDirector?: string;
  status: 'upcoming' | 'active' | 'completed';
  challenges: CohortChallenge[];
  metrics: CohortMetrics;
  demoDay?: DemoDay;
  createdAt: Date;
  updatedAt: Date;
}

export interface CohortChallenge {
  title: string;
  description: string;
  type: 'hackathon' | 'competition' | 'case-study';
  startDate: Date;
  endDate: Date;
  prizes?: string[];
  winners?: string[];
}

export interface CohortMetrics {
  completionRate: number;
  averageProgress: number;
  projectsLaunched: number;
  fundingSecured: number;
  jobsCreated: number;
}

export interface DemoDay {
  date: Date;
  location: string;
  investors: string[];
  pitchingTeams: string[];
}

export interface Alumni {
  id: string;
  userId: string;
  cohortId: string;
  graduationDate: Date;
  currentStatus: 'active-startup' | 'employed' | 'founder' | 'freelance' | 'further-education' | 'other';
  companyName?: string;
  position?: string;
  startupMetrics?: StartupMetrics;
  isMentor: boolean;
  willingToHelp: boolean;
  areasOfExpertise: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StartupMetrics {
  fundingRaised: number;
  employees: number;
  revenue: number;
  customers: number;
}

// Partnership
export interface PartnerOrg {
  id: string;
  organizationName: string;
  organizationType: 'corporate' | 'startup' | 'government' | 'ngo' | 'academic' | 'investor';
  partnershipType: 'challenge-provider' | 'mentor-provider' | 'funding-partner' | 'pilot-partner' | 'hiring-partner' | 'resource-provider';
  status: 'prospective' | 'active' | 'inactive' | 'completed';
  challenges: PartnerChallenge[];
  pilots: PilotProject[];
  metrics: PartnerMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface PartnerChallenge {
  title: string;
  description: string;
  problemStatement: string;
  budget?: number;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  interestedTeams: string[];
  selectedTeams: string[];
}

export interface PilotProject {
  teamId: string;
  projectId: string;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  convertedToContract: boolean;
  contractValue?: number;
}

export interface PartnerMetrics {
  challengesPosted: number;
  pilotsCompleted: number;
  participantsHired: number;
  fundingProvided: number;
}

// Team Formation
export interface TeamFormation {
  id: string;
  participantId: string;
  cohortId: string;
  lookingFor: 'team' | 'members' | 'both';
  status: 'open' | 'in-discussion' | 'team-formed' | 'closed';
  projectIdea?: {
    title: string;
    description: string;
    industry: string;
  };
  skills: string[];
  role: string;
  desiredRoles: string[];
  desiredSkills: string[];
  matches: TeamMatch[];
  formedTeamId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMatch {
  userId: string;
  matchScore: number;
  status: 'pending' | 'accepted' | 'declined';
  matchedAt: Date;
}

// Validation Activities
export interface ValidationActivity {
  id: string;
  projectId: string;
  teamId: string;
  type: 'customer-interview' | 'user-testing' | 'survey' | 'pilot-customer' | 'market-research' | 'landing-page-test';
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  findings?: ValidationFindings;
  testResults?: TestResults;
  validationScore?: number;
  overallInsights?: string;
  actionItems?: string[];
  pivotRequired?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ValidationFindings {
  problemValidation: string;
  painPoints: string[];
  willingnessToPay: string;
  featureRequests: string[];
}

export interface TestResults {
  completionRate: number;
  successRate: number;
  satisfactionScore: number;
  issues: string[];
}

// Project Canvas
export interface ProjectCanvas {
  id: string;
  projectId: string;
  teamId: string;
  sections: CanvasSections;
  currentVersion: number;
  versions: CanvasVersion[];
  lastEditedBy?: string;
  lastEditedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CanvasSections {
  problem?: CanvasSection;
  solution?: CanvasSection;
  market?: CanvasSection;
  businessModel?: CanvasSection;
  product?: CanvasSection;
  traction?: CanvasSection;
  team?: CanvasSection;
  goToMarket?: CanvasSection;
  funding?: CanvasSection;
  risks?: CanvasSection;
}

export interface CanvasSection {
  [key: string]: any;
  lastUpdated?: Date;
  stage?: string;
}

export interface CanvasVersion {
  versionNumber: number;
  stage: string;
  savedAt: Date;
  savedBy: string;
  snapshot: any;
  changesSummary?: string;
}

// Analytics & KPIs
export interface ProgramMetrics {
  cohortId?: string;
  engagement: EngagementMetrics;
  progress: ProgressMetrics;
  validation: ValidationMetrics;
  outcomes: OutcomesMetrics;
  quality: QualityMetrics;
}

export interface EngagementMetrics {
  totalParticipants: number;
  activeParticipants: number;
  avgSessionAttendance: number;
  mentorEngagementRate: number;
}

export interface ProgressMetrics {
  participantsByStage: Record<ProgramStage, number>;
  completionRate: number;
  avgTimePerStage: Record<ProgramStage, number>;
}

export interface ValidationMetrics {
  totalInterviews: number;
  avgInterviewsPerTeam: number;
  totalUserTests: number;
  avgValidationScore: number;
}

export interface OutcomesMetrics {
  projectsLaunched: number;
  fundingRaised: number;
  revenueGenerated: number;
  customersAcquired: number;
  jobsCreated: number;
}

export interface QualityMetrics {
  avgMentorRating: number;
  avgProgramSatisfaction: number;
  gateReviewPassRate: number;
}

// Demo Day
export interface DemoEvent {
  id: string;
  cohortId: string;
  name: string;
  eventDate: Date;
  location: 'virtual' | 'in-person' | 'hybrid';
  pitchingTeams: PitchingTeam[];
  attendees: EventAttendees;
  awards: Award[];
  status: 'planning' | 'open-registration' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface PitchingTeam {
  teamId: string;
  projectId: string;
  pitchSlot: number;
  status: 'confirmed' | 'pending' | 'declined' | 'completed';
  judgeScores?: JudgeScore[];
  averageScore?: number;
}

export interface JudgeScore {
  judgeId: string;
  scores: {
    innovation: number;
    execution: number;
    marketPotential: number;
    presentation: number;
    impact: number;
  };
  totalScore: number;
}

export interface EventAttendees {
  investors: Investor[];
  judges: string[];
  mentors: string[];
  public: number;
}

export interface Investor {
  name: string;
  organization: string;
  email: string;
  interestedIn: string[];
}

export interface Award {
  name: string;
  prize: string;
  winnerId?: string;
}

// Learning Paths
export interface LearningPath {
  id: string;
  name: string;
  description: string;
  category: 'MedTech' | 'FinTech' | 'EdTech' | 'SaaS' | 'Hardware' | 'General';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  milestones: PathMilestone[];
  participants: string[];
  stats: PathStats;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PathMilestone {
  stage: ProgramStage;
  order: number;
  title: string;
  description: string;
  estimatedDuration: number;
  activities: PathActivity[];
  completionCriteria: string[];
}

export interface PathActivity {
  title: string;
  description: string;
  type: 'assignment' | 'project' | 'validation' | 'review';
  required: boolean;
}

export interface PathStats {
  totalEnrolled: number;
  completed: number;
  averageRating: number;
}

// Enhanced Mentor Features
export interface OfficeHours {
  id: string;
  mentorId: string;
  schedule: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  };
  maxParticipants: number;
  bookings: Booking[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupSession {
  id: string;
  title: string;
  type: 'workshop' | 'masterclass' | 'panel' | 'networking';
  hosts: SessionHost[];
  sessionDate: Date;
  targetStages: ProgramStage[];
  maxParticipants?: number;
  participants: SessionParticipant[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionHost {
  hostId: string;
  role: string;
}

export interface SessionParticipant {
  participantId: string;
  attended: boolean;
  feedback?: {
    rating: number;
    comment: string;
  };
}

export interface Booking {
  participantId: string;
  bookedAt: Date;
  question?: string;
  status: 'confirmed' | 'attended' | 'missed' | 'cancelled';
}

// Rewards & Gamification
export interface Grant {
  id: string;
  name: string;
  type: 'milestone-grant' | 'innovation-grant' | 'execution-grant' | 'impact-grant';
  amount: number;
  eligibilityCriteria: GrantCriterion[];
  applications: GrantApplication[];
  recipients: GrantRecipient[];
  status: 'draft' | 'open' | 'closed' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface GrantCriterion {
  criterion: string;
  required: boolean;
}

export interface GrantApplication {
  teamId: string;
  projectId: string;
  status: 'submitted' | 'under-review' | 'approved' | 'rejected';
  appliedAt: Date;
}

export interface GrantRecipient {
  teamId: string;
  amountAwarded: number;
  awardedAt: Date;
  disbursed: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: 'milestone' | 'skill' | 'validation' | 'collaboration' | 'leadership' | 'innovation';
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  criteria: string;
  stats: AchievementStats;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AchievementStats {
  totalUnlocked: number;
  unlockRate: number;
}

export interface Leaderboard {
  cohortId?: string;
  type: 'overall' | 'stage' | 'validation' | 'collaboration' | 'innovation';
  period: 'all-time' | 'monthly' | 'weekly';
  rankings: LeaderboardEntry[];
  lastUpdated: Date;
}

export interface LeaderboardEntry {
  participantId: string;
  rank: number;
  score: number;
  achievements: number;
  milestones: number;
}

// Revenue & Monetization Types
export interface SponsorshipBenefit {
  category: 'brand_exposure' | 'talent_access' | 'innovation' | 'engagement' | 'networking' | 'content';
  description: string;
  value?: string;
}

export interface SponsorshipPackage {
  id: string;
  name: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze' | 'custom';
  annualInvestment: number;
  currency: string;
  benefits: SponsorshipBenefit[];
  maxSponsors?: number;
  currentSponsors: number;
  features: {
    brandExposure: {
      logoOnWebsite: boolean;
      logoOnMaterials: boolean;
      socialMediaMentions: number;
      blogPosts: number;
    };
    talentAccess: {
      jobPostings: number;
      resumeDatabase: boolean;
      exclusiveRecruitingEvents: number;
      earlyAccessToGraduates: boolean;
    };
    innovation: {
      accessToProjects: boolean;
      pitchSessionAccess: boolean;
      ipRightsFirstLook: boolean;
      challengeHosting: boolean;
    };
    engagement: {
      mentorSlots: number;
      workshopOpportunities: number;
      judgingOpportunities: number;
      networkingEvents: number;
    };
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SponsorshipProposal {
  sentDate: Date;
  status: 'sent' | 'opened' | 'interested' | 'declined';
  followUpDates: Date[];
}

export interface SponsorshipMilestone {
  name: string;
  description: string;
  dueDate: Date;
  completedDate?: Date;
  status: 'pending' | 'completed' | 'overdue';
}

export interface Sponsorship {
  id: string;
  partnerId: string;
  packageId: string;
  status: 'proposal' | 'negotiating' | 'active' | 'completed' | 'cancelled';
  startDate: Date;
  endDate: Date;
  totalInvestment: number;
  currency: string;
  paymentSchedule: {
    frequency: 'one-time' | 'quarterly' | 'biannual' | 'annual';
    installments: PaymentInstallment[];
  };
  proposal?: SponsorshipProposal;
  milestones: SponsorshipMilestone[];
  deliverables: Deliverable[];
  metrics: SponsorshipMetrics;
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentInstallment {
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'overdue';
}

export interface Deliverable {
  category: string;
  description: string;
  dueDate: Date;
  deliveredDate?: Date;
  status: 'pending' | 'delivered' | 'approved';
  files?: string[];
}

export interface SponsorshipMetrics {
  logoImpressions: number;
  socialMediaReach: number;
  talentsRecruited: number;
  eventsAttended: number;
  projectsReviewed: number;
}

export interface ParticipantSubscription {
  id: string;
  participantId: string;
  cohortId?: string;
  subscriptionType: 'full_program' | 'mentorship_only' | 'platform_access' | 'alumni_network' | 'custom';
  pricingModel: 'tuition' | 'subscription' | 'isa' | 'scholarship' | 'corporate_sponsored' | 'free';
  pricing: {
    baseAmount: number;
    currency: string;
    paymentSchedule: 'one-time' | 'monthly' | 'quarterly' | 'semester';
    totalAmount: number;
    discountApplied?: Discount;
  };
  isa?: ISADetails;
  payments: Payment[];
  status: 'active' | 'paused' | 'completed' | 'cancelled' | 'delinquent';
  startDate: Date;
  endDate?: Date;
  accessIncludes: AccessLevel;
  financialAid?: FinancialAid;
  createdAt: Date;
  updatedAt: Date;
}

export interface Discount {
  type: 'early_bird' | 'scholarship' | 'referral' | 'financial_aid' | 'corporate';
  amount: number;
  percentage?: number;
  reason?: string;
}

export interface ISADetails {
  percentage: number;
  incomeThreshold: number;
  maxPaymentMonths: number;
  capAmount: number;
  paymentsMade: number;
  totalPaid: number;
  startDate?: Date;
}

export interface Payment {
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'overdue' | 'waived';
  method?: 'card' | 'bank_transfer' | 'wire' | 'scholarship' | 'corporate' | 'isa';
  transactionId?: string;
  receiptUrl?: string;
}

export interface AccessLevel {
  platformAccess: boolean;
  mentorshipHours: number;
  workshopAccess: boolean;
  projectReviews: number;
  careerServices: boolean;
  alumniNetwork: boolean;
  certificateEligible: boolean;
}

export interface FinancialAid {
  applied: boolean;
  approved: boolean;
  amount?: number;
  reason?: string;
  reviewedBy?: string;
  reviewedAt?: Date;
}

export interface RevenueTransaction {
  id: string;
  transactionType: 'participant_tuition' | 'participant_subscription' | 'sponsorship' | 'corporate_service' | 'licensing' | 'brokerage' | 'grant' | 'other';
  source: {
    type: 'participant' | 'organization' | 'grant' | 'other';
    id?: string;
    name: string;
  };
  subscriptionId?: string;
  sponsorshipId?: string;
  cohortId?: string;
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'bank_transfer' | 'wire' | 'check' | 'paypal' | 'stripe' | 'other';
  transactionId: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'disputed';
  transactionDate: Date;
  processingDate?: Date;
  settlementDate?: Date;
  processingFees?: number;
  netAmount: number;
  accountingCategory: 'tuition_revenue' | 'subscription_revenue' | 'sponsorship_revenue' | 'service_revenue' | 'licensing_revenue' | 'other_revenue';
  fiscalYear: number;
  fiscalQuarter: number;
  invoiceNumber?: string;
  invoiceUrl?: string;
  receiptUrl?: string;
  notes?: string;
  refund?: RefundDetails;
  createdAt: Date;
  updatedAt: Date;
}

export interface RefundDetails {
  amount: number;
  reason: string;
  processedDate: Date;
  processedBy: string;
}

export interface RevenueAnalytics {
  fiscalYear: number;
  overview: {
    totalRevenue: number;
    totalTransactions: number;
    mrr: number;
    arr: number;
    activeSponsorships: number;
    sponsorshipRevenue: number;
  };
  revenueByCategory: CategoryRevenue[];
  revenueByQuarter: QuarterRevenue[];
  subscriptionMetrics: SubscriptionMetric[];
  participantsByPricing: PricingBreakdown[];
  paymentStats: PaymentStats[];
}

export interface CategoryRevenue {
  _id: string;
  totalRevenue: number;
  count: number;
}

export interface QuarterRevenue {
  _id: number;
  totalRevenue: number;
  transactions: number;
}

export interface SubscriptionMetric {
  _id: string;
  count: number;
  totalMRR: number;
}

export interface PricingBreakdown {
  _id: string;
  count: number;
}

export interface PaymentStats {
  _id: string;
  count: number;
  totalAmount: number;
}

// Equity & Success Fees
export interface EquityAgreement {
  id: string;
  participantId: string;
  teamId?: string;
  projectId?: string;
  cohortId: string;
  equityType: 'common' | 'preferred' | 'safe' | 'revenue-share';
  percentage: number;
  valuationAtEntry?: number;
  valuationCurrency: string;
  revenueSharePercentage?: number;
  revenueShareCap?: number;
  revenueSharePaid?: number;
  vestingSchedule?: {
    totalMonths: number;
    cliffMonths: number;
    vestingStartDate: Date;
  };
  conditions: string[];
  conditionsMet: boolean[];
  signedDate?: Date;
  effectiveDate: Date;
  expirationDate?: Date;
  status: 'draft' | 'pending-signature' | 'active' | 'vested' | 'exercised' | 'expired' | 'terminated';
  agreementDocumentUrl?: string;
  capTableUrl?: string;
  milestones: EquityMilestone[];
  exitEvent?: ExitEvent;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EquityMilestone {
  title: string;
  description: string;
  targetDate?: Date;
  completedDate?: Date;
  equityRelease?: number;
  status: 'pending' | 'completed' | 'missed';
}

export interface ExitEvent {
  type: 'acquisition' | 'ipo' | 'secondary-sale' | 'buyback';
  date: Date;
  valuationAtExit: number;
  techmastersReturn: number;
  multiple: number;
}

// Grants
export interface Grant {
  id: string;
  name: string;
  description: string;
  type: 'milestone-grant' | 'innovation-grant' | 'execution-grant' | 'impact-grant' | 'government-grant' | 'research-grant';
  amount: number;
  currency: string;
  totalBudget: number;
  remainingBudget: number;
  eligibilityCriteria: GrantCriterion[];
  targetStages: ProgramStage[];
  targetCategories?: string[];
  maxApplicationsPerTeam: number;
  applicationStartDate: Date;
  applicationDeadline: Date;
  reviewPeriod: number;
  disbursementDate?: Date;
  applications: string[];
  recipients: GrantRecipient[];
  status: 'draft' | 'open' | 'closed' | 'under-review' | 'completed';
  fundedBy: {
    type: 'internal' | 'government' | 'foundation' | 'corporate' | 'donor';
    name: string;
    organizationId?: string;
  };
  selectionCriteria: {
    innovation: number;
    execution: number;
    impact: number;
    feasibility: number;
    teamStrength: number;
  };
  reviewCommittee?: string[];
  guidelinesUrl?: string;
  applicationFormUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GrantApplication {
  id: string;
  grantId: string;
  teamId: string;
  participantId: string;
  projectId: string;
  cohortId: string;
  requestedAmount: number;
  justification: string;
  proposal: {
    problemStatement: string;
    solution: string;
    impactStatement: string;
    budgetBreakdown: BudgetItem[];
    timeline: GrantTimeline[];
  };
  documents: GrantDocument[];
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected' | 'withdrawn';
  submittedAt?: Date;
  reviews: GrantReview[];
  averageScore?: number;
  decision?: GrantDecision;
  reportingRequirements?: GrantReporting;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetItem {
  category: string;
  amount: number;
  description: string;
}

export interface GrantTimeline {
  milestone: string;
  targetDate: Date;
  deliverable: string;
}

export interface GrantDocument {
  type: 'business-plan' | 'pitch-deck' | 'financial-projection' | 'impact-report' | 'other';
  name: string;
  url: string;
  uploadedAt: Date;
}

export interface GrantReview {
  reviewerId: string;
  scores: {
    innovation: number;
    execution: number;
    impact: number;
    feasibility: number;
    teamStrength: number;
  };
  totalScore: number;
  comments: string;
  recommendation: 'approve' | 'reject' | 'revise';
  reviewedAt: Date;
}

export interface GrantDecision {
  outcome: 'approved' | 'rejected';
  amountApproved?: number;
  conditions?: string[];
  feedback: string;
  decidedBy: string;
  decidedAt: Date;
}

export interface GrantReporting {
  frequency: 'monthly' | 'quarterly' | 'milestone-based' | 'final-only';
  nextReportDue?: Date;
  reports: GrantReport[];
}

export interface GrantReport {
  title: string;
  dueDate: Date;
  submittedDate?: Date;
  reportUrl?: string;
  status: 'pending' | 'submitted' | 'overdue';
}

// Alumni Investment Fund
export interface AlumniFund {
  id: string;
  name: string;
  description: string;
  fundType: 'pooled-investment' | 'angel-syndicate' | 'grant-pool' | 'scholarship-fund';
  targetSize: number;
  currentSize: number;
  currency: string;
  contributors: FundContributor[];
  investmentCriteria: FundCriteria;
  investments: FundInvestment[];
  governance: FundGovernance;
  performance: FundPerformance;
  status: 'fundraising' | 'active' | 'closed' | 'liquidating';
  launchDate: Date;
  fundingDeadline?: Date;
  closureDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface FundContributor {
  alumniId: string;
  contributionAmount: number;
  contributionDate: Date;
  equityShare: number;
  status: 'pledged' | 'paid' | 'defaulted';
}

export interface FundCriteria {
  minStage: ProgramStage;
  categories: string[];
  minTeamSize: number;
  requiresRevenue: boolean;
  requiresMVP: boolean;
}

export interface FundInvestment {
  teamId: string;
  projectId: string;
  participantId: string;
  cohortId: string;
  amountInvested: number;
  investmentDate: Date;
  equityReceived: number;
  valuationAtInvestment: number;
  investmentType: 'equity' | 'convertible-note' | 'safe' | 'grant';
  status: 'active' | 'exited' | 'written-off';
  currentValue?: number;
  exitDetails?: FundExitDetails;
}

export interface FundExitDetails {
  exitDate: Date;
  exitType: 'acquisition' | 'ipo' | 'buyback' | 'secondary-sale';
  exitValue: number;
  returnMultiple: number;
  distributedToContributors: boolean;
}

export interface FundGovernance {
  investmentCommittee: string[];
  votingThreshold: number;
  minInvestmentAmount: number;
  maxInvestmentAmount: number;
  maxInvestmentsPerYear: number;
}

export interface FundPerformance {
  totalInvested: number;
  totalReturned: number;
  activeInvestments: number;
  successfulExits: number;
  failedInvestments: number;
  averageReturnMultiple: number;
  irr?: number;
}

// Global Exchange Program
export interface GlobalPartner {
  id: string;
  organizationName: string;
  country: string;
  city: string;
  region: 'Africa' | 'Asia' | 'Europe' | 'North America' | 'South America' | 'Middle East' | 'Oceania';
  organizationType: 'university' | 'incubator' | 'accelerator' | 'innovation-hub' | 'government' | 'corporate';
  primaryContact: {
    name: string;
    email: string;
    phone?: string;
    position: string;
  };
  website?: string;
  partnershipType: 'exchange-program' | 'dual-cohort' | 'mentor-sharing' | 'resource-sharing' | 'joint-demo-day' | 'curriculum-license';
  status: 'prospective' | 'negotiating' | 'active' | 'inactive' | 'completed';
  agreementStartDate?: Date;
  agreementEndDate?: Date;
  agreementDocumentUrl?: string;
  capacity: {
    maxParticipantsPerYear: number;
    maxMentorsShared: number;
  };
  focusAreas: string[];
  metrics: {
    participantsExchanged: number;
    mentorsShared: number;
    jointProjects: number;
    eventsHosted: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ExchangeProgram {
  id: string;
  name: string;
  description: string;
  programType: 'outbound' | 'inbound' | 'virtual-exchange';
  partnerId: string;
  hostCountry: string;
  hostCity: string;
  cohortId?: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  applicationDeadline: Date;
  participants: ExchangeParticipant[];
  maxParticipants: number;
  activities: ExchangeActivity[];
  logistics: {
    accommodationProvided: boolean;
    travelStipendProvided: boolean;
    visaSupport: boolean;
    localTransportation: boolean;
  };
  costs: {
    programFee: number;
    scholarshipsAvailable: number;
    travelBudget?: number;
    accommodationBudget?: number;
    currency: string;
  };
  learningOutcomes: string[];
  status: 'planning' | 'open-applications' | 'selection' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  outcomes?: ExchangeOutcomes;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExchangeParticipant {
  userId: string;
  cohortId: string;
  status: 'applied' | 'accepted' | 'confirmed' | 'completed' | 'withdrawn';
  appliedAt: Date;
  acceptedAt?: Date;
  departureDate?: Date;
  returnDate?: Date;
  completionReport?: string;
}

export interface ExchangeActivity {
  type: 'workshop' | 'site-visit' | 'networking' | 'mentor-session' | 'hackathon' | 'cultural';
  title: string;
  date?: Date;
  description?: string;
}

export interface ExchangeOutcomes {
  participantsCompleted: number;
  projectsCreated: number;
  partnershipsFormed: number;
  averageSatisfaction: number;
  keyLearnings: string[];
}

export interface InternationalEvent {
  id: string;
  name: string;
  description: string;
  eventType: 'global-summit' | 'regional-meetup' | 'virtual-conference' | 'hackathon' | 'demo-day' | 'alumni-reunion';
  format: 'virtual' | 'in-person' | 'hybrid';
  country?: string;
  city?: string;
  venue?: string;
  virtualPlatform?: string;
  startDate: Date;
  endDate: Date;
  timezone: string;
  expectedAttendees: number;
  registeredAttendees: number;
  attendees: EventAttendee[];
  countriesRepresented: string[];
  agenda: EventAgendaItem[];
  organizingPartners: string[];
  sponsors?: EventSponsor[];
  outcomes?: EventOutcomes;
  registrationUrl?: string;
  registrationFee?: number;
  currency?: string;
  status: 'planning' | 'open-registration' | 'closed-registration' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface EventAttendee {
  userId: string;
  userType: 'participant' | 'alumni' | 'mentor' | 'partner' | 'guest';
  cohortId?: string;
  country: string;
  registeredAt: Date;
  attended: boolean;
}

export interface EventAgendaItem {
  time: string;
  activity: string;
  speaker?: string;
  speakerOrg?: string;
  description?: string;
}

export interface EventSponsor {
  organizationName: string;
  sponsorshipLevel: 'title' | 'platinum' | 'gold' | 'silver' | 'bronze';
  contribution: number;
}

export interface EventOutcomes {
  totalAttendance: number;
  networksFormed: number;
  dealsInitiated: number;
  mediaReach: number;
  recordings: string[];
}

// ============================================
// TECHMASTERS FESTIVAL TYPES
// ============================================

export interface TechMastersFestival {
  _id: string;
  name: string;
  edition: number;
  year: number;
  theme: string;
  tagline: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  format: 'virtual' | 'in-person' | 'hybrid';
  venue?: FestivalVenue;
  virtualPlatform?: FestivalVirtualPlatform;
  cohorts: FestivalCohortParticipation[];
  tracks: FestivalTrack[];
  showcases: FestivalShowcase[];
  attendees: FestivalAttendees;
  keynoteSpeakers: FestivalSpeaker[];
  sessions: FestivalSession[];
  competitions: FestivalCompetition[];
  sponsors: FestivalSponsor[];
  networking: FestivalNetworking;
  media: FestivalMedia;
  outcomes: FestivalOutcomes;
  budget: FestivalBudget;
  registration: FestivalRegistration;
  status: 'planning' | 'announced' | 'registration-open' | 'sold-out' | 'in-progress' | 'completed' | 'cancelled';
  postEvent?: FestivalPostEvent;
  createdAt: Date;
  updatedAt: Date;
}

export interface FestivalVenue {
  name: string;
  address: string;
  city: string;
  country: string;
  capacity: number;
}

export interface FestivalVirtualPlatform {
  platform: string;
  url: string;
  capacity: number;
}

export interface FestivalCohortParticipation {
  cohortId: string;
  showcaseSlots: number;
  teamsShowcasing: string[];
}

export interface FestivalTrack {
  name: string;
  description: string;
  focusAreas: string[];
  teamsCount: number;
}

export interface FestivalShowcase {
  type: 'main-stage-pitch' | 'startup-expo' | 'innovation-lab' | 'poster-session' | 'demo-booth';
  title: string;
  teamsParticipating: FestivalTeamParticipation[];
}

export interface FestivalTeamParticipation {
  teamId: string;
  projectId: string;
  cohortId: string;
  boothNumber?: string;
  pitchSlot?: Date;
  awards?: string[];
}

export interface FestivalAttendees {
  totalRegistered: number;
  totalAttended: number;
  breakdown: {
    participants: number;
    alumni: number;
    mentors: number;
    investors: number;
    corporatePartners: number;
    media: number;
    government: number;
    publicGuest: number;
  };
  internationalAttendees: number;
  countriesRepresented: string[];
}

export interface FestivalSpeaker {
  name: string;
  title: string;
  organization: string;
  biography: string;
  photo?: string;
  sessionTitle: string;
  sessionTime: Date;
}

export interface FestivalSession {
  type: 'panel' | 'workshop' | 'masterclass' | 'fireside-chat' | 'keynote';
  title: string;
  description: string;
  speakers: {
    name: string;
    organization: string;
    role: string;
  }[];
  startTime: Date;
  endTime: Date;
  venue?: string;
  capacity?: number;
  registrations?: number;
}

export interface FestivalCompetition {
  name: string;
  category: string;
  prize: number;
  currency: string;
  judges: {
    name: string;
    organization: string;
    expertise: string;
  }[];
  finalists: string[];
  winner?: string;
  runnerUp?: string;
  judgingCriteria: {
    criterion: string;
    weight: number;
  }[];
}

export interface FestivalSponsor {
  organizationName: string;
  logo?: string;
  tier: 'title' | 'platinum' | 'gold' | 'silver' | 'bronze' | 'inkind';
  contribution: number;
  benefits: string[];
}

export interface FestivalNetworking {
  investorMeetings: number;
  corporateConnections: number;
  collaborationsFormed: number;
  hiringLeads: number;
}

export interface FestivalMedia {
  pressReleases: number;
  mediaOutlets: string[];
  socialMediaReach: number;
  eventHashtag: string;
  livestreamViews?: number;
  recordings: {
    title: string;
    url: string;
    views: number;
  }[];
}

export interface FestivalOutcomes {
  fundingCommitments: number;
  pilotProjectsInitiated: number;
  partnershipsFormed: number;
  jobOffersExtended: number;
  mediaImpressions: number;
  attendeeSatisfaction: number;
  npsScore?: number;
}

export interface FestivalBudget {
  totalBudget: number;
  sponsorshipRevenue: number;
  ticketRevenue: number;
  expenses: {
    venue: number;
    catering: number;
    technology: number;
    marketing: number;
    production: number;
    other: number;
  };
  profitLoss: number;
  currency: string;
}

export interface FestivalRegistration {
  ticketPrice: number;
  earlyBirdPrice?: number;
  studentPrice?: number;
  vipPrice?: number;
  registrationDeadline: Date;
  registrationUrl: string;
  capacity: number;
}

export interface FestivalPostEvent {
  highlightsVideo?: string;
  photoGallery?: string[];
  pressKit?: string;
  impactReport?: string;
  attendeeFeedback: {
    totalResponses: number;
    averageRating: number;
    testimonials: {
      attendeeName: string;
      attendeeType: string;
      quote: string;
    }[];
  };
}

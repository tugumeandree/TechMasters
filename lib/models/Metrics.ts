import mongoose, { Schema, model, models } from 'mongoose';

const KPIMetricSchema = new Schema({
  // Scope
  level: {
    type: String,
    enum: ['program', 'cohort', 'participant', 'team', 'project'],
    required: true
  },
  entityId: Schema.Types.ObjectId, // ID of cohort, participant, team, or project
  cohortId: {
    type: Schema.Types.ObjectId,
    ref: 'Cohort'
  },
  // Metric details
  category: {
    type: String,
    enum: ['engagement', 'progress', 'validation', 'outcomes', 'financial', 'quality'],
    required: true
  },
  metricName: {
    type: String,
    required: true
  },
  value: Schema.Types.Mixed, // Can be number, string, object
  unit: String, // e.g., 'percentage', 'count', 'dollars', 'hours'
  // Time period
  period: {
    start: Date,
    end: Date
  },
  // Benchmarks
  target: Number,
  previousValue: Number,
  industryBenchmark: Number,
  // Metadata
  calculatedAt: {
    type: Date,
    default: Date.now
  },
  calculationMethod: String,
  dataSource: String
}, {
  timestamps: true
});

// Program-level aggregate metrics
const ProgramMetricsSchema = new Schema({
  cohortId: {
    type: Schema.Types.ObjectId,
    ref: 'Cohort'
  },
  periodStart: Date,
  periodEnd: Date,
  
  // Engagement metrics
  engagement: {
    totalParticipants: Number,
    activeParticipants: Number,
    avgSessionAttendance: Number,
    mentorEngagementRate: Number,
    resourceUsageRate: Number
  },
  
  // Progress metrics
  progress: {
    participantsByStage: {
      research: Number,
      skilling: Number,
      development: Number,
      business: Number
    },
    avgTimePerStage: {
      research: Number,
      skilling: Number,
      development: Number,
      business: Number
    },
    completionRate: Number,
    dropoutRate: Number,
    stageProgression: Number // avg stages advanced
  },
  
  // Validation metrics
  validation: {
    totalInterviews: Number,
    avgInterviewsPerTeam: Number,
    totalUserTests: Number,
    pilotCustomers: Number,
    avgValidationScore: Number
  },
  
  // Outcomes metrics
  outcomes: {
    projectsLaunched: Number,
    fundingRaised: Number,
    revenueGenerated: Number,
    customersAcquired: Number,
    jobsCreated: Number,
    participantsHired: Number
  },
  
  // Quality metrics
  quality: {
    avgMentorRating: Number,
    avgProgramSatisfaction: Number,
    avgProjectQuality: Number,
    gateReviewPassRate: Number
  },
  
  // Team metrics
  teams: {
    totalTeams: Number,
    avgTeamSize: Number,
    teamsFormed: Number
  },
  
  // Partner metrics
  partnerships: {
    activePartners: Number,
    challengesPosted: Number,
    pilotsCompleted: Number,
    participantsHired: Number
  }
}, {
  timestamps: true
});

// Participant-level metrics
const ParticipantMetricsSchema = new Schema({
  participantId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cohortId: {
    type: Schema.Types.ObjectId,
    ref: 'Cohort'
  },
  
  // Engagement
  engagement: {
    sessionsAttended: Number,
    totalSessions: Number,
    attendanceRate: Number,
    mentorSessionsCompleted: Number,
    resourcesAccessed: Number,
    lastActive: Date
  },
  
  // Progress
  progress: {
    currentStage: String,
    stagesCompleted: Number,
    daysInProgram: Number,
    outputsCompleted: Number,
    outcomesAchieved: Number
  },
  
  // Validation
  validation: {
    interviewsConducted: Number,
    userTestsCompleted: Number,
    validationScore: Number
  },
  
  // Project outcomes
  outcomes: {
    projectStatus: String,
    funding: Number,
    customers: Number,
    revenue: Number,
    teamRole: String
  },
  
  // Skills & growth
  skills: {
    technicalSkillsGained: [String],
    businessSkillsGained: [String],
    certificationsEarned: [String],
    mentorRating: Number
  },
  
  // Networking
  network: {
    mentorConnections: Number,
    peerConnections: Number,
    partnerConnections: Number,
    alumniConnections: Number
  }
}, {
  timestamps: true
});

// Export models
export const KPIMetric = models.KPIMetric || model('KPIMetric', KPIMetricSchema);
export const ProgramMetrics = models.ProgramMetrics || model('ProgramMetrics', ProgramMetricsSchema);
export const ParticipantMetrics = models.ParticipantMetrics || model('ParticipantMetrics', ParticipantMetricsSchema);

import mongoose, { Schema, model, models } from 'mongoose';

const GrantSchema = new Schema({
  // Grant details
  name: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['milestone-grant', 'innovation-grant', 'execution-grant', 'impact-grant'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  // Eligibility
  eligibilityCriteria: [{
    criterion: String,
    required: Boolean
  }],
  minStage: {
    type: String,
    enum: ['research', 'skilling', 'development', 'business']
  },
  maxRecipients: Number,
  // Application period
  applicationStart: Date,
  applicationEnd: Date,
  // Application requirements
  requiredDocuments: [String],
  applicationQuestions: [{
    question: String,
    type: String, // 'text', 'file', 'number'
    required: Boolean
  }],
  // Recipients
  applications: [{
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team'
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project'
    },
    appliedAt: Date,
    responses: Schema.Types.Mixed,
    documents: [String],
    status: {
      type: String,
      enum: ['submitted', 'under-review', 'approved', 'rejected'],
      default: 'submitted'
    },
    reviewNotes: String,
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: Date
  }],
  recipients: [{
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team'
    },
    awardedAt: Date,
    amountAwarded: Number,
    disbursed: Boolean,
    disbursedAt: Date
  }],
  // Status
  status: {
    type: String,
    enum: ['draft', 'open', 'closed', 'completed'],
    default: 'draft'
  },
  // Funding source
  fundedBy: String,
  totalBudget: Number,
  remainingBudget: Number
}, {
  timestamps: true
});

const AchievementSchema = new Schema({
  // Achievement definition
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  category: {
    type: String,
    enum: ['milestone', 'skill', 'validation', 'collaboration', 'leadership', 'innovation', 'impact'],
    required: true
  },
  icon: String, // URL or emoji
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  points: {
    type: Number,
    default: 10
  },
  // Unlock criteria
  criteria: {
    type: String,
    required: true
  },
  criteriaDetails: Schema.Types.Mixed,
  // Stage-specific
  stage: {
    type: String,
    enum: ['research', 'skilling', 'development', 'business', 'any']
  },
  // Statistics
  stats: {
    totalUnlocked: {
      type: Number,
      default: 0
    },
    unlockRate: Number // percentage of participants
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const ParticipantAchievementSchema = new Schema({
  participantId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  achievementId: {
    type: Schema.Types.ObjectId,
    ref: 'Achievement',
    required: true
  },
  unlockedAt: {
    type: Date,
    default: Date.now
  },
  context: String // What triggered the achievement
});

const LeaderboardSchema = new Schema({
  cohortId: {
    type: Schema.Types.ObjectId,
    ref: 'Cohort'
  },
  type: {
    type: String,
    enum: ['overall', 'stage', 'validation', 'collaboration', 'innovation'],
    required: true
  },
  period: {
    type: String,
    enum: ['all-time', 'monthly', 'weekly'],
    default: 'all-time'
  },
  periodStart: Date,
  periodEnd: Date,
  // Rankings
  rankings: [{
    participantId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    rank: Number,
    score: Number,
    achievements: Number,
    milestones: Number,
    metadata: Schema.Types.Mixed
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
GrantSchema.index({ status: 1, applicationEnd: 1 });
AchievementSchema.index({ category: 1, rarity: 1 });
ParticipantAchievementSchema.index({ participantId: 1, achievementId: 1 }, { unique: true });
LeaderboardSchema.index({ cohortId: 1, type: 1, period: 1 });

// Export models
export const Grant = models.Grant || model('Grant', GrantSchema);
export const Achievement = models.Achievement || model('Achievement', AchievementSchema);
export const ParticipantAchievement = models.ParticipantAchievement || model('ParticipantAchievement', ParticipantAchievementSchema);
export const Leaderboard = models.Leaderboard || model('Leaderboard', LeaderboardSchema);

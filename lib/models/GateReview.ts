import mongoose, { Schema, model, models } from 'mongoose';

const GateReviewSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    index: true
  },
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  stage: {
    type: String,
    enum: ['research', 'skilling', 'development', 'business'],
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'submitted', 'under-review', 'approved', 'rejected', 'revision-requested'],
    default: 'scheduled'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  submittedAt: Date,
  reviewedAt: Date,
  // Submission by team
  submission: {
    presentationUrl: String,
    demoUrl: String,
    documentation: [String],
    keyAchievements: [String],
    challenges: [String],
    nextStepsPlan: String,
    additionalNotes: String
  },
  // Review criteria scores (0-10)
  criteria: {
    problemValidation: {
      score: Number,
      comments: String
    },
    technicalExecution: {
      score: Number,
      comments: String
    },
    businessViability: {
      score: Number,
      comments: String
    },
    teamReadiness: {
      score: Number,
      comments: String
    },
    overallScore: Number
  },
  // Panel review
  reviewPanel: [{
    reviewerId: { type: Schema.Types.ObjectId, ref: 'User' },
    role: String, // 'technical-mentor', 'industry-mentor', 'investor-mentor', 'admin'
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending'
    },
    recommendation: {
      type: String,
      enum: ['approve', 'reject', 'request-revision']
    },
    feedback: String,
    completedAt: Date
  }],
  // Final decision
  decision: {
    outcome: {
      type: String,
      enum: ['approved', 'rejected', 'revision-requested']
    },
    feedback: String,
    actionItems: [String],
    decisionMaker: { type: Schema.Types.ObjectId, ref: 'User' },
    decisionDate: Date
  },
  // If revision requested
  revisionDeadline: Date,
  revisionCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
GateReviewSchema.index({ projectId: 1, stage: 1 });
GateReviewSchema.index({ teamId: 1, status: 1 });
GateReviewSchema.index({ status: 1, scheduledDate: 1 });
GateReviewSchema.index({ 'reviewPanel.reviewerId': 1 });

export default models.GateReview || model('GateReview', GateReviewSchema);

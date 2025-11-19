import mongoose, { Schema, model, models } from 'mongoose';

const ProjectSchema = new Schema({
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  category: String,
  stage: {
    type: String,
    enum: ['research', 'skilling', 'development', 'business'],
    default: 'research',
    index: true
  },
  progress: {
    research: { type: Number, default: 0 },
    skilling: { type: Number, default: 0 },
    development: { type: Number, default: 0 },
    business: { type: Number, default: 0 }
  },
  milestones: [{
    id: String,
    title: String,
    description: String,
    dueDate: Date,
    completed: { type: Boolean, default: false },
    stage: String,
    completedAt: Date,
    outputType: {
      type: String,
      enum: ['deliverable', 'artifact', 'competency']
    },
    outcomeType: {
      type: String,
      enum: ['mindset', 'skill', 'credential', 'network']
    }
  }],
  outputs: [{
    id: String,
    stage: String,
    title: String,
    description: String,
    type: {
      type: String,
      enum: ['deliverable', 'artifact', 'competency', 'documentation']
    },
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed'],
      default: 'not-started'
    },
    completedAt: Date,
    fileUrl: String,
    notes: String
  }],
  outcomes: [{
    id: String,
    stage: String,
    title: String,
    description: String,
    category: {
      type: String,
      enum: ['mindset', 'skill', 'credential', 'network', 'leadership', 'career']
    },
    achieved: { type: Boolean, default: false },
    achievedAt: Date,
    evidence: String
  }],
  pitchDeck: String,
  demoUrl: String,
  repositoryUrl: String,
  metrics: {
    users: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    growth: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes
ProjectSchema.index({ teamId: 1, stage: 1 });
ProjectSchema.index({ category: 1 });

export default models.Project || model('Project', ProjectSchema);

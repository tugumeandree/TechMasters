import mongoose, { Schema, model, models } from 'mongoose';

const ProjectCanvasSchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    unique: true
  },
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  // Core sections that evolve through stages
  sections: {
    // Problem & Opportunity
    problem: {
      statement: String,
      targetCustomer: String,
      painPoints: [String],
      marketSize: String,
      lastUpdated: Date,
      stage: String // Which stage this was last updated in
    },
    // Solution
    solution: {
      description: String,
      keyFeatures: [String],
      uniqueValue: String,
      differentiators: [String],
      lastUpdated: Date,
      stage: String
    },
    // Customer & Market
    market: {
      targetMarket: String,
      customerSegments: [String],
      competitors: [{
        name: String,
        strength: String,
        weakness: String
      }],
      marketTrends: [String],
      lastUpdated: Date,
      stage: String
    },
    // Business Model
    businessModel: {
      revenueStreams: [String],
      pricing: String,
      costStructure: String,
      keyMetrics: [{
        metric: String,
        target: String,
        current: String
      }],
      lastUpdated: Date,
      stage: String
    },
    // Product/Technical
    product: {
      architecture: String,
      technologyStack: [String],
      developmentStatus: String,
      roadmap: [{
        milestone: String,
        targetDate: Date,
        status: String
      }],
      lastUpdated: Date,
      stage: String
    },
    // Traction & Validation
    traction: {
      customers: Number,
      revenue: Number,
      users: Number,
      validationActivities: [{
        type: String,
        date: Date,
        result: String
      }],
      testimonials: [String],
      lastUpdated: Date,
      stage: String
    },
    // Team
    team: {
      members: [{
        name: String,
        role: String,
        skills: [String]
      }],
      advisors: [String],
      gaps: [String],
      lastUpdated: Date,
      stage: String
    },
    // Go-to-Market
    goToMarket: {
      channels: [String],
      partnerships: [String],
      marketingStrategy: String,
      salesStrategy: String,
      lastUpdated: Date,
      stage: String
    },
    // Funding & Resources
    funding: {
      needAmount: Number,
      currentRaised: Number,
      useOfFunds: [String],
      fundingSources: [String],
      runway: String,
      lastUpdated: Date,
      stage: String
    },
    // Risks & Assumptions
    risks: {
      keyRisks: [{
        risk: String,
        mitigation: String,
        priority: String
      }],
      assumptions: [{
        assumption: String,
        validated: Boolean,
        validationMethod: String
      }],
      lastUpdated: Date,
      stage: String
    }
  },
  // Version history
  versions: [{
    versionNumber: Number,
    stage: String,
    savedAt: Date,
    savedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    snapshot: Schema.Types.Mixed, // Full canvas snapshot
    changesSummary: String
  }],
  // Current version
  currentVersion: {
    type: Number,
    default: 1
  },
  // Collaboration
  lastEditedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  lastEditedAt: Date
}, {
  timestamps: true
});

// Indexes
ProjectCanvasSchema.index({ projectId: 1 });
ProjectCanvasSchema.index({ teamId: 1 });

export default models.ProjectCanvas || model('ProjectCanvas', ProjectCanvasSchema);

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGrant extends Document {
  // Grant metadata
  name: string;
  description: string;
  type: 'milestone-grant' | 'innovation-grant' | 'execution-grant' | 'impact-grant' | 'government-grant' | 'research-grant';
  
  // Funding
  amount: number;
  currency: string;
  totalBudget: number;
  remainingBudget: number;
  
  // Eligibility
  eligibilityCriteria: {
    criterion: string;
    required: boolean;
  }[];
  
  // Target audience
  targetStages: ('research' | 'skilling' | 'development' | 'business')[];
  targetCategories?: string[]; // e.g., ['MedTech', 'CleanTech']
  maxApplicationsPerTeam: number;
  
  // Timeline
  applicationStartDate: Date;
  applicationDeadline: Date;
  reviewPeriod: number; // days
  disbursementDate?: Date;
  
  // Application tracking
  applications: mongoose.Types.ObjectId[];
  recipients: {
    teamId: mongoose.Types.ObjectId;
    participantId: mongoose.Types.ObjectId;
    projectId: mongoose.Types.ObjectId;
    amountAwarded: number;
    awardedAt: Date;
    disbursed: boolean;
    disbursedAt?: Date;
    transactionId?: string;
    milestones?: {
      title: string;
      dueDate: Date;
      completedDate?: Date;
      reportUrl?: string;
      status: 'pending' | 'completed' | 'overdue';
    }[];
  }[];
  
  // Status
  status: 'draft' | 'open' | 'closed' | 'under-review' | 'completed';
  
  // Grant provider
  fundedBy: {
    type: 'internal' | 'government' | 'foundation' | 'corporate' | 'donor';
    name: string;
    organizationId?: mongoose.Types.ObjectId;
  };
  
  // Selection criteria & process
  selectionCriteria: {
    innovation: number; // weight
    execution: number;
    impact: number;
    feasibility: number;
    teamStrength: number;
  };
  
  reviewCommittee?: mongoose.Types.ObjectId[];
  
  // Documentation
  guidelinesUrl?: string;
  applicationFormUrl?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface IGrantApplication extends Document {
  // Application details
  grantId: mongoose.Types.ObjectId;
  teamId: mongoose.Types.ObjectId;
  participantId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  cohortId: mongoose.Types.ObjectId;
  
  // Requested amount
  requestedAmount: number;
  justification: string;
  
  // Proposal
  proposal: {
    problemStatement: string;
    solution: string;
    impactStatement: string;
    budgetBreakdown: {
      category: string;
      amount: number;
      description: string;
    }[];
    timeline: {
      milestone: string;
      targetDate: Date;
      deliverable: string;
    }[];
  };
  
  // Supporting documents
  documents: {
    type: 'business-plan' | 'pitch-deck' | 'financial-projection' | 'impact-report' | 'other';
    name: string;
    url: string;
    uploadedAt: Date;
  }[];
  
  // Status
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected' | 'withdrawn';
  submittedAt?: Date;
  
  // Review
  reviews: {
    reviewerId: mongoose.Types.ObjectId;
    scores: {
      innovation: number; // 0-10
      execution: number;
      impact: number;
      feasibility: number;
      teamStrength: number;
    };
    totalScore: number;
    comments: string;
    recommendation: 'approve' | 'reject' | 'revise';
    reviewedAt: Date;
  }[];
  
  averageScore?: number;
  
  // Decision
  decision?: {
    outcome: 'approved' | 'rejected';
    amountApproved?: number;
    conditions?: string[];
    feedback: string;
    decidedBy: mongoose.Types.ObjectId;
    decidedAt: Date;
  };
  
  // Post-award tracking
  reportingRequirements?: {
    frequency: 'monthly' | 'quarterly' | 'milestone-based' | 'final-only';
    nextReportDue?: Date;
    reports: {
      title: string;
      dueDate: Date;
      submittedDate?: Date;
      reportUrl?: string;
      status: 'pending' | 'submitted' | 'overdue';
    }[];
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const GrantSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['milestone-grant', 'innovation-grant', 'execution-grant', 'impact-grant', 'government-grant', 'research-grant'],
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
  totalBudget: {
    type: Number,
    required: true
  },
  remainingBudget: Number,
  
  eligibilityCriteria: [{
    criterion: String,
    required: Boolean
  }],
  
  targetStages: [{
    type: String,
    enum: ['research', 'skilling', 'development', 'business']
  }],
  targetCategories: [String],
  maxApplicationsPerTeam: {
    type: Number,
    default: 1
  },
  
  applicationStartDate: {
    type: Date,
    required: true
  },
  applicationDeadline: {
    type: Date,
    required: true
  },
  reviewPeriod: {
    type: Number,
    default: 14
  },
  disbursementDate: Date,
  
  applications: [{
    type: Schema.Types.ObjectId,
    ref: 'GrantApplication'
  }],
  
  recipients: [{
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team'
    },
    participantId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project'
    },
    amountAwarded: Number,
    awardedAt: Date,
    disbursed: Boolean,
    disbursedAt: Date,
    transactionId: String,
    milestones: [{
      title: String,
      dueDate: Date,
      completedDate: Date,
      reportUrl: String,
      status: {
        type: String,
        enum: ['pending', 'completed', 'overdue'],
        default: 'pending'
      }
    }]
  }],
  
  status: {
    type: String,
    enum: ['draft', 'open', 'closed', 'under-review', 'completed'],
    default: 'draft'
  },
  
  fundedBy: {
    type: {
      type: String,
      enum: ['internal', 'government', 'foundation', 'corporate', 'donor'],
      required: true
    },
    name: String,
    organizationId: Schema.Types.ObjectId
  },
  
  selectionCriteria: {
    innovation: Number,
    execution: Number,
    impact: Number,
    feasibility: Number,
    teamStrength: Number
  },
  
  reviewCommittee: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  guidelinesUrl: String,
  applicationFormUrl: String
}, {
  timestamps: true
});

const GrantApplicationSchema: Schema = new Schema({
  grantId: {
    type: Schema.Types.ObjectId,
    ref: 'Grant',
    required: true
  },
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  participantId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  cohortId: {
    type: Schema.Types.ObjectId,
    ref: 'Cohort',
    required: true
  },
  
  requestedAmount: {
    type: Number,
    required: true
  },
  justification: String,
  
  proposal: {
    problemStatement: String,
    solution: String,
    impactStatement: String,
    budgetBreakdown: [{
      category: String,
      amount: Number,
      description: String
    }],
    timeline: [{
      milestone: String,
      targetDate: Date,
      deliverable: String
    }]
  },
  
  documents: [{
    type: {
      type: String,
      enum: ['business-plan', 'pitch-deck', 'financial-projection', 'impact-report', 'other']
    },
    name: String,
    url: String,
    uploadedAt: Date
  }],
  
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under-review', 'approved', 'rejected', 'withdrawn'],
    default: 'draft'
  },
  submittedAt: Date,
  
  reviews: [{
    reviewerId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    scores: {
      innovation: Number,
      execution: Number,
      impact: Number,
      feasibility: Number,
      teamStrength: Number
    },
    totalScore: Number,
    comments: String,
    recommendation: {
      type: String,
      enum: ['approve', 'reject', 'revise']
    },
    reviewedAt: Date
  }],
  
  averageScore: Number,
  
  decision: {
    outcome: {
      type: String,
      enum: ['approved', 'rejected']
    },
    amountApproved: Number,
    conditions: [String],
    feedback: String,
    decidedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    decidedAt: Date
  },
  
  reportingRequirements: {
    frequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'milestone-based', 'final-only']
    },
    nextReportDue: Date,
    reports: [{
      title: String,
      dueDate: Date,
      submittedDate: Date,
      reportUrl: String,
      status: {
        type: String,
        enum: ['pending', 'submitted', 'overdue'],
        default: 'pending'
      }
    }]
  }
}, {
  timestamps: true
});

// Indexes
GrantSchema.index({ status: 1, applicationDeadline: 1 });
GrantSchema.index({ type: 1, status: 1 });
GrantSchema.index({ 'fundedBy.type': 1 });

GrantApplicationSchema.index({ grantId: 1, status: 1 });
GrantApplicationSchema.index({ teamId: 1 });
GrantApplicationSchema.index({ participantId: 1 });
GrantApplicationSchema.index({ status: 1, submittedAt: 1 });

const Grant: Model<IGrant> = mongoose.models.Grant || mongoose.model<IGrant>('Grant', GrantSchema);
const GrantApplication: Model<IGrantApplication> = mongoose.models.GrantApplication || mongoose.model<IGrantApplication>('GrantApplication', GrantApplicationSchema);

export { Grant, GrantApplication };
export default Grant;

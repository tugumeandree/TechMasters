import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAlumniFund extends Document {
  // Fund metadata
  name: string;
  description: string;
  fundType: 'pooled-investment' | 'angel-syndicate' | 'grant-pool' | 'scholarship-fund';
  
  // Fund size
  targetSize: number;
  currentSize: number;
  currency: string;
  
  // Contributors (alumni who invest)
  contributors: {
    alumniId: mongoose.Types.ObjectId;
    contributionAmount: number;
    contributionDate: Date;
    equityShare: number; // % of fund ownership
    status: 'pledged' | 'paid' | 'defaulted';
  }[];
  
  // Investment criteria
  investmentCriteria: {
    minStage: 'research' | 'skilling' | 'development' | 'business';
    categories: string[]; // e.g., ['MedTech', 'FinTech']
    minTeamSize: number;
    requiresRevenue: boolean;
    requiresMVP: boolean;
  };
  
  // Investments made
  investments: {
    teamId: mongoose.Types.ObjectId;
    projectId: mongoose.Types.ObjectId;
    participantId: mongoose.Types.ObjectId;
    cohortId: mongoose.Types.ObjectId;
    amountInvested: number;
    investmentDate: Date;
    equityReceived: number; // % equity in venture
    valuationAtInvestment: number;
    investmentType: 'equity' | 'convertible-note' | 'safe' | 'grant';
    status: 'active' | 'exited' | 'written-off';
    currentValue?: number;
    exitDetails?: {
      exitDate: Date;
      exitType: 'acquisition' | 'ipo' | 'buyback' | 'secondary-sale';
      exitValue: number;
      returnMultiple: number;
      distributedToContributors: boolean;
    };
  }[];
  
  // Fund governance
  governance: {
    investmentCommittee: mongoose.Types.ObjectId[]; // Alumni who decide
    votingThreshold: number; // % required to approve investment
    minInvestmentAmount: number;
    maxInvestmentAmount: number;
    maxInvestmentsPerYear: number;
  };
  
  // Performance tracking
  performance: {
    totalInvested: number;
    totalReturned: number;
    activeInvestments: number;
    successfulExits: number;
    failedInvestments: number;
    averageReturnMultiple: number;
    irr?: number; // Internal Rate of Return
  };
  
  // Fund status
  status: 'fundraising' | 'active' | 'closed' | 'liquidating';
  
  // Key dates
  launchDate: Date;
  fundingDeadline?: Date;
  closureDate?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface IContributionPledge extends Document {
  fundId: mongoose.Types.ObjectId;
  alumniId: mongoose.Types.ObjectId;
  pledgedAmount: number;
  paidAmount: number;
  paymentSchedule: {
    installment: number;
    amount: number;
    dueDate: Date;
    paidDate?: Date;
    status: 'pending' | 'paid' | 'overdue';
  }[];
  status: 'pending' | 'confirmed' | 'fulfilled' | 'cancelled';
  pledgedAt: Date;
  fulfilledAt?: Date;
}

const AlumniFundSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  fundType: {
    type: String,
    enum: ['pooled-investment', 'angel-syndicate', 'grant-pool', 'scholarship-fund'],
    required: true
  },
  
  targetSize: {
    type: Number,
    required: true
  },
  currentSize: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  
  contributors: [{
    alumniId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    contributionAmount: Number,
    contributionDate: Date,
    equityShare: Number,
    status: {
      type: String,
      enum: ['pledged', 'paid', 'defaulted'],
      default: 'pledged'
    }
  }],
  
  investmentCriteria: {
    minStage: {
      type: String,
      enum: ['research', 'skilling', 'development', 'business']
    },
    categories: [String],
    minTeamSize: Number,
    requiresRevenue: Boolean,
    requiresMVP: Boolean
  },
  
  investments: [{
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team'
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project'
    },
    participantId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    cohortId: {
      type: Schema.Types.ObjectId,
      ref: 'Cohort'
    },
    amountInvested: Number,
    investmentDate: Date,
    equityReceived: Number,
    valuationAtInvestment: Number,
    investmentType: {
      type: String,
      enum: ['equity', 'convertible-note', 'safe', 'grant']
    },
    status: {
      type: String,
      enum: ['active', 'exited', 'written-off'],
      default: 'active'
    },
    currentValue: Number,
    exitDetails: {
      exitDate: Date,
      exitType: {
        type: String,
        enum: ['acquisition', 'ipo', 'buyback', 'secondary-sale']
      },
      exitValue: Number,
      returnMultiple: Number,
      distributedToContributors: Boolean
    }
  }],
  
  governance: {
    investmentCommittee: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    votingThreshold: {
      type: Number,
      default: 50
    },
    minInvestmentAmount: Number,
    maxInvestmentAmount: Number,
    maxInvestmentsPerYear: Number
  },
  
  performance: {
    totalInvested: {
      type: Number,
      default: 0
    },
    totalReturned: {
      type: Number,
      default: 0
    },
    activeInvestments: {
      type: Number,
      default: 0
    },
    successfulExits: {
      type: Number,
      default: 0
    },
    failedInvestments: {
      type: Number,
      default: 0
    },
    averageReturnMultiple: {
      type: Number,
      default: 0
    },
    irr: Number
  },
  
  status: {
    type: String,
    enum: ['fundraising', 'active', 'closed', 'liquidating'],
    default: 'fundraising'
  },
  
  launchDate: {
    type: Date,
    required: true
  },
  fundingDeadline: Date,
  closureDate: Date
}, {
  timestamps: true
});

const ContributionPledgeSchema: Schema = new Schema({
  fundId: {
    type: Schema.Types.ObjectId,
    ref: 'AlumniFund',
    required: true
  },
  alumniId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pledgedAmount: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  paymentSchedule: [{
    installment: Number,
    amount: Number,
    dueDate: Date,
    paidDate: Date,
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue'],
      default: 'pending'
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'fulfilled', 'cancelled'],
    default: 'pending'
  },
  pledgedAt: {
    type: Date,
    default: Date.now
  },
  fulfilledAt: Date
}, {
  timestamps: true
});

// Indexes
AlumniFundSchema.index({ status: 1 });
AlumniFundSchema.index({ fundType: 1, status: 1 });
ContributionPledgeSchema.index({ fundId: 1, alumniId: 1 });
ContributionPledgeSchema.index({ status: 1 });

const AlumniFund: Model<IAlumniFund> = mongoose.models.AlumniFund || mongoose.model<IAlumniFund>('AlumniFund', AlumniFundSchema);
const ContributionPledge: Model<IContributionPledge> = mongoose.models.ContributionPledge || mongoose.model<IContributionPledge>('ContributionPledge', ContributionPledgeSchema);

export { AlumniFund, ContributionPledge };
export default AlumniFund;

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEquityAgreement extends Document {
  // Parties
  participantId: mongoose.Types.ObjectId;
  teamId?: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  cohortId: mongoose.Types.ObjectId;
  
  // Equity terms
  equityType: 'common' | 'preferred' | 'safe' | 'revenue-share';
  percentage: number; // e.g., 2, 3, 5, 6
  
  // Valuation (for equity stakes)
  valuationAtEntry?: number;
  valuationCurrency: string;
  
  // Revenue share (alternative to equity)
  revenueSharePercentage?: number;
  revenueShareCap?: number; // Maximum amount to be paid
  revenueSharePaid?: number; // Amount paid so far
  
  // Terms
  vestingSchedule?: {
    totalMonths: number;
    cliffMonths: number;
    vestingStartDate: Date;
  };
  
  // Conditions
  conditions: string[]; // e.g., "Graduate program", "Launch MVP", "Achieve $100K revenue"
  conditionsMet: boolean[];
  
  // Agreement details
  signedDate?: Date;
  effectiveDate: Date;
  expirationDate?: Date;
  
  status: 'draft' | 'pending-signature' | 'active' | 'vested' | 'exercised' | 'expired' | 'terminated';
  
  // Documentation
  agreementDocumentUrl?: string;
  capTableUrl?: string;
  
  // Milestone tracking
  milestones: {
    title: string;
    description: string;
    targetDate?: Date;
    completedDate?: Date;
    equityRelease?: number; // % of equity released upon milestone
    status: 'pending' | 'completed' | 'missed';
  }[];
  
  // Exit events
  exitEvent?: {
    type: 'acquisition' | 'ipo' | 'secondary-sale' | 'buyback';
    date: Date;
    valuationAtExit: number;
    techmastersReturn: number;
    multiple: number; // ROI multiple
  };
  
  // Notes
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const EquityAgreementSchema: Schema = new Schema({
  participantId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project'
  },
  cohortId: {
    type: Schema.Types.ObjectId,
    ref: 'Cohort',
    required: true
  },
  
  equityType: {
    type: String,
    enum: ['common', 'preferred', 'safe', 'revenue-share'],
    required: true
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  
  valuationAtEntry: Number,
  valuationCurrency: {
    type: String,
    default: 'USD'
  },
  
  revenueSharePercentage: Number,
  revenueShareCap: Number,
  revenueSharePaid: {
    type: Number,
    default: 0
  },
  
  vestingSchedule: {
    totalMonths: Number,
    cliffMonths: Number,
    vestingStartDate: Date
  },
  
  conditions: [String],
  conditionsMet: [Boolean],
  
  signedDate: Date,
  effectiveDate: {
    type: Date,
    required: true
  },
  expirationDate: Date,
  
  status: {
    type: String,
    enum: ['draft', 'pending-signature', 'active', 'vested', 'exercised', 'expired', 'terminated'],
    default: 'draft'
  },
  
  agreementDocumentUrl: String,
  capTableUrl: String,
  
  milestones: [{
    title: String,
    description: String,
    targetDate: Date,
    completedDate: Date,
    equityRelease: Number,
    status: {
      type: String,
      enum: ['pending', 'completed', 'missed'],
      default: 'pending'
    }
  }],
  
  exitEvent: {
    type: {
      type: String,
      enum: ['acquisition', 'ipo', 'secondary-sale', 'buyback']
    },
    date: Date,
    valuationAtExit: Number,
    techmastersReturn: Number,
    multiple: Number
  },
  
  notes: String
}, {
  timestamps: true
});

// Indexes
EquityAgreementSchema.index({ participantId: 1, status: 1 });
EquityAgreementSchema.index({ teamId: 1 });
EquityAgreementSchema.index({ cohortId: 1, status: 1 });
EquityAgreementSchema.index({ status: 1 });
EquityAgreementSchema.index({ effectiveDate: 1 });

// Virtual: Calculate vested percentage
EquityAgreementSchema.virtual('vestedPercentage').get(function(this: IEquityAgreement) {
  if (!this.vestingSchedule || this.status !== 'active') return 0;
  
  const now = new Date();
  const startDate = new Date(this.vestingSchedule.vestingStartDate);
  const monthsElapsed = Math.floor((now.getTime() - startDate.getTime()) / (30.44 * 24 * 60 * 60 * 1000));
  
  // Check cliff
  if (monthsElapsed < this.vestingSchedule.cliffMonths) return 0;
  
  // Calculate vested percentage
  const vestedMonths = Math.min(monthsElapsed, this.vestingSchedule.totalMonths);
  return (vestedMonths / this.vestingSchedule.totalMonths) * 100;
});

const EquityAgreement: Model<IEquityAgreement> = 
  mongoose.models.EquityAgreement || mongoose.model<IEquityAgreement>('EquityAgreement', EquityAgreementSchema);

export default EquityAgreement;

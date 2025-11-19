import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISponsorshipProposal {
  sentDate: Date;
  status: 'sent' | 'opened' | 'interested' | 'declined';
  followUpDates: Date[];
}

export interface ISponsorshipMilestone {
  name: string;
  description: string;
  dueDate: Date;
  completedDate?: Date;
  status: 'pending' | 'completed' | 'overdue';
}

export interface ISponsorship extends Document {
  partner: mongoose.Types.ObjectId;
  package: mongoose.Types.ObjectId;
  status: 'proposal' | 'negotiating' | 'active' | 'completed' | 'cancelled';
  startDate: Date;
  endDate: Date;
  totalInvestment: number;
  currency: string;
  paymentSchedule: {
    frequency: 'one-time' | 'quarterly' | 'biannual' | 'annual';
    installments: {
      amount: number;
      dueDate: Date;
      paidDate?: Date;
      status: 'pending' | 'paid' | 'overdue';
    }[];
  };
  proposal?: ISponsorshipProposal;
  milestones: ISponsorshipMilestone[];
  deliverables: {
    category: string;
    description: string;
    dueDate: Date;
    deliveredDate?: Date;
    status: 'pending' | 'delivered' | 'approved';
    files?: string[];
  }[];
  metrics: {
    logoImpressions: number;
    socialMediaReach: number;
    talentsRecruited: number;
    eventsAttended: number;
    projectsReviewed: number;
  };
  notes: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SponsorshipSchema: Schema = new Schema({
  partner: { type: Schema.Types.ObjectId, ref: 'Partner', required: true },
  package: { type: Schema.Types.ObjectId, ref: 'SponsorshipPackage', required: true },
  status: {
    type: String,
    enum: ['proposal', 'negotiating', 'active', 'completed', 'cancelled'],
    default: 'proposal'
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalInvestment: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  paymentSchedule: {
    frequency: {
      type: String,
      enum: ['one-time', 'quarterly', 'biannual', 'annual'],
      required: true
    },
    installments: [{
      amount: { type: Number, required: true },
      dueDate: { type: Date, required: true },
      paidDate: Date,
      status: {
        type: String,
        enum: ['pending', 'paid', 'overdue'],
        default: 'pending'
      }
    }]
  },
  proposal: {
    sentDate: Date,
    status: {
      type: String,
      enum: ['sent', 'opened', 'interested', 'declined']
    },
    followUpDates: [Date]
  },
  milestones: [{
    name: { type: String, required: true },
    description: String,
    dueDate: { type: Date, required: true },
    completedDate: Date,
    status: {
      type: String,
      enum: ['pending', 'completed', 'overdue'],
      default: 'pending'
    }
  }],
  deliverables: [{
    category: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    deliveredDate: Date,
    status: {
      type: String,
      enum: ['pending', 'delivered', 'approved'],
      default: 'pending'
    },
    files: [String]
  }],
  metrics: {
    logoImpressions: { type: Number, default: 0 },
    socialMediaReach: { type: Number, default: 0 },
    talentsRecruited: { type: Number, default: 0 },
    eventsAttended: { type: Number, default: 0 },
    projectsReviewed: { type: Number, default: 0 }
  },
  notes: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

// Indexes for performance
SponsorshipSchema.index({ partner: 1, status: 1 });
SponsorshipSchema.index({ startDate: 1, endDate: 1 });
SponsorshipSchema.index({ 'paymentSchedule.installments.dueDate': 1 });

const Sponsorship: Model<ISponsorship> = 
  mongoose.models.Sponsorship || mongoose.model<ISponsorship>('Sponsorship', SponsorshipSchema);

export default Sponsorship;

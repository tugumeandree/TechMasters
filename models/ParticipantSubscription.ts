import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IParticipantSubscription extends Document {
  participant: mongoose.Types.ObjectId;
  cohort?: mongoose.Types.ObjectId;
  subscriptionType: 'full_program' | 'mentorship_only' | 'platform_access' | 'alumni_network' | 'custom';
  pricingModel: 'tuition' | 'subscription' | 'isa' | 'scholarship' | 'corporate_sponsored' | 'free';
  
  // Pricing details
  pricing: {
    baseAmount: number;
    currency: string;
    paymentSchedule: 'one-time' | 'monthly' | 'quarterly' | 'semester';
    totalAmount: number;
    discountApplied?: {
      type: 'early_bird' | 'scholarship' | 'referral' | 'financial_aid' | 'corporate';
      amount: number;
      percentage?: number;
      reason?: string;
    };
  };
  
  // ISA (Income Share Agreement) specific
  isa?: {
    percentage: number;
    incomeThreshold: number;
    maxPaymentMonths: number;
    capAmount: number;
    paymentsMade: number;
    totalPaid: number;
    startDate?: Date;
  };
  
  // Payment tracking
  payments: {
    amount: number;
    dueDate: Date;
    paidDate?: Date;
    status: 'pending' | 'paid' | 'overdue' | 'waived';
    method?: 'card' | 'bank_transfer' | 'wire' | 'scholarship' | 'corporate' | 'isa';
    transactionId?: string;
    receiptUrl?: string;
  }[];
  
  // Subscription status
  status: 'active' | 'paused' | 'completed' | 'cancelled' | 'delinquent';
  startDate: Date;
  endDate?: Date;
  
  // Access levels
  accessIncludes: {
    platformAccess: boolean;
    mentorshipHours: number;
    workshopAccess: boolean;
    projectReviews: number;
    careerServices: boolean;
    alumniNetwork: boolean;
    certificateEligible: boolean;
  };
  
  // Financial aid
  financialAid?: {
    applied: boolean;
    approved: boolean;
    amount?: number;
    reason?: string;
    reviewedBy?: mongoose.Types.ObjectId;
    reviewedAt?: Date;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const ParticipantSubscriptionSchema: Schema = new Schema({
  participant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  cohort: { type: Schema.Types.ObjectId, ref: 'Cohort' },
  subscriptionType: {
    type: String,
    enum: ['full_program', 'mentorship_only', 'platform_access', 'alumni_network', 'custom'],
    required: true
  },
  pricingModel: {
    type: String,
    enum: ['tuition', 'subscription', 'isa', 'scholarship', 'corporate_sponsored', 'free'],
    required: true
  },
  
  pricing: {
    baseAmount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    paymentSchedule: {
      type: String,
      enum: ['one-time', 'monthly', 'quarterly', 'semester'],
      required: true
    },
    totalAmount: { type: Number, required: true },
    discountApplied: {
      type: {
        type: String,
        enum: ['early_bird', 'scholarship', 'referral', 'financial_aid', 'corporate']
      },
      amount: Number,
      percentage: Number,
      reason: String
    }
  },
  
  isa: {
    percentage: Number,
    incomeThreshold: Number,
    maxPaymentMonths: Number,
    capAmount: Number,
    paymentsMade: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 },
    startDate: Date
  },
  
  payments: [{
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    paidDate: Date,
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue', 'waived'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['card', 'bank_transfer', 'wire', 'scholarship', 'corporate', 'isa']
    },
    transactionId: String,
    receiptUrl: String
  }],
  
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'cancelled', 'delinquent'],
    default: 'active'
  },
  startDate: { type: Date, required: true },
  endDate: Date,
  
  accessIncludes: {
    platformAccess: { type: Boolean, default: true },
    mentorshipHours: { type: Number, default: 0 },
    workshopAccess: { type: Boolean, default: false },
    projectReviews: { type: Number, default: 0 },
    careerServices: { type: Boolean, default: false },
    certificateEligible: { type: Boolean, default: false },
    alumniNetwork: { type: Boolean, default: false }
  },
  
  financialAid: {
    applied: { type: Boolean, default: false },
    approved: { type: Boolean, default: false },
    amount: Number,
    reason: String,
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date
  }
}, {
  timestamps: true
});

// Indexes
ParticipantSubscriptionSchema.index({ participant: 1 });
ParticipantSubscriptionSchema.index({ status: 1 });
ParticipantSubscriptionSchema.index({ 'payments.dueDate': 1 });
ParticipantSubscriptionSchema.index({ startDate: 1, endDate: 1 });

const ParticipantSubscription: Model<IParticipantSubscription> = 
  mongoose.models.ParticipantSubscription || mongoose.model<IParticipantSubscription>('ParticipantSubscription', ParticipantSubscriptionSchema);

export default ParticipantSubscription;

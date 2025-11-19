import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRevenueTransaction extends Document {
  transactionType: 'participant_tuition' | 'participant_subscription' | 'sponsorship' | 'corporate_service' | 'licensing' | 'brokerage' | 'grant' | 'other';
  
  // Source information
  source: {
    type: 'participant' | 'organization' | 'grant' | 'other';
    id?: mongoose.Types.ObjectId;
    name: string;
  };
  
  // Related records
  subscription?: mongoose.Types.ObjectId;
  sponsorship?: mongoose.Types.ObjectId;
  cohort?: mongoose.Types.ObjectId;
  
  // Financial details
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'bank_transfer' | 'wire' | 'check' | 'paypal' | 'stripe' | 'other';
  transactionId: string;
  
  // Status and dates
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'disputed';
  transactionDate: Date;
  processingDate?: Date;
  settlementDate?: Date;
  
  // Fees and net
  processingFees?: number;
  netAmount: number;
  
  // Accounting
  accountingCategory: 'tuition_revenue' | 'subscription_revenue' | 'sponsorship_revenue' | 'service_revenue' | 'licensing_revenue' | 'other_revenue';
  fiscalYear: number;
  fiscalQuarter: number;
  
  // Documentation
  invoiceNumber?: string;
  invoiceUrl?: string;
  receiptUrl?: string;
  notes?: string;
  
  // Refund tracking
  refund?: {
    amount: number;
    reason: string;
    processedDate: Date;
    processedBy: mongoose.Types.ObjectId;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const RevenueTransactionSchema: Schema = new Schema({
  transactionType: {
    type: String,
    enum: ['participant_tuition', 'participant_subscription', 'sponsorship', 'corporate_service', 'licensing', 'brokerage', 'grant', 'other'],
    required: true
  },
  
  source: {
    type: {
      type: String,
      enum: ['participant', 'organization', 'grant', 'other'],
      required: true
    },
    id: Schema.Types.ObjectId,
    name: { type: String, required: true }
  },
  
  subscription: { type: Schema.Types.ObjectId, ref: 'ParticipantSubscription' },
  sponsorship: { type: Schema.Types.ObjectId, ref: 'Sponsorship' },
  cohort: { type: Schema.Types.ObjectId, ref: 'Cohort' },
  
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  paymentMethod: {
    type: String,
    enum: ['card', 'bank_transfer', 'wire', 'check', 'paypal', 'stripe', 'other'],
    required: true
  },
  transactionId: { type: String, required: true, unique: true },
  
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded', 'disputed'],
    default: 'pending'
  },
  transactionDate: { type: Date, required: true },
  processingDate: Date,
  settlementDate: Date,
  
  processingFees: { type: Number, default: 0 },
  netAmount: { type: Number, required: true },
  
  accountingCategory: {
    type: String,
    enum: ['tuition_revenue', 'subscription_revenue', 'sponsorship_revenue', 'service_revenue', 'licensing_revenue', 'other_revenue'],
    required: true
  },
  fiscalYear: { type: Number, required: true },
  fiscalQuarter: { type: Number, required: true, min: 1, max: 4 },
  
  invoiceNumber: String,
  invoiceUrl: String,
  receiptUrl: String,
  notes: String,
  
  refund: {
    amount: Number,
    reason: String,
    processedDate: Date,
    processedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  }
}, {
  timestamps: true
});

// Indexes for analytics and reporting
RevenueTransactionSchema.index({ transactionType: 1, status: 1 });
RevenueTransactionSchema.index({ fiscalYear: 1, fiscalQuarter: 1 });
RevenueTransactionSchema.index({ transactionDate: 1 });
RevenueTransactionSchema.index({ 'source.type': 1, 'source.id': 1 });
RevenueTransactionSchema.index({ cohort: 1 });

const RevenueTransaction: Model<IRevenueTransaction> = 
  mongoose.models.RevenueTransaction || mongoose.model<IRevenueTransaction>('RevenueTransaction', RevenueTransactionSchema);

export default RevenueTransaction;

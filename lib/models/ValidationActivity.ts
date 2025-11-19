import mongoose, { Schema, model, models } from 'mongoose';

const ValidationActivitySchema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  // Activity type
  type: {
    type: String,
    enum: ['customer-interview', 'user-testing', 'survey', 'pilot-customer', 'market-research', 'landing-page-test'],
    required: true
  },
  // Customer Interview
  interviewDetails: {
    customerName: String,
    customerEmail: String,
    customerProfile: String, // Demographics, role, company
    interviewDate: Date,
    duration: Number, // minutes
    format: String, // 'in-person', 'video', 'phone'
    interviewer: String
  },
  // Questions & Responses
  questions: [{
    question: String,
    response: String,
    insights: String
  }],
  // Key findings
  findings: {
    problemValidation: String,
    painPoints: [String],
    currentSolutions: [String],
    willingnessToPay: String,
    featureRequests: [String]
  },
  // User Testing
  testingDetails: {
    testDate: Date,
    participants: Number,
    testType: String, // 'usability', 'a-b', 'beta'
    prototype: String, // URL or description
    duration: Number
  },
  testResults: {
    completionRate: Number,
    successRate: Number,
    timeOnTask: Number,
    satisfactionScore: Number,
    issues: [String],
    improvements: [String]
  },
  // Survey
  surveyDetails: {
    platform: String,
    responses: Number,
    targetAudience: String,
    surveyLink: String
  },
  surveyResults: {
    summary: String,
    keyMetrics: [{
      metric: String,
      value: String
    }]
  },
  // Pilot Customer
  pilotDetails: {
    customerName: String,
    customerType: String, // 'individual', 'business'
    startDate: Date,
    endDate: Date,
    terms: String,
    pricing: String
  },
  pilotResults: {
    usage: String,
    feedback: String,
    conversionLikelihood: String,
    revenue: Number
  },
  // Attachments
  attachments: [{
    name: String,
    url: String,
    type: String // 'document', 'video', 'audio', 'image'
  }],
  // Overall insights
  overallInsights: String,
  actionItems: [String],
  pivotRequired: Boolean,
  // Validation score (how well this validates the idea)
  validationScore: {
    type: Number,
    min: 1,
    max: 5
  },
  // Tags for categorization
  tags: [String],
  // Status
  status: {
    type: String,
    enum: ['planned', 'in-progress', 'completed', 'cancelled'],
    default: 'planned'
  }
}, {
  timestamps: true
});

// Indexes
ValidationActivitySchema.index({ projectId: 1, type: 1 });
ValidationActivitySchema.index({ teamId: 1 });
ValidationActivitySchema.index({ status: 1 });

export default models.ValidationActivity || model('ValidationActivity', ValidationActivitySchema);

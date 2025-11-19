import mongoose, { Schema, model, models } from 'mongoose';

const AlumniSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  cohortId: {
    type: Schema.Types.ObjectId,
    ref: 'Cohort',
    required: true
  },
  graduationDate: {
    type: Date,
    required: true
  },
  // Post-program status
  currentStatus: {
    type: String,
    enum: ['active-startup', 'employed', 'founder', 'freelance', 'further-education', 'other'],
    required: true
  },
  companyName: String,
  position: String,
  companyWebsite: String,
  // Startup metrics (if applicable)
  startupMetrics: {
    fundingRaised: Number,
    employees: Number,
    revenue: Number,
    customers: Number,
    activeUsers: Number
  },
  // Achievements
  achievements: [{
    title: String,
    description: String,
    date: Date,
    type: String // 'funding', 'launch', 'acquisition', 'award', 'milestone'
  }],
  // Alumni engagement
  isMentor: {
    type: Boolean,
    default: false
  },
  mentoringSince: Date,
  sessionsGiven: {
    type: Number,
    default: 0
  },
  // Networking
  willingToHelp: {
    type: Boolean,
    default: true
  },
  areasOfExpertise: [String],
  openToOpportunities: {
    type: Boolean,
    default: false
  },
  // Social links
  linkedIn: String,
  twitter: String,
  github: String,
  portfolio: String,
  // Privacy
  profileVisibility: {
    type: String,
    enum: ['public', 'alumni-only', 'private'],
    default: 'alumni-only'
  },
  shareMetrics: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
AlumniSchema.index({ cohortId: 1, graduationDate: -1 });
AlumniSchema.index({ currentStatus: 1 });
AlumniSchema.index({ isMentor: 1 });

export default models.Alumni || model('Alumni', AlumniSchema);

import mongoose, { Schema, model, models } from 'mongoose';

const PartnerSchema = new Schema({
  // Organization details
  organizationName: {
    type: String,
    required: true
  },
  organizationType: {
    type: String,
    enum: ['corporate', 'startup', 'government', 'ngo', 'academic', 'investor'],
    required: true
  },
  industry: String,
  website: String,
  logo: String,
  description: String,
  // Contact person
  contactPerson: {
    name: String,
    email: String,
    phone: String,
    position: String
  },
  // Partnership details
  partnershipType: {
    type: String,
    enum: ['challenge-provider', 'mentor-provider', 'funding-partner', 'pilot-partner', 'hiring-partner', 'resource-provider'],
    required: true
  },
  status: {
    type: String,
    enum: ['prospective', 'active', 'inactive', 'completed'],
    default: 'prospective'
  },
  startDate: Date,
  endDate: Date,
  // Challenges posted by partner
  challenges: [{
    title: String,
    description: String,
    problemStatement: String,
    desiredOutcomes: [String],
    budget: Number,
    timeline: String,
    status: {
      type: String,
      enum: ['open', 'in-progress', 'completed', 'cancelled'],
      default: 'open'
    },
    postedDate: Date,
    deadline: Date,
    interestedTeams: [{
      type: Schema.Types.ObjectId,
      ref: 'Team'
    }],
    selectedTeams: [{
      type: Schema.Types.ObjectId,
      ref: 'Team'
    }]
  }],
  // Pilot projects
  pilots: [{
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team'
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project'
    },
    title: String,
    description: String,
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['planned', 'active', 'completed', 'cancelled'],
      default: 'planned'
    },
    outcomes: String,
    feedback: String,
    convertedToContract: {
      type: Boolean,
      default: false
    },
    contractValue: Number
  }],
  // Mentors provided
  mentorsProvided: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Resources/benefits provided
  resources: {
    funding: Number,
    credits: String, // e.g., "AWS credits $10,000"
    tools: [String], // e.g., ["GitHub Enterprise", "Figma Pro"]
    office: String,
    other: [String]
  },
  // Hiring
  hiringInterests: {
    active: {
      type: Boolean,
      default: false
    },
    roles: [String],
    hiredParticipants: [{
      participantId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      role: String,
      hireDate: Date
    }]
  },
  // Engagement metrics
  metrics: {
    challengesPosted: {
      type: Number,
      default: 0
    },
    pilotsCompleted: {
      type: Number,
      default: 0
    },
    participantsHired: {
      type: Number,
      default: 0
    },
    fundingProvided: {
      type: Number,
      default: 0
    },
    sessionsProvided: {
      type: Number,
      default: 0
    }
  },
  // Satisfaction
  satisfactionScore: Number, // 1-5
  testimonial: String,
  // Visibility
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
PartnerSchema.index({ status: 1 });
PartnerSchema.index({ partnershipType: 1 });
PartnerSchema.index({ 'challenges.status': 1 });

export default models.Partner || model('Partner', PartnerSchema);

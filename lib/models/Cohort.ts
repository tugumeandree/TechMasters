import mongoose, { Schema, model, models } from 'mongoose';

const CohortSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  applicationDeadline: {
    type: Date,
    required: true
  },
  maxParticipants: {
    type: Number,
    required: true
  },
  maxTeams: Number, // Target: 20-30 teams
  currentParticipants: {
    type: Number,
    default: 0
  },
  // Program format
  format: {
    type: String,
    enum: ['virtual', 'in-person', 'hybrid'],
    default: 'hybrid'
  },
  location: String, // For in-person or hybrid
  // Weekly schedule (descriptive)
  weeklySchedule: {
    buildingDays: {
      type: Number,
      default: 3
    }, // Days per week for hands-on building
    learningDays: {
      type: Number,
      default: 2
    }, // Days per week for workshops/learning
    schedule: String // e.g., "Mon-Wed building, Thu-Fri workshops"
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed'],
    default: 'upcoming',
    index: true
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  teams: [{
    type: Schema.Types.ObjectId,
    ref: 'Team'
  }],
  mentors: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Cohort challenges
  challenges: [{
    title: String,
    description: String,
    type: String, // 'hackathon', 'skill-challenge', 'pitch-competition'
    startDate: Date,
    endDate: Date,
    prize: Number,
    winners: [{
      teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
      prize: Number,
      rank: Number
    }]
  }],
  // Cohort metrics
  metrics: {
    completionRate: { type: Number, default: 0 },
    averageProgress: { type: Number, default: 0 },
    projectsLaunched: { type: Number, default: 0 },
    fundingSecured: { type: Number, default: 0 },
    jobsCreated: { type: Number, default: 0 }
  },
  // Demo day
  demoDay: {
    date: Date,
    location: String,
    virtualLink: String,
    investorCount: Number,
    pitchingTeams: [{
      type: Schema.Types.ObjectId,
      ref: 'Team'
    }]
  },
  // TechMasters Festival participation
  festivalParticipation: {
    participatingInFestival: {
      type: Boolean,
      default: false
    },
    festivalYear: Number,
    showcaseSlots: Number,
    attendeeCount: Number
  },
}, {
  timestamps: true
});

// Indexes
CohortSchema.index({ status: 1, startDate: -1 });
CohortSchema.index({ applicationDeadline: 1 });

export default models.Cohort || model('Cohort', CohortSchema);

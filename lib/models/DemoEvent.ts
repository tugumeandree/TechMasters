import mongoose, { Schema, model, models } from 'mongoose';

const DemoEventSchema = new Schema({
  cohortId: {
    type: Schema.Types.ObjectId,
    ref: 'Cohort',
    required: true
  },
  // Event details
  name: {
    type: String,
    required: true
  },
  description: String,
  eventDate: {
    type: Date,
    required: true
  },
  startTime: String,
  endTime: String,
  location: {
    type: String, // 'virtual', 'in-person', 'hybrid'
    enum: ['virtual', 'in-person', 'hybrid'],
    required: true
  },
  venue: String,
  virtualLink: String,
  // Pitching teams
  pitchingTeams: [{
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team'
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project'
    },
    pitchSlot: Number,
    pitchTime: String,
    pitchDuration: Number, // minutes
    status: {
      type: String,
      enum: ['confirmed', 'pending', 'declined', 'completed'],
      default: 'pending'
    },
    // Pitch materials
    pitchDeck: String, // URL
    demoVideo: String, // URL
    liveDemo: Boolean,
    // Judging
    judgeScores: [{
      judgeId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      scores: {
        innovation: Number,
        execution: Number,
        marketPotential: Number,
        presentation: Number,
        impact: Number
      },
      totalScore: Number,
      feedback: String
    }],
    averageScore: Number,
    awards: [String]
  }],
  // Attendees
  attendees: {
    investors: [{
      name: String,
      organization: String,
      email: String,
      confirmed: Boolean,
      interestedIn: [{
        type: Schema.Types.ObjectId,
        ref: 'Team'
      }]
    }],
    judges: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    mentors: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    partners: [{
      type: Schema.Types.ObjectId,
      ref: 'Partner'
    }],
    alumni: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    public: Number // Number of public attendees
  },
  // Awards & prizes
  awards: [{
    name: String,
    prize: String,
    winnerId: {
      type: Schema.Types.ObjectId,
      ref: 'Team'
    },
    criteria: String
  }],
  // Agenda
  agenda: [{
    time: String,
    activity: String,
    description: String,
    speaker: String
  }],
  // Registration
  registration: {
    required: Boolean,
    deadline: Date,
    link: String,
    capacity: Number,
    registered: Number
  },
  // Outcomes
  outcomes: {
    totalPitches: Number,
    investorMeetings: Number,
    followUps: Number,
    fundingCommitments: Number,
    mediaReach: Number
  },
  // Media
  media: {
    photos: [String],
    videos: [String],
    pressRelease: String,
    socialMedia: [String]
  },
  // Status
  status: {
    type: String,
    enum: ['planning', 'open-registration', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'planning'
  }
}, {
  timestamps: true
});

// Indexes
DemoEventSchema.index({ cohortId: 1, eventDate: -1 });
DemoEventSchema.index({ status: 1 });

export default models.DemoEvent || model('DemoEvent', DemoEventSchema);

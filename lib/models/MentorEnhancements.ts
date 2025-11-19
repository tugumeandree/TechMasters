import mongoose, { Schema, model, models } from 'mongoose';

const OfficeHoursSchema = new Schema({
  mentorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Schedule
  title: String,
  description: String,
  recurring: {
    type: Boolean,
    default: false
  },
  schedule: {
    dayOfWeek: Number, // 0-6 (Sunday-Saturday)
    startTime: String, // "14:00"
    endTime: String,
    timezone: String
  },
  // Single session details
  sessionDate: Date,
  sessionStartTime: String,
  sessionEndTime: String,
  // Capacity
  maxParticipants: {
    type: Number,
    default: 5
  },
  // Bookings
  bookings: [{
    participantId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    bookedAt: Date,
    question: String,
    status: {
      type: String,
      enum: ['confirmed', 'attended', 'missed', 'cancelled'],
      default: 'confirmed'
    }
  }],
  // Meeting details
  meetingLink: String,
  location: String,
  format: {
    type: String,
    enum: ['virtual', 'in-person', 'hybrid'],
    default: 'virtual'
  },
  // Topics
  topics: [String],
  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const GroupSessionSchema = new Schema({
  // Session details
  title: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['workshop', 'masterclass', 'panel', 'networking', 'critique', 'milestone-review'],
    required: true
  },
  // Hosts
  hosts: [{
    hostId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    role: String // 'facilitator', 'presenter', 'panelist'
  }],
  // Schedule
  sessionDate: {
    type: Date,
    required: true
  },
  startTime: String,
  endTime: String,
  timezone: String,
  duration: Number, // minutes
  // Target audience
  targetStages: [{
    type: String,
    enum: ['research', 'skilling', 'development', 'business']
  }],
  targetCategories: [String], // Project categories
  maxParticipants: Number,
  // Participants
  participants: [{
    participantId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: Date,
    attended: Boolean,
    feedback: {
      rating: Number,
      comment: String
    }
  }],
  // Content
  agenda: [{
    time: String,
    topic: String,
    speaker: String
  }],
  materials: [{
    name: String,
    url: String,
    type: String
  }],
  recording: String, // URL
  // Meeting details
  meetingLink: String,
  location: String,
  format: {
    type: String,
    enum: ['virtual', 'in-person', 'hybrid'],
    default: 'virtual'
  },
  // Status
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  // Engagement
  requiresRSVP: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const MentorAvailabilitySchema = new Schema({
  mentorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Weekly availability
  weeklySlots: [{
    dayOfWeek: Number,
    startTime: String,
    endTime: String,
    maxSessions: Number
  }],
  // Specific dates unavailable
  unavailableDates: [{
    date: Date,
    reason: String
  }],
  // Preferences
  sessionDuration: {
    type: Number,
    default: 60 // minutes
  },
  bufferTime: {
    type: Number,
    default: 15 // minutes between sessions
  },
  maxSessionsPerWeek: Number,
  maxSessionsPerDay: Number,
  // Video conferencing preferences
  preferredPlatform: String,
  meetingLink: String,
  // Specializations
  specializations: [String],
  canMentorStages: [{
    type: String,
    enum: ['research', 'skilling', 'development', 'business']
  }],
  // Status
  isAcceptingBookings: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Export models
export const OfficeHours = models.OfficeHours || model('OfficeHours', OfficeHoursSchema);
export const GroupSession = models.GroupSession || model('GroupSession', GroupSessionSchema);
export const MentorAvailability = models.MentorAvailability || model('MentorAvailability', MentorAvailabilitySchema);

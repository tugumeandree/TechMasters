import mongoose, { Schema, model, models } from 'mongoose';

const TeamFormationSchema = new Schema({
  // Participant looking for team
  participantId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cohortId: {
    type: Schema.Types.ObjectId,
    ref: 'Cohort',
    required: true
  },
  // Profile
  lookingFor: {
    type: String,
    enum: ['team', 'members', 'both'],
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'in-discussion', 'team-formed', 'closed'],
    default: 'open'
  },
  // Project idea (if participant has one)
  projectIdea: {
    title: String,
    description: String,
    industry: String,
    stage: {
      type: String,
      enum: ['idea', 'prototype', 'mvp', 'launched']
    }
  },
  // Skills offered
  skills: [String],
  role: String, // e.g., "Technical Lead", "Business Developer"
  // Looking for
  desiredRoles: [String], // Roles they're looking for in teammates
  desiredSkills: [String], // Skills they're looking for
  teamSize: {
    min: Number,
    max: Number
  },
  // Preferences
  preferences: {
    workStyle: {
      type: String,
      enum: ['full-time', 'part-time', 'flexible']
    },
    commitment: {
      type: String,
      enum: ['high', 'medium', 'low']
    },
    location: String,
    timezone: String,
    remote: Boolean
  },
  // Matches
  interestedIn: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  interestedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  matches: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    matchScore: Number,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending'
    },
    matchedAt: Date
  }],
  // Final team
  formedTeamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  teamFormedAt: Date
}, {
  timestamps: true
});

// Indexes
TeamFormationSchema.index({ cohortId: 1, status: 1 });
TeamFormationSchema.index({ participantId: 1 });
TeamFormationSchema.index({ status: 1 });

export default models.TeamFormation || model('TeamFormation', TeamFormationSchema);

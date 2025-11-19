import mongoose, { Schema } from 'mongoose';

const applicationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Participant', required: true },
  cohortId: { type: Schema.Types.ObjectId, ref: 'Cohort', required: true },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'under_review', 'accepted', 'rejected', 'waitlisted'],
    default: 'draft'
  },
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    dateOfBirth: String,
    location: String,
    education: String,
    currentRole: String,
    linkedIn: String,
    github: String,
    portfolio: String,
  },
  projectIdea: {
    title: String,
    description: String,
    problemStatement: String,
    proposedSolution: String,
    targetMarket: String,
    category: String,
    stage: {
      type: String,
      enum: ['idea', 'prototype', 'mvp', 'launched']
    }
  },
  skillsAssessment: {
    technicalSkills: [String],
    businessSkills: [String],
    softSkills: [String],
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced']
    },
    areasOfInterest: [String],
  },
  teamPreferences: {
    hasTeam: Boolean,
    teamSize: Number,
    lookingForMembers: Boolean,
    desiredRoles: [String],
    willingToJoinExistingTeam: Boolean,
  },
  documents: [{
    type: {
      type: String,
      enum: ['resume', 'proposal', 'pitch_deck', 'other']
    },
    name: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  submittedAt: Date,
  reviewedAt: Date,
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
  reviewNotes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const ApplicationModel = mongoose.models.Application || 
  mongoose.model('Application', applicationSchema);

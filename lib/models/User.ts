import mongoose, { Schema, Document } from 'mongoose';
import { Participant, Mentor, Partner, Admin } from '@/types';

// Base User Schema
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['participant', 'mentor', 'partner', 'admin'], 
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Participant Schema
const participantSchema = new Schema({
  ...userSchema.obj,
  phone: String,
  location: String,
  timezone: String,
  bio: String,
  skills: [String],
  teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
  cohortId: { type: Schema.Types.ObjectId, ref: 'Cohort' },
  applicationId: { type: Schema.Types.ObjectId, ref: 'Application' },
  currentStage: {
    type: String,
    enum: ['research', 'skilling', 'development', 'business']
  },
  profileImage: String,
});

// Mentor Schema
const mentorSchema = new Schema({
  ...userSchema.obj,
  mentorType: {
    type: String,
    enum: ['technical', 'industry', 'investor'],
    required: true
  },
  expertise: [String],
  company: String,
  position: String,
  bio: String,
  timezone: String,
  availability: [{
    dayOfWeek: Number,
    startTime: String,
    endTime: String,
  }],
  cohorts: [{ type: Schema.Types.ObjectId, ref: 'Cohort' }],
  profileImage: String,
  linkedIn: String,
  rating: Number,
  sessionsCompleted: { type: Number, default: 0 },
});

// Partner Schema
const partnerSchema = new Schema({
  ...userSchema.obj,
  companyName: { type: String, required: true },
  industry: String,
  contactPerson: String,
  sponsorshipTier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum']
  },
  challenges: [{ type: Schema.Types.ObjectId, ref: 'Challenge' }],
  logo: String,
});

// Admin Schema
const adminSchema = new Schema({
  ...userSchema.obj,
  permissions: [String],
});

// Create a generic User model for authentication
const genericUserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['participant', 'mentor', 'partner', 'admin'], 
    required: true 
  },
  phone: String,
  location: String,
  timezone: String,
  bio: String,
  skills: [String],
  teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
  cohortId: { type: Schema.Types.ObjectId, ref: 'Cohort' },
  applicationId: { type: Schema.Types.ObjectId, ref: 'Application' },
  currentStage: {
    type: String,
    enum: ['research', 'skilling', 'development', 'business']
  },
  profileImage: String,
  mentorType: String,
  expertise: [String],
  company: String,
  position: String,
  availability: [{
    dayOfWeek: Number,
    startTime: String,
    endTime: String,
  }],
  linkedIn: String,
  rating: Number,
  sessionsCompleted: Number,
  companyName: String,
  industry: String,
  contactPerson: String,
  sponsorshipTier: String,
  challenges: [{ type: Schema.Types.ObjectId, ref: 'Challenge' }],
  logo: String,
  permissions: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Export models
export const ParticipantModel = mongoose.models.Participant || 
  mongoose.model('Participant', participantSchema);

export const MentorModel = mongoose.models.Mentor || 
  mongoose.model('Mentor', mentorSchema);

export const PartnerModel = mongoose.models.Partner || 
  mongoose.model('Partner', partnerSchema);

export const AdminModel = mongoose.models.Admin || 
  mongoose.model('Admin', adminSchema);

// Generic User model for authentication
const User = mongoose.models.User || mongoose.model('User', genericUserSchema);
export default User;

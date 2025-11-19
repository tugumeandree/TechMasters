import mongoose, { Schema } from 'mongoose';

const cohortSchema = new Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  applicationDeadline: { type: Date, required: true },
  maxParticipants: { type: Number, required: true },
  currentParticipants: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed'],
    default: 'upcoming'
  },
  description: String,
  createdAt: { type: Date, default: Date.now },
});

const teamSchema = new Schema({
  name: { type: String, required: true },
  projectName: { type: String, required: true },
  cohortId: { type: Schema.Types.ObjectId, ref: 'Cohort', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'Participant' }],
  leaderId: { type: Schema.Types.ObjectId, ref: 'Participant', required: true },
  currentStage: {
    type: String,
    enum: ['research', 'skilling', 'development', 'business'],
    default: 'research'
  },
  mentors: [{ type: Schema.Types.ObjectId, ref: 'Mentor' }],
  createdAt: { type: Date, default: Date.now },
});

const projectSchema = new Schema({
  teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
  name: { type: String, required: true },
  description: String,
  category: String,
  stage: {
    type: String,
    enum: ['research', 'skilling', 'development', 'business'],
    default: 'research'
  },
  progress: {
    research: { type: Number, default: 0 },
    skilling: { type: Number, default: 0 },
    development: { type: Number, default: 0 },
    business: { type: Number, default: 0 },
  },
  milestones: [{
    title: String,
    description: String,
    dueDate: Date,
    completed: { type: Boolean, default: false },
    stage: String,
  }],
  resources: [{
    title: String,
    type: {
      type: String,
      enum: ['video', 'document', 'link', 'tool']
    },
    url: String,
    stage: String,
    pillar: String,
    description: String,
  }],
  pitchDeck: String,
  demoUrl: String,
  repositoryUrl: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const mentorSessionSchema = new Schema({
  mentorId: { type: Schema.Types.ObjectId, ref: 'Mentor', required: true },
  participantId: { type: Schema.Types.ObjectId, ref: 'Participant' },
  teamId: { type: Schema.Types.ObjectId, ref: 'Team' },
  date: { type: Date, required: true },
  duration: { type: Number, required: true },
  type: {
    type: String,
    enum: ['one-on-one', 'group', 'workshop'],
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  topic: String,
  notes: String,
  meetingLink: String,
  feedback: {
    rating: Number,
    comment: String,
    submittedBy: Schema.Types.ObjectId,
    submittedAt: Date,
  },
  createdAt: { type: Date, default: Date.now },
});

const challengeSchema = new Schema({
  partnerId: { type: Schema.Types.ObjectId, ref: 'Partner', required: true },
  title: { type: String, required: true },
  description: String,
  category: String,
  prize: Number,
  deadline: Date,
  requirements: [String],
  submissions: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
  status: {
    type: String,
    enum: ['open', 'closed', 'judging', 'completed'],
    default: 'open'
  },
  createdAt: { type: Date, default: Date.now },
});

export const CohortModel = mongoose.models.Cohort || 
  mongoose.model('Cohort', cohortSchema);

export const TeamModel = mongoose.models.Team || 
  mongoose.model('Team', teamSchema);

export const ProjectModel = mongoose.models.Project || 
  mongoose.model('Project', projectSchema);

export const MentorSessionModel = mongoose.models.MentorSession || 
  mongoose.model('MentorSession', mentorSessionSchema);

export const ChallengeModel = mongoose.models.Challenge || 
  mongoose.model('Challenge', challengeSchema);

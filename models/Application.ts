import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IApplication extends Document {
  // Applicant information
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    education: string;
    currentOccupation: string;
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
  };
  
  // Project details
  projectIdea: {
    title: string;
    description: string;
    problemStatement: string;
    proposedSolution: string;
    targetMarket: string;
    competitiveAdvantage?: string;
    stage: 'idea' | 'prototype' | 'mvp' | 'launched';
  };
  
  // Skills assessment
  skillsAssessment: {
    technicalSkills: string[];
    businessSkills: string[];
    softSkills: string[];
    experience: string;
    achievements?: string;
  };
  
  // Team preferences
  teamPreferences: {
    hasTeam: boolean;
    teamSize?: number;
    rolesNeeded?: string[];
    willingToJoinTeam: boolean;
    leadershipExperience?: string;
  };
  
  // Documents
  documents?: {
    resumeUrl?: string;
    proposalUrl?: string;
  };
  
  // Application metadata
  status: 'pending' | 'under-review' | 'interview' | 'accepted' | 'rejected' | 'waitlisted';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: mongoose.Types.ObjectId; // Admin user ID
  
  // Review details
  reviewNotes?: string;
  interviewScheduled?: Date;
  score?: {
    innovation: number; // 0-10
    feasibility: number; // 0-10
    teamFit: number; // 0-10
    commitment: number; // 0-10
    overall: number; // Calculated average
  };
  
  // Assignment
  assignedCohort?: mongoose.Types.ObjectId;
  assignedTeam?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId; // If user account created
  
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema: Schema = new Schema({
  personalInfo: {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true
    },
    phone: {
      type: String,
      required: true
    },
    location: String,
    education: String,
    currentOccupation: String,
    linkedinUrl: String,
    githubUrl: String,
    portfolioUrl: String
  },
  
  projectIdea: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    problemStatement: {
      type: String,
      required: true
    },
    proposedSolution: {
      type: String,
      required: true
    },
    targetMarket: String,
    competitiveAdvantage: String,
    stage: {
      type: String,
      enum: ['idea', 'prototype', 'mvp', 'launched'],
      default: 'idea'
    }
  },
  
  skillsAssessment: {
    technicalSkills: [String],
    businessSkills: [String],
    softSkills: [String],
    experience: String,
    achievements: String
  },
  
  teamPreferences: {
    hasTeam: {
      type: Boolean,
      default: false
    },
    teamSize: Number,
    rolesNeeded: [String],
    willingToJoinTeam: Boolean,
    leadershipExperience: String
  },
  
  documents: {
    resumeUrl: String,
    proposalUrl: String
  },
  
  status: {
    type: String,
    enum: ['pending', 'under-review', 'interview', 'accepted', 'rejected', 'waitlisted'],
    default: 'pending',
    index: true
  },
  
  submittedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  reviewedAt: Date,
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  reviewNotes: String,
  interviewScheduled: Date,
  
  score: {
    innovation: {
      type: Number,
      min: 0,
      max: 10
    },
    feasibility: {
      type: Number,
      min: 0,
      max: 10
    },
    teamFit: {
      type: Number,
      min: 0,
      max: 10
    },
    commitment: {
      type: Number,
      min: 0,
      max: 10
    },
    overall: Number
  },
  
  assignedCohort: {
    type: Schema.Types.ObjectId,
    ref: 'Cohort'
  },
  assignedTeam: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
ApplicationSchema.index({ 'personalInfo.email': 1 });
ApplicationSchema.index({ status: 1, submittedAt: -1 });
ApplicationSchema.index({ assignedCohort: 1 });

// Calculate overall score before saving
ApplicationSchema.pre('save', function(next) {
  if (this.score && this.score.innovation && this.score.feasibility && this.score.teamFit && this.score.commitment) {
    this.score.overall = (
      this.score.innovation +
      this.score.feasibility +
      this.score.teamFit +
      this.score.commitment
    ) / 4;
  }
  next();
});

const Application: Model<IApplication> = 
  mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);

export default Application;

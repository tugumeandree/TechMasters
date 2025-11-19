import mongoose, { Schema, model, models } from 'mongoose';

const LearningPathSchema = new Schema({
  // Path metadata
  name: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['MedTech', 'FinTech', 'EdTech', 'AgriTech', 'CleanTech', 'SaaS', 'Hardware', 'Consumer', 'Enterprise', 'Social-Impact', 'General'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  duration: Number, // estimated weeks
  // Prerequisites
  prerequisites: {
    skills: [String],
    experience: String,
    requiredStage: {
      type: String,
      enum: ['research', 'skilling', 'development', 'business']
    }
  },
  // Path structure (milestones through stages)
  milestones: [{
    stage: {
      type: String,
      enum: ['research', 'skilling', 'development', 'business'],
      required: true
    },
    order: Number,
    title: String,
    description: String,
    estimatedDuration: Number, // days
    // Resources
    resources: [{
      resourceId: {
        type: Schema.Types.ObjectId,
        ref: 'Resource'
      },
      title: String,
      type: String,
      url: String,
      required: Boolean
    }],
    // Activities
    activities: [{
      title: String,
      description: String,
      type: String, // 'assignment', 'project', 'validation', 'review'
      deliverable: String,
      required: Boolean
    }],
    // Completion criteria
    completionCriteria: [{
      criterion: String,
      type: String // 'output', 'outcome', 'skill', 'validation'
    }]
  }],
  // Specialized modules
  specializedModules: [{
    title: String,
    description: String,
    stage: String,
    topics: [String],
    resources: [{
      type: Schema.Types.ObjectId,
      ref: 'Resource'
    }],
    optional: Boolean
  }],
  // Mentor guidance
  mentorGuidance: [{
    stage: String,
    focusAreas: [String],
    recommendedMentorType: {
      type: String,
      enum: ['technical', 'industry', 'investor']
    },
    sessionFrequency: String
  }],
  // Success metrics
  successMetrics: [{
    stage: String,
    metric: String,
    target: String,
    description: String
  }],
  // Enrollments
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  // Statistics
  stats: {
    totalEnrolled: {
      type: Number,
      default: 0
    },
    completed: {
      type: Number,
      default: 0
    },
    averageRating: Number,
    averageCompletionTime: Number
  },
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
LearningPathSchema.index({ category: 1, isActive: 1 });
LearningPathSchema.index({ difficulty: 1 });

export default models.LearningPath || model('LearningPath', LearningPathSchema);

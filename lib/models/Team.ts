import mongoose, { Schema, model, models } from 'mongoose';

const TeamSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  projectName: {
    type: String,
    required: true
  },
  cohortId: {
    type: Schema.Types.ObjectId,
    ref: 'Cohort',
    required: true,
    index: true
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  leaderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentStage: {
    type: String,
    enum: ['research', 'skilling', 'development', 'business'],
    default: 'research',
    index: true
  },
  mentors: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
TeamSchema.index({ cohortId: 1, isActive: 1 });
TeamSchema.index({ leaderId: 1 });
TeamSchema.index({ members: 1 });

export default models.Team || model('Team', TeamSchema);

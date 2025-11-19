import mongoose, { Schema, model, models } from 'mongoose';

const ActivitySchema = new Schema({
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
    index: true
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['commit', 'comment', 'milestone', 'team', 'update'],
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  metadata: {
    branch: String,
    filesChanged: Number,
    additions: Number,
    deletions: Number,
    commitHash: String,
    url: String
  }
}, {
  timestamps: true
});

// Compound indexes for feed queries
ActivitySchema.index({ teamId: 1, createdAt: -1 });
ActivitySchema.index({ projectId: 1, createdAt: -1 });
ActivitySchema.index({ userId: 1, createdAt: -1 });

export default models.Activity || model('Activity', ActivitySchema);

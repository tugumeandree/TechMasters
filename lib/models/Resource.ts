import mongoose, { Schema, model, models } from 'mongoose';

const ResourceSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['video', 'document', 'link', 'tool'],
    required: true,
    index: true
  },
  url: {
    type: String,
    required: true
  },
  stage: {
    type: String,
    enum: ['research', 'skilling', 'development', 'business'],
    index: true
  },
  pillar: {
    type: String,
    enum: ['research', 'skilling', 'development', 'business'],
    index: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  duration: String,
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  tags: [String],
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  viewCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for filtering
ResourceSchema.index({ stage: 1, featured: -1, rating: -1 });
ResourceSchema.index({ type: 1, isActive: 1 });
ResourceSchema.index({ tags: 1 });

export default models.Resource || model('Resource', ResourceSchema);

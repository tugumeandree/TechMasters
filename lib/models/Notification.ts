import mongoose, { Schema, model, models } from 'mongoose';

const NotificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['gate-review', 'success', 'info', 'reminder', 'alert'],
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false,
    index: true
  },
  actionLabel: String,
  actionUrl: String,
  metadata: {
    sessionId: Schema.Types.ObjectId,
    milestoneId: Schema.Types.ObjectId,
    teamId: Schema.Types.ObjectId,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    }
  }
}, {
  timestamps: true
});

// Compound indexes for notification feed
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, type: 1, createdAt: -1 });

export default models.Notification || model('Notification', NotificationSchema);

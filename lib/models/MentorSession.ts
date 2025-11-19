import mongoose, { Schema, model, models } from 'mongoose';

const MentorSessionSchema = new Schema({
  mentorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  participantId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  duration: {
    type: Number,
    required: true,
    default: 60
  },
  type: {
    type: String,
    enum: ['one-on-one', 'group', 'workshop'],
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled'],
    default: 'scheduled',
    index: true
  },
  topic: String,
  notes: String,
  meetingLink: String,
  feedback: {
    rating: Number,
    comment: String,
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    submittedAt: Date
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
MentorSessionSchema.index({ participantId: 1, date: 1 });
MentorSessionSchema.index({ teamId: 1, date: 1 });
MentorSessionSchema.index({ mentorId: 1, status: 1 });

export default models.MentorSession || model('MentorSession', MentorSessionSchema);

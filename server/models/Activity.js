const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: [true, 'Activity action is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Activity description is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['system', 'call', 'email', 'meeting', 'note', 'followup'],
      default: 'system',
    },
    performedBy: {
      type: String,
      default: 'Admin',
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

activitySchema.index({ leadId: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);

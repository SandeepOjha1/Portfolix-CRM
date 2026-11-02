const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Note content is required'],
      trim: true,
    },
    createdBy: {
      type: String,
      default: 'Admin',
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    email: {
      type: String,
      required: [true, 'Lead email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    company: {
      type: String,
      trim: true,
      default: '',
    },
    source: {
      type: String,
      enum: ['Website', 'Referral', 'Social Media', 'Advertisement', 'Other'],
      default: 'Website',
    },
    subject: {
      type: String,
      trim: true,
      default: 'General Inquiry',
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'],
      default: 'New',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 70,
    },
    dealValue: {
      type: Number,
      min: 0,
      default: 0,
    },
    assignedTo: {
      type: String,
      default: 'Ryan Ellis',
      trim: true,
    },
    followUpDate: {
      type: Date,
      default: null,
    },
    followUpStatus: {
      type: String,
      enum: ['None', 'Scheduled', 'Overdue', 'Completed'],
      default: 'None',
    },
    notes: [noteSchema],
  },
  {
    timestamps: true,
  }
);

// Indexes for fast lookup, filtering, and sorting
leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ priority: 1 });
leadSchema.index({ followUpDate: 1 });
leadSchema.index({ createdAt: -1 });

// Compound text index for fuzzy searching
leadSchema.index({
  name: 'text',
  email: 'text',
  company: 'text',
  subject: 'text',
  message: 'text',
});

module.exports = mongoose.model('Lead', leadSchema);

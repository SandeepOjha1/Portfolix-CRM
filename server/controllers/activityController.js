const Activity = require('../models/Activity');
const Lead = require('../models/Lead');

// @desc    Get all activities for a lead
// @route   GET /api/leads/:id/activities
// @access  Private
exports.getLeadActivities = async (req, res, next) => {
  try {
    const activities = await Activity.find({ leadId: req.params.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: activities.length,
      activities,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log a new custom activity (Phone Call, Meeting, Email, etc.)
// @route   POST /api/leads/:id/activities
// @access  Private
exports.logLeadActivity = async (req, res, next) => {
  try {
    const { action, description, type, metadata } = req.body;

    if (!action || !description) {
      return res.status(400).json({
        success: false,
        message: 'Action and description are required',
      });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const performer = req.admin ? req.admin.name : 'Admin';

    const activity = await Activity.create({
      leadId: lead._id,
      action: action.trim(),
      description: description.trim(),
      type: type || 'system',
      performedBy: performer,
      metadata: metadata || {},
    });

    res.status(201).json({
      success: true,
      message: 'Activity logged successfully',
      activity,
    });
  } catch (error) {
    next(error);
  }
};


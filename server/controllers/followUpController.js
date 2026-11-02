const Lead = require('../models/Lead');
const Activity = require('../models/Activity');

// @desc    Get all follow-ups categorized by Overdue, Today, and Upcoming
// @route   GET /api/followups
// @access  Private
exports.getFollowUps = async (req, res, next) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    // Overdue: followUpDate < todayStart and not marked Completed and status not Converted/Lost
    const overdue = await Lead.find({
      followUpDate: { $lt: todayStart, $ne: null },
      followUpStatus: { $ne: 'Completed' },
      status: { $nin: ['Converted', 'Lost'] },
    })
      .sort({ followUpDate: 1 })
      .lean();

    // Today: followUpDate between todayStart and todayEnd
    const today = await Lead.find({
      followUpDate: { $gte: todayStart, $lt: todayEnd },
    })
      .sort({ followUpDate: 1 })
      .lean();

    // Upcoming: followUpDate >= todayEnd
    const upcoming = await Lead.find({
      followUpDate: { $gte: todayEnd },
    })
      .sort({ followUpDate: 1 })
      .lean();

    // Completed follow-ups
    const completed = await Lead.find({
      followUpStatus: 'Completed',
    })
      .sort({ updatedAt: -1 })
      .limit(20)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        overdue,
        today,
        upcoming,
        completed,
        counts: {
          overdue: overdue.length,
          today: today.length,
          upcoming: upcoming.length,
          completed: completed.length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update follow-up status or reschedule
// @route   PATCH /api/followups/:id
// @access  Private
exports.updateFollowUpStatus = async (req, res, next) => {
  try {
    const { followUpStatus, followUpDate } = req.body;
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const performer = req.admin ? req.admin.name : 'Admin';

    if (followUpStatus) {
      lead.followUpStatus = followUpStatus;
      await Activity.create({
        leadId: lead._id,
        action: 'Follow-up ' + followUpStatus,
        description: `Follow-up status marked as "${followUpStatus}" by ${performer}`,
        type: 'followup',
        performedBy: performer,
      });
    }

    if (followUpDate !== undefined) {
      lead.followUpDate = followUpDate ? new Date(followUpDate) : null;
      if (lead.followUpDate) {
        lead.followUpStatus = 'Scheduled';
        await Activity.create({
          leadId: lead._id,
          action: 'Follow-up Rescheduled',
          description: `Follow-up rescheduled to ${new Date(followUpDate).toLocaleDateString()}`,
          type: 'followup',
          performedBy: performer,
        });
      }
    }

    await lead.save();

    res.status(200).json({
      success: true,
      message: 'Follow-up updated successfully',
      lead,
    });
  } catch (error) {
    next(error);
  }
};


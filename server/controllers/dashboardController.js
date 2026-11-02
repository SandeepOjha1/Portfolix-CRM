const Lead = require('../models/Lead');
const Activity = require('../models/Activity');

// @desc    Get dashboard metrics, trends, and statistics
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalLeads = await Lead.countDocuments();

    // Counts by status
    const newLeads = await Lead.countDocuments({ status: 'New' });
    const contactedLeads = await Lead.countDocuments({ status: 'Contacted' });
    const qualifiedLeads = await Lead.countDocuments({ status: 'Qualified' });
    const convertedLeads = await Lead.countDocuments({ status: 'Converted' });
    const lostLeads = await Lead.countDocuments({ status: 'Lost' });

    // Conversion rate
    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : 0;

    // Status distribution
    const statusDistribution = [
      { name: 'New', value: newLeads, color: '#38BDF8' },
      { name: 'Contacted', value: contactedLeads, color: '#F59E0B' },
      { name: 'Qualified', value: qualifiedLeads, color: '#8B5CF6' },
      { name: 'Converted', value: convertedLeads, color: '#10B981' },
      { name: 'Lost', value: lostLeads, color: '#EF4444' },
    ];

    // Source breakdown aggregation
    const sourceAgg = await Lead.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const sourcePalette = {
      Website: '#6366F1',
      Referral: '#F59E0B',
      'Social Media': '#EC4899',
      Advertisement: '#3B82F6',
      Other: '#94A3B8',
    };

    const sourceDistribution = sourceAgg.map((item) => ({
      name: item._id || 'Unknown',
      count: item.count,
      percentage: totalLeads > 0 ? Math.round((item.count / totalLeads) * 100) : 0,
      color: sourcePalette[item._id] || '#64748B',
    }));

    // Monthly lead generation & conversions trend for past 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyAgg = await Lead.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total: { $sum: 1 },
          conversions: {
            $sum: { $cond: [{ $eq: ['$status', 'Converted'] }, 1, 0] },
          },
          contacted: {
            $sum: {
              $cond: [
                { $in: ['$status', ['Contacted', 'Qualified', 'Converted']] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    // Format monthly data
    const monthlyTrends = monthlyAgg.map((item) => {
      const monthLabel = monthNames[item._id.month - 1];
      return {
        month: monthLabel,
        total: item.total,
        conversions: item.conversions,
        contacted: item.contacted,
      };
    });

    // Conversion Split by Subject/Category (as in Image 1: UI UX design, Flutter, etc.)
    const subjectAgg = await Lead.aggregate([
      {
        $group: {
          _id: '$subject',
          total: { $sum: 1 },
          converted: {
            $sum: { $cond: [{ $eq: ['$status', 'Converted'] }, 1, 0] },
          },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 4 },
    ]);

    const conversionSplit = subjectAgg.map((s) => ({
      subject: s._id || 'Inquiry',
      converted: s.converted,
      total: s.total,
      percentage: s.total > 0 ? Math.round((s.converted / s.total) * 100) : 0,
    }));

    // Recent leads (last 5)
    const recentLeads = await Lead.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .select('name email company status priority source createdAt score dealValue')
      .lean();

    // Follow-ups overview
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const overdueFollowUps = await Lead.countDocuments({
      followUpDate: { $lt: today, $ne: null },
      status: { $nin: ['Converted', 'Lost'] },
    });

    const todayFollowUps = await Lead.countDocuments({
      followUpDate: { $gte: today, $lt: tomorrow },
    });

    const upcomingFollowUps = await Lead.countDocuments({
      followUpDate: { $gte: tomorrow },
    });

    // Total Pipeline Value ($)
    const pipelineValueAgg = await Lead.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: '$dealValue' },
          convertedValue: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Converted'] }, '$dealValue', 0],
            },
          },
        },
      },
    ]);

    const totalPipelineValue = pipelineValueAgg[0]?.totalValue || 0;
    const convertedPipelineValue = pipelineValueAgg[0]?.convertedValue || 0;

    res.status(200).json({
      success: true,
      stats: {
        totalLeads,
        newLeads,
        contactedLeads,
        qualifiedLeads,
        convertedLeads,
        lostLeads,
        conversionRate: parseFloat(conversionRate),
        totalPipelineValue,
        convertedPipelineValue,
        followUps: {
          overdue: overdueFollowUps,
          today: todayFollowUps,
          upcoming: upcomingFollowUps,
        },
      },
      statusDistribution,
      sourceDistribution,
      monthlyTrends,
      conversionSplit,
      recentLeads,
    });
  } catch (error) {
    next(error);
  }
};

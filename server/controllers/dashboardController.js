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
    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0';

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
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const last6Months = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      last6Months.push({
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        label: monthNames[d.getMonth()],
      });
    }

    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
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
    ]);

    // Merge with full 6 months list so every month appears even with 0 leads
    const monthlyTrends = last6Months.map((m) => {
      const found = monthlyAgg.find(
        (a) => a._id.year === m.year && a._id.month === m.month
      );
      return {
        month: m.label,
        total: found ? found.total : 0,
        conversions: found ? found.conversions : 0,
        contacted: found ? found.contacted : 0,
      };
    });

    // Conversion Split by Subject/Category
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

    // Recent leads (last 6)
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
    const avgDealSize = convertedLeads > 0 ? Math.round(convertedPipelineValue / convertedLeads) : 0;
    const winLossRatio =
      lostLeads > 0
        ? (convertedLeads / lostLeads).toFixed(1)
        : convertedLeads > 0
        ? `${convertedLeads}:0`
        : '0:0';
    const responseRate =
      totalLeads > 0
        ? Math.round(((contactedLeads + qualifiedLeads + convertedLeads) / totalLeads) * 100)
        : 0;

    // Detailed Channel Performance Matrix
    const channelAgg = await Lead.aggregate([
      {
        $group: {
          _id: '$source',
          total: { $sum: 1 },
          contacted: {
            $sum: {
              $cond: [{ $in: ['$status', ['Contacted', 'Qualified', 'Converted']] }, 1, 0],
            },
          },
          qualified: {
            $sum: {
              $cond: [{ $in: ['$status', ['Qualified', 'Converted']] }, 1, 0],
            },
          },
          converted: {
            $sum: { $cond: [{ $eq: ['$status', 'Converted'] }, 1, 0] },
          },
          lost: {
            $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] },
          },
          revenue: {
            $sum: { $cond: [{ $eq: ['$status', 'Converted'] }, '$dealValue', 0] },
          },
          pipelineValue: { $sum: '$dealValue' },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const channelMetrics = channelAgg.map((c) => ({
      source: c._id || 'Direct',
      total: c.total,
      contacted: c.contacted,
      qualified: c.qualified,
      converted: c.converted,
      lost: c.lost,
      revenue: c.revenue,
      pipelineValue: c.pipelineValue,
      conversionRate: c.total > 0 ? Math.round((c.converted / c.total) * 100) : 0,
    }));

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
        avgDealSize,
        winLossRatio,
        responseRate,
        followUps: {
          overdue: overdueFollowUps,
          today: todayFollowUps,
          upcoming: upcomingFollowUps,
        },
      },
      statusDistribution,
      sourceDistribution,
      channelMetrics,
      monthlyTrends,
      conversionSplit,
      recentLeads,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset all leads and activities to 0
// @route   POST /api/dashboard/reset
// @access  Private
exports.resetDashboardData = async (req, res, next) => {
  try {
    await Lead.deleteMany({});
    await Activity.deleteMany({});
    console.log('[CRM] Wiped all leads and activities. Database count is now 0.');

    res.status(200).json({
      success: true,
      message: 'All leads and activity history have been completely reset to 0.',
    });
  } catch (error) {
    next(error);
  }
};

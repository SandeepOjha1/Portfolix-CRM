const Lead = require('../models/Lead');
const Activity = require('../models/Activity');

// @desc    Get all leads with filtering, search, sorting, and pagination
// @route   GET /api/leads
// @access  Private
exports.getLeads = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const { search, status, source, priority, sortBy, sortOrder } = req.query;

    const query = {};

    // Filter by Status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by Source
    if (source && source !== 'All') {
      query.source = source;
    }

    // Filter by Priority
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Search query (name, email, company, subject)
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: regex },
        { email: regex },
        { company: regex },
        { subject: regex },
      ];
    }

    // Sorting
    let sort = {};
    if (sortBy) {
      const order = sortOrder === 'asc' ? 1 : -1;
      sort[sortBy] = order;
    } else {
      sort = { createdAt: -1 }; // Default: Newest first
    }

    const totalLeads = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPages = Math.ceil(totalLeads / limit) || 1;

    res.status(200).json({
      success: true,
      count: leads.length,
      total: totalLeads,
      totalPages,
      currentPage: page,
      limit,
      leads,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lead by ID with its activities
// @route   GET /api/leads/:id
// @access  Private
exports.getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: `Lead not found with id: ${req.params.id}`,
      });
    }

    const activities = await Activity.find({ leadId: lead._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      lead,
      activities,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
exports.createLead = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      source,
      subject,
      message,
      status,
      priority,
      dealValue,
      score,
      assignedTo,
      followUpDate,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required fields',
      });
    }

    const lead = await Lead.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : '',
      company: company ? company.trim() : '',
      source: source || 'Website',
      subject: subject ? subject.trim() : 'General Inquiry',
      message: message ? message.trim() : '',
      status: status || 'New',
      priority: priority || 'Medium',
      dealValue: dealValue ? Number(dealValue) : 0,
      score: score ? Number(score) : 70,
      assignedTo: assignedTo || (req.admin ? req.admin.name : 'Ryan Ellis'),
      followUpDate: followUpDate ? new Date(followUpDate) : null,
      followUpStatus: followUpDate ? 'Scheduled' : 'None',
    });

    // Log Activity
    await Activity.create({
      leadId: lead._id,
      action: 'Lead Created',
      description: `Lead created by ${req.admin ? req.admin.name : 'Admin'} with status "${lead.status}"`,
      type: 'system',
      performedBy: req.admin ? req.admin.name : 'Admin',
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead information
// @route   PUT /api/leads/:id
// @access  Private
exports.updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: `Lead not found with id: ${req.params.id}`,
      });
    }

    const performer = req.admin ? req.admin.name : 'Admin';
    const originalStatus = lead.status;
    const originalPriority = lead.priority;
    const originalFollowUp = lead.followUpDate;

    // Detect changes for activity timeline
    if (req.body.status && req.body.status !== originalStatus) {
      await Activity.create({
        leadId: lead._id,
        action: 'Status Updated',
        description: `Status changed from "${originalStatus}" to "${req.body.status}"`,
        type: 'system',
        performedBy: performer,
        metadata: { oldStatus: originalStatus, newStatus: req.body.status },
      });
    }

    if (req.body.priority && req.body.priority !== originalPriority) {
      await Activity.create({
        leadId: lead._id,
        action: 'Priority Updated',
        description: `Priority updated to "${req.body.priority}"`,
        type: 'system',
        performedBy: performer,
      });
    }

    if (req.body.followUpDate !== undefined) {
      const newFollowUpDate = req.body.followUpDate ? new Date(req.body.followUpDate) : null;
      if (
        (newFollowUpDate && !originalFollowUp) ||
        (newFollowUpDate && originalFollowUp && newFollowUpDate.getTime() !== originalFollowUp.getTime())
      ) {
        await Activity.create({
          leadId: lead._id,
          action: 'Follow-up Scheduled',
          description: `Follow-up scheduled for ${newFollowUpDate.toLocaleDateString()}`,
          type: 'followup',
          performedBy: performer,
        });
        req.body.followUpStatus = 'Scheduled';
      } else if (!newFollowUpDate && originalFollowUp) {
        req.body.followUpStatus = 'None';
      }
    }

    // Apply updates
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      lead: updatedLead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: `Lead not found with id: ${req.params.id}`,
      });
    }

    // Cascade delete associated activities
    await Activity.deleteMany({ leadId: lead._id });
    await Lead.findByIdAndDelete(lead._id);

    res.status(200).json({
      success: true,
      message: 'Lead and associated activities deleted successfully',
      deletedId: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export leads as CSV
// @route   GET /api/leads/export/csv
// @access  Private
exports.exportLeadsCSV = async (req, res, next) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 }).lean();

    const headers = [
      'ID',
      'Name',
      'Email',
      'Phone',
      'Company',
      'Source',
      'Subject',
      'Status',
      'Priority',
      'Deal Value ($)',
      'Score',
      'Follow-Up Date',
      'Created At',
    ];

    const escapeCSV = (str) => {
      if (str === null || str === undefined) return '""';
      const formatted = String(str).replace(/"/g, '""');
      return `"${formatted}"`;
    };

    const rows = leads.map((l) => [
      escapeCSV(l._id),
      escapeCSV(l.name),
      escapeCSV(l.email),
      escapeCSV(l.phone || ''),
      escapeCSV(l.company || ''),
      escapeCSV(l.source || ''),
      escapeCSV(l.subject || ''),
      escapeCSV(l.status || ''),
      escapeCSV(l.priority || ''),
      escapeCSV(l.dealValue || 0),
      escapeCSV(l.score || 70),
      escapeCSV(l.followUpDate ? new Date(l.followUpDate).toLocaleDateString() : ''),
      escapeCSV(l.createdAt ? new Date(l.createdAt).toLocaleDateString() : ''),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=leads-export-${new Date().toISOString().split('T')[0]}.csv`
    );
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

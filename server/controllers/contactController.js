const validator = require('validator');
const Lead = require('../models/Lead');
const Activity = require('../models/Activity');

// @desc    Submit public website contact form
// @route   POST /api/contact
// @access  Public (Rate-limited)
exports.submitContactForm = async (req, res, next) => {
  try {
    const { name, email, phone, company, subject, message } = req.body;

    // Validation
    const errors = [];
    if (!name || name.trim().length < 2) {
      errors.push('Full name must be at least 2 characters long');
    }

    if (!email || !validator.isEmail(email.trim())) {
      errors.push('A valid email address is required');
    }

    if (!message || message.trim().length < 5) {
      errors.push('Message must be at least 5 characters long');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors.join('. '),
        errors,
      });
    }

    // Determine default priority based on message / subject cues or default to Medium
    let priority = 'Medium';
    const combinedText = `${subject || ''} ${message}`.toLowerCase();
    if (combinedText.includes('urgent') || combinedText.includes('asap') || combinedText.includes('budget') || combinedText.includes('enterprise')) {
      priority = 'High';
    }

    // Create lead in MongoDB
    const lead = await Lead.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : '',
      company: company ? company.trim() : '',
      source: 'Website',
      subject: subject && subject.trim() ? subject.trim() : 'Website Inquiry',
      message: message.trim(),
      status: 'New',
      priority,
      score: 75,
      dealValue: 0,
      assignedTo: 'Ryan Ellis',
    });

    // Log Activity
    await Activity.create({
      leadId: lead._id,
      action: 'Lead Created',
      description: `New lead generated from Website Contact Form with subject "${lead.subject}"`,
      type: 'system',
      performedBy: 'Public Visitor',
      metadata: {
        ip: req.ip || req.headers['x-forwarded-for'],
        source: 'Website Contact Form',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been received. Our team will contact you shortly.',
      leadId: lead._id,
    });
  } catch (error) {
    next(error);
  }
};


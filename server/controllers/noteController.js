const Lead = require('../models/Lead');
const Activity = require('../models/Activity');

// @desc    Add note to a lead
// @route   POST /api/leads/:id/notes
// @access  Private
exports.addNote = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Note content cannot be empty',
      });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
      });
    }

    const performer = req.admin ? req.admin.name : 'Admin';
    const newNote = {
      content: content.trim(),
      createdBy: performer,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    lead.notes.unshift(newNote);
    await lead.save();

    // Log Activity
    const preview = content.trim().length > 60 ? content.trim().slice(0, 60) + '...' : content.trim();
    await Activity.create({
      leadId: lead._id,
      action: 'Note Added',
      description: `Note added: "${preview}"`,
      type: 'note',
      performedBy: performer,
    });

    res.status(201).json({
      success: true,
      message: 'Note added successfully',
      note: lead.notes[0],
      notes: lead.notes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update note in a lead
// @route   PUT /api/leads/:id/notes/:noteId
// @access  Private
exports.updateNote = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Note content cannot be empty',
      });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const note = lead.notes.id(req.params.noteId);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    note.content = content.trim();
    note.updatedAt = new Date();
    await lead.save();

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      note,
      notes: lead.notes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete note from a lead
// @route   DELETE /api/leads/:id/notes/:noteId
// @access  Private
exports.deleteNote = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const note = lead.notes.id(req.params.noteId);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    lead.notes.pull(req.params.noteId);
    await lead.save();

    const performer = req.admin ? req.admin.name : 'Admin';
    await Activity.create({
      leadId: lead._id,
      action: 'Note Deleted',
      description: `A note was deleted`,
      type: 'note',
      performedBy: performer,
    });

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
      notes: lead.notes,
    });
  } catch (error) {
    next(error);
  }
};


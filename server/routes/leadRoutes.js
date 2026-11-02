const express = require('express');
const router = express.Router();
const {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
} = require('../controllers/leadController');
const {
  addNote,
  updateNote,
  deleteNote,
} = require('../controllers/noteController');
const {
  getLeadActivities,
  logLeadActivity,
} = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

// Protect all lead routes
router.use(protect);

// CSV Export route must come before /:id
router.get('/export/csv', exportLeadsCSV);

// Lead CRUD
router.route('/')
  .get(getLeads)
  .post(createLead);

router.route('/:id')
  .get(getLeadById)
  .put(updateLead)
  .delete(deleteLead);

// Lead Notes Sub-routes
router.route('/:id/notes')
  .post(addNote);

router.route('/:id/notes/:noteId')
  .put(updateNote)
  .delete(deleteNote);

// Lead Activities Sub-routes
router.route('/:id/activities')
  .get(getLeadActivities)
  .post(logLeadActivity);

module.exports = router;

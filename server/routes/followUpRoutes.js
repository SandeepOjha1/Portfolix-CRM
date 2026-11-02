const express = require('express');
const router = express.Router();
const { getFollowUps, updateFollowUpStatus } = require('../controllers/followUpController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getFollowUps);
router.patch('/:id', updateFollowUpStatus);

module.exports = router;


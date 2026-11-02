const express = require('express');
const router = express.Router();
const { getDashboardStats, resetDashboardData } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.get('/stats', protect, getDashboardStats);
router.post('/reset', protect, resetDashboardData);

module.exports = router;

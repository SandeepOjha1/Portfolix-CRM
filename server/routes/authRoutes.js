const express = require('express');
const router = express.Router();
const { login, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');

router.post('/login', loginLimiter, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;

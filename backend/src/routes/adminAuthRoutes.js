const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const adminAuthController = require('../controllers/adminAuthController');
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');

// Rate limiter for admin login (5 attempts per 15 minutes)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/login', loginLimiter, adminAuthController.login);
router.post('/logout', adminAuthController.logout);
router.get('/verify', adminAuthMiddleware, adminAuthController.verify);
router.post('/change-password', adminAuthMiddleware, adminAuthController.changePassword);

module.exports = router;

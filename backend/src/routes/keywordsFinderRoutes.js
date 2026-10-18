const express = require('express');
const router = express.Router();
const { findKeywords } = require('../controllers/keywordsFinderController');
const { safetyLimiter } = require('../middleware/safetyLimiter');

// Rate limited per IP (10 searches/min, 20,000 keywords/day), no login/credit requirement
router.post('/', safetyLimiter({ isResearch: false }), findKeywords);

module.exports = router;

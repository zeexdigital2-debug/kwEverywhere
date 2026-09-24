const express = require('express');
const router = express.Router();
const { findKeywords } = require('../controllers/keywordsFinderController');
const { researchLimiter } = require('../middleware/rateLimiter');
const creditMiddleware = require('../middleware/creditMiddleware');

// Finder costs 2 credits because it involves scraping or heavier API calls
router.post('/', researchLimiter, creditMiddleware(2), findKeywords);

module.exports = router;

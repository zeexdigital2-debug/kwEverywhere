const express = require('express');
const router = express.Router();
const { researchKeywords } = require('../controllers/keywordResearchController');
const { researchLimiter } = require('../middleware/rateLimiter');
const creditMiddleware = require('../middleware/creditMiddleware');

// Base cost is 1 credit per bulk request
router.post('/', researchLimiter, creditMiddleware(1), researchKeywords);

module.exports = router;

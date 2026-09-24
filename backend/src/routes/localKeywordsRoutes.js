const express = require('express');
const router = express.Router();
const { getLocalKeywords } = require('../controllers/localKeywordsController');
const { researchLimiter } = require('../middleware/rateLimiter');
const creditMiddleware = require('../middleware/creditMiddleware');

// Local keywords cost 1 credit
router.post('/', researchLimiter, creditMiddleware(1), getLocalKeywords);

module.exports = router;

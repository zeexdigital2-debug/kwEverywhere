const express = require('express');
const router = express.Router();
const keywordController = require('../controllers/keywordController');
const authMiddleware = require('../middleware/auth');
const { keywordResearchLimiter } = require('../middleware/rateLimiter');

router.post('/research', authMiddleware, keywordResearchLimiter, keywordController.researchKeywords);

module.exports = router;

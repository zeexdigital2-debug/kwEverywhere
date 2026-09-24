const express = require('express');
const router = express.Router();
const { checkDomainMetrics } = require('../controllers/domainMetricsController');
const { researchLimiter } = require('../middleware/rateLimiter');
const creditMiddleware = require('../middleware/creditMiddleware');

// Domain metrics cost 1 credit
router.post('/', researchLimiter, creditMiddleware(1), checkDomainMetrics);

module.exports = router;

const express = require('express');
const router = express.Router();
const domainController = require('../controllers/domainController');
const authMiddleware = require('../middleware/auth');

router.post('/metrics', authMiddleware, domainController.checkDomainMetrics);

module.exports = router;

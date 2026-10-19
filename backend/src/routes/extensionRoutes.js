const express = require('express');
const cors = require('cors');
const router = express.Router();
const { getExtensionMetrics, getExtensionStatus } = require('../controllers/extensionController');
const { extensionLimiter } = require('../middleware/extensionLimiter');

// Ensure chrome-extension:// and all origins can access these routes with preflight support
const extensionCors = cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
});

router.use(extensionCors);
router.options('*', extensionCors);

// Extension keyword historical metrics: No login required, per-IP rate limited via store.js
router.post('/metrics', extensionLimiter, getExtensionMetrics);

// Extension monitoring endpoint: status, counters, caps, and store type
router.get('/status', getExtensionStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const { generateKeywordIdeas } = require('../services/googleAdsService');

/**
 * POST /api/keywords/generate-keyword-ideas
 * Body: { keyword: string, limit?: number } or { kw: string, limit?: number }
 */
router.post('/generate-keyword-ideas', async (req, res) => {
  try {
    const keyword = req.body.keyword || req.body.kw;
    const limit = req.body.limit || req.query.limit;

    if (!keyword || typeof keyword !== 'string' || !keyword.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a "keyword" or "kw" string in the request body.'
      });
    }

    const results = await generateKeywordIdeas(keyword.trim(), { limit });

    return res.json({
      success: true,
      currency: 'USD',
      keyword: keyword.trim(),
      count: results.length,
      limit: results.length,
      results
    });
  } catch (err) {
    // Ensure secrets are never leaked in error response
    return res.status(502).json({
      success: false,
      error: err.message || 'Failed to generate keyword ideas from Google Ads API.'
    });
  }
});

/**
 * GET /api/keywords/generate-keyword-ideas?keyword=...&limit=...
 */
router.get('/generate-keyword-ideas', async (req, res) => {
  try {
    const keyword = req.query.keyword || req.query.kw || req.query.q;
    const limit = req.query.limit;

    if (!keyword || typeof keyword !== 'string' || !keyword.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a "keyword" or "kw" query parameter.'
      });
    }

    const results = await generateKeywordIdeas(keyword.trim(), { limit });

    return res.json({
      success: true,
      currency: 'USD',
      keyword: keyword.trim(),
      count: results.length,
      limit: results.length,
      results
    });
  } catch (err) {
    return res.status(502).json({
      success: false,
      error: err.message || 'Failed to generate keyword ideas from Google Ads API.'
    });
  }
});

module.exports = router;

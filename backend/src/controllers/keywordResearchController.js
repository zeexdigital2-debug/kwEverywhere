const { analyzeKeywords } = require('../services/trendEngine');

const MAX_FREE_KEYWORDS = 500;

async function researchKeywords(req, res) {
  try {
    let { keywords } = req.body;

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({ error: 'Provide an array of keywords.' });
    }

    // Enforce free tier limit
    if (keywords.length > MAX_FREE_KEYWORDS) {
      keywords = keywords.slice(0, MAX_FREE_KEYWORDS);
    }

    // Clean and deduplicate
    const cleaned = [...new Set(keywords.map(k => String(k).trim().toLowerCase()).filter(k => k.length > 0))];

    const results = analyzeKeywords(cleaned);

    // Sort by opportunity score descending by default
    results.sort((a, b) => b.opportunity - a.opportunity);

    return res.json({
      success: true,
      count: results.length,
      results,
      meta: {
        processedAt: new Date().toISOString(),
        limit: MAX_FREE_KEYWORDS
      }
    });
  } catch (err) {
    console.error('[keywordResearch] Error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = { researchKeywords };

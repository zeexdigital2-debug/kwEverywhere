const { generateKeywordIdeas } = require('../services/googleAdsService');
const {
  calculateOpportunityScore,
  calculateTrendDirection,
  normalizeCompetition
} = require('../utils/keywordMetricsHelper');

const MULTI_KEYWORD_ERROR =
  'Keywords Finder works with one keyword at a time. Enter a single keyword to get related ideas. To check data for your own list of keywords, use Keyword Research.';

/**
 * POST /api/keywords-finder
 * Body: { seed?: string, keyword?: string, query?: string, country?: string }
 */
async function findKeywords(req, res) {
  try {
    const { seed, keyword, query, keywords, country } = req.body || {};

    // Check if user passed array with more than 1 keyword
    if (Array.isArray(keywords) && keywords.length > 1) {
      return res.status(400).json({
        success: false,
        error: MULTI_KEYWORD_ERROR
      });
    }

    const rawInput = seed ?? keyword ?? query ?? (Array.isArray(keywords) ? keywords[0] : keywords);

    if (!rawInput || typeof rawInput !== 'string' || !rawInput.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a seed keyword to get related ideas.'
      });
    }

    const trimmed = rawInput.trim();

    // Enforce single-keyword rule: if comma or newline is present, reject immediately without calling Google
    if (trimmed.includes(',') || trimmed.includes('\n') || trimmed.includes('\r')) {
      return res.status(400).json({
        success: false,
        error: MULTI_KEYWORD_ERROR
      });
    }

    // Call Google Ads generateKeywordIdeas (cached 24h, default 200 results, volume descending)
    const googleResults = await generateKeywordIdeas(trimmed, {
      country: country || 'US',
      limit: 200
    });

    // Map Google Ads results to frontend expected shape
    const mappedResults = googleResults.map((item) => {
      const kw = item.text || '';
      const volume = typeof item.avgMonthlySearches === 'number' ? item.avgMonthlySearches : 0;
      const hasData = volume > 0;
      const competition = hasData ? normalizeCompetition(item.competition) : 'unspecified';
      const cpc = hasData && typeof item.cpc === 'number' ? item.cpc : 0;
      const averageCpc = hasData && typeof item.averageCpc === 'number' ? item.averageCpc : cpc;
      const opportunity = hasData ? calculateOpportunityScore(kw, volume, competition) : 0;

      const monthlyVolumes = Array.isArray(item.monthlySearchVolumes) ? item.monthlySearchVolumes : [];
      let sparkline = hasData ? monthlyVolumes.map(m => Number(m.monthlySearches) || 0) : [];
      if (hasData && sparkline.length === 0) {
        sparkline = Array(12).fill(volume);
      }

      const trend = hasData ? calculateTrendDirection(sparkline) : 'none';

      return {
        keyword: kw,
        volume,
        competition,
        cpc,
        averageCpc,
        opportunity,
        sparkline,
        trend,
        currency: 'USD',
        cpcRange: item.cpcRange || { low: cpc, high: cpc },
        monthlySearchVolumes: monthlyVolumes
      };
    });

    return res.json({
      success: true,
      count: mappedResults.length,
      results: mappedResults,
      meta: {
        seed: trimmed,
        country: country || 'US',
        currency: 'USD',
        source: 'Google Ads API',
        processedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    if (err.statusCode === 429 || err.isDailyLimit || (err.message && err.message.includes('Daily limit reached'))) {
      return res.status(429).json({
        success: false,
        error: 'Daily limit reached, try again tomorrow'
      });
    }

    const errMsg = err.response?.data?.error?.message || err.message || 'Failed to find keyword ideas from Google Ads API.';
    console.error('[KeywordsFinderController] Google Ads API error:', errMsg);

    return res.status(502).json({
      success: false,
      error: errMsg
    });
  }
}

module.exports = { findKeywords };

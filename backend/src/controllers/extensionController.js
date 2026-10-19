const { generateKeywordHistoricalMetrics, getDailyCallStats } = require('../services/googleAdsService');
const store = require('../services/store');
const {
  calculateOpportunityScore,
  calculateTrendDirection,
  normalizeCompetition,
  formatMonthlyVolumes
} = require('../utils/keywordMetricsHelper');

const MAX_EXTENSION_KEYWORDS = 50;
const MAX_KEYWORD_LENGTH = 80;

/**
 * POST /api/extension/metrics
 * Body: { keywords: string[] | string, country?: string }
 */
async function getExtensionMetrics(req, res) {
  try {
    const { keywords, country } = req.body || {};

    if (!keywords) {
      return res.status(400).json({
        success: false,
        error: 'Please provide at least one keyword in the "keywords" field.'
      });
    }

    const rawList = Array.isArray(keywords)
      ? keywords
      : (typeof keywords === 'string' ? keywords.split(/[\n,]+/) : []);

    if (rawList.length > MAX_EXTENSION_KEYWORDS) {
      return res.status(400).json({
        success: false,
        error: `Maximum ${MAX_EXTENSION_KEYWORDS} keywords allowed per request.`
      });
    }

    // Har keyword trim + lowercase, 80 characters tak
    const cleaned = [...new Set(
      rawList
        .map(k => String(k || '').trim().toLowerCase().slice(0, MAX_KEYWORD_LENGTH))
        .filter(k => k.length > 0)
    )];

    if (cleaned.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide at least one valid keyword.'
      });
    }

    if (cleaned.length > MAX_EXTENSION_KEYWORDS) {
      return res.status(400).json({
        success: false,
        error: `Maximum ${MAX_EXTENSION_KEYWORDS} keywords allowed per request.`
      });
    }

    // Call Google Ads historical metrics with source: 'ext' (uses ext daily budget counter)
    const googleResults = await generateKeywordHistoricalMetrics(cleaned, {
      country: country || 'US',
      source: 'ext'
    });

    // Map Google Ads results to exact same response shape as /api/keyword-research
    const mappedResults = googleResults.map((item) => {
      const kw = item.text || '';
      const volume = typeof item.avgMonthlySearches === 'number' ? item.avgMonthlySearches : 0;
      const hasData = volume > 0;
      const competition = hasData ? normalizeCompetition(item.competition) : 'unspecified';
      const cpc = hasData && typeof item.cpc === 'number' ? item.cpc : 0;
      const averageCpc = hasData && typeof item.averageCpc === 'number' ? item.averageCpc : cpc;
      const opportunity = hasData ? calculateOpportunityScore(kw, volume, competition) : 0;

      const rawMonthlyVolumes = Array.isArray(item.monthlySearchVolumes) ? item.monthlySearchVolumes : [];
      const formattedMonthlyVolumes = hasData ? formatMonthlyVolumes(rawMonthlyVolumes) : [];

      let sparkline = hasData
        ? (formattedMonthlyVolumes.length > 0
            ? formattedMonthlyVolumes.map(m => m.volume)
            : rawMonthlyVolumes.map(m => Number(m.monthlySearches) || 0))
        : [];
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
        monthlyVolumes: formattedMonthlyVolumes,
        trend,
        currency: 'USD',
        cpcRange: item.cpcRange || { low: cpc, high: cpc },
        monthlySearchVolumes: rawMonthlyVolumes
      };
    });

    return res.json({
      success: true,
      count: mappedResults.length,
      results: mappedResults,
      meta: {
        processedAt: new Date().toISOString(),
        country: country || 'US',
        currency: 'USD',
        source: 'Google Ads API'
      }
    });
  } catch (err) {
    if (err.statusCode === 429 || err.isDailyLimit || (err.message && err.message.includes('Daily limit reached'))) {
      return res.status(429).json({
        success: false,
        error: 'Daily limit reached, try again tomorrow'
      });
    }

    const errMsg = err.response?.data?.error?.message || err.message || 'Failed to fetch keyword data for extension.';
    console.error('[ExtensionController] Error:', errMsg);

    return res.status(502).json({
      success: false,
      error: errMsg
    });
  }
}

/**
 * GET /api/extension/status
 * Monitoring endpoint: reports today's web and ext counters, caps, and store type.
 * No secrets or IP lists included.
 */
async function getExtensionStatus(req, res) {
  try {
    const stats = await getDailyCallStats();
    return res.json({
      success: true,
      store: store.getStoreType(),
      date: stats.date,
      web: stats.web,
      ext: stats.ext
    });
  } catch (err) {
    console.error('[ExtensionController] Status check failed:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve extension status'
    });
  }
}

module.exports = {
  getExtensionMetrics,
  getExtensionStatus
};

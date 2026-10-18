const { generateKeywordHistoricalMetrics } = require('../services/googleAdsService');
const {
  calculateOpportunityScore,
  calculateTrendDirection,
  normalizeCompetition
} = require('../utils/keywordMetricsHelper');

const MAX_BULK_KEYWORDS = 3000;

/**
 * POST /api/keyword-research
 * Body: { keywords: string[] | string, country?: string }
 */
async function researchKeywords(req, res) {
  try {
    let { keywords, country } = req.body;

    // Normalize keywords into array
    const rawList = Array.isArray(keywords)
      ? keywords
      : (typeof keywords === 'string' ? keywords.split(/[\n,]+/) : []);

    const cleaned = [...new Set(
      rawList
        .map(k => String(k || '').trim())
        .filter(k => k.length > 0)
    )];

    if (cleaned.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide at least one keyword to analyze.'
      });
    }

    // Support up to 3,000 keywords
    const keywordsToAnalyze = cleaned.slice(0, MAX_BULK_KEYWORDS);

    // Fetch exact Google Ads historical metrics (cached 24h per keyword, USD CPC conversion)
    const googleResults = await generateKeywordHistoricalMetrics(keywordsToAnalyze, {
      country: country || 'US'
    });

    // Map Google Ads results to the exact shape expected by frontend DataTable
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

    const errMsg = err.response?.data?.error?.message || err.message || 'Failed to fetch keyword data from Google Ads API.';
    console.error('[KeywordResearchController] Google Ads API error:', errMsg);

    return res.status(502).json({
      success: false,
      error: errMsg
    });
  }
}

module.exports = { researchKeywords };

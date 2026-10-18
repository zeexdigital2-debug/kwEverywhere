const { generateKeywordIdeas } = require('../services/googleAdsService');

const MAX_BULK_KEYWORDS = 500;

/**
 * Calculate opportunity score (0-100) based on volume, competition, and keyword length
 */
function calculateOpportunityScore(kw, volume, competitionLevel) {
  const compScore = competitionLevel === 'low' ? 70 : competitionLevel === 'medium' ? 40 : 15;
  const volScore = volume > 10000 ? 30 : volume > 1000 ? 20 : volume > 100 ? 10 : 5;
  const words = String(kw || '').trim().split(/\s+/).length;
  const lengthBonus = words >= 3 ? 15 : 0;
  return Math.min(100, compScore + volScore + lengthBonus);
}

/**
 * Calculate trend direction ('rising' | 'falling' | 'stable') from monthly volume array
 */
function calculateTrendDirection(sparkline) {
  if (!Array.isArray(sparkline) || sparkline.length < 4) return 'stable';
  const first3 = sparkline.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
  const last3 = sparkline.slice(-3).reduce((a, b) => a + b, 0) / 3;
  const delta = last3 - first3;
  const baseline = Math.max(first3, 10);
  const pct = (delta / baseline) * 100;
  if (pct > 12) return 'rising';
  if (pct < -12) return 'falling';
  return 'stable';
}

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

    // Enforce max bulk cap
    const keywordsToAnalyze = cleaned.slice(0, MAX_BULK_KEYWORDS);

    // Fetch real Google Ads metrics (cached 24h, automatic PKR->USD CPC conversion)
    const googleResults = await generateKeywordIdeas(keywordsToAnalyze, {
      country: country || 'US',
      limit: Math.max(50, Math.min(200, keywordsToAnalyze.length * 5))
    });

    // Map Google Ads results to the exact shape expected by frontend DataTable:
    // { keyword, volume, competition ('low'|'medium'|'high'), cpc ($USD), opportunity (0-100), sparkline, trend }
    const mappedResults = googleResults.map((item) => {
      const kw = item.text || '';
      const volume = typeof item.avgMonthlySearches === 'number' ? item.avgMonthlySearches : 0;

      // Map Google Ads competition enum (LOW, MEDIUM, HIGH) to frontend badge values ('low', 'medium', 'high')
      const rawComp = String(item.competition || '').toUpperCase();
      let competition = 'medium';
      if (rawComp === 'LOW') competition = 'low';
      else if (rawComp === 'HIGH') competition = 'high';
      else if (rawComp === 'MEDIUM') competition = 'medium';

      const cpc = typeof item.cpc === 'number' ? item.cpc : 0;
      const opportunity = calculateOpportunityScore(kw, volume, competition);

      // Extract 12-month trend array for SparklineChart
      const monthlyVolumes = Array.isArray(item.monthlySearchVolumes) ? item.monthlySearchVolumes : [];
      let sparkline = monthlyVolumes.map(m => Number(m.monthlySearches) || 0);
      if (sparkline.length === 0) {
        sparkline = Array(12).fill(volume);
      }

      const trend = calculateTrendDirection(sparkline);

      return {
        keyword: kw,
        volume,
        competition,
        cpc,
        averageCpc: typeof item.averageCpc === 'number' ? item.averageCpc : cpc,
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
    // Sanitize error message — NEVER return or log secrets or tokens
    const errMsg = err.response?.data?.error?.message || err.message || 'Failed to fetch keyword data from Google Ads API.';
    console.error('[KeywordResearchController] Google Ads API error:', errMsg);

    return res.status(502).json({
      success: false,
      error: errMsg
    });
  }
}

module.exports = { researchKeywords };


const { getDomainMetrics } = require('../services/openPageRank');

const MAX_DOMAINS = 50;

async function checkDomainMetrics(req, res) {
  try {
    let { domains } = req.body;

    if (!domains || !Array.isArray(domains) || domains.length === 0) {
      return res.status(400).json({ error: 'Provide an array of domains.' });
    }

    // Enforce free tier limit
    if (domains.length > MAX_DOMAINS) {
      domains = domains.slice(0, MAX_DOMAINS);
    }

    // Clean domains
    const cleaned = [...new Set(domains.map(d => String(d).trim().toLowerCase()).filter(d => d.length > 3))];

    if (cleaned.length === 0) {
      return res.status(400).json({ error: 'No valid domains provided.' });
    }

    const results = await getDomainMetrics(cleaned);
    
    // Sort by PageRank descending
    results.sort((a, b) => b.pageRank - a.pageRank);

    return res.json({
      success: true,
      count: results.length,
      results,
      meta: {
        processedAt: new Date().toISOString(),
        limit: MAX_DOMAINS
      }
    });
  } catch (err) {
    console.error('[domainMetrics] Error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = { checkDomainMetrics };

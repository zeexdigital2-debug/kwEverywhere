const { getAutocompleteSuggestions } = require('../services/googleAutocomplete');
const { analyzeKeywords, hashCode } = require('../services/trendEngine');

async function getLocalKeywords(req, res) {
  try {
    const { keyword, geo } = req.body;

    if (!keyword || !geo) {
      return res.status(400).json({ error: 'Provide both keyword and geo (country code, e.g. US, UK).' });
    }

    // 1. Fetch geo-targeted autocomplete suggestions
    const suggestions = await getAutocompleteSuggestions(keyword, 'en', geo);
    
    // Add seed keyword if it wasn't returned
    if (!suggestions.includes(keyword)) suggestions.unshift(keyword);

    // 2. Analyze keywords
    const results = analyzeKeywords(suggestions);

    // 3. Apply geo multiplier (simulate localized volume)
    // We adjust the deterministic volume based on the country code hash
    const geoHash = hashCode(geo.toUpperCase());
    const geoMultiplier = 0.1 + (geoHash % 90) / 100; // 0.1x to 1.0x of global volume

    results.forEach(r => {
      r.volume = Math.max(10, Math.round(r.volume * geoMultiplier));
      r.geo = geo.toUpperCase();
    });

    results.sort((a, b) => b.volume - a.volume);

    return res.json({
      success: true,
      count: results.length,
      geo: geo.toUpperCase(),
      results,
      meta: { processedAt: new Date().toISOString() }
    });

  } catch (err) {
    console.error('[localKeywords] Error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = { getLocalKeywords };

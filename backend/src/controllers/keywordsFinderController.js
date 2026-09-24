const { getAlphabetSuggestions, getQuestionSuggestions, getAutocompleteSuggestions } = require('../services/googleAutocomplete');
const { analyzeKeywords } = require('../services/trendEngine');
const { extractKeywordsFromUrl, extractDomain } = require('../services/urlScraper');

async function findKeywords(req, res) {
  try {
    const { seed, url, domain, type = 'seed' } = req.body;

    let rawKeywords = [];
    let sourceInfo = {};

    if (type === 'url' && url) {
      // Extract from competitor URL
      const scraped = await extractKeywordsFromUrl(url);
      rawKeywords = scraped.keywords;
      sourceInfo = { method: 'url_scrape', source: url, success: scraped.success };

      // Also fetch autocomplete for each scraped keyword (top 5)
      if (scraped.success && scraped.keywords.length > 0) {
        const topKws = scraped.keywords.slice(0, 5);
        const acResults = await Promise.allSettled(
          topKws.map(k => getAutocompleteSuggestions(k))
        );
        acResults.forEach(r => {
          if (r.status === 'fulfilled') rawKeywords.push(...r.value);
        });
      }
    } else if (type === 'domain' && domain) {
      // Treat domain as a seed + fetch autocomplete
      const cleanDomain = extractDomain(domain).replace(/\.(com|net|org|io|co|edu)$/, '').replace(/-/g, ' ');
      rawKeywords = await getAlphabetSuggestions(cleanDomain);
      sourceInfo = { method: 'domain', source: domain };
    } else if (seed) {
      // Standard seed keyword approach — alphabet soup + questions
      const [alphabetKws, questionKws] = await Promise.all([
        getAlphabetSuggestions(seed),
        getQuestionSuggestions(seed)
      ]);
      rawKeywords = [...alphabetKws, ...questionKws];
      sourceInfo = { method: 'seed', source: seed };
    } else {
      return res.status(400).json({ error: 'Provide a seed keyword, URL, or domain.' });
    }

    // Deduplicate, clean, limit
    const unique = [...new Set(rawKeywords.map(k => k.trim().toLowerCase()).filter(k => k.length > 2))].slice(0, 200);

    // Analyze with trend engine
    const results = analyzeKeywords(unique);
    results.sort((a, b) => b.volume - a.volume);

    return res.json({
      success: true,
      count: results.length,
      results,
      sourceInfo,
      meta: { processedAt: new Date().toISOString() }
    });
  } catch (err) {
    console.error('[keywordsFinder] Error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = { findKeywords };

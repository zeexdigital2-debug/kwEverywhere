const axios = require('axios');

/**
 * Fetch Google Autocomplete suggestions for a keyword.
 * Uses multiple endpoints to maximize suggestion count.
 */
async function getAutocompleteSuggestions(keyword, lang = 'en', geo = '') {
  const params = {
    q: keyword,
    client: 'firefox',
    hl: lang,
    ...(geo ? { gl: geo.toLowerCase() } : {})
  };

  try {
    const res = await axios.get('https://suggestqueries.google.com/complete/search', {
      params,
      timeout: 5000,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SEOBot/1.0)' }
    });
    const suggestions = Array.isArray(res.data?.[1]) ? res.data[1] : [];
    return suggestions.map(s => (typeof s === 'string' ? s : s[0])).filter(Boolean);
  } catch (err) {
    console.error('[googleAutocomplete] Error:', err.message);
    return [];
  }
}

/**
 * Get expanded suggestions using multiple alphabet prefixes (alphabet soup method).
 */
async function getAlphabetSuggestions(seedKeyword, lang = 'en', geo = '') {
  const prefixes = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const results = new Set();

  const baseSuggestions = await getAutocompleteSuggestions(seedKeyword, lang, geo);
  baseSuggestions.forEach(s => results.add(s));

  // Fetch a-z variations in batches of 6
  const batches = [];
  for (let i = 0; i < prefixes.length; i += 6) {
    batches.push(prefixes.slice(i, i + 6));
  }

  for (const batch of batches) {
    const batchResults = await Promise.allSettled(
      batch.map(p => getAutocompleteSuggestions(`${seedKeyword} ${p}`, lang, geo))
    );
    batchResults.forEach(r => {
      if (r.status === 'fulfilled') r.value.forEach(s => results.add(s));
    });
    await new Promise(res => setTimeout(res, 100)); // small delay between batches
  }

  return [...results].filter(s => s.toLowerCase().includes(seedKeyword.toLowerCase().split(' ')[0]));
}

/**
 * Get question-based suggestions (who, what, where, when, why, how).
 */
async function getQuestionSuggestions(seedKeyword, lang = 'en', geo = '') {
  const questions = ['who', 'what', 'where', 'when', 'why', 'how', 'can', 'is', 'are', 'which'];
  const results = new Set();

  const res = await Promise.allSettled(
    questions.map(q => getAutocompleteSuggestions(`${q} ${seedKeyword}`, lang, geo))
  );

  res.forEach(r => {
    if (r.status === 'fulfilled') r.value.forEach(s => results.add(s));
  });

  return [...results];
}

module.exports = { getAutocompleteSuggestions, getAlphabetSuggestions, getQuestionSuggestions };

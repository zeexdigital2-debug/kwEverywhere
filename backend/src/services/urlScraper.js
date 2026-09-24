const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Extract keywords from a competitor URL using Cheerio.
 * Scrapes title, meta description, headings, and anchor text.
 */
async function extractKeywordsFromUrl(url) {
  try {
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
    const res = await axios.get(normalizedUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      maxRedirects: 3
    });

    const $ = cheerio.load(res.data);
    const keywords = new Set();

    // Title
    const title = $('title').text().trim();
    if (title) splitToKeywords(title).forEach(k => keywords.add(k));

    // Meta description
    const metaDesc = $('meta[name="description"]').attr('content') || '';
    if (metaDesc) splitToKeywords(metaDesc).forEach(k => keywords.add(k));

    // Meta keywords
    const metaKw = $('meta[name="keywords"]').attr('content') || '';
    if (metaKw) metaKw.split(',').map(k => k.trim()).filter(k => k.length > 2).forEach(k => keywords.add(k.toLowerCase()));

    // H1, H2, H3 headings
    $('h1, h2, h3').each((_, el) => {
      const text = $(el).text().trim();
      if (text) splitToKeywords(text).forEach(k => keywords.add(k));
    });

    // Alt attributes on images
    $('img[alt]').each((_, el) => {
      const alt = $(el).attr('alt').trim();
      if (alt && alt.length > 3) splitToKeywords(alt).forEach(k => keywords.add(k));
    });

    // Anchor text
    $('a').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 3 && text.length < 80) splitToKeywords(text).forEach(k => keywords.add(k));
    });

    const deduplicated = [...keywords].filter(k => k.length > 2 && !/^\d+$/.test(k));
    return { success: true, keywords: deduplicated.slice(0, 100), source: normalizedUrl };
  } catch (err) {
    console.error('[urlScraper] Error:', err.message);
    return { success: false, keywords: [], error: err.message };
  }
}

/**
 * Extract a clean domain from a URL.
 */
function extractDomain(url) {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  }
}

/**
 * Split text into 1-gram and 2-gram keyword phrases, cleaned.
 */
function splitToKeywords(text) {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those', 'it', 'its', 'we', 'you', 'your', 'our', 'their']);

  const words = text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));

  const results = new Set(words);

  // 2-grams
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`;
    if (bigram.length < 40) results.add(bigram);
  }

  return [...results];
}

module.exports = { extractKeywordsFromUrl, extractDomain };

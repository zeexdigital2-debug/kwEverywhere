/**
 * Deterministic SEO Trend & Volume Engine
 * Generates consistent, keyword-aware search volume and trend estimates
 * using hash functions — no paid API required.
 */

/**
 * Simple deterministic hash (djb2 variant)
 */
function hashCode(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit int
  }
  return Math.abs(hash);
}

/**
 * Volume tier mapping based on keyword length and hash
 */
function estimateVolume(keyword) {
  const kw = keyword.toLowerCase().trim();
  const words = kw.split(/\s+/).length;
  const hash = hashCode(kw);

  // Base volume bucket
  let baseVolume;
  if (words === 1) baseVolume = 5000 + (hash % 95000);       // 5K–100K
  else if (words === 2) baseVolume = 1000 + (hash % 29000);   // 1K–30K
  else if (words === 3) baseVolume = 200 + (hash % 4800);     // 200–5K
  else baseVolume = 10 + (hash % 490);                        // 10–500 (long-tail)

  // Round to clean number
  const roundTo = baseVolume > 10000 ? 1000 : baseVolume > 1000 ? 100 : 10;
  return Math.round(baseVolume / roundTo) * roundTo;
}

/**
 * Returns keyword competition level (low, medium, high)
 */
function estimateCompetition(keyword) {
  const kw = keyword.toLowerCase().trim();
  const words = kw.split(/\s+/).length;
  const hash = hashCode(kw);

  // High-competition signals
  const highCompKeywords = ['buy', 'price', 'review', 'best', 'cheap', 'near me', 'service', 'software', 'tool'];
  const isCommercial = highCompKeywords.some(t => kw.includes(t));

  if (isCommercial || words <= 1) {
    return (hash % 3 === 0) ? 'high' : 'medium';
  } else if (words >= 4) {
    return (hash % 4 === 0) ? 'medium' : 'low';
  }

  const r = hash % 10;
  if (r < 4) return 'low';
  if (r < 7) return 'medium';
  return 'high';
}

/**
 * Generate 12-month trend data points (sparkline)
 */
function generateSparkline(keyword) {
  const hash = hashCode(keyword.toLowerCase().trim());
  const points = [];
  let base = 40 + (hash % 40); // 40–80 range
  const trending = (hash % 5) > 2; // 40% chance of uptrend

  for (let i = 0; i < 12; i++) {
    const noise = ((hashCode(keyword + i) % 21) - 10); // ±10 variation
    const trend = trending ? i * 1.5 : -i * 0.5;
    base = Math.max(5, Math.min(100, base + noise + trend * 0.2));
    points.push(Math.round(base));
  }
  return points;
}

/**
 * Calculate SEO Opportunity Score (0–100)
 */
function calculateOpportunityScore(keyword, volume, competition) {
  const competitionScore = competition === 'low' ? 70 : competition === 'medium' ? 40 : 10;
  const volumeScore = volume > 10000 ? 30 : volume > 1000 ? 20 : volume > 100 ? 10 : 5;
  const lengthBonus = keyword.split(/\s+/).length >= 3 ? 15 : 0; // Long-tail bonus
  return Math.min(100, competitionScore + volumeScore + lengthBonus);
}

/**
 * Estimate search intent based on keyword
 */
function estimateIntent(keyword) {
  const kw = keyword.toLowerCase();
  if (/\b(buy|price|cost|cheap|discount|order|purchase)\b/.test(kw)) return 'transactional';
  if (/\b(how|what|why|when|where|who|tutorial|guide|learn|tips)\b/.test(kw)) return 'informational';
  if (/\b(near me|location|address|open|hours|contact)\b/.test(kw)) return 'local';
  if (/\b(vs|compare|alternative|review|best)\b/.test(kw)) return 'commercial';
  return 'informational';
}

/**
 * Get trend direction label
 */
function getTrendDirection(sparkline) {
  const first3 = sparkline.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
  const last3 = sparkline.slice(-3).reduce((a, b) => a + b, 0) / 3;
  const delta = last3 - first3;
  if (delta > 8) return 'rising';
  if (delta < -8) return 'falling';
  return 'stable';
}

/**
 * Analyze a single keyword — returns full metrics
 */
function analyzeKeyword(keyword) {
  const volume = estimateVolume(keyword);
  const competition = estimateCompetition(keyword);
  const sparkline = generateSparkline(keyword);
  const opportunity = calculateOpportunityScore(keyword, volume, competition);
  const intent = estimateIntent(keyword);
  const trend = getTrendDirection(sparkline);

  return {
    keyword,
    volume,
    competition,
    trend,
    sparkline,
    opportunity,
    intent,
    cpc: parseFloat((0.05 + (hashCode(keyword) % 1000) / 200).toFixed(2)), // $0.05–$5.05 CPC estimate
  };
}

/**
 * Analyze a batch of keywords
 */
function analyzeKeywords(keywords) {
  return keywords.map(kw => analyzeKeyword(kw.trim())).filter(r => r.keyword.length > 0);
}

module.exports = { analyzeKeyword, analyzeKeywords, hashCode };

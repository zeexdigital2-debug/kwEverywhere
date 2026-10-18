/**
 * Shared metrics calculation helpers for Keyword Research & Keywords Finder
 */

/**
 * Calculate opportunity score (0-100) based on volume, competition, and keyword length
 */
function calculateOpportunityScore(kw, volume, competitionLevel) {
  const comp = String(competitionLevel || '').toLowerCase();
  const compScore = comp === 'low' ? 70 : comp === 'medium' ? 40 : 15;
  const vol = Number(volume) || 0;
  const volScore = vol > 10000 ? 30 : vol > 1000 ? 20 : vol > 100 ? 10 : 5;
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
 * Map raw competition string (from Google Ads enum or string) to 'low' | 'medium' | 'high'
 */
function normalizeCompetition(rawComp) {
  const comp = String(rawComp || '').toUpperCase();
  if (comp === 'LOW') return 'low';
  if (comp === 'HIGH') return 'high';
  return 'medium';
}

module.exports = {
  calculateOpportunityScore,
  calculateTrendDirection,
  normalizeCompetition
};

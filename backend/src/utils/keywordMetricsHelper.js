/**
 * Shared metrics calculation helpers for Keyword Research & Keywords Finder
 */

const MONTH_MAP = {
  1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun',
  7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec',
  JANUARY: 'Jan', FEBRUARY: 'Feb', MARCH: 'Mar', APRIL: 'Apr',
  MAY: 'May', JUNE: 'Jun', JULY: 'Jul', AUGUST: 'Aug',
  SEPTEMBER: 'Sep', OCTOBER: 'Oct', NOVEMBER: 'Nov', DECEMBER: 'Dec',
  JAN: 'Jan', FEB: 'Feb', MAR: 'Mar', APR: 'Apr', JUN: 'Jun',
  JUL: 'Jul', AUG: 'Aug', SEP: 'Sep', OCT: 'Oct', NOV: 'Nov', DEC: 'Dec'
};

const MONTH_NUM = {
  JANUARY: 1, FEBRUARY: 2, MARCH: 3, APRIL: 4, MAY: 5, JUNE: 6,
  JULY: 7, AUGUST: 8, SEPTEMBER: 9, OCTOBER: 10, NOVEMBER: 11, DECEMBER: 12,
  JAN: 1, FEB: 2, MAR: 3, APR: 4, JUN: 6, JUL: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12
};

function parseMonth(month) {
  if (typeof month === 'number') return { num: month, name: MONTH_MAP[month] || 'Jan' };
  const str = String(month || '').trim().toUpperCase();
  const num = MONTH_NUM[str] || parseInt(str, 10) || 1;
  const name = MONTH_MAP[str] || MONTH_MAP[num] || 'Jan';
  return { num, name };
}

/**
 * Format Google Ads monthlySearchVolumes into 12 chronological entries:
 * [{ label: "Mar 2026", volume: 301000 }, ...]
 */
function formatMonthlyVolumes(rawVolumes) {
  if (!Array.isArray(rawVolumes) || rawVolumes.length === 0) {
    return [];
  }

  // Sort chronologically: oldest to newest
  const sorted = [...rawVolumes].sort((a, b) => {
    const yA = Number(a.year) || 0;
    const yB = Number(b.year) || 0;
    if (yA !== yB) return yA - yB;
    const mA = parseMonth(a.month).num;
    const mB = parseMonth(b.month).num;
    return mA - mB;
  });

  return sorted.slice(-12).map((m) => {
    const { name } = parseMonth(m.month);
    const yearStr = m.year ? ` ${m.year}` : '';
    return {
      label: `${name}${yearStr}`,
      volume: Number(m.monthlySearches ?? m.monthly_searches ?? 0)
    };
  });
}

/**
 * Calculate opportunity score (0-100) based on volume, competition, and keyword length.
 * If volume is 0 or null (no Google Ads data), returns 0.
 */
function calculateOpportunityScore(kw, volume, competitionLevel) {
  const vol = Number(volume) || 0;
  if (vol <= 0) return 0;

  const comp = String(competitionLevel || '').toLowerCase();
  const compScore = comp === 'low' ? 70 : comp === 'medium' ? 40 : 15;
  const volScore = vol > 10000 ? 30 : vol > 1000 ? 20 : vol > 100 ? 10 : 5;
  const words = String(kw || '').trim().split(/\s+/).length;
  const lengthBonus = words >= 3 ? 15 : 0;
  return Math.min(100, compScore + volScore + lengthBonus);
}

/**
 * Calculate trend direction ('rising' | 'falling' | 'stable') from monthly volume array.
 */
function calculateTrendDirection(sparkline) {
  if (!Array.isArray(sparkline) || sparkline.length < 4) return 'stable';
  if (sparkline.every(v => Number(v) === 0)) return 'stable';
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
  normalizeCompetition,
  formatMonthlyVolumes
};

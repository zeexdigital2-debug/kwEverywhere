const store = require('../services/store');
const { getClientIp } = require('./safetyLimiter');

function getUtcDateStr() {
  const d = new Date();
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

const EXT_MINUTE_LIMIT = 30;
const EXT_DAILY_LIMIT = 500;

/**
 * Extension Per-IP Rate Limiter using store.js:
 * - 30 requests / minute (key: rl:ext:{ip}:m:{minuteBucket}, TTL 90s)
 * - 500 requests / day (key: rl:ext:{ip}:d:{YYYYMMDD}, TTL 2 days)
 */
async function extensionLimiter(req, res, next) {
  try {
    const ip = getClientIp(req);
    const minuteBucket = Math.floor(Date.now() / 60000);
    const dateStr = getUtcDateStr();

    const minKey = `rl:ext:${ip}:m:${minuteBucket}`;
    const dayKey = `rl:ext:${ip}:d:${dateStr}`;

    // 1. Minute limit: 30 requests/min
    const minuteCount = await store.incr(minKey, 90, 1);
    if (minuteCount > EXT_MINUTE_LIMIT) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Limit is 30 requests per minute. Please try again shortly.'
      });
    }

    // 2. Daily limit: 500 requests/day
    const dayCount = await store.incr(dayKey, 172800, 1);
    if (dayCount > EXT_DAILY_LIMIT) {
      return res.status(429).json({
        success: false,
        error: 'Daily limit reached: Maximum 500 requests per day. Please try again tomorrow.'
      });
    }

    next();
  } catch (err) {
    console.error('[ExtensionLimiter] Error:', err.message);
    next();
  }
}

module.exports = { extensionLimiter };

const axios = require('axios');
const env = require('../config/env');
const store = require('./store');

// Cache TTL Constants (in seconds)
const KW_METRICS_CACHE_TTL = 7 * 24 * 60 * 60; // 7 days (604,800s)
const IDEAS_CACHE_TTL = 3 * 24 * 60 * 60;       // 3 days (259,200s)
const DAILY_CALL_COUNTER_TTL = 2 * 24 * 60 * 60; // 2 days (172,800s)

// Exchange rate cache for USD/PKR
let fxCache = {
  usdPerPkr: null,
  expiresAt: 0,
  lastValidRate: null
};
const FX_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// OAuth access token state
let cachedAccessToken = null;
let accessTokenExpiresAt = 0;

/**
 * Format current UTC date as YYYYMMDD
 */
function getUtcDateStr() {
  const d = new Date();
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

/**
 * Get daily call key for a source ('web' or 'ext')
 */
function getDailyCallKey(source = 'web') {
  const s = source === 'ext' ? 'ext' : 'web';
  return `calls:${s}:${getUtcDateStr()}`;
}

/**
 * Get configured daily call cap from env
 */
function getDailyCap(source = 'web') {
  return source === 'ext'
    ? (Number(env.EXT_DAILY_CALL_CAP) || 4000)
    : (Number(env.WEB_DAILY_CALL_CAP) || 4000);
}

/**
 * Check if the daily budget for the specified source has room.
 * Throws 429 if limit reached or would be exceeded.
 */
async function checkDailyCap(source = 'web', callsNeeded = 1) {
  const key = getDailyCallKey(source);
  const cap = getDailyCap(source);
  const currentCount = Number(await store.get(key)) || 0;
  if (currentCount + callsNeeded > cap) {
    const err = new Error('Daily limit reached, try again tomorrow');
    err.isDailyLimit = true;
    err.statusCode = 429;
    throw err;
  }
}

/**
 * Record actual Google Ads API HTTP calls made.
 */
async function recordDailyApiCalls(source = 'web', callsMade = 1) {
  const key = getDailyCallKey(source);
  return await store.incr(key, DAILY_CALL_COUNTER_TTL, callsMade);
}

/**
 * Get current daily API call stats for monitoring/status.
 */
async function getDailyCallStats() {
  const dateStr = getUtcDateStr();
  const webKey = `calls:web:${dateStr}`;
  const extKey = `calls:ext:${dateStr}`;

  const [webCalls, extCalls] = await store.mget([webKey, extKey]);

  return {
    date: dateStr,
    web: {
      calls: Number(webCalls) || 0,
      cap: Number(env.WEB_DAILY_CALL_CAP) || 4000
    },
    ext: {
      calls: Number(extCalls) || 0,
      cap: Number(env.EXT_DAILY_CALL_CAP) || 4000
    }
  };
}

/**
 * Fetch automatic USD per PKR exchange rate.
 * - GET https://open.er-api.com/v6/latest/USD
 * - usdPerPkr = 1 / rates.PKR
 * - In-memory 24-hour cache
 */
async function getUsdPerPkr() {
  const now = Date.now();

  if (fxCache.usdPerPkr && now < fxCache.expiresAt) {
    return fxCache.usdPerPkr;
  }

  const fallbackPkrRate = Number(env.USD_PKR_RATE) || 280;
  const fallbackUsdPerPkr = 1 / fallbackPkrRate;

  try {
    const response = await axios.get('https://open.er-api.com/v6/latest/USD', {
      timeout: 8000
    });

    const pkrRate = Number(response.data?.rates?.PKR);
    if (pkrRate && pkrRate > 0) {
      const calculatedRate = 1 / pkrRate;
      fxCache = {
        usdPerPkr: calculatedRate,
        expiresAt: now + FX_CACHE_TTL_MS,
        lastValidRate: calculatedRate
      };
      return calculatedRate;
    }
    throw new Error('PKR rate missing or invalid in exchange rate API response');
  } catch (err) {
    console.warn('[GoogleAdsService] Live exchange rate fetch failed, using fallback:', err.message);

    if (fxCache.lastValidRate) {
      return fxCache.lastValidRate;
    }
    return fallbackUsdPerPkr;
  }
}

/**
 * Obtain a fresh Google OAuth2 access token using the refresh token.
 */
async function getAccessToken() {
  const now = Date.now();
  if (cachedAccessToken && now < accessTokenExpiresAt - 60000) {
    return cachedAccessToken;
  }

  const clientId = env.GOOGLE_ADS_CLIENT_ID;
  const clientSecret = env.GOOGLE_ADS_CLIENT_SECRET;
  const refreshToken = env.GOOGLE_ADS_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google Ads OAuth credentials missing in environment.');
  }

  try {
    const response = await axios.post(
      'https://oauth2.googleapis.com/token',
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 10000
      }
    );

    const data = response.data;
    if (!data.access_token) {
      throw new Error('Failed to retrieve access token from Google OAuth endpoint.');
    }

    cachedAccessToken = data.access_token;
    const expiresIn = Number(data.expires_in) || 3600;
    accessTokenExpiresAt = now + expiresIn * 1000;

    return cachedAccessToken;
  } catch (err) {
    const errMsg = err.response?.data?.error_description || err.response?.data?.error || err.message;
    console.error('[GoogleAdsService] OAuth token refresh failed:', errMsg);
    throw new Error(`Google OAuth error: ${errMsg}`);
  }
}

// Country code to Google Ads geoTargetConstants ID lookup table
const GEO_TARGET_LOOKUP = {
  US: '2840', // United States
  GB: '2826', // United Kingdom
  UK: '2826', // United Kingdom (alias)
  PK: '2586', // Pakistan
  QA: '2634', // Qatar
  AE: '2784', // UAE
  SA: '2682', // Saudi Arabia
  IN: '2356', // India
  CA: '2124', // Canada
  AU: '2036', // Australia
  DE: '2276', // Germany
  FR: '2250', // France
  ES: '2724', // Spain
  BR: '2076', // Brazil
  MX: '2484', // Mexico
  SG: '2702', // Singapore
  ZA: '2710', // South Africa
  IT: '2380', // Italy
  NL: '2528', // Netherlands
  JP: '2392', // Japan
  TR: '2792', // Turkey
  ID: '2360', // Indonesia
  MY: '2458', // Malaysia
  PH: '2608', // Philippines
  BD: '2050', // Bangladesh
  EG: '2818', // Egypt
  NG: '2566', // Nigeria
  KE: '2404', // Kenya
  NZ: '2554', // New Zealand
  IE: '2372'  // Ireland
};

/**
 * Resolve country code or ID string to a Google Ads geoTargetConstants ID.
 * Defaults to '2840' (United States).
 */
function resolveGeoTargetId(countryOrGeo) {
  if (!countryOrGeo) return '2840';
  const str = String(countryOrGeo).trim();
  if (/^\d+$/.test(str)) return str;
  if (str.startsWith('geoTargetConstants/')) return str.replace('geoTargetConstants/', '');
  return GEO_TARGET_LOOKUP[str.toUpperCase()] || '2840';
}

/**
 * Format Google Ads metrics into unified model with USD CPC conversion.
 */
function parseMetricsItem(item, usdPerPkr) {
  const text = item.text || '';
  const metrics = item.keywordMetrics || item.keywordIdeaMetrics || {};

  const avgMonthlySearches = metrics.avgMonthlySearches
    ? Number(metrics.avgMonthlySearches)
    : (metrics.avg_monthly_searches ? Number(metrics.avg_monthly_searches) : 0);

  const competition = String(metrics.competition || 'UNSPECIFIED').toUpperCase();

  const rawAvgCpcMicros = Number(metrics.averageCpcMicros ?? metrics.average_cpc_micros ?? metrics.avgCpcMicros) || 0;
  const rawLowMicros = Number(metrics.lowTopOfPageBidMicros ?? metrics.low_top_of_page_bid_micros) || 0;
  const rawHighMicros = Number(metrics.highTopOfPageBidMicros ?? metrics.high_top_of_page_bid_micros) || 0;

  const avgPkr = rawAvgCpcMicros > 0 ? (rawAvgCpcMicros / 1000000) : 0;
  const lowPkr = rawLowMicros > 0 ? (rawLowMicros / 1000000) : 0;
  const highPkr = rawHighMicros > 0 ? (rawHighMicros / 1000000) : 0;

  const avgCpc = avgPkr > 0 ? Number((avgPkr * usdPerPkr).toFixed(2)) : 0;
  const lowCpc = lowPkr > 0 ? Number((lowPkr * usdPerPkr).toFixed(2)) : 0;
  const highCpc = highPkr > 0 ? Number((highPkr * usdPerPkr).toFixed(2)) : 0;

  const cpc = avgCpc > 0
    ? avgCpc
    : (lowCpc > 0 && highCpc > 0
        ? Number(((lowCpc + highCpc) / 2).toFixed(2))
        : (lowCpc || highCpc || 0));

  const rawVolumes = metrics.monthlySearchVolumes || metrics.monthly_search_volumes || [];
  const monthlySearchVolumes = (Array.isArray(rawVolumes) ? rawVolumes : []).map((m) => ({
    year: Number(m.year),
    month: m.month,
    monthlySearches: Number(m.monthlySearches ?? m.monthly_searches ?? 0)
  }));

  return {
    text,
    avgMonthlySearches,
    competition,
    cpc,
    averageCpc: avgCpc,
    cpcRange: {
      low: lowCpc,
      high: highCpc
    },
    currency: 'USD',
    monthlySearchVolumes,
    monthlyVolumes: monthlySearchVolumes
  };
}

/**
 * Create a clean zero-data metric fallback object
 */
function createZeroMetric(kw) {
  return {
    text: kw,
    avgMonthlySearches: 0,
    competition: 'UNSPECIFIED',
    cpc: 0,
    averageCpc: 0,
    cpcRange: { low: 0, high: 0 },
    currency: 'USD',
    monthlySearchVolumes: [],
    monthlyVolumes: []
  };
}

/**
 * (A) Keyword Historical Metrics
 * - Exact keywords metrics (no related ideas/variations)
 * - Persistent cache via store.js: kw:v1:{COUNTRY}:{LANG}:{keyword lowercase trimmed}, TTL 7 days (604,800s)
 * - ONLY cache-miss keywords are sent to Google Ads API
 * - Separate daily call cap for web vs ext (calls:web:{YYYYMMDD} vs calls:ext:{YYYYMMDD})
 * - If 100% cache hits, Google call is 0 and daily call budget is untouched
 *
 * @param {string|string[]} keywordInput One or more keywords
 * @param {Object} [options]
 * @param {string} [options.country='US'] Country code (US, PK, GB, etc.) or geo numeric ID
 * @param {string} [options.language='languageConstants/1000'] Language constant
 * @param {string} [options.source='web'] Calling source: 'web' | 'ext'
 * @returns {Promise<Array>} List of exact-match keyword metrics
 */
async function generateKeywordHistoricalMetrics(keywordInput, options = {}) {
  const rawKeywords = Array.isArray(keywordInput)
    ? keywordInput
    : (typeof keywordInput === 'string' ? keywordInput.split(/[\n,]+/) : []);

  const keywordsList = [...new Set(
    rawKeywords
      .map(k => String(k || '').trim())
      .filter(k => k.length > 0)
  )];

  if (keywordsList.length === 0) {
    throw new Error('A valid keyword string or array of keywords is required.');
  }

  const countryCode = String(options.country || options.geoId || 'US').trim().toUpperCase();
  const geoId = resolveGeoTargetId(countryCode);
  const rawLanguage = options.language || 'languageConstants/1000';
  const langCode = String(options.lang || rawLanguage).replace(/^languageConstants\//, '').trim() || '1000';
  const source = options.source === 'ext' ? 'ext' : 'web';

  // 1. Check persistent cache in store.js for all keywords using mget
  const cacheKeys = keywordsList.map(kw => `kw:v1:${countryCode}:${langCode}:${kw.toLowerCase().trim()}`);
  const cachedItems = await store.mget(cacheKeys);

  const resultsMap = new Map();
  const cacheMisses = [];

  for (let i = 0; i < keywordsList.length; i++) {
    const kw = keywordsList[i];
    const lowerKw = kw.toLowerCase().trim();
    const cached = cachedItems[i];

    if (cached) {
      resultsMap.set(lowerKw, cached);
    } else {
      cacheMisses.push(kw);
    }
  }

  // 2. If all keywords were cached (100% cache hit), return immediately
  // Cache hits do NOT count against the daily call cap
  if (cacheMisses.length === 0) {
    return keywordsList.map(kw => resultsMap.get(kw.toLowerCase().trim()) || createZeroMetric(kw));
  }

  // 3. For cache misses, chunk in groups of 10,000 (Google Ads API limit)
  const CHUNK_SIZE = 10000;
  const chunks = [];
  for (let i = 0; i < cacheMisses.length; i += CHUNK_SIZE) {
    chunks.push(cacheMisses.slice(i, i + CHUNK_SIZE));
  }

  // Check daily call cap for this source before making external Google API calls
  await checkDailyCap(source, chunks.length);

  // Obtain access token & exchange rate
  const [accessToken, usdPerPkr] = await Promise.all([
    getAccessToken(),
    getUsdPerPkr()
  ]);

  const customerId = (env.GOOGLE_ADS_CUSTOMER_ID || '7500158188').replace(/[^0-9]/g, '');
  if (!customerId) {
    throw new Error('Google Ads Customer ID is missing or invalid.');
  }

  const endpoint = `https://googleads.googleapis.com/v24/customers/${customerId}:generateKeywordHistoricalMetrics`;

  for (const chunk of chunks) {
    const requestBody = {
      keywords: chunk,
      geoTargetConstants: [`geoTargetConstants/${geoId}`],
      language: rawLanguage,
      keywordPlanNetwork: 'GOOGLE_SEARCH'
    };

    try {
      const response = await axios.post(endpoint, requestBody, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 55000 // 55s timeout
      });

      // Increment daily call counter for this source
      await recordDailyApiCalls(source, 1);

      const items = response.data?.results || [];
      const returnedSet = new Set();
      const entriesToCache = [];

      for (const item of items) {
        const parsed = parseMetricsItem(item, usdPerPkr);
        const lowerText = parsed.text.toLowerCase().trim();
        if (lowerText) {
          returnedSet.add(lowerText);
          resultsMap.set(lowerText, parsed);
          entriesToCache.push({
            key: `kw:v1:${countryCode}:${langCode}:${lowerText}`,
            value: parsed
          });
        }
      }

      // For any requested keyword that Google didn't return data for, cache a zero-data fallback
      for (const kw of chunk) {
        const lowerKw = kw.toLowerCase().trim();
        if (!returnedSet.has(lowerKw)) {
          const zeroMetric = createZeroMetric(kw);
          resultsMap.set(lowerKw, zeroMetric);
          entriesToCache.push({
            key: `kw:v1:${countryCode}:${langCode}:${lowerKw}`,
            value: zeroMetric
          });
        }
      }

      // Batch persist new cache entries with TTL 7 days (604,800s) via single pipeline
      if (entriesToCache.length > 0) {
        await store.mset(entriesToCache, KW_METRICS_CACHE_TTL);
      }
    } catch (err) {
      const status = err.response?.status;
      const apiError = err.response?.data?.error?.message || err.response?.data?.message || err.message;
      console.error(`[GoogleAdsService] Historical Metrics call failed (${status || 'network'}):`, apiError);
      throw new Error(`Google Ads API error: ${apiError}`);
    }
  }

  // Return formatted results in the exact order requested by user
  return keywordsList.map(kw => resultsMap.get(kw.toLowerCase().trim()) || createZeroMetric(kw));
}

/**
 * (B) Keywords Finder: Google Ads generateKeywordIdeas
 * - Single seed keyword to discover related ideas
 * - Persistent cache via store.js: ideas:v1:{COUNTRY}:{LANG}:{seed}, TTL 3 days (259,200s)
 * - Website and extension share the same cache
 * - Uses web daily call budget
 *
 * @param {string} seedKeyword A single seed keyword
 * @param {Object} [options]
 * @param {string} [options.country='US'] Country code or geo numeric ID
 * @param {string} [options.language='languageConstants/1000'] Language constant
 * @param {string} [options.source='web'] Calling source: 'web' | 'ext'
 * @param {number} [options.limit=200] Results limit (default 200)
 * @returns {Promise<Array>} List of related keyword ideas sorted by volume descending
 */
async function generateKeywordIdeas(seedKeyword, options = {}) {
  const seed = String(seedKeyword || '').trim();
  if (!seed) {
    throw new Error('A single seed keyword is required.');
  }

  // Strict single-keyword check: no commas or newlines
  if (seed.includes(',') || seed.includes('\n') || seed.includes('\r')) {
    throw new Error('Keywords Finder works with one keyword at a time. Enter a single keyword to get related ideas.');
  }

  const limit = Math.min(200, Math.max(1, Number(options.limit) || 200));
  const countryCode = String(options.country || options.geoId || 'US').trim().toUpperCase();
  const geoId = resolveGeoTargetId(countryCode);
  const rawLanguage = options.language || 'languageConstants/1000';
  const langCode = String(options.lang || rawLanguage).replace(/^languageConstants\//, '').trim() || '1000';
  const source = options.source === 'ext' ? 'ext' : 'web';

  // 1. Check persistent cache: ideas:v1:{COUNTRY}:{LANG}:{seed} (TTL 3 days)
  const cacheKey = `ideas:v1:${countryCode}:${langCode}:${seed.toLowerCase()}`;
  const cached = await store.get(cacheKey);
  if (cached && Array.isArray(cached)) {
    return cached.slice(0, limit);
  }

  // 2. Check daily call cap for this source before calling Google Ads API
  await checkDailyCap(source, 1);

  // 3. Obtain access token & exchange rate concurrently
  const [accessToken, usdPerPkr] = await Promise.all([
    getAccessToken(),
    getUsdPerPkr()
  ]);

  const customerId = (env.GOOGLE_ADS_CUSTOMER_ID || '7500158188').replace(/[^0-9]/g, '');
  if (!customerId) {
    throw new Error('Google Ads Customer ID is missing or invalid.');
  }

  const endpoint = `https://googleads.googleapis.com/v24/customers/${customerId}:generateKeywordIdeas`;

  const requestBody = {
    keywordSeed: {
      keywords: [seed]
    },
    geoTargetConstants: [`geoTargetConstants/${geoId}`],
    language: rawLanguage,
    keywordPlanNetwork: 'GOOGLE_SEARCH'
  };

  try {
    const response = await axios.post(endpoint, requestBody, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 55000
    });

    // Increment daily call counter for this source
    await recordDailyApiCalls(source, 1);

    const rawResults = response.data?.results || [];

    // Deduplicate by lowercase keyword text
    const seenKw = new Set();
    const formatted = [];

    for (const item of rawResults) {
      const parsed = parseMetricsItem(item, usdPerPkr);
      const lower = parsed.text.toLowerCase().trim();
      if (lower && !seenKw.has(lower)) {
        seenKw.add(lower);
        formatted.push(parsed);
      }
    }

    // Sort descending by avgMonthlySearches
    formatted.sort((a, b) => b.avgMonthlySearches - a.avgMonthlySearches);

    // Cache full result array in store for 3 days (259,200s)
    await store.set(cacheKey, formatted, IDEAS_CACHE_TTL);

    return formatted.slice(0, limit);
  } catch (err) {
    const status = err.response?.status;
    const apiError = err.response?.data?.error?.message || err.response?.data?.message || err.message;
    console.error(`[GoogleAdsService] Keyword Ideas call failed (${status || 'network'}):`, apiError);
    throw new Error(`Google Ads API error: ${apiError}`);
  }
}

module.exports = {
  getAccessToken,
  getUsdPerPkr,
  generateKeywordHistoricalMetrics,
  generateKeywordIdeas,
  resolveGeoTargetId,
  GEO_TARGET_LOOKUP,
  checkDailyCap,
  recordDailyApiCalls,
  getDailyCallStats,
  // Backwards-compatible aliases
  checkGlobalDailyCap: (callsNeeded = 1) => checkDailyCap('web', callsNeeded),
  recordGlobalApiCalls: (callsMade = 1) => recordDailyApiCalls('web', callsMade),
  getGlobalApiCallStats: getDailyCallStats
};

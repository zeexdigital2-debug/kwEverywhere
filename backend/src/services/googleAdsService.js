const axios = require('axios');
const env = require('../config/env');

// In-memory 24-hour cache: key -> { data, expiresAt }
const keywordCache = new Map();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

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

// Global daily Google Ads API call tracking (Cap: 8,000 calls / day)
const GLOBAL_DAILY_CALL_LIMIT = 8000;
let globalApiStats = {
  dateStr: new Date().toISOString().slice(0, 10), // "YYYY-MM-DD"
  callCount: 0
};

/**
 * Check and enforce global daily Google Ads API call cap.
 * Throws a 429 error if limit would be exceeded.
 */
function checkGlobalDailyCap(callsNeeded = 1) {
  const todayStr = new Date().toISOString().slice(0, 10);
  if (globalApiStats.dateStr !== todayStr) {
    globalApiStats = { dateStr: todayStr, callCount: 0 };
  }
  if (globalApiStats.callCount + callsNeeded > GLOBAL_DAILY_CALL_LIMIT) {
    const err = new Error('Daily limit reached, try again tomorrow');
    err.isDailyLimit = true;
    err.statusCode = 429;
    throw err;
  }
}

/**
 * Record actual Google Ads API calls made.
 */
function recordGlobalApiCalls(callsMade = 1) {
  const todayStr = new Date().toISOString().slice(0, 10);
  if (globalApiStats.dateStr !== todayStr) {
    globalApiStats = { dateStr: todayStr, callCount: 0 };
  }
  globalApiStats.callCount += callsMade;
}

/**
 * Get current global API call stats for monitoring.
 */
function getGlobalApiCallStats() {
  const todayStr = new Date().toISOString().slice(0, 10);
  if (globalApiStats.dateStr !== todayStr) {
    globalApiStats = { dateStr: todayStr, callCount: 0 };
  }
  return { ...globalApiStats, limit: GLOBAL_DAILY_CALL_LIMIT };
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
    monthlySearchVolumes
  };
}

/**
 * (A) Keyword Research: Google Ads generateKeywordHistoricalMetrics
 * - Exact keywords metrics only (no related ideas/variations)
 * - 1 to 3000 keywords in a single call (chunks if > 10,000)
 * - 24-hour in-memory cache per keyword + country + language
 * - ONLY cache-miss keywords are sent to Google Ads API
 * - Global daily limit: 8,000 API calls (cache-miss only)
 *
 * @param {string|string[]} keywordInput One or more keywords (up to 3000)
 * @param {Object} [options]
 * @param {string} [options.country='US'] Country code (US, PK, GB, etc.) or geo numeric ID
 * @param {string} [options.language='languageConstants/1000'] Language constant
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

  const geoId = resolveGeoTargetId(options.country || options.geoId || 'US');
  const language = options.language || 'languageConstants/1000';
  const now = Date.now();

  // 1. Check 24-hour cache for each individual keyword
  const resultsMap = new Map();
  const cacheMisses = [];

  for (const kw of keywordsList) {
    const cacheKey = `hist:${kw.toLowerCase()}::${geoId}::${language}`;
    const cached = keywordCache.get(cacheKey);
    if (cached && now < cached.expiresAt) {
      resultsMap.set(kw.toLowerCase(), cached.data);
    } else {
      cacheMisses.push(kw);
    }
  }

  // 2. If all keywords were cached (100% cache hit), return immediately
  // Cache hits do NOT count against the global daily API call limit
  if (cacheMisses.length === 0) {
    return keywordsList.map(kw => resultsMap.get(kw.toLowerCase()) || {
      text: kw,
      avgMonthlySearches: 0,
      competition: 'UNSPECIFIED',
      cpc: 0,
      averageCpc: 0,
      cpcRange: { low: 0, high: 0 },
      currency: 'USD',
      monthlySearchVolumes: []
    });
  }

  // 3. For cache misses, chunk in groups of 10,000 (Google Ads API limit)
  // For 1 to 3000 keywords, this is a single chunk / single call
  const CHUNK_SIZE = 10000;
  const chunks = [];
  for (let i = 0; i < cacheMisses.length; i += CHUNK_SIZE) {
    chunks.push(cacheMisses.slice(i, i + CHUNK_SIZE));
  }

  // Check global daily cap before making external Google API calls
  checkGlobalDailyCap(chunks.length);

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
      language,
      keywordPlanNetwork: 'GOOGLE_SEARCH'
    };

    try {
      const response = await axios.post(endpoint, requestBody, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 55000 // 55s timeout, well within Vercel's 60s maxDuration
      });

      // Increment global API call counter
      recordGlobalApiCalls(1);

      const items = response.data?.results || [];

      // Keep track of which keywords in this chunk had metrics returned
      const returnedSet = new Set();

      for (const item of items) {
        const parsed = parseMetricsItem(item, usdPerPkr);
        const lowerText = parsed.text.toLowerCase().trim();
        if (lowerText) {
          returnedSet.add(lowerText);
          resultsMap.set(lowerText, parsed);

          // Cache individual keyword data for 24 hours
          keywordCache.set(`hist:${lowerText}::${geoId}::${language}`, {
            data: parsed,
            expiresAt: now + CACHE_TTL_MS
          });
        }
      }

      // For any requested keyword that Google didn't return data for, cache a zero-data fallback
      for (const kw of chunk) {
        const lowerKw = kw.toLowerCase().trim();
        if (!returnedSet.has(lowerKw)) {
          const zeroMetric = {
            text: kw,
            avgMonthlySearches: 0,
            competition: 'UNSPECIFIED',
            cpc: 0,
            averageCpc: 0,
            cpcRange: { low: 0, high: 0 },
            currency: 'USD',
            monthlySearchVolumes: []
          };
          resultsMap.set(lowerKw, zeroMetric);
          keywordCache.set(`hist:${lowerKw}::${geoId}::${language}`, {
            data: zeroMetric,
            expiresAt: now + CACHE_TTL_MS
          });
        }
      }
    } catch (err) {
      const status = err.response?.status;
      const apiError = err.response?.data?.error?.message || err.response?.data?.message || err.message;
      console.error(`[GoogleAdsService] Historical Metrics call failed (${status || 'network'}):`, apiError);
      throw new Error(`Google Ads API error: ${apiError}`);
    }
  }

  // Return formatted results in the exact order requested by user
  return keywordsList.map(kw => resultsMap.get(kw.toLowerCase().trim()) || {
    text: kw,
    avgMonthlySearches: 0,
    competition: 'UNSPECIFIED',
    cpc: 0,
    averageCpc: 0,
    cpcRange: { low: 0, high: 0 },
    currency: 'USD',
    monthlySearchVolumes: []
  });
}

/**
 * (B) Keywords Finder: Google Ads generateKeywordIdeas
 * - Single seed keyword to discover related ideas and close variants
 * - Volume descending sort, default 200 results
 * - 24-hour cache per seed keyword + country + language
 * - Global daily limit: 8,000 API calls (cache-miss only)
 *
 * @param {string} seedKeyword A single seed keyword
 * @param {Object} [options]
 * @param {string} [options.country='US'] Country code or geo numeric ID
 * @param {string} [options.language='languageConstants/1000'] Language constant
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
  const geoId = resolveGeoTargetId(options.country || options.geoId || 'US');
  const language = options.language || 'languageConstants/1000';
  const now = Date.now();

  // 1. Check 24-hour cache
  const cacheKey = `ideas:${seed.toLowerCase()}::${geoId}::${language}`;
  const cached = keywordCache.get(cacheKey);
  if (cached && now < cached.expiresAt) {
    return cached.data.slice(0, limit);
  }

  // 2. Check global daily cap before calling Google Ads API
  checkGlobalDailyCap(1);

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
    language,
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

    // Increment global API call counter
    recordGlobalApiCalls(1);

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

    // Cache full result array for 24 hours
    keywordCache.set(cacheKey, {
      data: formatted,
      expiresAt: now + CACHE_TTL_MS
    });

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
  checkGlobalDailyCap,
  recordGlobalApiCalls,
  getGlobalApiCallStats
};

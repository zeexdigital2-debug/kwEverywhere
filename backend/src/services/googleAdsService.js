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

/**
 * Fetch automatic USD per PKR exchange rate.
 * - GET https://open.er-api.com/v6/latest/USD (free, no key required)
 * - usdPerPkr = 1 / rates.PKR
 * - In-memory 24-hour cache
 * - Fallback: last valid cached rate, or env.USD_PKR_RATE (default 280)
 *
 * @returns {Promise<number>} usdPerPkr multiplier
 */
async function getUsdPerPkr() {
  const now = Date.now();

  // Return active cache if still valid
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

    // Fallback 1: previous valid cached rate
    if (fxCache.lastValidRate) {
      return fxCache.lastValidRate;
    }

    // Fallback 2: env.js USD_PKR_RATE (default 280)
    return fallbackUsdPerPkr;
  }
}

/**
 * Obtain a fresh Google OAuth2 access token using the refresh token.
 * Tokens are cached in-memory until ~1 minute before expiration.
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
    // Sanitize error: never log or expose client secret or tokens
    const errMsg = err.response?.data?.error_description || err.response?.data?.error || err.message;
    console.error('[GoogleAdsService] OAuth token refresh failed:', errMsg);
    throw new Error(`Google OAuth error: ${errMsg}`);
  }
}

/**
 * Generate keyword ideas from Google Ads API v24 for a given keyword.
 * Results are cached for 24 hours.
 *
 * @param {string} keyword
 * @param {Object} [options]
 * @param {number} [options.limit=50] Limit returned results (max 200, default 50)
 * @returns {Promise<Array>} List of keyword ideas with volume, competition, cpc in USD, and 12-month trend
 */
async function generateKeywordIdeas(keyword, options = {}) {
  if (!keyword || typeof keyword !== 'string') {
    throw new Error('A valid keyword string is required.');
  }

  // Parse limit: default 50, min 1, max 200
  const limit = Math.min(200, Math.max(1, Number(options.limit) || 50));

  const cleanKw = keyword.trim();
  const cacheKey = cleanKw.toLowerCase();
  const now = Date.now();

  // 1. Check 24-hour cache (return sliced copy by requested limit)
  const cached = keywordCache.get(cacheKey);
  if (cached && now < cached.expiresAt) {
    return cached.data.slice(0, limit);
  }

  // 2. Obtain valid Access Token & USD/PKR Exchange Rate concurrently
  const [accessToken, usdPerPkr] = await Promise.all([
    getAccessToken(),
    getUsdPerPkr()
  ]);

  // 3. Prepare Customer ID & Endpoint
  const customerId = (env.GOOGLE_ADS_CUSTOMER_ID || '7500158188').replace(/[^0-9]/g, '');
  if (!customerId) {
    throw new Error('Google Ads Customer ID is missing or invalid.');
  }

  const endpoint = `https://googleads.googleapis.com/v24/customers/${customerId}:generateKeywordIdeas`;

  const requestBody = {
    keywordSeed: {
      keywords: [cleanKw]
    },
    geoTargetConstants: ['geoTargetConstants/2840'], // United States (default)
    language: 'languageConstants/1000', // English
    keywordPlanNetwork: 'GOOGLE_SEARCH'
  };

  try {
    const response = await axios.post(endpoint, requestBody, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
        // developer-token header intentionally omitted as specified
      },
      timeout: 15000
    });

    const rawResults = response.data?.results || [];

    // 4. Format response: text, avgMonthlySearches, competition, CPC (converted to USD), currency, monthlySearchVolumes
    const formatted = rawResults.map((item) => {
      const text = item.text || cleanKw;
      const metrics = item.keywordIdeaMetrics || {};

      // Average monthly searches
      const avgMonthlySearches = metrics.avgMonthlySearches ? Number(metrics.avgMonthlySearches) : 0;

      // Competition enum (LOW, MEDIUM, HIGH, etc.)
      const competition = metrics.competition || 'UNSPECIFIED';

      // CPC conversion:
      // Google Ads account currency is PKR.
      // lowTopOfPageBidMicros and highTopOfPageBidMicros divided by 1,000,000 gives PKR value.
      // Multiply PKR value by usdPerPkr to convert to USD, rounded to 2 decimals.
      const rawLowMicros = Number(metrics.lowTopOfPageBidMicros) || 0;
      const rawHighMicros = Number(metrics.highTopOfPageBidMicros) || 0;

      const lowPkr = rawLowMicros > 0 ? (rawLowMicros / 1000000) : 0;
      const highPkr = rawHighMicros > 0 ? (rawHighMicros / 1000000) : 0;

      const lowCpc = lowPkr > 0 ? Number((lowPkr * usdPerPkr).toFixed(2)) : 0;
      const highCpc = highPkr > 0 ? Number((highPkr * usdPerPkr).toFixed(2)) : 0;
      const cpc = highCpc > 0 ? highCpc : lowCpc;

      // Monthly Search Volumes (12 months trend)
      const monthlySearchVolumes = (metrics.monthlySearchVolumes || []).map((m) => ({
        year: Number(m.year),
        month: m.month,
        monthlySearches: Number(m.monthlySearches || 0)
      }));

      return {
        text,
        avgMonthlySearches,
        competition,
        cpc,
        cpcRange: {
          low: lowCpc,
          high: highCpc
        },
        currency: 'USD',
        monthlySearchVolumes
      };
    });

    // Sort descending by avgMonthlySearches
    formatted.sort((a, b) => b.avgMonthlySearches - a.avgMonthlySearches);

    // 5. Cache full sorted results for 24 hours
    keywordCache.set(cacheKey, {
      data: formatted,
      expiresAt: now + CACHE_TTL_MS
    });

    return formatted.slice(0, limit);
  } catch (err) {
    // Sanitize error: never log full request headers or secrets
    const status = err.response?.status;
    const apiError = err.response?.data?.error?.message || err.response?.data?.message || err.message;
    console.error(`[GoogleAdsService] API call failed (${status || 'network'}):`, apiError);
    throw new Error(`Google Ads API error: ${apiError}`);
  }
}

module.exports = {
  getAccessToken,
  getUsdPerPkr,
  generateKeywordIdeas
};

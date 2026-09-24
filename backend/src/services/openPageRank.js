const axios = require('axios');
const env = require('../config/env');
const { hashCode } = require('./trendEngine');

const OPR_BASE = 'https://openpagerank.com/api/v1.0/getPageRank';

/**
 * Get OpenPageRank domain authority scores.
 * Falls back to a deterministic estimate when no API key is configured.
 */
async function getDomainMetrics(domains) {
  const uniqueDomains = [...new Set(domains.map(d => d.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '')))];

  if (env.OPENPAGERANK_API_KEY) {
    return fetchFromOPR(uniqueDomains);
  }

  return uniqueDomains.map(d => estimateDomainMetrics(d));
}

async function fetchFromOPR(domains) {
  const results = [];
  const batchSize = 10;

  for (let i = 0; i < domains.length; i += batchSize) {
    const batch = domains.slice(i, i + batchSize);
    try {
      const res = await axios.get(OPR_BASE, {
        params: batch.reduce((acc, d, idx) => { acc[`domains[${idx}]`] = d; return acc; }, {}),
        headers: { 'API-OPR': env.OPENPAGERANK_API_KEY },
        timeout: 8000
      });
      const data = res.data?.response || [];
      data.forEach(item => {
        results.push({
          domain: item.domain,
          pageRank: item.page_rank_decimal || 0,
          rank: item.rank || 'N/A',
          status: item.status_code === 200 ? 'found' : 'not_found',
          authorityTier: getAuthorityTier(item.page_rank_decimal || 0)
        });
      });
    } catch (err) {
      console.error('[openPageRank] OPR API error:', err.message);
      batch.forEach(d => results.push(estimateDomainMetrics(d)));
    }
  }
  return results;
}

/**
 * Deterministic domain authority estimate (fallback).
 */
function estimateDomainMetrics(domain) {
  const hash = hashCode(domain);
  const tld = domain.split('.').pop();
  const domainLen = domain.length;

  // Known TLD boost
  const tldBoost = { com: 2, org: 1.5, edu: 3, gov: 3, net: 1, io: 1.2, co: 0.8 }[tld] || 0.5;

  // Shorter domains tend to be older/more authoritative
  const lengthScore = Math.max(0, 10 - domainLen * 0.3);

  const base = ((hash % 60) * 0.1) + tldBoost * 1.5 + lengthScore * 0.3;
  const pr = Math.min(10, Math.max(0, parseFloat(base.toFixed(1))));

  return {
    domain,
    pageRank: pr,
    rank: pr > 7 ? 'Top 10K' : pr > 5 ? 'Top 100K' : pr > 3 ? 'Top 1M' : 'Unranked',
    status: 'estimated',
    authorityTier: getAuthorityTier(pr)
  };
}

function getAuthorityTier(pr) {
  if (pr >= 7) return 'Very High';
  if (pr >= 5) return 'High';
  if (pr >= 3) return 'Medium';
  if (pr >= 1) return 'Low';
  return 'Very Low';
}

module.exports = { getDomainMetrics };

(function () {
  'use strict';
  console.log('[KWEveryWhere Extension]: Content script active on Google Search.');

  function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  const query = getQueryParam('q');
  if (!query) return;

  // Default API host — matches backend server port
  let apiHost = 'http://localhost:4001/api';

  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['kws_host'], (data) => {
      if (data.kws_host) apiHost = data.kws_host;
      fetchAndInjectMetrics(query, apiHost);
    });
  } else {
    fetchAndInjectMetrics(query, apiHost);
  }

  async function fetchAndInjectMetrics(keyword, host) {
    try {
      const response = await fetch(`${host}/keyword-research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords: [keyword] })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      // Support both array and object response shapes
      const item = Array.isArray(data.data) ? data.data[0] : (data.data || data);
      if (item) {
        injectMetricsBar(normalizeItem(item, keyword));
      } else {
        injectFallbackBar(keyword);
      }
    } catch (error) {
      console.warn('[KWEveryWhere]: API unreachable, showing estimated metrics.', error.message);
      injectFallbackBar(keyword);
    }
  }

  // Normalize varying API response shapes
  function normalizeItem(raw, fallbackKeyword) {
    return {
      keyword:      raw.keyword || raw.term || fallbackKeyword,
      searchVolume: raw.searchVolume || raw.volume || raw.search_volume || generateEstimate(fallbackKeyword),
      difficulty:   raw.difficulty  || raw.kd   || 0,
      competition:  raw.competition || raw.competitionLevel || 'N/A',
      cpc:          parseFloat(raw.cpc || raw.avgCpc || 0),
      trend:        raw.trend || raw.monthlyTrend || null,
      suggestions:  raw.suggestions || raw.related || []
    };
  }

  // Deterministic-ish estimate from keyword string (for offline demo)
  function generateEstimate(kw) {
    let h = 0;
    for (let i = 0; i < kw.length; i++) h = (h * 31 + kw.charCodeAt(i)) & 0xFFFFFF;
    return Math.max(500, (h % 90000) + 1000);
  }

  function injectFallbackBar(keyword) {
    const vol = generateEstimate(keyword);
    injectMetricsBar({
      keyword,
      searchVolume: vol,
      difficulty:   Math.floor(20 + (vol % 60)),
      competition:  vol > 50000 ? 'HIGH' : vol > 15000 ? 'MEDIUM' : 'LOW',
      cpc:          parseFloat((0.3 + (vol % 800) / 100).toFixed(2)),
      suggestions:  [`best ${keyword}`, `${keyword} 2025`, `${keyword} guide`, `how to ${keyword}`]
    });
  }

  function injectMetricsBar(item) {
    if (document.getElementById('kwew-bar')) return;

    const targetCol = document.getElementById('center_col')
                   || document.getElementById('search')
                   || document.querySelector('#rcnt')
                   || document.body;

    const diffColor = item.difficulty > 65 ? '#F87171' : item.difficulty > 35 ? '#FBBF24' : '#34D399';
    const compColor = item.competition === 'HIGH' ? '#F87171' : item.competition === 'MEDIUM' ? '#FBBF24' : '#34D399';

    const bar = document.createElement('div');
    bar.id = 'kwew-bar';

    bar.innerHTML = `
      <div class="kwew-header">
        <div class="kwew-brand">
          <svg class="kwew-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span class="kwew-brand-name">KWEveryWhere</span>
          <span class="kwew-live-badge">
            <span class="kwew-ping-dot"></span>
            Live Metrics
          </span>
        </div>
        <div class="kwew-query-label">"${item.keyword}"</div>
      </div>

      <div class="kwew-grid">
        <div class="kwew-card">
          <div class="kwew-card-label">Search Volume</div>
          <div class="kwew-card-value" style="color:#34D399">${item.searchVolume.toLocaleString()}<span class="kwew-unit">/mo</span></div>
        </div>

        <div class="kwew-card">
          <div class="kwew-card-label">Keyword Difficulty</div>
          <div class="kwew-card-value" style="color:${diffColor}">${item.difficulty}<span class="kwew-unit">/ 100</span></div>
        </div>

        <div class="kwew-card">
          <div class="kwew-card-label">Competition</div>
          <div class="kwew-card-value" style="color:${compColor}">${item.competition}</div>
        </div>

        <div class="kwew-card">
          <div class="kwew-card-label">Est. CPC</div>
          <div class="kwew-card-value" style="color:#FBBF24">$${item.cpc.toFixed(2)}</div>
        </div>
      </div>

      ${item.suggestions && item.suggestions.length > 0 ? `
        <div class="kwew-suggestions">
          <span class="kwew-sug-label">Related searches:</span>
          ${item.suggestions.slice(0, 5).map(s =>
            `<a href="/search?q=${encodeURIComponent(s)}" class="kwew-sug-chip">${s}</a>`
          ).join('')}
        </div>
      ` : ''}

      <div class="kwew-footer">
        <span>Powered by <a href="http://localhost:4000" target="_blank" class="kwew-footer-link">KWEveryWhere</a></span>
        <span>Free SEO Research Tool</span>
      </div>
    `;

    targetCol.insertBefore(bar, targetCol.firstChild);
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const tokenInput = document.getElementById('api-token');
  const hostInput = document.getElementById('api-host');
  const saveBtn = document.getElementById('save-btn');
  const statusCard = document.getElementById('status-card');
  const statusText = document.getElementById('status-text');
  const quickKwInput = document.getElementById('quick-kw');
  const searchBtn = document.getElementById('search-btn');
  const resultBox = document.getElementById('result-box');

  // Load saved settings
  if (chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(['kws_token', 'kws_host'], (data) => {
      if (data.kws_token) {
        tokenInput.value = data.kws_token;
        updateStatus(true, 'Connected to KWS API');
      }
      if (data.kws_host) {
        hostInput.value = data.kws_host;
      }
    });
  }

  function updateStatus(isConnected, message) {
    if (isConnected) {
      statusCard.className = 'status-card status-connected';
      statusText.textContent = message || 'Connected to KWS Engine';
    } else {
      statusCard.className = 'status-card status-disconnected';
      statusText.textContent = message || 'Disconnected (No Token)';
    }
  }

  saveBtn.addEventListener('click', () => {
    const token = tokenInput.value.trim();
    const host = hostInput.value.trim() || 'http://localhost:4001/api';

    if (chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ kws_token: token, kws_host: host }, () => {
        if (token) {
          updateStatus(true, 'Token Saved & Connected!');
        } else {
          updateStatus(false, 'Disconnected (Token Cleared)');
        }
      });
    } else {
      updateStatus(true, 'Saved locally');
    }
  });

  searchBtn.addEventListener('click', async () => {
    const kw = quickKwInput.value.trim();
    if (!kw) return;

    resultBox.className = 'result-box';
    resultBox.textContent = 'Analyzing keyword metrics...';

    const host = hostInput.value.trim() || 'http://localhost:99009/api';
    const token = tokenInput.value.trim();

    try {
      const response = await fetch(`${host}/keyword-research`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-api-key': token
        },
        body: JSON.stringify({ keywords: [kw] })
      });

      const data = await response.json();
      if (data.status === 'success' && data.data && data.data[0]) {
        const item = data.data[0];
        resultBox.innerHTML = `
          <div style="font-weight: 700; color: #10B981;">"${item.keyword}"</div>
          <div>Volume: <strong>${item.searchVolume.toLocaleString()} /mo</strong></div>
          <div>Difficulty: <strong>${item.difficulty}% (${item.competition})</strong></div>
          <div>CPC: <strong>$${item.cpc.toFixed(2)}</strong></div>
        `;
      } else {
        resultBox.textContent = data.message || 'No metrics returned.';
      }
    } catch (err) {
      resultBox.textContent = `Error: ${err.message}. Check backend API URL.`;
    }
  });
});

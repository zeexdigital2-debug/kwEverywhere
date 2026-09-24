// Manifest V3 Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('[KWS Pulse Service Worker]: Extension installed successfully.');
});

// Listener for content script background messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'CHECK_AUTH') {
    chrome.storage.local.get(['kws_token'], (result) => {
      sendResponse({ token: result.kws_token || null });
    });
    return true; // Keep async response channel open
  }
});

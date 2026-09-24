const fs = require('fs');
const path = require('path');

// Simple file-based fallback for history if no DB is connected
const historyDir = path.join(__dirname, '../../data');
if (!fs.existsSync(historyDir)) {
  fs.mkdirSync(historyDir, { recursive: true });
}

async function getHistory(req, res) {
  try {
    const userId = req.user.id;
    const filePath = path.join(historyDir, `${userId}.json`);
    
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return res.json({ success: true, history: data });
    }
    
    return res.json({ success: true, history: [] });
  } catch (err) {
    console.error('[historyController] getHistory Error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

async function saveHistory(req, res) {
  try {
    const userId = req.user.id;
    const { tool, query, resultsCount } = req.body;
    
    if (!tool || !query) {
      return res.status(400).json({ error: 'Tool and query are required.' });
    }

    const filePath = path.join(historyDir, `${userId}.json`);
    let history = [];
    
    if (fs.existsSync(filePath)) {
      history = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    
    const newEntry = {
      id: Date.now().toString(),
      tool,
      query,
      resultsCount: resultsCount || 0,
      timestamp: new Date().toISOString()
    };
    
    history.unshift(newEntry); // Add to beginning
    
    // Keep only last 100 entries
    if (history.length > 100) history = history.slice(0, 100);
    
    fs.writeFileSync(filePath, JSON.stringify(history, null, 2));
    
    return res.json({ success: true, entry: newEntry });
  } catch (err) {
    console.error('[historyController] saveHistory Error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = { getHistory, saveHistory };

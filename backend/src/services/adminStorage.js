const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const Article = require('../models/Article');
const Category = require('../models/Category');
const Media = require('../models/Media');
const User = require('../models/User');
const AdminSetting = require('../models/AdminSetting');
const KeywordHistory = require('../models/KeywordHistory');

const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function isDbConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

function readJson(filename, defaultVal = []) {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultVal, null, 2), 'utf-8');
    return defaultVal;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    return defaultVal;
  }
}

function writeJson(filename, data) {
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Initial seed for categories if empty
const DEFAULT_CATEGORIES = [
  { _id: 'cat_seo_guide', name: 'SEO Guides', slug: 'seo-guides', description: 'Actionable SEO tips and search strategies', color: '#2563eb', createdAt: new Date() },
  { _id: 'cat_kw_res', name: 'Keyword Research', slug: 'keyword-research', description: 'Mastering search intent and keyword discovery', color: '#10b981', createdAt: new Date() },
  { _id: 'cat_serp', name: 'SERP & Trends', slug: 'serp-trends', description: 'Algorithm updates and market insights', color: '#8b5cf6', createdAt: new Date() }
];

const DEFAULT_ARTICLES = [
  {
    _id: 'art_1',
    title: 'How to Find High-Volume Low-Competition Keywords in 2026',
    slug: 'how-to-find-high-volume-low-competition-keywords-2026',
    excerpt: 'Step-by-step framework to discover untapped search queries that drive qualified organic traffic.',
    content: '<h2>Mastering Search Intent in Modern SEO</h2><p>Keyword research in 2026 is no longer just about raw search volume. Search algorithms prioritize topical authority, searcher intent, and semantic context. Using tools like <strong>Keywords Everywhere</strong>, marketers can instantly pinpoint exact buyer queries.</p><h3>Key Steps:</h3><ul><li>Analyze keyword difficulty & CPC</li><li>Examine the top 3 ranking SERP pages</li><li>Target long-tail variations</li></ul>',
    featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    category: 'cat_kw_res',
    tags: ['seo', 'keyword research', 'search volume'],
    status: 'published',
    author: 'Admin',
    views: 142,
    seo: {
      metaTitle: 'How to Find High-Volume Low-Competition Keywords | KW Everywhere',
      metaDescription: 'Step-by-step framework to discover untapped search queries that drive qualified organic traffic.',
      focusKeywords: ['keyword research', 'low competition keywords'],
      canonicalUrl: '',
      ogImage: '',
      noIndex: false
    },
    publishedAt: new Date(),
    createdAt: new Date()
  }
];

// Initialize default JSON data if empty
if (!fs.existsSync(path.join(dataDir, 'categories.json'))) {
  writeJson('categories.json', DEFAULT_CATEGORIES);
}
if (!fs.existsSync(path.join(dataDir, 'articles.json'))) {
  writeJson('articles.json', DEFAULT_ARTICLES);
}

module.exports = {
  isDbConnected,
  readJson,
  writeJson
};

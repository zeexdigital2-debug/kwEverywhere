const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const Category = require('../models/Category');
const adminSettingsController = require('../controllers/adminSettingsController');
const { isDbConnected, readJson } = require('../services/adminStorage');

// Public settings
router.get('/settings', adminSettingsController.getPublicSettings);

// Public published articles
router.get('/articles', async (req, res) => {
  try {
    const { page = 1, limit = 10, category = '', tag = '', search = '' } = req.query;

    if (isDbConnected()) {
      const query = { status: 'published' };
      if (category) {
        const cat = await Category.findOne({ slug: category });
        if (cat) query.category = cat._id;
      }
      if (tag) query.tags = tag;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } }
        ];
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await Article.countDocuments(query);
      const articles = await Article.find(query)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('category', 'name slug color');

      return res.status(200).json({
        success: true,
        articles,
        pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) }
      });
    }

    let articles = readJson('articles.json', []).filter(a => a.status === 'published');
    const categories = readJson('categories.json', []);
    const catMap = {};
    categories.forEach(c => { catMap[c._id] = { _id: c._id, name: c.name, slug: c.slug, color: c.color }; });

    if (category) {
      const cat = categories.find(c => c.slug === category);
      if (cat) articles = articles.filter(a => a.category === cat._id || (a.category && a.category._id === cat._id));
    }
    if (tag) {
      articles = articles.filter(a => a.tags && a.tags.includes(tag));
    }
    if (search) {
      const s = search.toLowerCase();
      articles = articles.filter(a =>
        (a.title && a.title.toLowerCase().includes(s)) ||
        (a.excerpt && a.excerpt.toLowerCase().includes(s))
      );
    }

    const total = articles.length;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginated = articles.slice(skip, skip + parseInt(limit)).map(a => ({
      ...a,
      category: typeof a.category === 'string' ? (catMap[a.category] || null) : a.category
    }));

    return res.status(200).json({
      success: true,
      articles: paginated,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Single published article by slug
router.get('/articles/:slug', async (req, res) => {
  try {
    if (isDbConnected()) {
      const article = await Article.findOneAndUpdate(
        { slug: req.params.slug, status: 'published' },
        { $inc: { views: 1 } },
        { new: true }
      ).populate('category', 'name slug color');

      if (!article) return res.status(404).json({ success: false, message: 'Article not found.' });
      return res.status(200).json({ success: true, article });
    }

    const articles = readJson('articles.json', []);
    const categories = readJson('categories.json', []);
    const catMap = {};
    categories.forEach(c => { catMap[c._id] = { _id: c._id, name: c.name, slug: c.slug, color: c.color }; });

    const article = articles.find(a => a.slug === req.params.slug && a.status === 'published');
    if (!article) return res.status(404).json({ success: false, message: 'Article not found.' });

    article.views = (article.views || 0) + 1;
    const enriched = {
      ...article,
      category: typeof article.category === 'string' ? (catMap[article.category] || null) : article.category
    };

    return res.status(200).json({ success: true, article: enriched });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Public categories
router.get('/categories', async (req, res) => {
  try {
    if (isDbConnected()) {
      const categories = await Category.find().sort({ name: 1 });
      return res.status(200).json({ success: true, categories });
    }
    const categories = readJson('categories.json', []);
    return res.status(200).json({ success: true, categories });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

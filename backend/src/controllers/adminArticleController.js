const Article = require('../models/Article');
const { isDbConnected, readJson, writeJson } = require('../services/adminStorage');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

exports.getArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '', category = '', sort = '-createdAt' } = req.query;

    if (isDbConnected()) {
      const query = {};
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { slug: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } }
        ];
      }
      if (status) query.status = status;
      if (category) query.category = category;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await Article.countDocuments(query);
      const articles = await Article.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('category', 'name color slug');

      return res.status(200).json({
        success: true,
        articles,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      });
    }

    // JSON fallback
    let articles = readJson('articles.json', []);
    const categories = readJson('categories.json', []);
    const catMap = {};
    categories.forEach(c => { catMap[c._id] = { _id: c._id, name: c.name, color: c.color, slug: c.slug }; });

    if (search) {
      const s = search.toLowerCase();
      articles = articles.filter(a =>
        (a.title && a.title.toLowerCase().includes(s)) ||
        (a.slug && a.slug.toLowerCase().includes(s)) ||
        (a.excerpt && a.excerpt.toLowerCase().includes(s))
      );
    }
    if (status) {
      articles = articles.filter(a => a.status === status);
    }
    if (category) {
      articles = articles.filter(a => a.category === category || (a.category && a.category._id === category));
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
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    if (isDbConnected()) {
      const article = await Article.findById(req.params.id).populate('category', 'name color slug');
      if (!article) return res.status(404).json({ success: false, message: 'Article not found.' });
      return res.status(200).json({ success: true, article });
    }

    const articles = readJson('articles.json', []);
    const categories = readJson('categories.json', []);
    const catMap = {};
    categories.forEach(c => { catMap[c._id] = { _id: c._id, name: c.name, color: c.color, slug: c.slug }; });

    const found = articles.find(a => a._id === req.params.id);
    if (!found) return res.status(404).json({ success: false, message: 'Article not found.' });

    const article = {
      ...found,
      category: typeof found.category === 'string' ? (catMap[found.category] || null) : found.category
    };

    return res.status(200).json({ success: true, article });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createArticle = async (req, res) => {
  try {
    const { title, slug, content, excerpt, featuredImage, category, tags, status, seo, author } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    let finalSlug = slug ? slugify(slug) : slugify(title);

    if (isDbConnected()) {
      let existing = await Article.findOne({ slug: finalSlug });
      if (existing) finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;

      const newArticle = new Article({
        title,
        slug: finalSlug,
        content,
        excerpt: excerpt || '',
        featuredImage: featuredImage || '',
        category: category || null,
        tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
        status: status || 'draft',
        author: author || 'Admin',
        seo: {
          metaTitle: seo?.metaTitle || title,
          metaDescription: seo?.metaDescription || excerpt || '',
          focusKeywords: seo?.focusKeywords || [],
          canonicalUrl: seo?.canonicalUrl || '',
          ogImage: seo?.ogImage || featuredImage || '',
          noIndex: seo?.noIndex || false
        },
        publishedAt: status === 'published' ? new Date() : null
      });

      await newArticle.save();
      return res.status(201).json({ success: true, message: 'Article created.', article: newArticle });
    }

    const articles = readJson('articles.json', []);
    let existing = articles.find(a => a.slug === finalSlug);
    if (existing) finalSlug = `${finalSlug}-${Date.now().toString().slice(-4)}`;

    const newArticle = {
      _id: 'art_' + Date.now(),
      title,
      slug: finalSlug,
      content,
      excerpt: excerpt || '',
      featuredImage: featuredImage || '',
      category: category || null,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      status: status || 'draft',
      author: author || 'Admin',
      views: 0,
      seo: {
        metaTitle: seo?.metaTitle || title,
        metaDescription: seo?.metaDescription || excerpt || '',
        focusKeywords: seo?.focusKeywords || [],
        canonicalUrl: seo?.canonicalUrl || '',
        ogImage: seo?.ogImage || featuredImage || '',
        noIndex: seo?.noIndex || false
      },
      publishedAt: status === 'published' ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    articles.unshift(newArticle);
    writeJson('articles.json', articles);

    return res.status(201).json({ success: true, message: 'Article created successfully.', article: newArticle });
  } catch (error) {
    console.error('Create article error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.slug) {
      updateData.slug = slugify(updateData.slug);
    }
    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(t => t.trim());
    }

    if (isDbConnected()) {
      if (updateData.status === 'published') {
        const current = await Article.findById(id);
        if (current && !current.publishedAt) updateData.publishedAt = new Date();
      }
      const updated = await Article.findByIdAndUpdate(id, updateData, { new: true }).populate('category', 'name color slug');
      if (!updated) return res.status(404).json({ success: false, message: 'Article not found.' });
      return res.status(200).json({ success: true, message: 'Article updated.', article: updated });
    }

    const articles = readJson('articles.json', []);
    const idx = articles.findIndex(a => a._id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Article not found.' });

    if (updateData.status === 'published' && !articles[idx].publishedAt) {
      updateData.publishedAt = new Date();
    }
    updateData.updatedAt = new Date();

    articles[idx] = { ...articles[idx], ...updateData };
    writeJson('articles.json', articles);

    return res.status(200).json({ success: true, message: 'Article updated.', article: articles[idx] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const deleted = await Article.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Article not found.' });
      return res.status(200).json({ success: true, message: 'Article deleted.' });
    }

    let articles = readJson('articles.json', []);
    const beforeLen = articles.length;
    articles = articles.filter(a => a._id !== id);
    if (articles.length === beforeLen) return res.status(404).json({ success: false, message: 'Article not found.' });
    writeJson('articles.json', articles);

    return res.status(200).json({ success: true, message: 'Article deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.bulkAction = async (req, res) => {
  try {
    const { ids, action } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'No article IDs provided.' });
    }

    if (isDbConnected()) {
      if (action === 'delete') {
        await Article.deleteMany({ _id: { $in: ids } });
      } else if (action === 'publish') {
        await Article.updateMany({ _id: { $in: ids } }, { $set: { status: 'published', publishedAt: new Date() } });
      } else if (action === 'draft') {
        await Article.updateMany({ _id: { $in: ids } }, { $set: { status: 'draft' } });
      }
      return res.status(200).json({ success: true, message: 'Bulk action completed.' });
    }

    let articles = readJson('articles.json', []);
    if (action === 'delete') {
      articles = articles.filter(a => !ids.includes(a._id));
    } else if (action === 'publish') {
      articles = articles.map(a => ids.includes(a._id) ? { ...a, status: 'published', publishedAt: new Date() } : a);
    } else if (action === 'draft') {
      articles = articles.map(a => ids.includes(a._id) ? { ...a, status: 'draft' } : a);
    }
    writeJson('articles.json', articles);

    return res.status(200).json({ success: true, message: 'Bulk action completed.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

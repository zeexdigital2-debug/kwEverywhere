const Category = require('../models/Category');
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

exports.getCategories = async (req, res) => {
  try {
    if (isDbConnected()) {
      const categories = await Category.find().sort({ name: 1 });
      const counts = await Article.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);
      const countMap = {};
      counts.forEach(c => { if (c._id) countMap[c._id.toString()] = c.count; });

      const enriched = categories.map(cat => ({
        ...cat.toObject(),
        articleCount: countMap[cat._id.toString()] || 0
      }));

      return res.status(200).json({ success: true, categories: enriched });
    }

    const categories = readJson('categories.json', []);
    const articles = readJson('articles.json', []);
    const countMap = {};
    articles.forEach(a => {
      const catId = typeof a.category === 'object' && a.category ? a.category._id : a.category;
      if (catId) countMap[catId] = (countMap[catId] || 0) + 1;
    });

    const enriched = categories.map(c => ({
      ...c,
      articleCount: countMap[c._id] || 0
    }));

    return res.status(200).json({ success: true, categories: enriched });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description, color } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const finalSlug = slug ? slugify(slug) : slugify(name);

    if (isDbConnected()) {
      const existing = await Category.findOne({ slug: finalSlug });
      if (existing) return res.status(400).json({ success: false, message: 'A category with this slug already exists.' });

      const category = new Category({
        name: name.trim(),
        slug: finalSlug,
        description: description || '',
        color: color || '#2563eb'
      });
      await category.save();
      return res.status(201).json({ success: true, message: 'Category created.', category });
    }

    const categories = readJson('categories.json', []);
    if (categories.some(c => c.slug === finalSlug)) {
      return res.status(400).json({ success: false, message: 'A category with this slug already exists.' });
    }

    const newCat = {
      _id: 'cat_' + Date.now(),
      name: name.trim(),
      slug: finalSlug,
      description: description || '',
      color: color || '#2563eb',
      articleCount: 0,
      createdAt: new Date()
    };

    categories.push(newCat);
    writeJson('categories.json', categories);

    return res.status(201).json({ success: true, message: 'Category created successfully.', category: newCat });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, color } = req.body;

    if (isDbConnected()) {
      const category = await Category.findById(id);
      if (!category) return res.status(404).json({ success: false, message: 'Category not found.' });

      if (name) category.name = name.trim();
      if (slug) category.slug = slugify(slug);
      if (description !== undefined) category.description = description;
      if (color) category.color = color;

      await category.save();
      return res.status(200).json({ success: true, message: 'Category updated.', category });
    }

    const categories = readJson('categories.json', []);
    const idx = categories.findIndex(c => c._id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Category not found.' });

    if (name) categories[idx].name = name.trim();
    if (slug) categories[idx].slug = slugify(slug);
    if (description !== undefined) categories[idx].description = description;
    if (color) categories[idx].color = color;

    writeJson('categories.json', categories);
    return res.status(200).json({ success: true, message: 'Category updated.', category: categories[idx] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const deleted = await Category.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Category not found.' });
      await Article.updateMany({ category: id }, { $set: { category: null } });
      return res.status(200).json({ success: true, message: 'Category deleted.' });
    }

    let categories = readJson('categories.json', []);
    categories = categories.filter(c => c._id !== id);
    writeJson('categories.json', categories);

    let articles = readJson('articles.json', []);
    articles = articles.map(a => a.category === id ? { ...a, category: null } : a);
    writeJson('articles.json', articles);

    return res.status(200).json({ success: true, message: 'Category deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

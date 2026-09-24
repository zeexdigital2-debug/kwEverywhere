const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  content: { type: String, required: true },
  excerpt: { type: String, default: '' },
  featuredImage: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  tags: [{ type: String, trim: true }],
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  author: { type: String, default: 'Admin' },
  seo: {
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    focusKeywords: [{ type: String, trim: true }],
    canonicalUrl: { type: String, default: '' },
    ogImage: { type: String, default: '' },
    noIndex: { type: Boolean, default: false }
  },
  views: { type: Number, default: 0 },
  publishedAt: { type: Date, default: null }
}, {
  timestamps: true
});

articleSchema.index({ status: 1 });
articleSchema.index({ createdAt: -1 });

module.exports = mongoose.models.Article || mongoose.model('Article', articleSchema);

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminService } from '@/lib/adminApi';
import {
  ArrowLeft,
  Save,
  Globe,
  Eye,
  Edit3,
  Image as ImageIcon,
  Sparkles,
  Search,
  CheckCircle,
  Clock,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2
} from 'lucide-react';

export default function ArticleEditor({ articleId = null }) {
  const router = useRouter();
  const isEditMode = !!articleId;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('draft');
  const [author, setAuthor] = useState('Admin');

  // SEO metadata
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeywords, setFocusKeywords] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [noIndex, setNoIndex] = useState(false);

  // States
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('write'); // 'write' or 'preview'
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const catRes = await adminService.getCategories();
        if (catRes && catRes.success) {
          setCategories(catRes.categories || []);
        }

        if (isEditMode) {
          const artRes = await adminService.getArticle(articleId);
          if (artRes && artRes.success && artRes.article) {
            const a = artRes.article;
            setTitle(a.title || '');
            setSlug(a.slug || '');
            setContent(a.content || '');
            setExcerpt(a.excerpt || '');
            setFeaturedImage(a.featuredImage || '');
            setCategory(a.category?._id || a.category || '');
            setTags(Array.isArray(a.tags) ? a.tags.join(', ') : (a.tags || ''));
            setStatus(a.status || 'draft');
            setAuthor(a.author || 'Admin');

            if (a.seo) {
              setMetaTitle(a.seo.metaTitle || '');
              setMetaDescription(a.seo.metaDescription || '');
              setFocusKeywords(Array.isArray(a.seo.focusKeywords) ? a.seo.focusKeywords.join(', ') : '');
              setCanonicalUrl(a.seo.canonicalUrl || '');
              setNoIndex(!!a.seo.noIndex);
            }
          }
        }
      } catch (err) {
        console.error(err);
        setNotification({ type: 'error', message: 'Failed to load article details.' });
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [articleId, isEditMode]);

  // Auto-generate slug when title changes (if new article)
  const handleTitleChange = (val) => {
    setTitle(val);
    if (!isEditMode && (!slug || slug === title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, ''))) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
      );
    }
  };

  const handleInsertTag = (prefix, suffix = '') => {
    setContent((prev) => prev + `${prefix}${suffix}`);
  };

  const handleSubmit = async (submitStatus = status) => {
    if (!title.trim() || !content.trim()) {
      setNotification({ type: 'error', message: 'Title and content cannot be empty.' });
      return;
    }

    setSaving(true);
    setNotification(null);

    const payload = {
      title,
      slug: slug || undefined,
      content,
      excerpt,
      featuredImage,
      category: category || null,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      status: submitStatus,
      author,
      seo: {
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt,
        focusKeywords: focusKeywords.split(',').map(k => k.trim()).filter(Boolean),
        canonicalUrl,
        ogImage: featuredImage,
        noIndex
      }
    };

    try {
      if (isEditMode) {
        const res = await adminService.updateArticle(articleId, payload);
        if (res && res.success) {
          setStatus(submitStatus);
          setNotification({ type: 'success', message: 'Article updated successfully.' });
        }
      } else {
        const res = await adminService.createArticle(payload);
        if (res && res.success) {
          setNotification({ type: 'success', message: 'Article created successfully!' });
          setTimeout(() => {
            router.push('/admin/articles');
          }, 1000);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Error saving article.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-3" />
        <p className="text-xs text-slate-400 font-medium">Loading Article Editor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              {isEditMode ? 'Edit Article' : 'Write New Article'}
            </h1>
            <p className="text-xs text-slate-400">
              {status === 'published' ? '🟢 Published on live site' : '🟡 Draft mode (unpublished)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            disabled={saving}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSubmit('published')}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Publishing...' : 'Publish Article'}</span>
          </button>
        </div>
      </div>

      {notification && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">
            &times;
          </button>
        </div>
      )}

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title input */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Article Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., The Ultimate Guide to Keyword Intent in 2026"
                className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-base font-bold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                URL Permalink / Slug
              </label>
              <div className="flex items-center rounded-xl bg-slate-950/60 border border-slate-800 px-3 py-2 text-xs text-slate-400">
                <span className="text-slate-500 mr-1 select-none">/blog/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="article-slug"
                  className="bg-transparent text-slate-200 focus:outline-none w-full"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Summary / Excerpt
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Short summary displayed on search results and blog listing cards..."
                className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Content Editor with Toolbar */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                <button
                  type="button"
                  onClick={() => handleInsertTag('<h2>', '</h2>')}
                  className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg text-xs"
                  title="Heading 2"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertTag('<h3>', '</h3>')}
                  className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg text-xs"
                  title="Heading 3"
                >
                  <Heading3 className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-slate-800 mx-1" />
                <button
                  type="button"
                  onClick={() => handleInsertTag('<strong>', '</strong>')}
                  className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg text-xs"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertTag('<em>', '</em>')}
                  className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg text-xs"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-slate-800 mx-1" />
                <button
                  type="button"
                  onClick={() => handleInsertTag('<ul>\n  <li>', '</li>\n</ul>')}
                  className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg text-xs"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertTag('<ol>\n  <li>', '</li>\n</ol>')}
                  className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg text-xs"
                  title="Numbered List"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertTag('<blockquote>', '</blockquote>')}
                  className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg text-xs"
                  title="Blockquote"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertTag('<pre><code>', '</code></pre>')}
                  className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg text-xs"
                  title="Code Block"
                >
                  <Code className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertTag('<a href="https://">', '</a>')}
                  className="p-1.5 hover:bg-slate-800 text-slate-300 rounded-lg text-xs"
                  title="Link"
                >
                  <Link2 className="w-4 h-4" />
                </button>
              </div>

              {/* Mode Toggle */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'write' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Write (HTML)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    activeTab === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Live Preview
                </button>
              </div>
            </div>

            {activeTab === 'write' ? (
              <textarea
                rows={16}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article content using HTML formatting or plain text..."
                className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 leading-relaxed"
              />
            ) : (
              <div
                className="prose prose-invert max-w-none p-5 bg-slate-950/60 border border-slate-800 rounded-xl min-h-[350px] text-xs text-slate-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content || '<p className="text-slate-600">No content to preview.</p>' }}
              />
            )}
          </div>
        </div>

        {/* Sidebar Settings & SEO (Right 1 col) */}
        <div className="space-y-5">
          {/* Publishing Info */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Publishing Options
            </h3>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Post Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Featured Image URL
              </label>
              <input
                type="text"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://... or /uploads/image.jpg"
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              {featuredImage && (
                <div className="mt-2 rounded-xl overflow-hidden border border-slate-800 h-28 relative">
                  <img
                    src={featuredImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="seo, serp, keywords"
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Admin"
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Search Engine Optimization (SEO) Box */}
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>Search Engine Preview (SEO)</span>
              </h3>
            </div>

            {/* Google SERP Snippet Preview */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                https://kweverywhere.com/blog/{slug || 'sample-slug'}
              </span>
              <h4 className="text-xs font-semibold text-blue-400 line-clamp-1">
                {metaTitle || title || 'Article Title Preview | Keywords Everywhere'}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {metaDescription || excerpt || 'Search description preview showing how this article appears in Google SERP results...'}
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-medium text-slate-400">Meta Title</label>
                <span className="text-[10px] text-slate-500">{metaTitle.length}/60 chars</span>
              </div>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder={title || 'Custom SEO Title'}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-medium text-slate-400">Meta Description</label>
                <span className="text-[10px] text-slate-500">{metaDescription.length}/160 chars</span>
              </div>
              <textarea
                rows={2}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder={excerpt || 'Compelling meta description...'}
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Focus Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={focusKeywords}
                onChange={(e) => setFocusKeywords(e.target.value)}
                placeholder="keyword research, serp analysis"
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="noindex"
                checked={noIndex}
                onChange={(e) => setNoIndex(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
              />
              <label htmlFor="noindex" className="text-xs text-slate-400 cursor-pointer">
                Instruct bots not to index (noindex)
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

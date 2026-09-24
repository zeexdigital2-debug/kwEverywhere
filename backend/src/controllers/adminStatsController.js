const Article = require('../models/Article');
const Category = require('../models/Category');
const Media = require('../models/Media');
const User = require('../models/User');
const KeywordHistory = require('../models/KeywordHistory');
const { isDbConnected, readJson } = require('../services/adminStorage');

exports.getOverviewStats = async (req, res) => {
  try {
    if (isDbConnected()) {
      const [
        totalArticles,
        publishedArticles,
        draftArticles,
        totalCategories,
        totalMedia,
        totalUsers,
        proUsers,
        totalKeywordsQueried,
        recentArticles,
        recentUsers
      ] = await Promise.all([
        Article.countDocuments(),
        Article.countDocuments({ status: 'published' }),
        Article.countDocuments({ status: 'draft' }),
        Category.countDocuments(),
        Media.countDocuments(),
        User.countDocuments(),
        User.countDocuments({ plan: { $in: ['pro', 'agency'] } }),
        KeywordHistory.countDocuments(),
        Article.find().sort({ createdAt: -1 }).limit(5).select('title slug status views createdAt category').populate('category', 'name color'),
        User.find().sort({ createdAt: -1 }).limit(5).select('email plan credits createdAt')
      ]);

      const viewsAgg = await Article.aggregate([
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ]);
      const totalViews = viewsAgg.length > 0 ? viewsAgg[0].totalViews : 0;

      return res.status(200).json({
        success: true,
        stats: {
          totalArticles,
          publishedArticles,
          draftArticles,
          totalCategories,
          totalMedia,
          totalUsers,
          proUsers,
          freeUsers: Math.max(0, totalUsers - proUsers),
          totalKeywordsQueried,
          totalViews
        },
        recentArticles,
        recentUsers
      });
    }

    // Fallback mode using persistent JSON data
    const articles = readJson('articles.json', []);
    const categories = readJson('categories.json', []);
    const media = readJson('media.json', []);
    const users = readJson('users.json', [
      { _id: 'u1', email: 'alex.marketer@example.com', plan: 'pro', credits: 980, createdAt: new Date(Date.now() - 86400000) },
      { _id: 'u2', email: 'sarah.seo@growth.io', plan: 'agency', credits: 4500, createdAt: new Date(Date.now() - 172800000) },
      { _id: 'u3', email: 'john.doe@gmail.com', plan: 'free', credits: 180, createdAt: new Date(Date.now() - 259200000) }
    ]);

    const publishedArticles = articles.filter(a => a.status === 'published').length;
    const draftArticles = articles.filter(a => a.status === 'draft').length;
    const proUsers = users.filter(u => u.plan === 'pro' || u.plan === 'agency').length;
    const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);

    const categoryMap = {};
    categories.forEach(c => { categoryMap[c._id] = { name: c.name, color: c.color }; });

    const recentArticles = articles.slice(0, 5).map(a => ({
      ...a,
      category: a.category ? (categoryMap[a.category] || { name: 'General', color: '#2563eb' }) : null
    }));

    return res.status(200).json({
      success: true,
      stats: {
        totalArticles: articles.length,
        publishedArticles,
        draftArticles,
        totalCategories: categories.length,
        totalMedia: media.length,
        totalUsers: users.length,
        proUsers,
        freeUsers: users.length - proUsers,
        totalKeywordsQueried: 1240,
        totalViews
      },
      recentArticles,
      recentUsers: users.slice(0, 5)
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics.',
      error: error.message
    });
  }
};

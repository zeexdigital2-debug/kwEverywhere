const express = require('express');
const router = express.Router();
const adminAuthMiddleware = require('../middleware/adminAuthMiddleware');

const adminStatsController = require('../controllers/adminStatsController');
const adminArticleController = require('../controllers/adminArticleController');
const adminCategoryController = require('../controllers/adminCategoryController');
const adminMediaController = require('../controllers/adminMediaController');
const adminUserController = require('../controllers/adminUserController');
const adminSettingsController = require('../controllers/adminSettingsController');

// Apply adminAuthMiddleware to all admin API routes
router.use(adminAuthMiddleware);

// --- Stats ---
router.get('/stats', adminStatsController.getOverviewStats);

// --- Articles ---
router.get('/articles', adminArticleController.getArticles);
router.get('/articles/:id', adminArticleController.getArticleById);
router.post('/articles', adminArticleController.createArticle);
router.put('/articles/:id', adminArticleController.updateArticle);
router.delete('/articles/:id', adminArticleController.deleteArticle);
router.post('/articles/bulk', adminArticleController.bulkAction);

// --- Categories ---
router.get('/categories', adminCategoryController.getCategories);
router.post('/categories', adminCategoryController.createCategory);
router.put('/categories/:id', adminCategoryController.updateCategory);
router.delete('/categories/:id', adminCategoryController.deleteCategory);

// --- Media ---
router.get('/media', adminMediaController.getMediaList);
router.post('/media/upload', adminMediaController.uploadMiddleware, adminMediaController.uploadMedia);
router.delete('/media/:id', adminMediaController.deleteMedia);

// --- Users ---
router.get('/users', adminUserController.getUsers);
router.get('/users/:id', adminUserController.getUserDetails);
router.put('/users/:id', adminUserController.updateUser);
router.delete('/users/:id', adminUserController.deleteUser);

// --- Settings ---
router.get('/settings', adminSettingsController.getSettings);
router.put('/settings', adminSettingsController.updateSettings);

module.exports = router;

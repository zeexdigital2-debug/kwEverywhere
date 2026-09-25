const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const env = require('./config/env');
const authMiddleware = require('./middleware/authMiddleware');
const { generalLimiter } = require('./middleware/rateLimiter');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

// Routes
const keywordResearchRoutes = require('./routes/keywordResearchRoutes');
const keywordsFinderRoutes = require('./routes/keywordsFinderRoutes');
const localKeywordsRoutes = require('./routes/localKeywordsRoutes');
const domainMetricsRoutes = require('./routes/domainMetricsRoutes');
const userRoutes = require('./routes/userRoutes');
const historyRoutes = require('./routes/historyRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contentRoutes = require('./routes/contentRoutes');

const app = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, server-to-server) or match allowed
    if (!origin) return callback(null, true);
    return callback(null, true); // dynamically allow requesting origin with credentials
  },
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Public Content & Settings Routes
app.use('/api/content', contentRoutes);

// Admin Auth Routes (login, logout, verify, change-password)
app.use('/api/admin/auth', adminAuthRoutes);

// Admin Management Routes (stats, articles, categories, media, users, settings)
app.use('/api/admin', adminRoutes);

// Apply general rate limit to all /api routes
app.use('/api/', generalLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Protected API Routes
app.use('/api/user', authMiddleware, userRoutes);
app.use('/api/history', authMiddleware, historyRoutes);
app.use('/api/keyword-research', authMiddleware, keywordResearchRoutes);
app.use('/api/keywords-finder', authMiddleware, keywordsFinderRoutes);
app.use('/api/local-keywords', authMiddleware, localKeywordsRoutes);
app.use('/api/domain-metrics', authMiddleware, domainMetricsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

const PORT = env.PORT;

if (require.main === module && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 SEO SaaS API Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  });
}

module.exports = app;

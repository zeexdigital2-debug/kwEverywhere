const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 48920,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seo_saas_db',
  JWT_SECRET: process.env.JWT_SECRET || 'seo_saas_jwt_secret_2026',
  OPENPAGERANK_API_KEY: process.env.OPENPAGERANK_API_KEY || '',
  SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:4000',
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
  ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH || '$2b$10$1Q8QbygYG2H7lAPP1nUJKuUePOR9bXtiggLHSnKOIc5Hd5jl/iMJG',
  ADMIN_JWT_SECRET: process.env.ADMIN_JWT_SECRET || 'kw_admin_jwt_secret_key_99887766'
};

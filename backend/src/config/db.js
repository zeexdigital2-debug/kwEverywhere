const mongoose = require('mongoose');
const env = require('./env');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  // On Vercel or production, skip attempting local MongoDB if no MONGODB_URI is supplied
  if (!process.env.MONGODB_URI && (process.env.VERCEL || process.env.NODE_ENV === 'production')) {
    console.log('[MongoDB]: Running in serverless mode with in-memory fallback state.');
    return;
  }

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2500
    });
    isConnected = true;
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Notice]: Could not connect (${error.message}). Running with in-memory fallback state.`);
  }
};

module.exports = connectDB;

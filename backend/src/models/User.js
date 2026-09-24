const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  supabaseId: { type: String, default: '' },
  apiKey: { type: String, unique: true },
  credits: { type: Number, default: 250 }, // Starting free credits
  plan: { type: String, enum: ['free', 'pro', 'agency'], default: 'free' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const keywordHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  keyword: { type: String, required: true },
  searchVolume: { type: Number, default: 0 },
  competition: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
  competitionScore: { type: Number, default: 50 },
  difficulty: { type: Number, default: 45 },
  cpc: { type: Number, default: 1.50 },
  trend: [{ type: Number }], // 12 monthly values 0-100
  suggestions: [{ type: String }],
  searchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.KeywordHistory || mongoose.model('KeywordHistory', keywordHistorySchema);

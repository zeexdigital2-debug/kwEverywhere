const mongoose = require('mongoose');

const creditLogSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  action: { type: String, required: true }, // e.g. 'KEYWORD_RESEARCH', 'DOMAIN_METRICS'
  description: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.models.CreditLog || mongoose.model('CreditLog', creditLogSchema);

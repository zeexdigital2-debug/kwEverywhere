const mongoose = require('mongoose');

const adminSettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, default: {} }
}, {
  timestamps: true
});

module.exports = mongoose.models.AdminSetting || mongoose.model('AdminSetting', adminSettingSchema);

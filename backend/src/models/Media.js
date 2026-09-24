const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  url: { type: String, required: true },
  altText: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.models.Media || mongoose.model('Media', mediaSchema);

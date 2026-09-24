const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Media = require('../models/Media');
const { isDbConnected, readJson, writeJson } = require('../services/adminStorage');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '-').slice(0, 40);
    cb(null, `${cleanBase}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'application/pdf',
    'image/x-icon'
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Only JPEG, PNG, WEBP, GIF, SVG, PDF are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

exports.uploadMiddleware = upload.single('file');

exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const { altText } = req.body;
    const url = `/uploads/${req.file.filename}`;

    const mediaObj = {
      _id: 'med_' + Date.now(),
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url,
      altText: altText || req.file.originalname,
      createdAt: new Date()
    };

    if (isDbConnected()) {
      const media = new Media(mediaObj);
      await media.save();
      return res.status(201).json({ success: true, message: 'File uploaded successfully.', media });
    }

    const mediaList = readJson('media.json', []);
    mediaList.unshift(mediaObj);
    writeJson('media.json', mediaList);

    return res.status(201).json({ success: true, message: 'File uploaded successfully.', media: mediaObj });
  } catch (error) {
    console.error('Media upload error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMediaList = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;

    if (isDbConnected()) {
      const query = {};
      if (search) {
        query.$or = [
          { originalName: { $regex: search, $options: 'i' } },
          { altText: { $regex: search, $options: 'i' } }
        ];
      }
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await Media.countDocuments(query);
      const media = await Media.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
      return res.status(200).json({
        success: true,
        media,
        pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) }
      });
    }

    let media = readJson('media.json', []);
    if (search) {
      const s = search.toLowerCase();
      media = media.filter(m =>
        (m.originalName && m.originalName.toLowerCase().includes(s)) ||
        (m.altText && m.altText.toLowerCase().includes(s))
      );
    }

    const total = media.length;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginated = media.slice(skip, skip + parseInt(limit));

    return res.status(200).json({
      success: true,
      media: paginated,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;

    let filename = '';
    if (isDbConnected()) {
      const media = await Media.findById(id);
      if (!media) return res.status(404).json({ success: false, message: 'Media file not found.' });
      filename = media.filename;
      await Media.findByIdAndDelete(id);
    } else {
      let mediaList = readJson('media.json', []);
      const found = mediaList.find(m => m._id === id);
      if (!found) return res.status(404).json({ success: false, message: 'Media file not found.' });
      filename = found.filename;
      mediaList = mediaList.filter(m => m._id !== id);
      writeJson('media.json', mediaList);
    }

    if (filename) {
      const filePath = path.join(uploadDir, filename);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch (e) {}
      }
    }

    return res.status(200).json({ success: true, message: 'Media deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

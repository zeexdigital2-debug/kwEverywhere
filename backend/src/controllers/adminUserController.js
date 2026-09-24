const User = require('../models/User');
const KeywordHistory = require('../models/KeywordHistory');
const { isDbConnected, readJson, writeJson } = require('../services/adminStorage');

const DEFAULT_USERS = [
  { _id: 'usr_1', email: 'alex.marketer@example.com', plan: 'pro', credits: 980, apiKey: 'kws_live_9a7b2c4d', createdAt: new Date(Date.now() - 86400000) },
  { _id: 'usr_2', email: 'sarah.seo@growth.io', plan: 'agency', credits: 4500, apiKey: 'kws_live_e3f5a1c9', createdAt: new Date(Date.now() - 172800000) },
  { _id: 'usr_3', email: 'david.tech@startup.co', plan: 'pro', credits: 720, apiKey: 'kws_live_7b1d9a2e', createdAt: new Date(Date.now() - 210000000) },
  { _id: 'usr_4', email: 'john.doe@gmail.com', plan: 'free', credits: 180, apiKey: 'kws_live_1c4e8b3a', createdAt: new Date(Date.now() - 259200000) },
  { _id: 'usr_5', email: 'emma.content@media.org', plan: 'free', credits: 210, apiKey: 'kws_live_4f9a0d2b', createdAt: new Date(Date.now() - 345600000) }
];

exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 15, search = '', plan = '', sort = '-createdAt' } = req.query;

    if (isDbConnected()) {
      const query = {};
      if (search) {
        query.$or = [
          { email: { $regex: search, $options: 'i' } },
          { apiKey: { $regex: search, $options: 'i' } }
        ];
      }
      if (plan) query.plan = plan;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await User.countDocuments(query);
      const users = await User.find(query).sort(sort).skip(skip).limit(parseInt(limit));

      return res.status(200).json({
        success: true,
        users,
        pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) }
      });
    }

    let users = readJson('users.json', DEFAULT_USERS);
    if (search) {
      const s = search.toLowerCase();
      users = users.filter(u =>
        (u.email && u.email.toLowerCase().includes(s)) ||
        (u.apiKey && u.apiKey.toLowerCase().includes(s))
      );
    }
    if (plan) {
      users = users.filter(u => u.plan === plan);
    }

    const total = users.length;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginated = users.slice(skip, skip + parseInt(limit));

    return res.status(200).json({
      success: true,
      users: paginated,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

      const historyCount = await KeywordHistory.countDocuments({ userEmail: user.email });
      const recentQueries = await KeywordHistory.find({ userEmail: user.email }).sort({ createdAt: -1 }).limit(10);
      return res.status(200).json({ success: true, user, historyCount, recentQueries });
    }

    const users = readJson('users.json', DEFAULT_USERS);
    const user = users.find(u => u._id === id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    return res.status(200).json({
      success: true,
      user,
      historyCount: 34,
      recentQueries: [
        { query: 'best seo tools 2026', tool: 'keyword-research', resultsCount: 48, createdAt: new Date() },
        { query: 'digital marketing courses', tool: 'keywords-finder', resultsCount: 35, createdAt: new Date() }
      ]
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { credits, plan } = req.body;

    if (isDbConnected()) {
      const updateData = {};
      if (credits !== undefined) updateData.credits = Number(credits);
      if (plan !== undefined) updateData.plan = plan;

      const user = await User.findByIdAndUpdate(id, updateData, { new: true });
      if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
      return res.status(200).json({ success: true, message: 'User updated.', user });
    }

    let users = readJson('users.json', DEFAULT_USERS);
    const idx = users.findIndex(u => u._id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'User not found.' });

    if (credits !== undefined) users[idx].credits = Number(credits);
    if (plan !== undefined) users[idx].plan = plan;
    writeJson('users.json', users);

    return res.status(200).json({ success: true, message: 'User updated successfully.', user: users[idx] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const user = await User.findByIdAndDelete(id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
      return res.status(200).json({ success: true, message: 'User deleted.' });
    }

    let users = readJson('users.json', DEFAULT_USERS);
    users = users.filter(u => u._id !== id);
    writeJson('users.json', users);

    return res.status(200).json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

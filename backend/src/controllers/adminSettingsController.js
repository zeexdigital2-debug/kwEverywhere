const AdminSetting = require('../models/AdminSetting');
const { isDbConnected, readJson, writeJson } = require('../services/adminStorage');

const DEFAULT_SETTINGS = {
  general: {
    siteName: 'Keywords Everywhere Pro',
    tagline: 'Instant Search Volume, CPC & SEO Intelligence',
    contactEmail: 'support@kweverywhere.com',
    defaultCredits: 250,
    allowRegistration: true
  },
  seo: {
    metaTitle: 'Keywords Everywhere — Instant SEO & Keyword Intelligence',
    metaDescription: 'Discover high-intent keywords, search volume, CPC, and competition with real-time analytics.',
    keywords: 'keyword research, seo tool, cpc checker, search volume',
    ogImageUrl: '',
    robotsTxt: 'User-agent: *\nAllow: /'
  },
  social: {
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com'
  }
};

exports.getSettings = async (req, res) => {
  try {
    if (isDbConnected()) {
      const settingsList = await AdminSetting.find({ key: { $ne: 'admin_credentials' } });
      const result = { ...DEFAULT_SETTINGS };
      settingsList.forEach(s => {
        if (s.key && s.value) result[s.key] = { ...result[s.key], ...s.value };
      });
      return res.status(200).json({ success: true, settings: result });
    }

    const saved = readJson('settings.json', DEFAULT_SETTINGS);
    return res.status(200).json({ success: true, settings: { ...DEFAULT_SETTINGS, ...saved } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const { group, data } = req.body;
    if (!group || !data) {
      return res.status(400).json({ success: false, message: 'Settings group and data are required.' });
    }

    if (group === 'admin_credentials') {
      return res.status(400).json({ success: false, message: 'Use change-password to update admin credentials.' });
    }

    if (isDbConnected()) {
      const updated = await AdminSetting.findOneAndUpdate(
        { key: group },
        { key: group, value: data },
        { upsert: true, new: true }
      );
      return res.status(200).json({ success: true, message: 'Settings updated successfully.', setting: updated });
    }

    const settings = readJson('settings.json', DEFAULT_SETTINGS);
    settings[group] = { ...(settings[group] || {}), ...data };
    writeJson('settings.json', settings);

    return res.status(200).json({ success: true, message: 'Settings updated successfully.', setting: { key: group, value: settings[group] } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPublicSettings = async (req, res) => {
  try {
    if (isDbConnected()) {
      const general = await AdminSetting.findOne({ key: 'general' });
      const seo = await AdminSetting.findOne({ key: 'seo' });
      const social = await AdminSetting.findOne({ key: 'social' });

      return res.status(200).json({
        success: true,
        settings: {
          general: general ? general.value : DEFAULT_SETTINGS.general,
          seo: seo ? seo.value : DEFAULT_SETTINGS.seo,
          social: social ? social.value : DEFAULT_SETTINGS.social
        }
      });
    }

    const saved = readJson('settings.json', DEFAULT_SETTINGS);
    return res.status(200).json({
      success: true,
      settings: {
        general: saved.general || DEFAULT_SETTINGS.general,
        seo: saved.seo || DEFAULT_SETTINGS.seo,
        social: saved.social || DEFAULT_SETTINGS.social
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

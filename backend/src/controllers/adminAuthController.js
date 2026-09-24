const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const AdminSetting = require('../models/AdminSetting');

// Helper to get active admin credentials
async function getAdminCredentials() {
  try {
    const credsSetting = await AdminSetting.findOne({ key: 'admin_credentials' });
    if (credsSetting && credsSetting.value) {
      return {
        username: credsSetting.value.username || env.ADMIN_USERNAME,
        passwordHash: credsSetting.value.passwordHash || env.ADMIN_PASSWORD_HASH
      };
    }
  } catch (e) {
    console.error('Error fetching admin creds setting:', e);
  }
  return {
    username: env.ADMIN_USERNAME,
    passwordHash: env.ADMIN_PASSWORD_HASH
  };
}

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required.'
      });
    }

    const currentCreds = await getAdminCredentials();

    if (username.trim().toLowerCase() !== currentCreds.username.toLowerCase()) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, currentCreds.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password.'
      });
    }

    const payload = {
      username: currentCreds.username,
      role: 'admin',
      iat: Math.floor(Date.now() / 1000)
    };

    const token = jwt.sign(payload, env.ADMIN_JWT_SECRET, { expiresIn: '7d' });

    // Set cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).json({
      success: true,
      message: 'Admin authentication successful.',
      token,
      admin: {
        username: currentCreds.username,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login.'
    });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie('admin_token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.verify = async (req, res) => {
  return res.status(200).json({
    success: true,
    admin: req.admin
  });
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, newUsername } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.'
      });
    }

    const currentCreds = await getAdminCredentials();
    const isMatch = await bcrypt.compare(currentPassword, currentCreds.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect.'
      });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    const updatedUsername = newUsername ? newUsername.trim() : currentCreds.username;

    await AdminSetting.findOneAndUpdate(
      { key: 'admin_credentials' },
      {
        key: 'admin_credentials',
        value: {
          username: updatedUsername,
          passwordHash: newHash,
          updatedAt: new Date()
        }
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Admin credentials updated successfully.'
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update admin credentials.'
    });
  }
};

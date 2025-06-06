import fs from 'fs';
import path from 'path';

let adminProfile = {
  username: 'admin',
  email: 'admin@example.com',
  profilePicture: null, // store filename here
};

let adminSettings = {
  notificationsEnabled: true,
  theme: 'light',
};

// GET /api/admin/profile
export const getProfile = (req, res) => {
  res.json(adminProfile);
};

// PUT /api/admin/profile
export const updateProfile = (req, res) => {
  const { username, email } = req.body;
  if (username) adminProfile.username = username;
  if (email) adminProfile.email = email;
  res.json({ message: 'Profile updated', profile: adminProfile });
};

// POST /api/admin/profile/picture
export const uploadProfilePicture = (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  // Delete old picture if exists
  if (adminProfile.profilePicture) {
    const oldPath = path.join('uploads/profile-pics/', adminProfile.profilePicture);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  }

  adminProfile.profilePicture = req.file.filename;
  res.json({ message: 'Profile picture uploaded', filename: req.file.filename });
};

// DELETE /api/admin/profile/picture
export const deleteProfilePicture = (req, res) => {
  if (!adminProfile.profilePicture) {
    return res.status(404).json({ message: 'No profile picture to delete' });
  }

  const picPath = path.join('uploads/profile-pics/', adminProfile.profilePicture);
  if (fs.existsSync(picPath)) {
    fs.unlinkSync(picPath);
  }

  adminProfile.profilePicture = null;
  res.json({ message: 'Profile picture deleted' });
};

// GET /api/admin/settings
export const getSettings = (req, res) => {
  res.json(adminSettings);
};

// PUT /api/admin/settings
export const updateSettings = (req, res) => {
  const { notificationsEnabled, theme } = req.body;
  if (typeof notificationsEnabled === 'boolean') adminSettings.notificationsEnabled = notificationsEnabled;
  if (theme === 'light' || theme === 'dark') adminSettings.theme = theme;
  res.json({ message: 'Settings updated', settings: adminSettings });
};

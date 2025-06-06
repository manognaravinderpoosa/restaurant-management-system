const path = require('path');
const fs = require('fs');

let userProfile = {
  username: 'JohnDoe',
  email: 'john@example.com',
  profilePic: null,
};

let userSettings = {
  notificationSound: true,
  theme: 'light',
};

exports.getProfile = (req, res) => {
  res.json(userProfile);
};

exports.updateProfile = (req, res) => {
  const { username, email } = req.body;
  if (!username || !email) return res.status(400).json({ error: 'Missing fields' });

  userProfile.username = username;
  userProfile.email = email;
  res.json({ message: 'Profile updated' });
};

exports.uploadProfilePicture = (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  // Delete old profile pic if exists
  if (userProfile.profilePic) {
    const oldPath = path.join(__dirname, '../', userProfile.profilePic);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
  }

  // Save new profile pic path relative to backend root
  userProfile.profilePic = `uploads/profile-pics/${req.file.filename}`;
  res.json({ profilePic: userProfile.profilePic });
};

exports.deleteProfilePicture = (req, res) => {
  if (userProfile.profilePic) {
    const oldPath = path.join(__dirname, '../', userProfile.profilePic);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    userProfile.profilePic = null;
  }
  res.json({ message: 'Profile picture deleted' });
};

exports.getSettings = (req, res) => {
  res.json(userSettings);
};

exports.updateSettings = (req, res) => {
  const { notificationSound, theme } = req.body;
  if (typeof notificationSound !== 'boolean' || !theme)
    return res.status(400).json({ error: 'Invalid settings data' });

  userSettings.notificationSound = notificationSound;
  userSettings.theme = theme;
  res.json({ message: 'Settings updated' });
};

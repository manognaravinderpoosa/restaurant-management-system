const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');

// Multer config for profile pic uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/admin-profile-pics'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, req.userId + ext);
  },
});
const upload = multer({ storage });

router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', verifyToken, async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.username = username || user.username;
    user.email = email || user.email;
    await user.save();

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Update failed' });
  }
});

router.post('/profile/picture', verifyToken, upload.single('profilePic'), async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.profilePic = req.file.filename;
    await user.save();

    res.json({ profilePic: user.profilePic });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed' });
  }
});

router.delete('/profile/picture', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.profilePic = null;
    await user.save();

    res.json({ message: 'Profile picture removed' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove profile picture' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  deleteProfilePicture,
  getSettings,
  updateSettings,
} = require('../controllers/userController');

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/profile-pics'));
  },
  filename: function (req, file, cb) {
    // Use user id + timestamp + original extension
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});
const upload = multer({ storage });

// Routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

router.post('/profile/picture', upload.single('profilePic'), uploadProfilePicture);
router.delete('/profile/picture', deleteProfilePicture);

router.get('/settings', getSettings);
router.put('/settings', updateSettings);

module.exports = router;

const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// Get current settings
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.find();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
});

// Update settings
router.put('/', async (req, res) => {
  try {
    const updatedSettings = await Settings.updateOne({}, req.body, { new: true });
    res.json(updatedSettings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update settings' });
  }
});

module.exports = router;

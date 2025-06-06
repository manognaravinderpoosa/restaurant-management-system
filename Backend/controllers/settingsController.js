// controllers/settingController.js
const Setting = require('../models/Setting');

// Get settings data
const getSettings = async (req, res) => {
  try {
    const settings = await Setting.find();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
};

// Update settings data
const updateSettings = async (req, res) => {
  try {
    const updatedSetting = await Setting.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedSetting);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update settings' });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};

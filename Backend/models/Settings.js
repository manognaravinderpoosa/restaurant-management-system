const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  lowStockThreshold: { type: Number, default: 5 },
  restockNotification: { type: Boolean, default: true }
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;

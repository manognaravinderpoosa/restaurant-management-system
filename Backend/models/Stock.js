const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true },
  usage: { type: Number, default: 0 },
  date: { type: Date, default: Date.now } // Added date field
});

module.exports = mongoose.models.Stock || mongoose.model('Stock', stockSchema);

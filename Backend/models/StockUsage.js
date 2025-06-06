const mongoose = require('mongoose');

// Define the stock usage schema
const stockUsageSchema = new mongoose.Schema({
  stockName: { type: String, required: true },
  quantityUsed: { type: Number, required: true },
  unit: { type: String, required: true },
  date: { type: Date, required: true },
});

// Check if the model already exists, if not, define it
const StockUsage = mongoose.models.StockUsage || mongoose.model('StockUsage', stockUsageSchema);

module.exports = StockUsage;

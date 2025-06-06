const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define the Stock Usage schema
const stockUsageSchema = new mongoose.Schema({
  stockName: { type: String, required: true },
  quantityUsed: { type: Number, required: true },
  unit: { type: String, required: true }, // Added unit field
  date: { type: Date, default: Date.now }
});

// Check if the model already exists to avoid redefinition
const StockUsage = mongoose.models.StockUsage || mongoose.model('StockUsage', stockUsageSchema);

// ✅ GET: Fetch all stock usage data
router.get('/', async (req, res) => {
  try {
    const usageData = await StockUsage.find();
    res.json(usageData);
  } catch (error) {
    console.error('Error fetching stock usage data:', error.message);
    res.status(500).json({ error: 'Failed to fetch stock usage data' });
  }
});

// POST: Add Stock Usage
router.post('/add', async (req, res) => {
  try {
    const { stockName, quantityUsed, unit, date } = req.body;
    const newUsage = new StockUsage({ stockName, quantityUsed, unit, date });
    await newUsage.save();

    // Emit a real-time update (e.g., using socket.io)
    req.app.get('io').emit('stockUsageUpdated', newUsage);

    res.status(201).json({ message: 'Stock usage added successfully', newUsage });
  } catch (error) {
    console.error('Error adding stock usage:', error.message);
    res.status(500).json({ error: 'Failed to add stock usage' });
  }
});

// PUT: Update Stock Usage (by stockName)
router.put('/update-usage', async (req, res) => {
  try {
    const { stockName, quantityUsed, unit, date } = req.body;
    const updatedUsage = await StockUsage.findOneAndUpdate(
      { stockName },
      { quantityUsed, unit, date },
      { new: true, upsert: true }
    );

    // Emit a real-time update (e.g., using socket.io)
    req.app.get('io').emit('stockUsageUpdated', updatedUsage);

    res.json({ message: 'Stock usage updated successfully', updatedUsage });
  } catch (error) {
    console.error('Error updating stock usage:', error.message);
    res.status(500).json({ error: 'Failed to update stock usage' });
  }
});

module.exports = router;

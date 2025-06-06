const Stock = require("../models/Stock");

// Get Dashboard Stats (Stock Usage Overview)
const getDashboardStats = async (req, res) => {
  try {
    const stocks = await Stock.find();

    const totalStock = stocks.reduce((sum, item) => sum + item.quantity, 0);
    const lowStockCount = stocks.filter((item) => item.quantity < 10).length;
    const stockUsage = stocks.reduce((sum, item) => sum + item.usage, 0);

    res.status(200).json({
      totalStock,
      lowStockCount,
      stockUsage,
      orders: 340, // Static for now
      customers: 1800, // Static for now
    });
  } catch (error) {
    res.status(500).json({ message: "Dashboard data error", error });
  }
};

// Get Stock Usage Chart Data
const getStockUsageChartData = async (req, res) => {
  try {
    const stocks = await Stock.find({}, "name usage");

    const chartData = stocks.map((item) => ({
      x: item.name,
      y: item.usage,
    }));

    res.status(200).json(chartData);
  } catch (error) {
    res.status(500).json({ message: "Chart data error", error });
  }
};

// Update Stock Usage (automatically)
const updateStockUsage = async (stockId, quantityUsed) => {
  try {
    const stock = await Stock.findById(stockId);

    if (stock) {
      stock.usage += quantityUsed;
      await stock.save();
    }
  } catch (error) {
    console.error("Error updating stock usage:", error);
  }
};

module.exports = {
  getDashboardStats,
  getStockUsageChartData,
  updateStockUsage, // Make sure this is available for your other files to call
};

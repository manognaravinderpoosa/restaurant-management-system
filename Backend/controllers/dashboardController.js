const Stock = require("../models/Stock");
const StockUsage = require("../models/StockUsage");

const getDashboardStats = async (req, res) => {
  try {
    const stocks = await Stock.find();

    const totalStock = stocks.reduce((sum, item) => sum + item.quantity, 0);
    const lowStockCount = stocks.filter((item) => item.quantity < 10).length;

    // Aggregate total quantityUsed from StockUsage collection
    const usageAgg = await StockUsage.aggregate([
      { $group: { _id: null, total: { $sum: "$quantityUsed" } } }
    ]);
    const stockUsage = usageAgg.length > 0 ? usageAgg[0].total : 0;

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

const getStockUsageChartData = async (req, res) => {
  try {
    // Aggregate total quantityUsed grouped by stockName
    const usageData = await StockUsage.aggregate([
      {
        $group: {
          _id: "$stockName",
          totalUsage: { $sum: "$quantityUsed" },
        },
      },
    ]);

    const chartData = usageData.map((item) => ({
      x: item._id,
      y: item.totalUsage,
    }));

    res.status(200).json(chartData);
  } catch (error) {
    res.status(500).json({ message: "Chart data error", error });
  }
};

module.exports = {
  getDashboardStats,
  getStockUsageChartData,
};

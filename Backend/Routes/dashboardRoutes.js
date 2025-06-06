const express = require("express");
const router = express.Router();
const { getDashboardStats, getStockUsageChartData } = require("../controllers/dashboardController");  // Import controller functions

// Route to get dashboard stats (stock overview)
router.get("/", getDashboardStats);

// Route to get stock usage chart data
router.get("/usage-chart", getStockUsageChartData);

module.exports = router;

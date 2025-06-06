const StockUsage = require("../models/StockUsage");

// Helper function to calculate date range
const getDateRange = (range) => {
  const endDate = new Date();
  const startDate = new Date();

  if (range === "daily") {
    // Get last 24 hours
    startDate.setTime(endDate.getTime() - (24 * 60 * 60 * 1000));
  } else if (range === "weekly") {
    startDate.setDate(endDate.getDate() - 7);
  } else if (range === "monthly") {
    startDate.setMonth(endDate.getMonth() - 1);
  }

  return { startDate, endDate };
};

// Controller to get report data
const getReportData = async (range, res) => {
  try {
    // TEMPORARY: Let's see what the date filtering is doing
    const { startDate, endDate } = getDateRange(range);

    console.log(`${range} report - Date range:`, {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });

    // First, let's get ALL data to see what we have
    const allData = await StockUsage.find({}).sort({ date: -1 });
    console.log(`ALL data in database (${allData.length} records):`,
      allData.map(item => ({
        stockName: item.stockName,
        date: item.date,
        dateString: item.date.toISOString()
      }))
    );

    // Then get filtered data
    const filteredData = await StockUsage.find({
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });

    console.log(`${range} report - Records found after filtering:`, filteredData.length);
    console.log(`Filtered records:`, filteredData.map(item => ({
      stockName: item.stockName,
      date: item.date.toISOString()
    })));

    // TEMPORARY FIX: For now, let's return ALL data for ALL report types
    // This will help us see if the issue is date filtering or something else
    console.log(`TEMPORARY: Returning ALL data for ${range} report`);
    res.status(200).json(allData);

  } catch (err) {
    console.error(`Error fetching ${range} report:`, err);
    res.status(500).json({
      error: "Failed to fetch report data",
      message: err.message
    });
  }
};

const getDailyReport = (req, res) => getReportData("daily", res);
const getWeeklyReport = (req, res) => getReportData("weekly", res);
const getMonthlyReport = (req, res) => getReportData("monthly", res);

// Debug function to see all data
const getAllData = async (req, res) => {
  try {
    const allData = await StockUsage.find({}).sort({ date: -1 });
    console.log("All records in database:", allData.length);
    res.json(allData);
  } catch (error) {
    console.error("Error fetching all data:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDailyReport,
  getWeeklyReport,
  getMonthlyReport,
  getAllData,
};
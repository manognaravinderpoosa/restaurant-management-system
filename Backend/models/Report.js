const StockUsage = require('./StockUsage');

const getDailyReport = async () => {
  const start = new Date();
  start.setTime(Date.now() - (24 * 60 * 60 * 1000)); // Last 24 hours
  const end = new Date();

  return await StockUsage.find({
    date: { $gte: start, $lte: end }
  }).sort({ date: -1 });
};

const getWeeklyReport = async () => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 7);

  return await StockUsage.find({
    date: { $gte: start, $lte: end }
  }).sort({ date: -1 });
};

const getMonthlyReport = async () => {
  const end = new Date();
  const start = new Date();
  start.setMonth(end.getMonth() - 1);

  return await StockUsage.find({
    date: { $gte: start, $lte: end }
  }).sort({ date: -1 });
};

module.exports = {
  getDailyReport,
  getWeeklyReport,
  getMonthlyReport
};
const express = require("express");
const {
  getDailyReport,
  getWeeklyReport,
  getMonthlyReport,
  getAllData,
} = require("../controllers/reportsController");

const router = express.Router();

router.get("/daily", getDailyReport);
router.get("/weekly", getWeeklyReport);
router.get("/monthly", getMonthlyReport);
router.get("/all", getAllData);

module.exports = router;
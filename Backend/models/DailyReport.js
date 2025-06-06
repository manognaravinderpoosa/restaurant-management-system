const mongoose = require('mongoose');

const dailyReportSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    date: { type: Date, required: true },
    totalRevenue: { type: Number, default: 0 },
    itemSales: {
        type: Map,
        of: Number // item name => count
    }
});

module.exports = mongoose.model('DailyReport', dailyReportSchema);

const express = require("express");
const router = express.Router();
const TempOrder = require("../models/TempOrder");
const DailyReport = require("../models/DailyReport");

// POST /api/orders/served
router.post("/served", async (req, res) => {
    const { orderId, items, total, user_id } = req.body;

    try {
        // 1. Delete from TempOrder
        await TempOrder.findByIdAndDelete(orderId);

        // 2. Find or create today's report
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to midnight

        let report = await DailyReport.findOne({ user_id, date: today });

        if (!report) {
            report = new DailyReport({
                user_id,
                date: today,
                totalRevenue: 0,
                itemSales: {}
            });
        }

        // 3. Update totalRevenue and itemSales
        report.totalRevenue += total;

        items.forEach(item => {
            const currentCount = report.itemSales.get(item.name) || 0;
            report.itemSales.set(item.name, currentCount + item.quantity);
        });

        await report.save();

        res.status(200).json({ message: "Order served and report updated." });
    } catch (error) {
        console.error("Error serving order:", error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;

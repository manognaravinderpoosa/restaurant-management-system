// routes/stockRoutes.js

const express = require("express");
const router = express.Router();
const Stock = require("../models/Stock");
const Notification = require("../models/Notification");

// 📦 Add New Stock
router.post("/", async (req, res) => {
  try {
    const newStock = new Stock(req.body);
    const savedStock = await newStock.save();

    const io = req.app.get("io");
    const message = `Stock Added: ${savedStock.name} (${savedStock.quantity})`;

    // Save notification to DB
    const notification = new Notification({ message });
    await notification.save();

    // Emit notification and dashboard update
    io.emit("notification", message);
    io.emit("dashboardUpdate");

    res.status(201).json(savedStock);
  } catch (error) {
    console.error("Error adding stock:", error);
    res.status(500).json({ error: "Failed to add stock" });
  }
});

// ✏️ Update Stock
router.put("/:id", async (req, res) => {
  try {
    const updatedStock = await Stock.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    const io = req.app.get("io");
    const message = `Stock Updated: ${updatedStock.name} (${updatedStock.quantity})`;

    const notification = new Notification({ message });
    await notification.save();

    io.emit("notification", message);
    io.emit("dashboardUpdate");

    res.status(200).json(updatedStock);
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ error: "Failed to update stock" });
  }
});

// 🗑️ Delete Stock
router.delete("/:id", async (req, res) => {
  try {
    const deletedStock = await Stock.findByIdAndDelete(req.params.id);

    const io = req.app.get("io");
    const message = `Stock Deleted: ${deletedStock.name}`;

    const notification = new Notification({ message });
    await notification.save();

    io.emit("notification", message);
    io.emit("dashboardUpdate");

    res.status(200).json({ message: "Stock deleted" });
  } catch (error) {
    console.error("Error deleting stock:", error);
    res.status(500).json({ error: "Failed to delete stock" });
  }
});

// 📄 Get all stocks
router.get("/", async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stocks" });
  }
});

// 📈 Get Stock Usage Data for Chart
router.get("/usage-chart", async (req, res) => {
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
});

module.exports = router;

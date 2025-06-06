const mongoose = require("mongoose");

const inventoryAdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model("InventoryAdmin", inventoryAdminSchema);

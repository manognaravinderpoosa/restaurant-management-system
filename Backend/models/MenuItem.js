// models/MenuItem.js
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image_url: { type: String, default: null }, // Added image_url field
}, {
    timestamps: true // Optional: adds createdAt and updatedAt fields
});

module.exports = mongoose.model("MenuItem", menuItemSchema);
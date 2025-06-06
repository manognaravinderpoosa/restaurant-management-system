const mongoose = require('mongoose');

const tempOrderSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    table_number: { type: Number, required: true },
    items: [
        {
            name: String,
            quantity: Number,
            price: Number,
            category: String
        }
    ],
    totalAmount: Number,
    paymentStatus: { type: String, default: 'not paid' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TempOrder', tempOrderSchema);

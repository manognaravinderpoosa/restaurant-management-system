const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    note: { type: String },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', expenseSchema);

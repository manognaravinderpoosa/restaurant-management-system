const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    salary: { type: Number, required: true }
});

module.exports = mongoose.model('Staff', staffSchema);

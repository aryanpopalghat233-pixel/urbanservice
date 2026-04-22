const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., 'AC Repair'
    category: String,
    price: Number,
    icon: String, // FontAwesome class
    description: String
});

module.exports = mongoose.model('Service', ServiceSchema);

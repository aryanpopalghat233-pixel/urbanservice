const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    serviceType: { type: String, required: true },
    address: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Assigned', 'In Progress', 'Completed'], default: 'Pending' },
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);

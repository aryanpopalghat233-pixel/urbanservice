const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    service: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'assigned', 'started', 'completed'], 
        default: 'pending' 
    },
    scheduledTime: Date,
    location: {
        address: String,
        lat: Number,
        lng: Number
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);

const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    skill: { type: String, required: true }, // e.g., Plumber, Electrician
    isAvailable: { type: Boolean, default: true },
    currentLocation: {
        lat: { type: Number },
        lng: { type: Number }
    }
}, { timestamps: true });

module.exports = mongoose.model('Worker', workerSchema);

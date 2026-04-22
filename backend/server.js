const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Models
const Booking = require('./models/Booking');
const User = require('./models/User');
const Worker = require('./models/Worker');

// Database Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('DB Connection Error:', err));

// Routes
app.post('/api/bookings', async (req, res) => {
    try {
        const { customerName, serviceType, address } = req.body;
        const newBooking = new Booking({ customerName, serviceType, address, status: 'Pending' });
        await newBooking.save();
        res.status(201).json({ message: 'Booking successful!', bookingId: newBooking._id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create booking' });
    }
});

app.get('/api/bookings/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        res.status(200).json(booking);
    } catch (error) {
        res.status(404).json({ error: 'Booking not found' });
    }
});

// Serve Frontend Pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../frontend/index.html')));
app.get('/book', (req, res) => res.sendFile(path.join(__dirname, '../frontend/book.html')));
app.get('/track', (req, res) => res.sendFile(path.join(__dirname, '../frontend/track.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

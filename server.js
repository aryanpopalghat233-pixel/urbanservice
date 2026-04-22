require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection (Replace with your MongoDB URI)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/homeservice';
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ DB Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));

// Placeholder route for Bookings
app.post('/api/bookings', async (req, res) => {
    // In a real app, you'd save to the Booking model here
    res.json({ message: "Booking created and worker assigned!" });
});

// Real-time Socket.io Logic
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Worker broadcasts location
    socket.on('update-location', (data) => {
        // Broadcast specifically to customers or admins
        io.emit('location-broadcast', data);
    });

    socket.on('disconnect', () => console.log('User disconnected'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});

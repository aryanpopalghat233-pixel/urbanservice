const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

// Real-time tracking logic
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // When worker sends location, broadcast it to everyone (Customer & Admin)
    socket.on('update-location', (data) => {
        // data looks like: { role: 'worker', lat: 0, lng: 0, name: 'John' }
        io.emit('location-broadcast', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${3000}`);
});

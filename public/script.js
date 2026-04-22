const socket = io();
const statusMsg = document.getElementById('status-bar');

// Initialize Map (Centered on a default location)
const map = L.map('map').setView([20.5937, 78.9629], 5); 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let workerMarker = null;

// --- CUSTOMER LOGIC ---
socket.on('location-broadcast', (data) => {
    statusMsg.innerText = `Update: ${data.name} is at ${data.lat.toFixed(4)}, ${data.lng.toFixed(4)}`;
    
    if (!workerMarker) {
        workerMarker = L.marker([data.lat, data.lng]).addTo(map)
            .bindPopup(data.name + " (Worker)").openPopup();
    } else {
        workerMarker.setLatLng([data.lat, data.lng]);
    }
    map.setView([data.lat, data.lng], 15);
});

// --- WORKER LOGIC ---
document.getElementById('start-worker').addEventListener('click', () => {
    if ("geolocation" in navigator) {
        statusMsg.innerText = "Tracking your location...";
        navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords;
            
            // Send to server
            socket.emit('update-location', {
                role: 'worker',
                lat: latitude,
                lng: longitude,
                name: 'Technician John'
            });
            
            // Show on own map
            if (!workerMarker) {
                workerMarker = L.marker([latitude, longitude]).addTo(map);
            }
            workerMarker.setLatLng([latitude, longitude]);
            map.setView([latitude, longitude], 15);

        }, (err) => console.error(err), { enableHighAccuracy: true });
    } else {
        alert("Geolocation not supported");
    }
});

document.getElementById('view-customer').addEventListener('click', () => {
    statusMsg.innerText = "Waiting for worker updates...";
});

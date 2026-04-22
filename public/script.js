const socket = io();
let map;
let workerMarker = null;

// Initialize Map
function initMap() {
    map = L.map('map').setView([20.5937, 78.9629], 5); 
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
}
initMap();

async function startBooking(service) {
    // 1. Show the map section
    const container = document.getElementById('tracking-container');
    container.classList.remove('hidden');
    
    // 2. Update status text
    document.getElementById('worker-name').innerText = `Finding a ${service} expert...`;

    // 3. FIX: Force map to show correctly
    setTimeout(() => {
        map.invalidateSize();
        container.scrollIntoView({ behavior: 'smooth' });
    }, 200);

    // 4. API Call (Optional - logic from previous step)
    console.log(`Booking request sent for: ${service}`);
}

// Real-time tracking from Worker
socket.on('location-broadcast', (data) => {
    const pos = [data.lat, data.lng];
    document.getElementById('worker-name').innerText = data.name;

    if (!workerMarker) {
        workerMarker = L.marker(pos).addTo(map)
            .bindPopup(`${data.name} is arriving!`).openPopup();
    } else {
        workerMarker.setLatLng(pos);
    }
    map.setView(pos, 15);
});


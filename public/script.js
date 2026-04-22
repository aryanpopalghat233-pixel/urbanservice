const socket = io();
let map;
let workerMarker = null;

// Initialize Map immediately (but it's hidden in the drawer)
function initMap() {
    map = L.map('map').setView([20.5937, 78.9629], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© ServicePro'
    }).addTo(map);
}

initMap();

function openTracking(service, rating, price) {
    const drawer = document.getElementById('tracking-drawer');
    const serviceTitle = document.getElementById('tracking-service-name');
    
    // Set Drawer content
    serviceTitle.innerText = `${service} Tracking`;
    drawer.classList.add('active');

    // CRITICAL: Leaflet needs a refresh when shown from a hidden state
    setTimeout(() => {
        map.invalidateSize();
    }, 500);

    // Optional: simulate server booking
    console.log(`Booking ${service} at $${price}`);
}

function closeTracking() {
    document.getElementById('tracking-drawer').classList.remove('active');
}

// Listen for Real-time Worker Location
socket.on('location-broadcast', (data) => {
    const pos = [data.lat, data.lng];
    document.getElementById('worker-name-display').innerText = data.name;
    document.getElementById('tracking-status').innerText = "Professional is on the way!";

    if (!workerMarker) {
        workerMarker = L.marker(pos).addTo(map)
            .bindPopup(data.name + " is here").openPopup();
    } else {
        workerMarker.setLatLng(pos);
    }
    
    map.panTo(pos);
});

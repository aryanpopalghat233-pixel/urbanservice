const socket = io();
let map, workerMarker;

// Page Navigation Logic
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    if(pageId === 'customer') {
        document.getElementById('customer-page').classList.remove('hidden');
    } else if(pageId === 'worker-reg') {
        document.getElementById('worker-reg-page').classList.remove('hidden');
    }
}

// Map Initialization
function initMap() {
    map = L.map('map').setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
}
initMap();

// CUSTOMER LOGIC
function startBooking(service, price) {
    if(confirm(`Book ${service} for $${price}?`)) {
        document.getElementById('tracking-container').classList.remove('hidden');
        setTimeout(() => {
            map.invalidateSize();
            document.getElementById('tracking-container').scrollIntoView({behavior: 'smooth'});
        }, 300);
    }
}

socket.on('location-broadcast', (data) => {
    const pos = [data.lat, data.lng];
    if (!workerMarker) {
        workerMarker = L.marker(pos).addTo(map).bindPopup(data.name + " is on the way!");
    } else {
        workerMarker.setLatLng(pos);
    }
    map.setView(pos, 15);
});

// WORKER LOGIC (Sharing Location Anytime)
const gpsBtn = document.getElementById('worker-start-gps');
const workerNameInput = document.getElementById('worker-name-input');
const statusText = document.getElementById('worker-status');

gpsBtn.addEventListener('click', () => {
    const name = workerNameInput.value || "New Professional";
    
    if ("geolocation" in navigator) {
        statusText.innerText = "Status: 🟢 ONLINE & SHARING LOCATION";
        statusText.classList.replace('text-gray-400', 'text-green-600');
        gpsBtn.innerText = "Tracking Active...";
        gpsBtn.classList.replace('bg-blue-600', 'bg-green-600');

        navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords;
            
            // Emit to server
            socket.emit('update-location', {
                role: 'worker',
                lat: latitude,
                lng: longitude,
                name: name
            });
        }, (err) => console.error(err), { enableHighAccuracy: true });
    } else {
        alert("GPS not supported by your browser.");
    }
});

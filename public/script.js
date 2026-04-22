const socket = io();
const statusText = document.getElementById('status-text');
const workerNameDisplay = document.getElementById('worker-name');
const trackingContainer = document.getElementById('tracking-container');

// Initialize Map
const map = L.map('map').setView([20.5937, 78.9629], 5); 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

let workerMarker = null;

// UI Interactions
function startBooking(service) {
    alert(`Booking ${service}... Now let's open the tracking map.`);
    showTrackingSection();
}

function showTrackingSection() {
    trackingContainer.classList.remove('hidden');
    trackingContainer.scrollIntoView({ behavior: 'smooth' });
    map.invalidateSize(); // Refreshes Leaflet size if it was hidden
}

function closeTracking() {
    trackingContainer.classList.add('hidden');
}

// SOCKET LOGIC
socket.on('location-broadcast', (data) => {
    workerNameDisplay.innerText = data.name;
    statusText.innerText = "Professional is on the way!";
    
    const pos = [data.lat, data.lng];

    if (!workerMarker) {
        workerMarker = L.marker(pos).addTo(map)
            .bindPopup("Your Pro: " + data.name).openPopup();
    } else {
        workerMarker.setLatLng(pos);
    }
    map.setView(pos, 15);
});

// WORKER SIMULATION
document.getElementById('start-worker').addEventListener('click', () => {
    if ("geolocation" in navigator) {
        alert("Worker simulation started. Your location will now be shared.");
        navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords;
            
            socket.emit('update-location', {
                role: 'worker',
                lat: latitude,
                lng: longitude,
                name: 'Rajesh Kumar'
            });

        }, (err) => alert("Error: " + err.message), { enableHighAccuracy: true });
    }
    async function startBooking(serviceName) {
    const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: serviceName })
    });
    const data = await response.json();
    alert(data.message);
    showTrackingSection();
}

    // Enhanced Booking Interaction
async function startBooking(serviceName, imageUrl) {
    // 1. Visual feedback for the user
    const confirmBooking = confirm(`Do you want to book ${serviceName}? Our professional will be assigned immediately.`);
    
    if (confirmBooking) {
        // 2. Simulate an API Call to your backend
        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ service: serviceName, time: new Date() })
            });

            // 3. Update the UI to show tracking
            alert(`Great! A technician has been assigned for your ${serviceName}.`);
            
            // Show the tracking section
            document.getElementById('tracking-container').classList.remove('hidden');
            document.getElementById('worker-name').innerText = "Assigning Professional...";
            document.getElementById('status-text').innerText = "Connecting to GPS...";
            
            // Scroll smoothly to the map
            document.getElementById('tracking-container').scrollIntoView({ behavior: 'smooth' });
            
            // Trigger Map Resize (Leaflet needs this when a container goes from hidden -> block)
            setTimeout(() => {
                map.invalidateSize();
            }, 500);

        } catch (error) {
            console.error("Booking failed", error);
            alert("Something went wrong. Please check your server connection.");
        }
    }
}
});




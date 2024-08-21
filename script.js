// Initialize the map
var map = L.map('map').setView([18.5204, 73.8567], 13);

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add a marker for the specific location
L.marker([18.5204, 73.8567]).addTo(map)
    .bindPopup('Pune')
    .openPopup();


    
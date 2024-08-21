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





// Add scale control
L.control.scale({
    position: 'bottomright' // Change position to bottom right
}).addTo(map);

// calender

// JavaScript for date picker functionality
document.getElementById('calendar-icon').addEventListener('click', function () {
    document.getElementById('date-input').click();
});

document.getElementById('date-input').addEventListener('change', function () {
    const selectedDate = new Date(this.value);
    const formattedDate = selectedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Display the selected date in the date-range-display div
    document.getElementById('date-range-display').textContent = formattedDate;
});

// // Show the summary section and move elements when the Status Wise button is clicked
// document.getElementById('status-wise-button').addEventListener('click', function () {
//     document.querySelector('.summary-section').style.display = 'block';
//     document.querySelector('.north-arrow-container').classList.add('move-up');
//     document.querySelector('.map-controls').classList.add('move-up');
//     this.classList.toggle('btn-active');
// });

// // Hide the summary section and reset elements when the close button is clicked
// document.getElementById('closeButton').addEventListener('click', function () {
//     document.querySelector('.summary-section').style.display = 'none';
//     document.querySelector('.north-arrow-container').classList.remove('move-up');
//     document.querySelector('.map-controls').classList.remove('move-up');
// });






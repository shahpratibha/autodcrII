//click on status-wise open the summary section 
document.getElementById('status-wise-button').addEventListener('click', function() {
    document.querySelector('.summary-section').style.display = 'block';
    document.querySelector('.north-arrow-container').classList.add('move-up');
    document.querySelector('.leaflet-top.leaflet-left .leaflet-bar').classList.add('move-up');
    document.querySelector('.leaflet-control-scale').classList.add('move-up');
    document.querySelector('.container-fluid').classList.add('summary-section-open');
    document.querySelector('.geopulseaname').classList.add('move-up'); // Add class for moving up

    this.classList.toggle('btn-active');
});

document.getElementById('closeButton').addEventListener('click', function() {
    document.querySelector('.summary-section').style.display = 'none';
    document.querySelector('.north-arrow-container').classList.remove('move-up');
    document.querySelector('.leaflet-top.leaflet-left .leaflet-bar').classList.remove('move-up');
    document.querySelector('.leaflet-control-scale').classList.remove('move-up');
    document.querySelector('.container-fluid').classList.remove('summary-section-open');
    document.querySelector('.geopulseaname').classList.remove('move-up'); // Remove class for reverting position

    const statusButton = document.getElementById('status-wise-button');
    statusButton.classList.remove('btn-active');
    statusButton.classList.add('btn-blue');
});

    
          
    document.addEventListener('DOMContentLoaded', () => {
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const slider = document.querySelector('.slider');
    const sliderItems = document.querySelectorAll('.slider-item');
    const totalItems = sliderItems.length;
    let currentIndex = 0;

    function updateSlider() {
        const offset = -currentIndex * 100;
        slider.style.transform = `translateX(${offset}%)`;
    }

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentIndex < totalItems - 0) {
            currentIndex++;
            updateSlider();
        }
    });
});


// calender
document.getElementById('calendar-icon').addEventListener('click', function() {
    // Check if the calendar is already open
    let calendarElement = document.querySelector('.flatpickr-calendar');
    if (calendarElement) {
        calendarElement.remove(); // Remove the calendar
        return;
    }

    // Create a calendar container
    let calendarContainer = document.createElement('div');
    calendarContainer.id = 'calendar-container'; // Add ID for styling if needed
    document.getElementById('date-range-display').appendChild(calendarContainer);

    // Initialize flatpickr
    flatpickr(calendarContainer, {
        mode: "range",
        inline: true,
        defaultDate: ["2024-04-01", "2025-03-31"],
        onClose: function(selectedDates, dateStr, instance) {
            // Format and display the selected date range
            let formattedDates = selectedDates.map(function(date) {
                return formatDate(date);
            }).join(' to '); // Join dates if range selected
            document.getElementById('date-range-display').innerText = formattedDates;
        },
        onReady: function(selectedDates, dateStr, instance) {
            // Add custom buttons
            let calendarFooter = document.createElement('div');
            calendarFooter.className = 'flatpickr-custom-buttons';
            calendarFooter.innerHTML = `
                <button id="apply-button" class="flatpickr-button">Cancel</button>
                <button id="cancel-button" class="flatpickr-button">Choose Date</button>
            `;
            document.querySelector('.flatpickr-calendar').appendChild(calendarFooter);

            // Add event listeners to the buttons
            document.getElementById('apply-button').addEventListener('click', function() {
                instance.close(); // Close the calendar on apply
            });

            document.getElementById('cancel-button').addEventListener('click', function() {
                calendarContainer.remove(); // Close and remove the calendar on cancel
            });

            updateWeekdayLabels(); // Update labels after the calendar is ready

            // Custom function to update weekday labels
            function updateWeekdayLabels() {
                let weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
                let weekdayElements = document.querySelectorAll('.flatpickr-weekday');
                weekdayElements.forEach((element, index) => {
                    if (element.textContent.trim() !== '') {
                        element.textContent = weekdays[index];
                    }
                });
            }
        }
    });
});

// Close the calendar when the mouse moves over the map
map.on('mousemove', function() {
    let calendarElement = document.querySelector('.flatpickr-calendar');
    if (calendarElement) {
        calendarElement.remove(); // Remove only the calendar, keep the icon
    }
});

// Function to format the date in "May 1, 2025" format
function formatDate(date) {
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

    
 // Function to toggle the visibility of the search input
function toggleSearchInput() {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('searchInputDashboard');
    const searchIcon = document.getElementById('search-icon');
    const closeIcon = document.getElementById('close-icon');

    // Toggle the full-width class on the button
    searchButton.classList.toggle('full-width');

    // Toggle the visibility of the search input field and icons
    if (searchButton.classList.contains('full-width')) {
        searchInput.style.display = 'block';
        searchIcon.style.display = 'none';
        closeIcon.style.display = 'inline';
        searchInput.focus();
    } else {
        searchInput.style.display = 'none';
        searchIcon.style.display = 'inline';
        closeIcon.style.display = 'none';
    }
}

// Function to handle closing the search input when clicking outside of it
function handleClickOutside(event) {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('searchInputDashboard');
    const searchIcon = document.getElementById('search-icon');
    const closeIcon = document.getElementById('close-icon');

    // Check if the click is outside the search button and input
    if (!searchButton.contains(event.target) && !searchInput.contains(event.target) && !closeIcon.contains(event.target)) {
        // Close search input if it's visible
        if (searchButton.classList.contains('full-width')) {
            searchButton.classList.remove('full-width');
            searchInput.style.display = 'none';
            searchIcon.style.display = 'inline';
            closeIcon.style.display = 'none';
        }
    }
}

// Function to handle showing the search input when clicking the search icon
function handleSearchIconClick() {
    toggleSearchInput();
}

// Function to handle showing the cross icon when typing in the search input
function handleSearchInput() {
    const searchInput = document.getElementById('searchInputDashboard');
    const closeIcon = document.getElementById('close-icon');

    // Show or hide the close icon based on input value
    closeIcon.style.display = searchInput.value.length > 0 ? 'inline' : 'none';
}

// Function to clear the search input
function clearSearchInput() {
    const searchInput = document.getElementById('searchInputDashboard');
    const closeIcon = document.getElementById('close-icon');

    // Clear the input field and hide the close icon
    searchInput.value = '';
    closeIcon.style.display = 'none';
}

// Add event listeners
document.addEventListener('click', handleClickOutside);
document.getElementById('search-icon').addEventListener('click', handleSearchIconClick);
document.getElementById('searchInputDashboard').addEventListener('input', handleSearchInput);
document.getElementById('close-icon').addEventListener('click', clearSearchInput);



// Ensure the DOM is fully loaded before adding the event listener Printbutton
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('printButton').addEventListener('click', function () {
        window.print();
    });
});

//excle

document.getElementById('excelButton').addEventListener('click', function() {
    // Define the URL of the Excel file
    var excelFileUrl = 'path/to/yourfile.xlsx';
    
    // Create a temporary link element
    var link = document.createElement('a');
    link.href = excelFileUrl;
    link.download = 'filename.xlsx'; // Optional: specify the filename
    
    // Append the link to the body (it has to be part of the document to work)
    document.body.appendChild(link);
    
    // Programmatically click the link to trigger the download
    link.click();
    
    // Remove the link from the document
    document.body.removeChild(link);
});



// Add scale control
L.control.scale({
    position: 'bottomleft' // Change position to bottom right
}).addTo(map);

// Toggle arrow direction
function toggleFilter(label) {
    const icon = label.querySelector('.icon-container i');
    const filterInput = label.nextElementSibling; // Assuming the input follows the label
    const filterList = filterInput.nextElementSibling; // Assuming the ul follows the input


    if (icon.classList.contains('fa-angle-down')) {
        icon.classList.remove('fa-angle-down');
        icon.classList.add('fa-angle-up');
    } else {
        icon.classList.remove('fa-angle-up');
        icon.classList.add('fa-angle-down');
    }

    // Toggle the visibility of the search input and filter list
    if (filterInput.style.display === 'none' || !filterInput.style.display) {
        filterInput.style.display = 'block';
        filterList.style.display = 'block';
    } else {
        filterInput.style.display = 'none';
        filterList.style.display = 'none';
    }
}




// //

// document.addEventListener('DOMContentLoaded', function () {
//     const filters = document.getElementById('filters');
//     const map = document.getElementById('map');
//     const button = document.getElementById('toggleFilters');
//     const closeFiltersBtn = document.querySelector('.close'); // Close button element
//     const mapControls = document.getElementById('map-controls');
//     const summarySection = document.querySelector('.summary-section');

//     if (!filters || !map || !button || !closeFiltersBtn || !mapControls || !summarySection) {
//         console.error('One or more elements are not found in the DOM.');
//         return;
//     }

//     let filtersVisible = false;

//     button.addEventListener('click', function () {
//         if (!filtersVisible) {
//             showFilters();
//         } else {
//             closeFilters();
//         }
//         filtersVisible = !filtersVisible;
//     });

//     closeFiltersBtn.addEventListener('click', closeFilters);

//     function showFilters() {
//         console.log('Showing filters');
//         filters.style.display = 'block'; // Show filters
//         filters.style.opacity = '1';
//         map.style.width = '81vw'; // Reduce map width to accommodate filters

//         // Move map controls and summary section for filters
//         mapControls.style.right = 'calc(20vw - 1px)';
//         summarySection.style.position = 'absolute';
//         summarySection.style.right = '0';
//         summarySection.style.marginRight = '0';
//         summarySection.style.transform = 'translateX(-19vw)';
//     }

//     function closeFilters() {
//         console.log('Closing filters');
//         filters.style.display = 'none'; // Hide filters
//         filters.style.opacity = '0';
//         map.style.width = '100vw'; // Reset map width to full

//         // Reset map controls and summary section
//         mapControls.style.right = '10px';
//         summarySection.style.position = 'relative';
//         summarySection.style.right = '10px';
//         summarySection.style.marginRight = '1vw';
//         summarySection.style.transform = 'translateX(0)';
//     }
// });



var map = L.map("map", {
  center: [18.52, 73.89],
  zoom: 12,
  minZoom: 11,
  maxZoom: 18,
  boxZoom: true,
  trackResize: true,
  wheelPxPerZoomLevel: 40,
  zoomAnimation: true
});

var googleSat = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"]
  }
);

var stamen = L.tileLayer(
'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
, ).addTo(map);




var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");

var Esri_WorldImagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
);

var PlotBoundary_Layer = L.tileLayer.wms("https://iwmsgis.pmc.gov.in/geoserver/AutoDCR/wms", {
  layers: "auto_test",
  format: "image/png",
  transparent: true,
  tiled: true,
  version: "1.1.0",
  opacity: 1
}).addTo(map);

var Revenue_Layer = L.tileLayer.wms("https://iwmsgis.pmc.gov.in/geoserver/AutoDCR/wms", {
  layers: "Revenue_1",
  format: "image/png",
  transparent: true,
  tiled: true,
  version: "1.1.0",
  opacity: 1
});

var Revenue_Layer1 = L.tileLayer.wms("https://iwmsgis.pmc.gov.in/geoserver/AutoDCR/wms", {
  layers: "Revenue_1",
  format: "image/png",
  transparent: true,
  tiled: true,
  version: "1.1.0",
  opacity: 1
});
document.addEventListener('DOMContentLoaded', function () {
  const filters = document.getElementById('filters');
  const map = document.getElementById('map');
  const searchbtn = document.getElementById('map-controls');
  const button = document.getElementById('toggleFilters');
  const leafletControlLayers = document.querySelector('.leaflet-control-layers');
  const leafletControlLayersToggle = document.querySelector('.leaflet-control-layers-toggle');
  const leafletControlZoom = document.querySelector('.leaflet-control-zoom');
  const geopulseaname = document.querySelector('.geopulseaname');
  const legendControl = document.querySelector('.collapse-button');
  const datePicker = document.querySelector('.date-picker');
  const summarySection = document.querySelector('.summary-section');
  const cardsContainer = document.querySelector('.cards');

  // Check if all elements are available
  if (!filters || !map || !button || !searchbtn || !leafletControlLayers || !leafletControlLayersToggle || !leafletControlZoom || !geopulseaname || !legendControl || !datePicker || !summarySection || !cardsContainer) {
    console.error('One or more elements are not found in the DOM.');
    return;
  }

  button.setAttribute('title', 'Filter');

  let filtersVisible = false;

  button.addEventListener('click', function () {
    if (!filtersVisible) {
      console.log('Showing filters');

      filters.style.marginLeft = '0';
      filters.style.opacity = '1';
      map.style.width = '81vw';
      summarySection.style.position = 'absolute';
      summarySection.style.right = '0';
      summarySection.style.marginRight = '0';
      summarySection.style.transform = 'translateX(-19vw)';
      button.style.top = "15vh";
      button.style.right = '20vw';
      button.innerHTML = '<img src="image/filter.png" alt="Filter Icon" id="search-icon">';
      searchbtn.style.right = 'calc(20vw - 1px)';
      searchbtn.style.top = '22vh';
      leafletControlLayers.style.right = '35vw';
      leafletControlLayersToggle.style.right = '30vw'; // Move layers toggle button
      leafletControlZoom.style.right = '21vw';
      geopulseaname.style.right = '21vw';
      legendControl.style.right = '40vw';
      datePicker.style.right = '20vw';

      cardsContainer.style.width = 'calc(100% - 1vw)';
      cardsContainer.style.overflowX = 'auto';
    } else {
      console.log('Hiding filters');

      filters.style.marginLeft = '-35vw';
      filters.style.opacity = '0';
      map.style.width = '100vw';
      summarySection.style.position = 'absolute';
      summarySection.style.marginRight = '1vw';
      summarySection.style.transform = 'translateX(0)';
      button.style.top = "15vh";
      button.style.right = '10px';
      button.innerHTML = '<img src="image/filter.png" alt="Filter Icon" id="search-icon">';
      searchbtn.style.right = '10px';
      searchbtn.style.top = '22vh';
      leafletControlLayers.style.right = '10px';
      leafletControlLayersToggle.style.right = '10px'; // Reset layers toggle button position
      leafletControlZoom.style.right = '10px';
      geopulseaname.style.right = '10px';
      legendControl.style.right = '10px';
      datePicker.style.right = '10px';

      cardsContainer.style.width = '100%';
      cardsContainer.style.overflowX = 'hidden';
    }

    filtersVisible = !filtersVisible;
  });
});





  // Optional: Add a click event listener to cards or status items if needed
  // For example, adjust the card size or position on status item click



function updateTableStats(stats) {
  document.getElementById('tablestats').innerText = stats;
}



$(document).ready(function () {


  var cql_filter1 ='';


  initializeCheckboxes();
  function getCheckedValuess() {
    var checkedValues = [];
    var checkboxes = document.querySelectorAll("#checkboxContainer input[type='checkbox']:checked");
    checkboxes.forEach(function(checkbox) {
        checkedValues.push("'" + checkbox.value + "'"); // Push value wrapped in single quotes
    });

    if (checkedValues.length === 0) {
        checkedValues.push("''"); // Push an empty string to simulate no results
    }

    return checkedValues;
}
});

document.getElementById("checkboxContainer").addEventListener("change", function() {
    var checkedValues = getCheckedValuess();
   
    var filterString1 = "";
 
    loadinitialData(filterString1);
    // FilterAndZoom(filterString1)
 
  getCheckedValues(function (filterString) {
    console.log("Filter Stringinside: ", filterString1);
    const mainfilter = combineFilters(filterString1, filterString);
    console.log("Filter Stringinside: ", mainfilter);
    FilterAndZoom(mainfilter);
    DataTableFilter(mainfilter)
   
 
  });
});

var Boundary_Layer = L.tileLayer.wms("https://iwmsgis.pmc.gov.in/geoserver/AutoDCR/wms", {
  layers: "PMC_Boundary",
  format: "image/png",
  transparent: true,
  tiled: true,
  version: "1.1.0",
  opacity: 1
}).addTo(map);

var Village_Boundary = L.tileLayer.wms("https://iwmsgis.pmc.gov.in/geoserver/AutoDCR/wms", {
  layers: "Village_Boundary",
  format: "image/png",
  transparent: true,
  tiled: true,
  version: "1.1.0",
  opacity: 1
});

var baseLayers = {
  "OSM": osm,
  "Esri": Esri_WorldImagery,
  "Satellite": googleSat,
  "stamen": stamen,
};

var overlayLayers = {
  "Plot": PlotBoundary_Layer,
  // "Revenue": Revenue_Layer,
  // "PLU": PLU_Layer,
  // "DPRoad": DPRoad_Layer,
  "Boundary": Boundary_Layer,
  "Village": Village_Boundary
};

L.control.layers(baseLayers, overlayLayers).addTo(map);
// Add clustering functionality
// var markers = L.markerClusterGroup();

// function createClusterIcon(cluster) {
//   console.log(cluster)
//   var childCount = cluster.getChildCount();
//   console.log(childCount, "childCount");

//   // Calculate the size based on the number of markers, but ensure a minimum size
//   var size = Math.max(Math.sqrt(childCount) * 5, 20); // Ensure a minimum size of 20px
// // console.log(size)
//   return L.divIcon({
//       html: '<div class="bufferColor cluster-text" style="width: ' + size + 'px; height: ' + size + 'px; line-height: ' + size + 'px;">' + childCount + '</div>',
//       className: 'custom-cluster-icon',
//       iconSize: [size, size] // Adjust the size based on the number of markers
//   });
// }

// markers.options.iconCreateFunction = createClusterIcon;

// // Load and process GeoJSON file
// fetch('Auto_test.geojson')
//   .then(response => response.json())
//   .then(geojsonData => {
//       // Convert polygons to points
//       var points = geojsonData.features.map(function(feature) {
//           if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
//               var centroid = turf.centroid(feature);
//               return {
//                   type: 'Feature',
//                   geometry: centroid.geometry,
//                   properties: feature.properties
//               };
//           }
//           return null;
//       }).filter(function(point) { return point !== null; });

//       // Add points to the map as markers
//       L.geoJSON(points, {
//           pointToLayer: function (feature, latlng) {
//               return L.marker(latlng);
//           }
//       })
//       .addTo(markers);

//       map.addLayer(markers);
//   })
//   .catch(error => console.error('Error loading GeoJSON:', error));  














var markers = L.markerClusterGroup();

function createClusterIcon(cluster) {
  console.log(cluster)
  var childCount = cluster.getChildCount();
  console.log(childCount, "childCount");

  // Calculate the size based on the number of markers, but ensure a minimum size
  var size = Math.max(Math.sqrt(childCount) * 5, 20); // Ensure a minimum size of 20px
// console.log(size)
  return L.divIcon({
      html: '<div class="bufferColor cluster-text" style="width: ' + size + 'px; height: ' + size + 'px; line-height: ' + size + 'px;">' + childCount + '</div>',
      className: 'custom-cluster-icon',
      iconSize: [size, size] // Adjust the size based on the number of markers
  });
}

function combineFilters(cql_filter123, filterString) {
  if (cql_filter123) {
    return `${cql_filter123} AND ${filterString}`;
  } else {
    return filterString;
  }
}
function closeFilters() {
  const filters = document.getElementById('filters');
  filters.style.display = 'none'; // Hide the entire filter section
}

// Load and process GeoJSON file
const layername = "auto_test"
const main_url = "https://iwmsgis.pmc.gov.in/geoserver/"
var urlm =
 main_url+"ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
 layername +"&outputFormat=application/json";
      $.getJSON(urlm, function (geojsonData) {
        // Convert polygons to points
        var points = geojsonData.features.map(function(feature) {
            if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
                var centroid = turf.centroid(feature);
                console.log(centroid,"centroid")
                return {
                    type: 'Feature',
                    geometry: centroid.geometry,
                    properties: feature.properties
                };
            }
            return null;
        }).filter(function(point) { return point !== null; });
    
        // Add points to the map as markers
        L.geoJSON(points, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng);
            }
        })
        .addTo(markers);
    
        // Add marker cluster group to the map
        map.addLayer(markers);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
        console.error('Error loading GeoJSON:', textStatus, errorThrown);
    });


















// status wise filter js

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


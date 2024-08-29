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

var  stamen =
L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://stamen.com/">Stamen Design</a>',
  maxZoom: 18,
}).addTo(map);
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
var markers = L.markerClusterGroup();

function createClusterIcon(cluster) {
  var childCount = cluster.getChildCount();
  var size = Math.sqrt(childCount) * 5; // Adjust the size based on the number of markers
  return L.divIcon({
      html: '<div class="bufferColor" style=" width: ' + size + 'px; height: ' + size + 'px;  line-height: ' + size + 'px;">' + childCount + '</div>',
      className: 'custom-cluster-icon',
      iconSize: [2, 2]
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

function toggleFilter(label) {
  const icon = label.querySelector('.icon-container i'); // Find the icon inside the label
  const filterInput = label.nextElementSibling; // Input follows the label
  const filterList = filterInput.nextElementSibling; // ul follows the input

  // Toggle arrow direction
  if (icon.classList.contains('fa-angle-down')) {
    icon.classList.remove('fa-angle-down');
    icon.classList.add('fa-angle-up');

    // Show search input and filter list
    filterInput.style.display = 'block';
    filterList.style.display = 'block';
  } else {
    icon.classList.remove('fa-angle-up');
    icon.classList.add('fa-angle-down');

    // Hide search input and filter list
    filterInput.style.display = 'none';
    filterList.style.display = 'none';
  }
}

/// Initialize the map
var map = L.map('map').setView([18.5204, 73.8567], 12);

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add a marker for the specific location
L.marker([18.5204, 73.8567]).addTo(map)
    .bindPopup('Pune')
    .openPopup();

var googleSat = L.tileLayer(
    "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    {
        maxZoom: 21,
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }
);

var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
}).addTo(map);

var Esri_WorldImagery = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
        maxZoom: 19.9,
    }
);

var baseLayers = {
    "OSM": osm,
    "Esri": Esri_WorldImagery,
    "Satellite": googleSat,
};

var auto_test = L.tileLayer.wms(
    "http://iwmsgis.pmc.gov.in:8080/geoserver1/wms",
    {
        layers: "auto_test",
        format: "image/png",
        transparent: true,
        tiled: true,
        version: "1.1.0",
        maxZoom: 21,
        opacity: 1,
    }
).addTo(map);

var PlotBoundary_Layer = L.tileLayer
    .wms("https://iwmsgis.pmc.gov.in/geoserver/AutoDCR/wms", {
        layers: "plotboundary",
        format: "image/png",
        transparent: true,
        tiled: true,
        version: "1.1.0",
        // attribution: "Revenue",
        opacity: 1,
    }).addTo(map);


var Revenue_Layer = L.tileLayer
    .wms("https://iwmsgis.pmc.gov.in/geoserver/AutoDCR/wms", {
        layers: "Revenue_1",
        format: "image/png",
        transparent: true,
        tiled: true,
        version: "1.1.0",
        // attribution: "Revenue",
        opacity: 1,
    });

// .addTo(map);


// for only gut showing
var Revenue_Layer1 = L.tileLayer
    .wms("https://iwmsgis.pmc.gov.in/geoserver/AutoDCR/wms", {
        layers: "Revenue_1",
        format: "image/png",
        transparent: true,
        tiled: true,
        version: "1.1.0",
        // attribution: "Revenue",
        opacity: 1,
    }).addTo(map);

var PLU_Layer = L.tileLayer
    .wms("https://iwmsgis.pmc.gov.in/geoserver/AutoDCR/wms", {
        layers: "PLU_Ward",
        format: "image/png",
        transparent: true,
        tiled: true,
        version: "1.1.0",
        // attribution: "Revenue",
        opacity: 1,
    });

var DPRoad_Layer = L.tileLayer
    .wms("https://iwmsgis.pmc.gov.in/geoserver/AutoDCR/wms", {
        layers: "DP_Ward_Road",
        format: "image/png",
        transparent: true,
        tiled: true,
        version: "1.1.0",
        // attribution: "Revenue",
        opacity: 1,
    });

var Boundary_Layer = L.tileLayer
    .wms("https://iwmsgis.pmc.gov.in/geoserver/AutoDCR/wms", {
        layers: "PMC_Boundary",
        format: "image/png",
        transparent: true,
        tiled: true,
        version: "1.1.0",
        // attribution: "Revenue",
        opacity: 1,
    }).addTo(map);

var Village_Boundary = L.tileLayer
    .wms("https://iwmsgis.pmc.gov.in/geoserver/AutoDCR/wms", {
        layers: "Village_Boundary",
        format: "image/png",
        transparent: true,
        tiled: true,
        version: "1.1.0",
        // attribution: "Revenue",
        opacity: 1,
    });

    var aviation = L.tileLayer
    .wms("https://iwmsgis.pmc.gov.in/geoserver/AutoDCR/wms", {
        layers: "Aviation_data",
        format: "image/png",
        transparent: true,
        tiled: true,
        version: "1.1.0",
        // attribution: "Revenue",
        opacity: 1,
    });


function refreshWMSLayer() {
    // Remove the layer from the map
    map.removeLayer(PlotBoundary_Layer);
    // Add the layer again
    PlotBoundary_Layer.addTo(map);
  }

var WMSlayers = {
    Aviation: aviation,
    auto_test: auto_test,

    Plot:PlotBoundary_Layer,
    Revenue: Revenue_Layer,
    PLU: PLU_Layer,
    DPRoad: DPRoad_Layer,
    Boundary: Boundary_Layer,
    Village: Village_Boundary,
  
};

// Create the layers control and add it to the map
var control = L.control.layers(baseLayers, WMSlayers).addTo(map);

// Function to toggle layers control visibility
function toggleLayersControl() {
    var controlContainer = document.querySelector('.leaflet-control-layers');
    if (controlContainer) {
        // Toggle visibility of the layers control
        controlContainer.style.display = controlContainer.style.display === 'none' ? 'block' : 'none';
    }
}

// Add event listener to the button
document.getElementById('toggle-layers-button').addEventListener('click', function() {
    toggleLayersControl();
});
// Add scale control
L.control.scale({
    position: 'bottomright' // Change position to bottom right
}).addTo(map);












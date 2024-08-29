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

var PLU_Layer = L.tileLayer.wms("https://iwmsgis.pmc.gov.in/geoserver/AutoDCR/wms", {
  layers: "PLU_Ward",
  format: "image/png",
  transparent: true,
  tiled: true,
  version: "1.1.0",
  opacity: 1
});

var DPRoad_Layer = L.tileLayer.wms("https://iwmsgis.pmc.gov.in/geoserver/AutoDCR/wms", {
  layers: "DP_Ward_Road",
  format: "image/png",
  transparent: true,
  tiled: true,
  version: "1.1.0",
  opacity: 1
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

markers.options.iconCreateFunction = createClusterIcon;

// Load and process GeoJSON file
fetch('Auto_test.geojson')
  .then(response => response.json())
  .then(geojsonData => {
      // Convert polygons to points
      var points = geojsonData.features.map(function(feature) {
          if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
              var centroid = turf.centroid(feature);
              return {
                  type: 'Feature',
                  geometry: centroid.geometry,
                  properties: feature.properties
              };
          }
          return null;
      }).filter(function(point) { return point !== null; });

      // Add points to the map
      L.geoJSON(points, {
          pointToLayer: function (feature, latlng) {
              return L.marker(latlng);
          }
      }).addTo(markers);

      map.addLayer(markers);
  })
  .catch(error => console.error('Error loading GeoJSON:', error));
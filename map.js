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
  ).addTo(map);
  
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

  var auto_test = L.tileLayer.wms(
  "https://iwmsgis.pmc.gov.in/geoserver/wms",
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
  
  var baseLayers = {
    "OSM": osm,
    "Esri": Esri_WorldImagery,
    "Satellite": googleSat,
    "stamen": stamen,
  };
  
  var overlayLayers = {
    "Plot": PlotBoundary_Layer,
    "Boundary": Boundary_Layer,
    "Village": Village_Boundary,
    "auto_test":auto_test,
  };
  
  L.control.layers(baseLayers, overlayLayers).addTo(map);
  
  map.on("zoomend", function() {
    if (map.getZoom() > 17.2) {
      if (!map.hasLayer(Esri_WorldImagery)) {
        map.removeLayer(stamen);
        map.addLayer(Esri_WorldImagery);
      }
    } else {
      if (!map.hasLayer(stamen)) {
        map.removeLayer(Esri_WorldImagery);
        map.addLayer(stamen);
      }
    }
  });
  
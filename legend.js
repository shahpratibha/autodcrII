


// Now continue with your remaining JavaScript code...
// GeoServer URL
var geoserverUrl = "https://iwmsgis.pmc.gov.in/geoserver";

var workspace = "Bhavan";

// Variable to keep track of legend visibility
var legendVisible = true;
var processedLayers = [];
// Add the WMS Legend control to the map
var legendControl = L.control({ position: "topright" });

legendControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend");

  // Function to fetch and populate the legend
  function updateLegend() {
    // Clear the existing legend
    div.innerHTML = '';

    // Fetch capabilities to get all layers in the 'pmc' workspace
    fetch(geoserverUrl + "/ows?service=wms&version=1.3.0&request=GetCapabilities")
      .then((response) => response.text())
      .then((data) => {
        // Parse capabilities XML response
        var parser = new DOMParser();
        var xml = parser.parseFromString(data, "text/xml");

        // Extract layer names and legend URLs for layers in the 'pmc' workspace
        var layers = xml.querySelectorAll('Layer[queryable="1"]');
        

        layers.forEach((layer) => {
          var layerName = layer.querySelector("Name").textContent;
          var layerWorkspace = layerName.split(":")[0]; // Extract workspace from layer name
          if (layerWorkspace === workspace && !processedLayers.includes(layerName)) {
            var legendUrl =
              geoserverUrl +
              "/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=" +
              layerName;
            var layerParts = layerName.split(":"); // Split layer name by ":"
            var layerDisplayName = layerParts[layerParts.length - 1]; // Take the last part as the display name
            div.innerHTML +=
              "<p><strong>" +
              layerDisplayName + // Use layerDisplayName instead of layerName
              "</strong></p>" +
              '<img src="' +
              legendUrl +
              '" alt="' +
              layerDisplayName + // Use layerDisplayName instead of layerName
              ' legend"><br>';
            processedLayers.push(layerName); // Add processed layer to the list
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching capabilities:", error);
      });
  }

  // Initially update the legend
  updateLegend();

  // Apply CSS to fit to bottom right, occupy 60% of screen height, and provide scrollbar
  div.style.position = "fixed";
  div.style.bottom = "0";
  div.style.right = "0";
  div.style.height = "40vh";
  div.style.marginTop = "60px";

  div.style.width = "300px";
  div.style.overflowY = "auto";
  div.style.scrollbarWidth = "thin";
  div.style.backgroundColor = "white";
  div.style.border = "2px solid darkblue";
  div.style.borderRadius = "10px";
  div.style.padding = "10px";
  div.style.transition = "all 0.3s ease-in-out"; // Add transition for smooth animation

  // Toggle legend visibility function
  function toggleLegend() {
    if (legendVisible) {
      div.style.height = "0"; // Minimize the legend
      legendVisible = false;
    } else {
      div.style.height = "40vh"; // Maximize the legend
      legendVisible = true;
    }
  }

  // Add event listener to the legend control
  div.addEventListener('click', toggleLegend);

  return div;
};
// -----------------------------------------------------
// Add collapsible button
var collapseButton = L.control({ position: "topright" });

collapseButton.onAdd = function (map) {
  var button = L.DomUtil.create("button", "collapse-button");
  button.innerHTML = "<img src='image/legend_cons.svg' alt='' style='width: 53px; height: 53px; margin-top: -21.200px; margin-left: -21px;'>"; // Image instead of icon
  // Apply styling
  
 
  button.style.width = "31px";
  button.style.height = "31px";
  
  button.style.color = "black";
  button.style.padding = "10px";
  button.style.textAlign = "center";
  button.style.textDecoration = "none";
  button.style.display = "block";
 
  button.style.cursor = "pointer";
  button.style.transition = "background-color 0.3s ease-in-out"; // Add transition for smooth animation

  // Toggle legend visibility when the button is clicked
  button.onclick = function () {
    var legendDiv = document.querySelector(".info.legend");
    if (
      legendDiv.style.height === "0px" || legendDiv.style.display === "none") {


      legendDiv.style.display = "block";
      legendDiv.style.height = "40vh";
      legendDiv.style.width = "200px";
      legendDiv.style.top ="15%";
      legendDiv.style.left ="84%";
      legendDiv.style.scrollbarWidth = "thin";
      legendDiv.style.scrollbarColor =  "#163140 white";
      legendDiv.style.borderRadius= "10px";
      legendDiv.style.boxShadow = "5px 5px 5px rgba(0, 0, 0, 0.7)"; // Add shadow
      button.innerHTML = "<img src='image/legend_cons.svg' alt='' style='width: 53px; height: 53px; margin-top: -21.200px; margin-left: -21px;'>"; // Image instead of icon
  // Apply styling

    
      legendVisible = true;
    } else {
      legendDiv.style.display = "none";
      button.innerHTML = "<img src='image/legend_cons.svg' alt='' style='width: 53px; height: 53px; margin-top: -21.200px; margin-left: -21px;'>"; // Image instead of icon
    
      
      legendVisible = false;
    }
  };

  return button;
};

collapseButton.addTo(map);

// Create a legend control
var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend");

  // Initially hide the legend content
  div.style.display = "none";

  // Create a button to toggle the visibility of the legend content
  var toggleButton = L.DomUtil.create("button", "legend-toggle");
  toggleButton.innerHTML = "";
  toggleButton.style.backgroundColor = "transparent";

  toggleButton.onclick = function () {
    if (div.style.display === "none") {
      div.style.display = "block";
    } else {
      div.style.display = "none";
    }
  };
  div.appendChild(toggleButton);

  // Fetch capabilities to get all layers in the 'pmc' workspace
  fetch(
    "https://iwmsgis.pmc.gov.in/geoserver/ows?service=wms&version=1.3.0&request=GetCapabilities"
  )
    .then((response) => response.text())
    .then((data) => {
      // Parse capabilities XML response
      var parser = new DOMParser();
      var xml = parser.parseFromString(data, "text/xml");

      // Extract layer names and legend URLs for layers in the 'pmc' workspace
      var layers = xml.querySelectorAll('Layer[queryable="1"]');
      layers.forEach(function (layer) {
        var layerName = layer.querySelector("Name").textContent;
        if (layerName.startsWith("Bhavan:")) {
          var legendUrl =
            this.geoserverUrl +
            "/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=" +
            layerName;
          var layerParts = layerName.split(":"); // Split layer name by ":"
          var layerDisplayName = layerParts[layerParts.length - 1]; // Take the last part as the display name
          div.innerHTML +=
            "<p><strong>" +
            layerDisplayName +
            "</strong></p>" +
            '<img src="' +
            legendUrl +
            '" alt="' +
            layerDisplayName +
            ' legend"><br>';
        }
      });

      // Apply CSS to fit to bottom right, occupy 60% of screen height, and provide scrollbar
      div.style.position = "fixed";
      div.style.bottom = "0";
      div.style.right = "0";
      div.style.height = "60vh";
      div.style.width = "300px";
      div.style.overflowY = "auto";
      div.style.scrollbarWidth = "thin";
      div.style.backgroundColor = "white";
      div.style.border = "2px solid darkblue";
      div.style.borderRadius = "10px";
      div.style.padding = "10px";
    })
    .catch((error) => {
      console.error("Error fetching capabilities:", error);
    });

  return div;
};


legend.addTo(map);
map.on('click', function () {
  var legendDiv = document.querySelector(".info.legend");
  var button = document.querySelector(".collapse-button");

  // Check if the legend is currently visible
  if (legendDiv.style.display === "none" || legendDiv.style.display === "") {
    // Hide the legend
  

    // Update the button's inner HTML with the image
    button.innerHTML = "<img src='image/legend_cons.svg' alt='' style='width: 53px; height: 53px; margin-top: -21.200px; margin-left: -21px;'>";
    legendVisible = false;
  }
});


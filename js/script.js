const main_url = "https://iwmsgis.pmc.gov.in/geoserver/";

// Function to toggle layers control visibility
function toggleLayersControl() {
  var controlContainer = document.querySelector('.leaflet-control-layers');
  if (controlContainer) {
    // Toggle visibility of the layers control
    controlContainer.style.display = controlContainer.style.display === 'none' ? 'block' : 'none';
  }
}


function toggleFilter(label) {
  const input = label.nextElementSibling; // Get the input element next to the label
  const ul = input.nextElementSibling; // Get the ul element next to the input

  // Toggle 'active' class for the clicked filter input and its associated ul  
  input.classList.toggle('active');
  ul.classList.toggle('active');
}

// Function to close filter groups when clicking outside
document.addEventListener('click', function (event) {
  if (!event.target.closest('.filter-group')) {
    document.querySelectorAll('.filter-input').forEach(filterInput => {
      filterInput.classList.remove('active');
      filterInput.nextElementSibling.classList.remove('active');
    });
  }
});

// Function to filter checkboxes based on search input
function filterCheckboxes(input) {
  const filter = input.value.toLowerCase();
  const ul = input.nextElementSibling;
  const li = ul.getElementsByTagName('li');

  for (let i = 0; i < li.length; i++) {
    const text = li[i].textContent || li[i].innerText;
    if (text.toLowerCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Add event listeners to filter inputs
  document.querySelectorAll('.filter-input').forEach(input => {
    input.addEventListener('input', function (event) {
      event.stopPropagation(); // Stop event propagation
      filterCheckboxes(this);
    });
    // Stop event propagation for click events on the input element
    input.addEventListener('click', function (event) {
      event.stopPropagation(); // Stop event propagation
    });
    // Stop event propagation for mousedown events on the input element to prevent the div from closing
    input.addEventListener('mousedown', function (event) {
      event.stopPropagation(); // Stop event propagation
    });
  });

  // Add event listeners to checkboxes to stop propagation
  document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('click', function (event) {
      event.stopPropagation(); // Stop event propagation
    });
  });
});

function updateTableStats(stats) {
  document.getElementById('tablestats').innerText = stats;
}



$(document).ready(function () {
    // Example usage of the function
const cluster_layerName = "Plot_Layout"; // Verify this layer name in your GeoServer
const cluster_url = "https://iwmsgis.pmc.gov.in/geoserver/";
// const filter = ""; // Add any additional filter if required

// loadAndProcessGeoJSON(main_url, layername, filter);
  var cql_filter1 = '';
  var filterString1 = "";
  
  loadinitialData(filterString1);
  loadAndProcessGeoJSON(cluster_url, cluster_layerName, filterString1);
  getCheckedValues(function (filterString) {
    // alert("opjojihu")
    // //console.log("Filter Stringinside: ", filterString1);
    const mainfilter = combineFilters(filterString1, filterString);
    console.log("Filter Stringinsidedfgnjfhfufh: ", mainfilter);
    loadAndProcessGeoJSON(cluster_url, cluster_layerName, mainfilter);
    // loadAndProcessGeoJSON(main_url, layername, mainfilter);
    FilterAndZoom(mainfilter);
    DataTableFilter(mainfilter)

  });


  function loadinitialData(cql_filter) {
    const filternames = ["siteaddress_area", "caseinformation_applyfor","gut_no", "caseinformation_casetype", "caseinformation_proposaltype", "token", "caseinformation_grossplotarea","plotdetails_developmentzonedp", "ownerinformation_firstname"];//accordn column names , if want add one more  criteria add here
    var workspace = 'AutoDCR';
    var layerName = 'Plot_Layout';
    filternames.forEach(function (filtername) {
      var url = `${main_url}${workspace}/wms?service=WFS&version=1.1.0&request=GetFeature&typeName=${layerName}&propertyName=${filtername}&outputFormat=application/json`;
      if (cql_filter) {
        url += `&cql_filter=${encodeURIComponent(cql_filter)}`;
      }
      $.getJSON(url, function (data) {
        var projectFiSet = new Set();
        var projectFiMap = new Map();
        $.each(data.features, function (index, feature) {
          var column_name = feature.properties[filtername];
          if (column_name !== null && column_name !== "#N/A") {
            if (projectFiMap.has(column_name)) {
             
              projectFiMap.set(column_name, (projectFiMap.get(column_name) || 0) + 1);
            } else {
              projectFiMap.set(column_name, 1);
            }
          }
        });
        var uniqueProjectFiList = Array.from(projectFiMap.entries()).map(([name, count]) => `${name} (${count})`);
        populateDropdown(filtername, uniqueProjectFiList);
      });
    });
    }
   
});


// new code 18/9
function DataTableFilter(cql_filter1) {
  var layers = ["AutoDCR:Plot_Layout"];
  var typeName = layers.join(',');
  var cqlFilter = cql_filter1;
  var workspace = 'AutoDCR';
  var geoServerURL =
    `${main_url}${workspace}/wms?service=WFS&version=1.1.0&request=GetFeature&typeName=${typeName}&outputFormat=application/json`;

  if (cql_filter1 !== '') {
    geoServerURL += "&CQL_FILTER=" + encodeURIComponent(cqlFilter);
  }

  // Define the headers and their display names
  var headerMapping = {
    "token": "Token",
    "gut_no": "Survey No",
    "siteaddress_area": "Village Name",
    "ownerinformation_firstname": "Owner Name",
    "caseinformation_grossplotarea": "Plot Area",
    "caseinformation_applyfor": "Apply For",
    "caseinformation_casetype": "Case Type",
    "caseinformation_proposaltype": "Proposal Type",
    "caseinformation_tdrzone": "TDR Zone",
    "plotdetails_developmentzonedp": "Development Zone",
    "entry_timestamp": "Date & Time"
  };

  var headers = Object.keys(headerMapping);  // Pass keys from the mapping
  showtable(typeName, geoServerURL, cqlFilter, headers, headerMapping);  // Pass the mapping as well
}


// new code 18/9


function populateDropdown(dropdownId, data) {

  var ul = $("#" + dropdownId);
  ul.empty();
  data.forEach(function (item) {
    // //console.log(item, "items")
    var listItem = $('<li><label><input type="checkbox" class="select2-option-checkbox" value="' + item + '"> ' + item + '</label></li>');
    ul.append(listItem);
  });


}



function getCheckedValues(callback) {
  var selectedValues = {};
  const filternames = ["siteaddress_area", "caseinformation_applyfor", "caseinformation_casetype", "caseinformation_proposaltype","gut_no", "token", "caseinformation_grossplotarea","plotdetails_developmentzonedp", "ownerinformation_firstname"];

  filternames.forEach(function (filtername) {
    selectedValues[filtername] = []; 

    $('#' + filtername).on('click', 'input[type="checkbox"]', function (event) {
     
      event.stopPropagation();
      var values = [];
      $('#' + filtername + ' input[type="checkbox"]:checked').each(function () {
        var single_val = $(this).val();
        
        if (single_val) {
        
          var actualValue = single_val.split(' (')[0];
          values.push(actualValue);
        }
      });

      
      selectedValues[filtername] = values;

      var filters = [];
      var fovillagefilter =[]
      for (var key in selectedValues) {
        
        if (selectedValues[key].length > 0) {
          if (key == 'siteaddress_area'){
            // alert(key)
            fovillagefilter.push(`${key} IN ('${selectedValues[key].join("','")}')`);
            var ff= `village_na IN ('${selectedValues[key].join("','")}')`
            console.log(ff,"ffffffffffffffffffffffffffffffff")
            FilterAndZoomforvillage(ff)
          }
          
          filters.push(`${key} IN ('${selectedValues[key].join("','")}')`);
          console.log(key,"forororroro")
        }
      }

      var filterString = filters.join(" AND ");

      var label = $('label[for="' + filtername + '"]');
      if (label.length > 0) {
        var selectedCount = values.length;
        var countText = selectedCount > 0 ? ' (' + selectedCount + ')' : '';
        label.find('.selected-count').text(countText);
      }

      if (typeof callback === 'function') {
        callback(filterString);
      }
    });
  });
}

function FilterAndZoom(filter) {
  fitbous(filter)
  Plot_Layout.setParams({
    CQL_FILTER: filter,
    maxZoom: 19.5,
  }).addTo(map);
  // Plot_Layout.setParams({
  //   CQL_FILTER: filter,
  //   maxZoom: 19.5,
  // }).addTo(map);
};

function FilterAndZoomforvillage(filter) {
  // fitbous(filter)
  Village_Boundary1.setParams({
    CQL_FILTER: filter,
    maxZoom: 19.5,
    styles: 'Village_Highlight'
  }).addTo(map);
  // Plot_Layout.setParams({
  //   CQL_FILTER: filter,
  //   maxZoom: 19.5,
  // }).addTo(map);
};


function fitbous(filter) {
  var layers = ["AutoDCR:Plot_Layout"];
  var bounds = null;

  var processLayer = function (layerName, callback) {
    var urlm =
      main_url + "ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
      layerName +
      "&CQL_FILTER=" +
      filter +
      "&outputFormat=application/json";

    $.getJSON(urlm, function (data) {
      var geojson = L.geoJson(data);
      var layerBounds = geojson.getBounds();
      if (bounds) {
        bounds.extend(layerBounds);
      } else {
        bounds = layerBounds;
      }
      callback();
    });
  };

  var layersProcessed = 0;
  layers.forEach(function (layerName) {
    processLayer(layerName, function () {
      layersProcessed++;
      if (layersProcessed === layers.length) {
        if (bounds) {
          map.fitBounds(bounds);
        }
      }
    });
  });
}


function fitbouss(filter) {
  var layers = ["zone:Taluka_boundary"];
  var bounds = null;

  var processLayer = function (layerName, callback) {
    var urlm =
      main_url + "ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
      layerName +
      "&CQL_FILTER=" +
      filter +
      "&outputFormat=application/json";

    $.getJSON(urlm, function (data) {
      var geojson = L.geoJson(data);
      var layerBounds = geojson.getBounds();
      if (bounds) {
        bounds.extend(layerBounds);
      } else {
        bounds = layerBounds;
      }
      callback();
    });
  };

  var layersProcessed = 0;
  layers.forEach(function (layerName) {
    processLayer(layerName, function () {
      layersProcessed++;
      if (layersProcessed === layers.length) {
        if (bounds) {
          map.fitBounds(bounds);
        }
      }
    });
  });
}
// new code 18/9-----------------
function showtable(typeName, geoServerURL, cqlFilter, headers, headerMapping) {
  tableData(typeName, geoServerURL, cqlFilter, headers);

  var currentPage = 1;
  var rowsPerPage = 10;
  var buttonsToShow = 3;

  function createTable(data, headers) {
    var tableContainer = document.getElementById('tablecontainer');
    if (!tableContainer) {
      console.error("Table container not found");
      return;
    }
    tableContainer.innerHTML = ""; // Clear any existing content

    var topContainer = document.createElement('div');
    topContainer.className = 'top-container';

    // Create minimize button
    var minimizeButton = document.createElement('button');
    minimizeButton.innerHTML = '<i class="fas fa-times"></i>'; // Set cross icon
    // minimizeButton.innerHTML = '<i class="fas fa-minus"></i>';
    minimizeButton.className = 'minimize-button';
    minimizeButton.addEventListener('click', function () {
      var tableDetail = document.querySelector('.tableDetail');
      if (tableDetail.style.display === 'none') {
        tableDetail.style.display = 'block';
        minimizeButton.innerHTML = '<i class="fas fa-times"></i>'; // Set cross icon
        document.getElementById('openTableBtn').style.display = 'none'; // Hide the show button
      } else {
        tableDetail.style.display = 'none';
        minimizeButton.style.display = 'none';
        document.getElementById('openTableBtn').style.display = 'block'; // Show the show button
      }
    });

    tableContainer.appendChild(minimizeButton);
    tableContainer.appendChild(topContainer);

    var tableDetail = document.createElement('div');
    tableDetail.className = 'tableDetail';
    tableContainer.appendChild(tableDetail);

    var table = document.createElement('table');
    table.className = 'data-table'; 
    table.id = 'data-table'; 

    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');

    headers.unshift('Sr_no'); // Add 'Serial No' as the first header

    // Create header cells using the headerMapping
    headers.forEach(header => {
      var th = document.createElement('th');
      var displayHeader = headerMapping[header] || header; // Get custom header or fallback to original
      th.textContent = displayHeader;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');

    // Populate table rows with data
    data.forEach((item, index) => {
      var row = document.createElement('tr');

      // Add serial number as the first column
      var serialNumberCell = document.createElement('td');
      serialNumberCell.textContent = index + 1;
      row.appendChild(serialNumberCell);

      headers.slice(1).forEach(header => {
        var cell = document.createElement('td');
        cell.textContent = item[header] || ''; // Fill the cell with data
        row.appendChild(cell);
      });

      row.addEventListener('click', function () {
        var boundsLayer = L.geoJSON(item.geometry, {
          style: {
            fillColor: "blue",
            fillOpacity: 0.3,
            color: "blue",
            weight: 2,
          },
        }).addTo(map);

        var bounds = boundsLayer.getBounds();
        map.fitBounds(bounds);
        setTimeout(function () {
          map.removeLayer(boundsLayer);
        }, 5000);
      });

      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableDetail.appendChild(table);

    $(document).ready(function () {
      if ($.fn.DataTable.isDataTable('#data-table')) {
        $('#data-table').DataTable().destroy(); 
      }
      $('#data-table').DataTable({
        paging: true,
        lengthChange: true,
        searching: true,
        ordering: true,
        info: true,
        autoWidth: false,
        scrollY: 400,
        scrollX: true,
        scrollCollapse: true,
        fixedHeader: true
      });
    });
  }


  
  // Function to show the hidden table
  function showTable() {
    var tableDetail = document.querySelector('.tableDetail');
    var minimizeButton = document.querySelector('.minimize-button');
    tableDetail.style.display = 'block';
    minimizeButton.style.display = 'block';
    // minimizeButton.innerText = '-';
    document.getElementById('openTableBtn').style.display = 'none'; // Hide the show button
  }

  // Add event listener to the show table button
  document.getElementById('openTableBtn').addEventListener('click', showTable);


  function tableData(typeName, geoServerURL, cqlFilter, headers) {
    $.getJSON(geoServerURL, function (data) {
      var filteredData = data.features.map(feature => {
        let mappedData = {};
        headers.forEach(header => {
          mappedData[header] = feature.properties[header] || '';
        });
        mappedData.geometry = feature.geometry;
        return mappedData;
      });

      createTable(filteredData, headers);
    });
  }
}

// new code 18/9-----------------
$(document).ready(function () {
  // Handle click event on minimize-button
  $('#minimize-button').click(function () {
    // Hide the pagination div
    $('#pagination').hide();
  });
});


document.addEventListener('DOMContentLoaded', (event) => {

  // alert("heheeheh")
  // var columns = {"Work_ID":"Work ID", "Budget_Code":"Budget Code", "Name_of_Work":"Name of Work", "Scope_of_Work":"Scope of Work", "Name_of_JE":"Name of JE", "Agency":"Agency"};
  var columns =  {"token": "Token No", "siteaddress_area": "Village Name", "gut_no": "Survey No", "ownerinformation_firstname": "Owner Name"  };

  var select = document.getElementById("search_type");

  // Populate dropdown with column names
  for (var key in columns) {
    if (columns.hasOwnProperty(key)) {
      var option = document.createElement("option");
      option.text = columns[key];
      option.value = key;



      select.appendChild(option);

    }
  }




  // Initialize selected value variable
  let selectedValue;





  // Event listener for dropdown change
  $("#search_type").change(function () {
    // alert("ooooooooooooo")
    var selectedValue = $(this).val();
    var selectedText = columns[selectedValue]; // Get corresponding label from columns object
    var input = document.getElementById("searchInputDashboard");
    // Update input placeholder and clear input value
    var selectedValue = select.value;
    input.placeholder = "Search " + selectedText;
    input.value = "";


    // Call autocomplete with empty array and selected column
    autocomplete(input, [], selectedValue);

    // Trigger search based on the selected column immediately after selecting
    if (selectedValue) {
      getValues(function (data) {
        autocomplete(input, data, selectedValue); // Call autocomplete with fetched data and selected column
      });
    }

    function getValues(callback) {
      var geoServerURL = `${main_url}AutoDCR/wms?service=WFS&version=1.1.0&request=GetFeature&typeName=Plot_Layout&propertyName=${selectedValue}&outputFormat=application/json`;
      console.log(geoServerURL, "geoServerURLsearch");

      $.getJSON(geoServerURL, function (data) {
        var workTypeSet = new Set();

        // Populate the Set with work types
        $.each(data.features, function (index, feature) {
          var workType = feature.properties[selectedValue];

          // Convert number (double) values to strings
          if (typeof workType === 'number') {
            workType = workType.toString();
          }
          if (workType !== null) {
            workTypeSet.add(workType);
          }
        });

        // Convert the Set to an array
        var uniqueWorkTypes = Array.from(workTypeSet);
        console.log(uniqueWorkTypes, "uniqueWorkTypes");

        // Call the callback function with the uniqueWorkTypes array
        callback(uniqueWorkTypes);
      });
    }

    // Call getValues function and initialize autocomplete
    getValues(function (data) {
      // console.log("heheheh", data);
      console.log(selectedValue, "LLLLLLLLLLLLLLLLLLLLLL")
      // Initialize autocomplete with fetched data
      autocomplete(document.getElementById("searchInputDashboard"), data);
    });
  });

  // autocomplete function
  function autocomplete(input, arr, selectedColumn) {
    let currentFocus;
    input.addEventListener("input", function () {
      let list, item, i, val = this.value.toLowerCase(); // Convert input value to lowercase for case-insensitive comparison
      closeAllLists();
      if (!val) return false;
      currentFocus = -1;
      list = document.createElement("ul");
      list.setAttribute("id", "autocomplete-list");
      list.setAttribute("class", "autocomplete-items");
      document.getElementById("autocompleteSuggestions").appendChild(list);
      for (i = 0; i < arr.length; i++) {
        if (arr[i].toLowerCase().includes(val)) { // Check if the suggestion contains the input value
          item = document.createElement("li");
          item.innerHTML = arr[i].replace(new RegExp(val, 'gi'), (match) => `<strong>${match}</strong>`); // Highlight matching letters
          item.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          item.addEventListener("click", function () {
            selectedValue = this.getElementsByTagName("input")[0].value; // Store the selected value
            console.log(selectedValue, "ppppppppppppppppp")


            var searchtypefield = $("#search_type").val();
            console.log(searchtypefield, "ppppppppppppppppp99999999")
            let cqlFilter;

            cqlFilter = `${searchtypefield} IN ('${selectedValue}')`;

            console.log(cqlFilter, "cqlFilter")




            Plot_Layout.setParams({
              CQL_FILTER: cqlFilter,
              maxZoom: 19.5,
              // styles: "IWMS_points"
            });

            Village_Boundary1.setParams({
              CQL_FILTER: cqlFilter,
              maxZoom: 19.5,
              styles: "Village_Highlight"
            });

            


            console.log("Adding IWMS_point, IWMS_line, and IWMS_polygon layers with filter:", cqlFilter);
            Plot_Layout.addTo(map).bringToFront();
           Village_Boundary1.addTo(map).bringToFront();
            fitbous(cqlFilter);

            DataTableFilter(cqlFilter)



            input.value = selectedValue;
            closeAllLists();
          });
          list.appendChild(item);
        }
      }
    });

    input.addEventListener("keydown", function (e) {
      let x = document.getElementById("autocomplete-list");
      if (x) x = x.getElementsByTagName("li");
      if (e.keyCode === 40) {
        currentFocus++;
        addActive(x);
      } else if (e.keyCode === 38) { //up
        currentFocus--;
        addActive(x);
      } else if (e.keyCode === 13) {
        e.preventDefault();
        if (currentFocus > -1) {
          if (x) {
            selectedValue = x[currentFocus].getElementsByTagName("input")[0].value; // Store the selected value
            input.value = selectedValue;
            closeAllLists();
          }
        }
      }
    });

    function addActive(x) {
      if (!x) return false;
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
      for (let i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }

    function closeAllLists(elmnt) {
      let x = document.getElementsByClassName("autocomplete-items");
      for (let i = 0; i < x.length; i++) {
        if (elmnt !== x[i] && elmnt !== input) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }

    document.addEventListener("click", function (e) {
      closeAllLists(e.target);
    });
  }
});

 
const layerDetails = {
  "AutoDCR:Plot_Layout": ["token","siteaddress_area", "gut_no", "ownerinformation_firstname","caseinformation_applyfor", "caseinformation_casetype", "caseinformation_proposaltype", "caseinformation_tdrzone", "caseinformation_grossplotarea", "plotdetails_developmentzonedp", ],
};

// Mapping of field names to display names
const fieldDisplayNames = {
  "token": "Token No",
  "siteaddress_area": "Village Name",
  "gut_no": "Survey No",
  "ownerinformation_firstname": "Owner Name",
  "caseinformation_applyfor": "Apply For",
  "caseinformation_casetype": "Case Type",
  "caseinformation_proposaltype": "Proposal Type",
  "caseinformation_tdrzone": "TDR Zone",
  "caseinformation_grossplotarea": "Gross Plot Area",
  "plotdetails_developmentzonedp": "Development Zone",
  
};

function getCheckedValuesforpopuups() {
  return new Promise((resolve, reject) => {
    var selectedValues = {};
    const filternames = ["siteaddress_area", "caseinformation_applyfor", "caseinformation_casetype", "gut_no", "caseinformation_proposaltype", "caseinformation_tdrzone", "caseinformation_grossplotarea", "plotdetails_developmentzonedp", "ownerinformation_firstname"];

    filternames.forEach(function (filtername) {
      selectedValues[filtername] = []; 

      $('#' + filtername + ' input[type="checkbox"]:checked').each(function () {
        var single_val = $(this).val();
        if (single_val) {
          var actualValue = single_val.split(' (')[0];
          selectedValues[filtername].push(actualValue);
        }
      });
    });

    var filters = [];
    for (var key in selectedValues) {
      if (selectedValues[key].length > 0) {
        filters.push(`${key} IN ('${selectedValues[key].join("','")}')`);
      }
    }

    var filterString = filters.join(" AND ");
    resolve(filterString);
  });
}

function combineFilters(cql_filter123, filterString) {
  if (cql_filter123) {
    return `${cql_filter123} AND ${filterString}`;
  } else {
    return filterString;
  }
}


// code for modal changes move modal with data , open after right click , after close modal that modal is not reopen 

let isModalOpen = false; // Flag to track modal visibility

// Function to handle right-click on the map
async function handleMapRightClick(e) {
  console.log("Right-click event:", e);

  let bbox = map.getBounds().toBBoxString();
  let size = map.getSize();

  let filterString = await getCheckedValuesforpopuups();
  let cqlFilter123 = filterString.trim() !== "" ? encodeURIComponent(filterString) : "";

  for (let layer in layerDetails) {
    let selectedKeys = layerDetails[layer];
    let workspace = "AutoDCR";
    let urrr = `https://iwmsgis.pmc.gov.in/geoserver/${workspace}/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=true&QUERY_LAYERS=${layer}&STYLES&LAYERS=${layer}&exceptions=application%2Fvnd.ogc.se_inimage&INFO_FORMAT=application/json&FEATURE_COUNT=50&X=${Math.round(e.containerPoint.x)}&Y=${Math.round(e.containerPoint.y)}&SRS=EPSG%3A4326&WIDTH=${size.x}&HEIGHT=${size.y}&BBOX=${bbox}`;
    console.log("WMS Request URL:", urrr);

    try {
      let response = await fetch(urrr);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      let json = await response.json();
      if (json.features.length > 0) {
        let htmldata = json.features[0].properties;
        let txtk1 = "";
        for (let key of selectedKeys) {
          if (htmldata.hasOwnProperty(key)) {
            let value = htmldata[key];
            let displayName = fieldDisplayNames[key] || key; // Use the mapping or default to key
            txtk1 += `<tr><td>${displayName}</td><td>${value}</td></tr>`;
          }
        }
        let detaildata1 = `<table style='width:100%;' class='popup-table'>${txtk1}<tr><td>Coordinates</td><td>${e.latlng}</td></tr></table>`;
        console.log("Modal Content:", detaildata1);

        // Update the modal content
        document.getElementById("modalContent").innerHTML = detaildata1;
        // Set modal position to clicked position
        updatePopupPosition(e);
        isModalOpen = true; // Mark the modal as open
      } else {
        console.log("No features found for this location.");
        closeModal(); // Close the modal if no features are found
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      closeModal(); // Close the modal on error
    }
  }
}

// Function to update the popup position
function updatePopupPosition(e) {
  let modal = document.getElementById("infoModal");
  if (!modal) return;

  modal.style.display = "block"; // Show the modal
  const modalWidth = modal.offsetWidth;
  const modalHeight = modal.offsetHeight;

  console.log(`Popup position: x=${e.containerPoint.x}, y=${e.containerPoint.y}`);
  console.log(`Modal size: width=${modalWidth}, height=${modalHeight}`);

  modal.style.left = `${e.containerPoint.x - modalWidth / 2}px`; // Center horizontally
  modal.style.top = `${e.containerPoint.y - modalHeight}px`; // Position above the click point
}

// Function to update popup position on map move
function updatePopupPositionOnMapMove() {
  if (lastClickEvent && isModalOpen) {
    const newContainerPoint = map.latLngToContainerPoint(lastClickEvent.latlng); // Get new container point after map move
    updatePopupPosition({ containerPoint: newContainerPoint, latlng: lastClickEvent.latlng });
  }
}

// Function to close the modal
function closeModal() {
  document.getElementById("infoModal").style.display = "none";
  isModalOpen = false; // Mark the modal as closed
}

// Event listener for right-click on map (contextmenu event)
map.on("contextmenu", (e) => {
  lastClickEvent = e;
  handleMapRightClick(e);
});

// Event listener for map move and zoom to update the popup position
map.on("move", () => {
  updatePopupPositionOnMapMove(); // Update popup position in real-time while the map is being dragged
});

// Store the last right-click event to use when the map moves
let lastClickEvent;



// script2.js

// Ensure tabsOptions is shown by default on page load
document.addEventListener("DOMContentLoaded", function() {
  var tabsOptions = document.getElementById("tabsOptions");
  var tabParent = document.getElementById("tabParent");

  tabsOptions.style.display = "flex"; // Show tabsOptions by default
  tabParent.style.display = "none";   // Hide tabParent by default
});

// Toggle options visibility when the optionsButton is clicked
document.getElementById("optionsButton").addEventListener("click", function () {
  var tabsOptions = document.getElementById("tabsOptions");
  var tabParent = document.getElementById("tabParent");

  if (tabsOptions.style.display === "none" || tabsOptions.style.display === "") {
    tabsOptions.style.display = "flex"; // Show the options
    tabParent.style.display = "none"; // Hide tab-parent
  } else {
    // Do nothing, keeping the options visible
  }
});

// Add click event listener for the Analytics button
document.querySelector(".component-6").addEventListener("click", function () {
  var tabParent = document.getElementById("tabParent");
  var tabsOptions = document.getElementById("tabsOptions");

  tabParent.style.display = "flex";   // Show tabParent
  tabsOptions.style.display = "none"; // Hide tabsOptions
});





//move the north arrow container 
document.addEventListener('DOMContentLoaded', function () {
  const statusElement = document.querySelector('.status');
  const dataGraphsElement = document.querySelector('.data-graphs');
  const legendsDiv = document.querySelector('.legends');
  const toggleButton = document.getElementById('toggleButton');
  const toggleFiltersButton = document.getElementById('toggleFilters');
  const filters = document.getElementById('filters');
  const filterCloseIcon = document.querySelector('.close-icon');
  const northArrowContainer = document.querySelector('.north-arrow-container');
  const closeLegendButton = document.getElementById('closeLegendButton');
  const summaryCloseIcon = document.querySelector('.summary-close');
  const toggleButtons = document.querySelectorAll('.toggle-button'); // Select all toggle-button elements

  setTimeout(() => {
    const scaleControlElement = document.querySelector('.leaflet-control-scale');

    function moveScaleControlRight() {
      if (scaleControlElement) {
        scaleControlElement.classList.add('move-right');
      }
    }

    function resetScaleControlPosition() {
      if (scaleControlElement) {
        scaleControlElement.classList.remove('move-right');
      }
    }

    function closeAllSections() {
      dataGraphsElement.style.display = 'none';
      legendsDiv.classList.add('hidden');
      filters.style.display = 'none';
      filters.style.opacity = '0';
      filters.style.visibility = 'hidden';
      northArrowContainer.classList.remove('move-right');
      resetScaleControlPosition();
    }

    function moveMapSectionRight() {
      northArrowContainer.classList.add('move-right');
      moveScaleControlRight();
    }

    statusElement.addEventListener('click', function () {
      if (dataGraphsElement.style.display === 'none' || dataGraphsElement.style.display === '') {
        closeAllSections();
        dataGraphsElement.style.display = 'block';
        moveMapSectionRight();
      } else {
        closeAllSections();
      }
    });

    toggleButton.addEventListener('click', function () {
      if (legendsDiv.classList.contains('hidden')) {
        closeAllSections();
        legendsDiv.classList.remove('hidden');
        moveMapSectionRight();
      } else {
        closeAllSections();
      }
    });

    closeLegendButton.addEventListener('click', function () {
      legendsDiv.classList.add('hidden');
      resetScaleControlPosition();
      northArrowContainer.classList.remove('move-right');
    });

    toggleFiltersButton.addEventListener('click', function () {
      if (filters.style.display === 'none' || filters.style.display === '') {
        closeAllSections();
        filters.style.display = 'block';
        filters.style.opacity = '1';
        filters.style.visibility = 'visible';
        moveMapSectionRight();
      } else {
        closeAllSections();
      }
    });

    filters.addEventListener('click', function (event) {
      event.stopPropagation();
    });

    filterCloseIcon.addEventListener('click', function () {
      filters.style.opacity = '0';
      filters.style.visibility = 'hidden';
      resetScaleControlPosition();
      northArrowContainer.classList.remove('move-right');

      setTimeout(() => {
        filters.style.display = 'none';
      }, 300);
    });

    // Add event listener for closing the data-graphs section
    summaryCloseIcon.addEventListener('click', function () {
      closeAllSections();
    });
  }, 100);
});

// $(document).ready(function () {
// // date range code
// // Example usage of the function
// const layername = "AutoDCR:plot1_layout_test";
// const main_url = "https://iwmsgis.pmc.gov.in/geoserver/";
// let villageLayer; 

// var start =  moment('2024-04-01');
// var end = moment();
// var cql_filter1; // Declare the variable in the outer scope
// $('#daterange').daterangepicker({
//   opens: 'left',
//   locale: {
//     format: 'MMMM D, YYYY' // Format to show Month name, Day, and Year
//   },
//   startDate: moment('2024-04-01'), // Set the start date to April 1st, 2024
//   endDate: moment('2025-03-31'),   // Set the end date to March 31st, 2025
//   ranges: {
//     'Last 7 Days': [moment().subtract(6, 'days'), moment()],
//     'This Month': [moment().startOf('month'), moment().endOf('month')],
//     'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
//     '2024-2025': [moment('2024-04-01'), moment('2025-03-31')],
//     '2023-2024': [moment('2023-04-01'), moment('2024-03-31')],
//     '2022-2023': [moment('2022-04-01'), moment('2023-03-31')],
//     '2021-2022': [moment('2021-04-01'), moment('2022-03-31')],
//   }
// }, cb);
// cb(start, end);

// function cb(start, end) {

//   var formattedStartDate = start.format('YYYY-MM-DDTHH:mm:ssZ');;
//   var formattedEndDate = end.format('YYYY-MM-DDTHH:mm:ssZ');;
//   cql_filter1 = `entry_timestamp >= '${formattedStartDate}' AND entry_timestamp < '${formattedEndDate}'`;

//   console.log(cql_filter1, "lll")

// // alert(cql_filter1)

//   console.log(cql_filter1, "lllokkkkk")


//   // loadAndProcessGeoJSON(main_url, layername,cql_filter1);
//   DataTableFilter(cql_filter1)

//   loadinitialData(cql_filter1);
//   highlightVillages(); // Call to highlight villages
// // alert(cql_filter1)
//   // console.log(cql_filter1,"cql_filter1")
//   getCheckedValues(function (filterString) {
//     // alert(filterString)
//     const mainfilter = combineFilters(cql_filter1, filterString);
//     console.log("Main Filterfor checking:", mainfilter);
//     FilterAndZoom(mainfilter);
//     DataTableFilter(mainfilter);
//     highlightVillages();
//   });
// }

// $('#calendarIcon').on('click', function () {
//   $('#daterange').click();
// });


// // Function to get cql_filter1 value
// function getCqlFilter() {
//   return cql_filter1;
// }


// // -------------------------------------------------
// function loadinitialData(cql_filter) {

//   const layername = "AutoDCR:plot1_layout_test";
// const main_url = "https://iwmsgis.pmc.gov.in/geoserver/";
//   const filternames = ["siteaddress_area", "caseinformation_applyfor", "gut_no", 
//                        "caseinformation_casetype", "caseinformation_proposaltype", 
//                        "token", "caseinformation_grossplotarea", 
//                        "plotdetails_developmentzonedp", "ownerinformation_firstname"];

//   // Load data from the specified layer
//   const url = `${main_url}AutoDCR/wms?service=WFS&version=1.1.0&request=GetFeature&typeName=${layername}&outputFormat=application/json&cql_filter=${encodeURIComponent(cql_filter)}`;
//   console.log(url, "mainurl");

//   return $.getJSON(url).then(function (data) {
//       // Assuming villageLayer is created here
//       villageLayer = L.geoJSON(data, {
//           onEachFeature: function (feature, layer) {
//               // Add any popups or bindings here
//               layer.bindPopup(feature.properties['siteaddress_area']);
//           }
//       }).addTo(map); // Assuming you have a map variable defined
//       highlightVillages(); // Highlight villages after loading the data
//   });
// }

// // Function to highlight selected villages
// function highlightVillages() {
//   const selectedVillages = [];
  
//   $('#siteaddress_area input[type="checkbox"]:checked').each(function () {
//       const villageName = $(this).val();
//       if (villageName) {
//           selectedVillages.push(villageName); // Add to array if valid
//       }
//   });

//   console.log("Selected Villages:", selectedVillages); // Debugging

//   if (villageLayer) {
//       villageLayer.eachLayer(function (layer) {
//           const villageName = layer.feature.properties['siteaddress_area'];
//           console.log("Checking village:", villageName); // Debugging
//           if (selectedVillages.includes(villageName)) {
//               // Highlight the village
//               layer.setStyle({ color: 'yellow', weight: 3 }); // Change the style as needed
//               console.log("Highlighting village:", villageName); // Debugging
//           } else {
//               // Reset the style for unselected villages
//               layer.setStyle({ color: 'blue', weight: 1 }); // Original style
//           }
//       });
//   } else {
//       console.error("villageLayer is not defined."); // Debugging
//   }
// }

// // Event listener for checkboxes
// $('#siteaddress_area input[type="checkbox"]').on('change', function () {
//   highlightVillages(); // Call the highlighting function whenever a checkbox is changed
// });




// function combineFilters(cql_filter123, filterString) {
//   if (filterString !== null && filterString !== undefined && filterString !== '') {
//     return `(${cql_filter123}) AND ${filterString}`;
//   } else {
//     return cql_filter123;
//   }
// }

// function initialize() {

//   $('#daterange').on('apply.daterangepicker', function (ev, picker) {
//     // var startDate = picker.startDate.format('YYYY-MM-DD');
//     // var endDate = picker.endDate.format('YYYY-MM-DD');

//     var formattedStartDate = start.format('YYYY-MM-DDTHH:mm:ssZ');;
//     var formattedEndDate = end.format('YYYY-MM-DDTHH:mm:ssZ');;
//     cql_filter1 = `entry_timestamp >= '${formattedStartDate}' AND entry_timestamp < '${formattedEndDate}'`;


//     loadinitialData(cql_filter1);
//     const cql_filter = getCqlFilter();
//     getCheckedValues(function (filterString) {


//       const mainfilter = combineFilters(cql_filter1, filterString);
//       console.log("Main Filterfor checking:", mainfilter);

//       FilterAndZoom(mainfilter);

//       DataTableFilter(mainfilter);
//       highlightVillages();

//     });
//   });
// }

// initialize();
// });















// Toggle arrow direction


$(document).ready(function () {
  // date range code
  const layername = "AutoDCR:Plot_Layout";
  const main_url = "https://iwmsgis.pmc.gov.in/geoserver/";
  let villageLayer;

  var start = moment('2024-04-01');
  var end = moment();
  var cql_filter1; // Declare the variable in the outer scope

  $('#daterange').daterangepicker({
      opens: 'left',
      locale: {
          format: 'MMMM D, YYYY' // Format to show Month name, Day, and Year
      },
      startDate: moment('2024-04-01'), // Set the start date to April 1st, 2024
      endDate: moment('2025-03-31'),   // Set the end date to March 31st, 2025
      ranges: {
          'Last 7 Days': [moment().subtract(6, 'days'), moment()],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
          '2024-2025': [moment('2024-04-01'), moment('2025-03-31')],
          '2023-2024': [moment('2023-04-01'), moment('2024-03-31')],
          '2022-2023': [moment('2022-04-01'), moment('2023-03-31')],
          '2021-2022': [moment('2021-04-01'), moment('2022-03-31')],
      }
  }, cb);
  cb(start, end);

  function cb(start, end) {
      var formattedStartDate = start.format('YYYY-MM-DDTHH:mm:ssZ');
      var formattedEndDate = end.format('YYYY-MM-DDTHH:mm:ssZ');
      cql_filter1 = `entry_timestamp >= '${formattedStartDate}' AND entry_timestamp < '${formattedEndDate}'`;

      console.log(cql_filter1, "lll");

      DataTableFilter(cql_filter1);
      loadinitialData(cql_filter1); // Load the initial data
  }

  $('#calendarIcon').on('click', function () {
      $('#daterange').click();
  });

  // Function to load initial data
  function loadinitialData(cql_filter) {
      const url = `${main_url}AutoDCR/wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=${layername}&outputFormat=application/json&cql_filter=${encodeURIComponent(cql_filter)}`;
      console.log(url, "Main URL");

      return $.getJSON(url).then(function (data) {
          // Create villageLayer from GeoJSON data
          villageLayer = L.geoJSON(data, {
              onEachFeature: function (feature, layer) {
                  layer.bindPopup(feature.properties['caseinformation_area']);
              }
          }).addTo(map); // Assuming you have a map variable defined

          // Highlight villages based on current checkbox selections
          highlightVillages(); // Call highlighting here only for initial load
      }).catch(function (error) {
          console.error("Error loading GeoJSON data:", error);
      });
  }

  // Function to highlight selected villages
  function highlightVillages() {
      const selectedVillages = [];

      $('#siteaddress_area input[type="checkbox"]:checked').each(function () {
          const villageName = $(this).val();
          if (villageName) {
              selectedVillages.push(villageName); // Add to array if valid
          }
      });

      console.log("Selected Villages:", selectedVillages); // Debugging

      if (villageLayer) {
          villageLayer.eachLayer(function (layer) {
              const villageName = layer.feature.properties['caseinformation_area']; // Using 'caseinformation_area' for village name
              // console.log("Checking village:", villageName); // Debugging
              if (selectedVillages.includes(villageName)) {
                  // Highlight the village
                  layer.setStyle({ color: 'yellow', weight: 3 }); // Change the style as needed
                  console.log("Highlighting village:", villageName); // Debugging
              } else {
                  // Reset the style for unselected villages
                  layer.setStyle({ color: 'blue', weight: 1 }); // Original style
              }
          });
      } else {
          console.error("villageLayer is not defined."); // Debugging
      }
  }

  // Event listener for checkboxes
  $('#siteaddress_area input[type="checkbox"]').on('change', function () {
      highlightVillages(); // Call the highlighting function whenever a checkbox is changed
  });

  // Additional code for combining filters and other functionality
  function combineFilters(cql_filter123, filterString) {
      if (filterString !== null && filterString !== undefined && filterString !== '') {
          return `(${cql_filter123}) AND ${filterString}`;
      } else {
          return cql_filter123;
      }
  }

  function initialize() {
      $('#daterange').on('apply.daterangepicker', function (ev, picker) {
          var formattedStartDate = picker.startDate.format('YYYY-MM-DDTHH:mm:ssZ');
          var formattedEndDate = picker.endDate.format('YYYY-MM-DDTHH:mm:ssZ');
          cql_filter1 = `entry_timestamp >= '${formattedStartDate}' AND entry_timestamp < '${formattedEndDate}'`;

          loadinitialData(cql_filter1);
          const cql_filter = getCqlFilter();
          getCheckedValues(function (filterString) {
              const mainfilter = combineFilters(cql_filter1, filterString);
              // alert("egrhubybv")
              console.log("Main Filter for checking:", mainfilter);

              FilterAndZoom(mainfilter);
              DataTableFilter(mainfilter);
              highlightVillages(); // Call to highlight after applying filter
          });
      });
  }

  initialize();
});





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




// Add scale control
L.control.scale({
  position: 'bottomleft' // Change position to bottom right
}).addTo(map);


document.addEventListener('DOMContentLoaded', function () {
  // Select all building-permissions-parent elements
  const toggleSections = document.querySelectorAll('.building-permissions-parent');

  toggleSections.forEach(section => {
      section.addEventListener('click', function () {
          const barChartContainer = this.nextElementSibling; // Select the next sibling which is the bar-chart-container

          // Toggle active class to change the icon and show/hide content
          this.classList.toggle('active');

          // Toggle display of the bar-chart-container
          if (barChartContainer.style.display === 'block') {
              barChartContainer.style.display = 'none';
              this.querySelector('.toggle-icon').classList.replace('fa-angle-up', 'fa-angle-down');
          } else {
              barChartContainer.style.display = 'block';
              this.querySelector('.toggle-icon').classList.replace('fa-angle-down', 'fa-angle-up');
          }
      });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const component6 = document.querySelector('.component-7');
  const component7 = document.querySelector('.component-6');
  const images = document.querySelectorAll('.ui-iconbookmarklight'); // Select all images

  // Define colors
  const defaultColor6 = '#f0f0f0'; // Default background color for component-6
  const activeColor6 = 'radial-gradient(50% 50% at 50% 50%, #198038, #24a148)'; // Active background color for component-6
  
  const defaultColor7 = '#f0f0f0'; // Default background color for component-7
  const activeColor7 = 'radial-gradient(50% 50% at 50% 50%, #198038, #24a148)'; // Active background color for component-7

  // Set initial active state for component-6
  component6.style.background = activeColor6;
  component6.style.color = 'white'; // Set initial text color for better contrast

  // Click event for component-6
  component6.addEventListener('click', function() {
    // Keep component-6 active when clicked
    component6.style.background = activeColor6;
    component6.style.color = 'white'; // Maintain text color for better contrast

    // Reset background color for component-7
    component7.style.background = defaultColor7;
    component7.style.color = 'black'; // Default text color

    // Remove white filter from images
    images.forEach(img => img.classList.remove('white-filter'));
  });

  // Click event for component-7
  component7.addEventListener('click', function() {
    // Set background color for component-7 to active
    component7.style.background = activeColor7;
    component7.style.color = 'white'; // Change text color to white for better contrast

    // Reset background color for component-6
    component6.style.background = defaultColor6;
    component6.style.color = 'black'; // Default text color

    // Add white filter to images
    images.forEach(img => img.classList.add('white-filter'));
  });
});


function closeFilters() {

  var filterElement = document.getElementById('filters');
  filterElement.style.display = 'none';
}

//cluster legend 
document.addEventListener('DOMContentLoaded', function() {
  const clusterLegend = document.getElementById('cluster_legend');
  const toggleButton = document.getElementById('toggleClusterLegend');
  const map = document.getElementById('map'); // Assuming your map has an id of 'map'

  toggleButton.addEventListener('click', function(event) {
    // Toggle the 'no-border' class to remove or add border
    this.classList.toggle('no-border');

    // Toggle the visibility of the cluster legend
    clusterLegend.classList.toggle('hidden');
    
    // Prevent click event from bubbling up to the map
    event.stopPropagation();
  });

  // Close the cluster legend when clicking on the map
  map.addEventListener('click', function() {
    // Add the 'hidden' class to close the legend if it's visible
    if (!clusterLegend.classList.contains('hidden')) {
      clusterLegend.classList.add('hidden');
    }
  });
});





document.addEventListener('DOMContentLoaded', function () {
  const dataGraphsElement = document.querySelector('.data-graphs');
  const tabElements = document.querySelectorAll('.tab'); // Select all tab elements
  const summaryCloseIcon = document.querySelector('.summary-close');
  const northArrowContainer = document.querySelector('.north-arrow-container'); // Select the north arrow container
  const scaleControlElement = document.querySelector('.leaflet-control-scale'); // Select the scale control
  const optionsButton = document.getElementById('optionsButton'); // Select the options button

  function closeDataGraphs() {
    dataGraphsElement.style.display = 'none';
    northArrowContainer.classList.remove('move-right'); // Reset the position of the north-arrow-container
    scaleControlElement.classList.remove('move-right'); // Reset the position of the scale control
  }

  function openDataGraphs() {
    dataGraphsElement.style.display = 'block';
    northArrowContainer.classList.add('move-right'); // Move the north-arrow-container to the right
    scaleControlElement.classList.add('move-right'); // Move the scale control to the right
  }

  // Add event listeners to each tab
  tabElements.forEach(tab => {
    tab.addEventListener('click', function () {
      const tabType = tab.getAttribute('data-tab'); // Get the data-tab attribute

      if (tabType === 'status') {
        // Open the data-graphs div when "Status" is clicked
        openDataGraphs();
      } else {
        // Close the data-graphs div for "Area" or "Explore"
        closeDataGraphs();
      }
    });
  });

  // Add event listener for closing the data-graphs when clicking the close icon
  summaryCloseIcon.addEventListener('click', function () {
    closeDataGraphs();
  });

  // Add event listener for the options button to close data-graphs
  optionsButton.addEventListener('click', function () {
    closeDataGraphs();
  });
});


// close the box and all 
document.addEventListener('DOMContentLoaded', function () {
  const filters = document.getElementById('filters');
  const legendsDiv = document.querySelector('.legends');
  const northArrowContainer = document.querySelector('.north-arrow-container');
  const scaleControlElement = document.querySelector('.leaflet-control-scale');
  const analyticsButton = document.getElementById('analyticsButton');
  const box = document.getElementById('box');
  const button = document.getElementById('Button');
  const closeBoxIcon = document.getElementById('closeBox');

  // By default, open the box
  box.style.display = 'block'; // Ensure the box is open by default

  function closeFilterAndLegend() {
    console.log('Closing filter and legend'); 

    filters.style.display = 'none';
    legendsDiv.classList.add('hidden');
    resetScaleControlPosition();
    northArrowContainer.classList.remove('move-right');
  }

  function resetScaleControlPosition() {
    if (scaleControlElement) {
      scaleControlElement.classList.remove('move-right');
    }
  }

  // Toggle box visibility below the button
  button.addEventListener('click', function (event) {
    event.stopPropagation(); // Prevent the document click from immediately hiding the box
    const buttonRect = button.getBoundingClientRect();

    if (box.style.display === 'none' || box.style.display === '') {
      box.style.display = 'block';
    } else {
      box.style.display = 'none';
    }
  });

  // Close box when clicking outside of it or outside the button
  document.addEventListener('click', function (event) {
    if (!box.contains(event.target) && !button.contains(event.target)) {
      box.style.display = 'none';
    }
  });

  // Close the box when the close icon is clicked
  closeBoxIcon.addEventListener('click', function () {
    box.style.display = 'none';
  });

  document.querySelectorAll('.component-10').forEach(function (element) {
    element.addEventListener('click', function () {
      closeFilterAndLegend();
    });
  });

  document.querySelectorAll('.component-11').forEach(function (element) {
    element.addEventListener('click', function () {
      closeFilterAndLegend();
    });
  });

  analyticsButton.addEventListener('click', function () {
    closeFilterAndLegend();
  });
});


//search bar 
const searchButton = document.getElementById('searchButton');
  const searchContainer = document.getElementById('search-container');

  searchButton.addEventListener('click', () => {
    if (searchContainer.style.display === 'none' || searchContainer.style.display === '') {
      searchContainer.style.display = 'block'; // Show the search container
    } else {
      searchContainer.style.display = 'none'; // Hide the search container
    }
  });


  //click on calender button show the calender box
  $(document).ready(function () {
    $('#calendarButton').on('click', function () {
        $('.daterange-container').toggle(); // Toggle visibility of the date range input
    });
});


//box pie chart total projrct 

const box_url = "https://iwmsgis.pmc.gov.in/geoserver/";
const layer_name = "AutoDCR:Plot_Layout";

const proposalTypeColors = {
    "Residential": "yellow",
    "Commercial": "blue",
    "Industrial": "violet",
    "Other": "gray",
    "Resi+Comm": "orange",
    "Institutional": "pink",
    "InfoTech": "indigo",
    "Assembly": "green",
   
};

// Function to fetch data from GeoServer
async function fetchProposalData() {
    // Set initial loading message
    document.getElementById("box-content").innerHTML = "Loading proposal type and project count...";

    const wfs_url = `${box_url}wfs?service=WFS&version=1.0.0&request=GetFeature&typeName=${layer_name}&outputFormat=application/json`;

    try {
        const response = await fetch(wfs_url);
        const geojson = await response.json();

        // Count number of features (projects)
        const projectCount = geojson.features.length;

        // Count occurrences of each proposal type
        const proposalCounts = {};
        geojson.features.forEach(feature => {
            const proposalType = feature.properties.caseinformation_proposaltype; // Use the correct property name
            proposalCounts[proposalType] = (proposalCounts[proposalType] || 0) + 1;
        });

        // Create a display string for proposal counts with color boxes
        const proposalCountDisplay = Object.entries(proposalCounts)
            .map(([type, count]) => {
                const color = proposalTypeColors[type] || "black"; // Default to black if not defined
                return `
                    <div style="padding: 2px; font-size: 13px; display: flex; align-items: center;">
                        <div style="width: 12px; height: 12px; background-color: ${color}; margin-right: 5px;"></div>
                        ${type}: ${count}
                    </div>
                `; // Colored square div next to the proposal type
            })
            .join('');

        // Display total project count and proposal counts in the box
        const content = `
            <strong>Total Projects: ${projectCount}</strong><hr>
            <strong>Proposal Counts:</strong><br>
            <div style="background-color: #e6f1fb; padding: 5px; border-radius: 5px;">
                ${proposalCountDisplay}
            </div>
        `;
        document.getElementById("box-content").innerHTML = content;
    } catch (error) {
        console.error("Error fetching proposal data:", error);
        document.getElementById("box-content").textContent = "Error loading proposal data.";
    }
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", fetchProposalData);

// Close the box when the close icon is clicked
document.getElementById("closeBox").addEventListener("click", () => {
    document.getElementById("box").style.display = "none";
});


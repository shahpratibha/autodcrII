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
    // //console.log("Filter Stringinside: ", filterString1);
    const mainfilter = combineFilters(filterString1, filterString);
    // //console.log("Filter Stringinside: ", mainfilter);
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

// old code 18/9
// function DataTableFilter(cql_filter1) {
//   var layers = ["AutoDCR:Plot_Layout"];
//   var typeName = layers.join(',');
//   var cqlFilter = cql_filter1;
//   var workspace = 'AutoDCR'
//   var geoServerURL =
//     `${main_url}${workspace}/wms?service=WFS&version=1.1.0&request=GetFeature&typeName=${typeName}&outputFormat=application/json`;
//   if (cql_filter1 !== '') {
//     geoServerURL += "&CQL_FILTER=" + encodeURIComponent(cqlFilter);
//   }
//   var headers = ["token","gut_no","siteaddress_area",  "ownerinformation_firstname", "caseinformation_grossplotarea","caseinformation_applyfor", "caseinformation_casetype", "caseinformation_proposaltype", "caseinformation_tdrzone","plotdetails_developmentzonedp","entry_timestamp"];
//   showtable(typeName, geoServerURL, cqlFilter, headers);


// }
// old code 18/9

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
      for (var key in selectedValues) {
        if (selectedValues[key].length > 0) {
          filters.push(`${key} IN ('${selectedValues[key].join("','")}')`);
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
// ----------------------old code 18/9
// function showtable(typeName, geoServerURL, cqlFilter, headers) {
//   tableData(typeName, geoServerURL, cqlFilter, headers);

//   var currentPage = 1;
//   var rowsPerPage = 10;
//   var buttonsToShow = 3;

//   function setupPagination(data, rowsPerPage, headers, tableContainer) {
//     var paginationContainer = document.createElement('div');
//     paginationContainer.id = 'pagination';

//     var pageCount = Math.ceil(data.length / rowsPerPage);

//     function renderPageButtons(startPage) {
//       paginationContainer.innerHTML = "";

//       // Previous Button
//       var prevButton = document.createElement('button');
//       prevButton.innerHTML = '&larr;';
//       prevButton.disabled = currentPage === 1;
//       prevButton.addEventListener('click', function () {
//         if (currentPage > 1) {
//           currentPage--;
//           createTable(data, currentPage, rowsPerPage, headers);
//           renderPageButtons(Math.max(1, currentPage - Math.floor(buttonsToShow / 2)));
//         }
//       });
//       paginationContainer.appendChild(prevButton);

//       // Page Buttons
//       var endPage = Math.min(startPage + buttonsToShow - 1, pageCount);
//       for (var i = startPage; i <= endPage; i++) {
//         var pageButton = document.createElement('button');
//         pageButton.innerText = i;
//         if (i === currentPage) {
//           pageButton.classList.add('active');
//         }
//         pageButton.addEventListener('click', function (event) {
//           currentPage = Number(event.target.innerText);
//           createTable(data, currentPage, rowsPerPage, headers);
//           renderPageButtons(Math.max(1, currentPage - Math.floor(buttonsToShow / 2)));
//         });
//         paginationContainer.appendChild(pageButton);
//       }

//       // Next Button
//       var nextButton = document.createElement('button');
//       nextButton.innerHTML = '&rarr;';
//       nextButton.disabled = currentPage === pageCount;
//       nextButton.addEventListener('click', function () {
//         if (currentPage < pageCount) {
//           currentPage++;
//           createTable(data, currentPage, rowsPerPage, headers);
//           renderPageButtons(Math.max(1, currentPage - Math.floor(buttonsToShow / 2)));
//         }
//       });
//       paginationContainer.appendChild(nextButton);
//     }

//     renderPageButtons(1);
//     tableContainer.appendChild(paginationContainer); // Append paginationContainer after rendering buttons
//   }




//   function createTable(data, headers) {
//     var tableContainer = document.getElementById('tablecontainer');
//     if (!tableContainer) {
//       console.error("Table container not found");
//       return;
//     }
//     tableContainer.innerHTML = ""; // Clear any existing content
//     // Create container for minimize button and pagination
//     var topContainer = document.createElement('div');
//     topContainer.className = 'top-container';

//     // Create minimize button
//     var minimizeButton = document.createElement('button');
//     minimizeButton.innerHTML = '<i class="fas fa-minus"></i>';
//     minimizeButton.className = 'minimize-button';
//     minimizeButton.addEventListener('click', function () {
//       var tableDetail = document.querySelector('.tableDetail');
//       if (tableDetail.style.display === 'none') {
//         tableDetail.style.display = 'block';
//         minimizeButton.innerHTML = '<i class="fas fa-minus"></i>';
//         document.getElementById('openTableBtn').style.display = 'none'; // Hide the show button
//       } else {
//         tableDetail.style.display = 'none';
//         minimizeButton.style.display = 'none';
//         // minimizeButton.innerTextpagination = '+';
//         document.getElementById('openTableBtn').style.display = 'block'; // Show the show button
//       }
//     });

    
//     tableContainer.appendChild(minimizeButton);
//     // Create pagination controls
//     var paginationContainer = document.createElement('div');
//     paginationContainer.id = 'pagination';

//     // Append pagination container to top container
//     topContainer.appendChild(paginationContainer);

//     // Append top container to tableContainer
//     tableContainer.appendChild(topContainer);

//     // Create tableDetail div
//     var tableDetail = document.createElement('div');
//     tableDetail.className = 'tableDetail';
//     tableContainer.appendChild(tableDetail);

//     var table = document.createElement('table');
//     table.className = 'data-table'; 
//     table.id = 'data-table'; 

//     var thead = document.createElement('thead');
//     var headerRow = document.createElement('tr');

//     // Add 'Serial No' as the first header
//     headers.unshift('Sr_no');

//     // Create header cells
//     headers.forEach(headerText => {
//       var th = document.createElement('th');
//       th.textContent = headerText;
//       headerRow.appendChild(th);
//     });
//     thead.appendChild(headerRow);
//     table.appendChild(thead);

//     var tbody = document.createElement('tbody');

//     // Populate table rows with data

//     data.forEach((item, index) => {
//       var row = document.createElement('tr');

//       // Add serial number as the first column
//       var serialNumberCell = document.createElement('td');
//       serialNumberCell.textContent = index + 1;
//       row.appendChild(serialNumberCell);

//       // Add other data columns
//       headers.slice(1).forEach(header => {
//         if (header !== 'Serial No' && header !== 'geometry') {
//           var cell = document.createElement('td');
//           cell.textContent = item[header] || ''; 
//           row.appendChild(cell);
//         }
//       });

//       row.addEventListener('click', function () {
//         // //console.log(item);
//         var boundsLayer = L.geoJSON(item.geometry, {
//           style: {
//             fillColor: "blue",
//             fillOpacity: 0.3,
//             color: "blue", 
//             weight: 2, 
//           },
//         }).addTo(map); 

//         var bounds = boundsLayer.getBounds();
//         map.fitBounds(bounds);
//         setTimeout(function () {
//           map.removeLayer(boundsLayer);
//         }, 5000);
//       });

//       tbody.appendChild(row);
//     });

//     table.appendChild(tbody);
//     tableDetail.appendChild(table);

//     // Initialize DataTables after rendering the table
//     $(document).ready(function () {
//       if ($.fn.DataTable.isDataTable('#data-table')) {
//         $('#data-table').DataTable().destroy(); 
//       }
//       $('#data-table').DataTable({
//         paging: true, // Enable pagination
//         lengthChange: true, // Enable the 'Show X entries' dropdown
//         searching: true, // Enable search box
//         ordering: true, // Enable column sorting
//         info: true, // Enable showing 'Showing X of Y entries' info
//         autoWidth: false,
//         scrollY: 400,
//         scrollX: true,
//         scrollCollapse: true,
//         fixedHeader: true
//       });
//     });
//   }

//   // Function to show the hidden table
//   function showTable() {
//     var tableDetail = document.querySelector('.tableDetail');
//     var minimizeButton = document.querySelector('.minimize-button');
//     tableDetail.style.display = 'block';
//     minimizeButton.style.display = 'block';
//     // minimizeButton.innerText = '-';
//     document.getElementById('openTableBtn').style.display = 'none'; // Hide the show button
//   }

//   // Add event listener to the show table button
//   document.getElementById('openTableBtn').addEventListener('click', showTable);


//   // -------------------------------------------------------------
//   function tableData(typeName, geoServerURL, cqlFilter, headers) {
//     $.getJSON(geoServerURL, function (data) {
//       var filteredData = data;

//       const work_id = [];
//       var exampleData = filteredData.features.map(feature => {
//         let mappedData = {};
//         headers.forEach(header => {
//           // Convert header to camelCase or other naming convention if necessary
//           let propertyName = header.replace(/ /g, '');
//           if (header === 'length_m') {
//             mappedData[propertyName] = (feature.properties[header]).toFixed(2); // Format to two decimal places
//           } else {
//             mappedData[propertyName] = feature.properties[header];
//           }
//         });
//         mappedData.geometry = feature.geometry;
//         work_id.push(feature.properties.id)

//         return mappedData;
//       });

//       const shapeAreaSum = data.features.reduce((sum, feature) => {
//         return sum + feature.properties.length_m;
//       }, 0);
//       let uniqueCount = new Set(work_id).size;
//       // //console.log(work_id.length, "lllllllllllll", work_id, uniqueCount)
//     //   document.getElementById('tablestats').innerHTML = `
//     //   // <div class="stat-button">
//     //   //   <div class="stat-label">Total Length (In Meter):</div>
//     //   //   <div class="stat-value" id="totalLength">${shapeAreaSum.toFixed(2)}</div>
//     //   // </div>
//     //   <div class="stat-button">
//     //     <div class="stat-label">Total Links:</div>
//     //     <div class="stat-value" id="totalLinks">${uniqueCount}</div>
//     //   </div>
//     // `;
//     document.getElementById('tablestats').innerHTML = `
    
//       <div class="stat-button">
        
//       </div>
//     `;

//       createTable(exampleData, headers);

//     });
//   }

// };
// ----------------old code 18/9

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
    minimizeButton.innerHTML = '<i class="fas fa-minus"></i>';
    minimizeButton.className = 'minimize-button';
    minimizeButton.addEventListener('click', function () {
      var tableDetail = document.querySelector('.tableDetail');
      if (tableDetail.style.display === 'none') {
        tableDetail.style.display = 'block';
        minimizeButton.innerHTML = '<i class="fas fa-minus"></i>';
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
  // Columns to populate
  var columns = { "name": "Village", "caseinformation_applyfor": "Survey No", "width": "Owner Name",  };

  // Dynamically populate #column-list (using div elements)
  var columnList = document.getElementById("column-list");
  for (var key in columns) {
    if (columns.hasOwnProperty(key)) {
      var optionDiv = document.createElement("div");
      optionDiv.textContent = columns[key];
      optionDiv.dataset.value = key; // Store value in a data attribute
      columnList.appendChild(optionDiv);
    }
  }

  // Handle search icon click to show/hide column list
  document.getElementById("toggle-select").addEventListener("click", function() {
    var columnList = document.getElementById("column-list");
    columnList.classList.toggle("hidden");
  });

  // Handle option click to populate search input
  columnList.addEventListener("click", function(event) {
    var target = event.target;
    if (target.tagName.toLowerCase() === "div") {
      var selectedValue = target.dataset.value;
      var selectedText = target.textContent;
      document.getElementById("search-input").setAttribute("placeholder", "Search " + selectedText);
      
      var layerName = 'Plot_Layout';
      var workspace = 'AutoDCR';
      var main_url = ''; // Ensure you set this to your actual URL

      // Function to fetch dynamic data
      function getValues(callback) {
        var geoServerURL = `${main_url}${workspace}/wms?service=WFS&version=1.1.0&request=GetFeature&typeName=${layerName}&propertyName=${selectedValue}&outputFormat=application/json`;

        $.getJSON(geoServerURL, function (data) {
          var workTypeSet = new Set();
          $.each(data.features, function (index, feature) {
            var workType = feature.properties[selectedValue];
            if (typeof workType === 'number') workType = workType.toString();
            if (workType !== null) workTypeSet.add(workType);
          });
          var uniqueWorkTypes = Array.from(workTypeSet);
          callback(uniqueWorkTypes); // Pass data to autocomplete function
        });
      }

      // Fetch dynamic data and pass it to the autocomplete function
      getValues(function (data) {
        autocomplete(document.getElementById("search-input"), data);
      });

      columnList.classList.add("hidden"); // Hide the list after selection
    }
  });

  // Autocomplete functionality
  function autocomplete(input, arr) {
    let currentFocus;
    input.addEventListener("input", function() {
      let list, item, i, val = this.value.toLowerCase();
      closeAllLists();
      if (!val) return false;
      currentFocus = -1;

      list = document.createElement("ul");
      list.setAttribute("id", "autocomplete-list");
      list.setAttribute("class", "autocomplete-items");
      document.body.appendChild(list);

      for (i = 0; i < arr.length; i++) {
        if (arr[i].toLowerCase().includes(val)) {
          item = document.createElement("li");
          item.innerHTML = arr[i].replace(new RegExp(val, 'gi'), (match) => `<strong>${match}</strong>`);
          item.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          item.addEventListener("click", function() {
            input.value = this.getElementsByTagName("input")[0].value;
            closeAllLists();
          });
          list.appendChild(item);
        }
      }
    });

    input.addEventListener("keydown", function(e) {
      let x = document.getElementById("autocomplete-list");
      if (x) x = x.getElementsByTagName("li");
      if (e.keyCode === 40) {
        currentFocus++;
        addActive(x);
      } else if (e.keyCode === 38) {
        currentFocus--;
        addActive(x);
      } else if (e.keyCode === 13) {
        e.preventDefault();
        if (currentFocus > -1) {
          if (x) x[currentFocus].click();
        }
      }
    });

    function addActive(x) {
      if (!x) return false;
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = x.length - 1;
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

    document.addEventListener("click", function(e) {
      closeAllLists(e.target);
    });
  }
});


// const layerDetails = {
//   "AutoDCR:Plot_Layout": ["siteaddress_area", "caseinformation_applyfor", "caseinformation_casetype", "caseinformation_proposaltype","gut_no", "caseinformation_tdrzone", "caseinformation_grossplotarea","plotdetails_developmentzonedp", "ownerinformation_firstname"],
// };

// function getCheckedValuesforpopuups() {
//   return new Promise((resolve, reject) => {
//     var selectedValues = {};
//     const filternames = ["siteaddress_area", "caseinformation_applyfor", "caseinformation_casetype", "gut_no","caseinformation_proposaltype", "caseinformation_tdrzone", "caseinformation_grossplotarea","plotdetails_developmentzonedp", "ownerinformation_firstname"];

//     filternames.forEach(function (filtername) {
//       selectedValues[filtername] = []; 

//       $('#' + filtername + ' input[type="checkbox"]:checked').each(function () {
//         var single_val = $(this).val();
//         if (single_val) {
//           var actualValue = single_val.split(' (')[0];
//           selectedValues[filtername].push(actualValue);
//           // //console.log(selectedValues, "lllllllllll99999999999999")
//         }
//       });
//     });

//     var filters = [];
//     for (var key in selectedValues) {
//       if (selectedValues[key].length > 0) {
//         filters.push(`${key} IN ('${selectedValues[key].join("','")}')`);
//       }
//     }
//     var checkedValues = getCheckedValuess();


//     if (checkedValues) {
//       var filterString = filters.join(" AND ");
//     }

//     resolve(filterString);
//   });
// }

// function combineFilters(cql_filter123, filterString) {
//   if (cql_filter123) {
//     return `${cql_filter123} AND ${filterString}`;
//   } else {
//     return filterString;
//   }
// }

 
// map.on("click", async (e) => {
//   console.log("Click event:", e);
 
//   let bbox = map.getBounds().toBBoxString();
//   let size = map.getSize();
 
//   let filterString = await getCheckedValuesforpopuups();
//   let cqlFilter123 = filterString.trim() !== "" ? encodeURIComponent(filterString) : "";
 
//   for (let layer in layerDetails) {
//     let selectedKeys = layerDetails[layer];
//     let workspace = "AutoDCR";
//     let urrr = `https://iwmsgis.pmc.gov.in/geoserver/${workspace}/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=true&QUERY_LAYERS=${layer}&STYLES&LAYERS=${layer}&exceptions=application%2Fvnd.ogc.se_inimage&INFO_FORMAT=application/json&FEATURE_COUNT=50&X=${Math.round(e.containerPoint.x)}&Y=${Math.round(e.containerPoint.y)}&SRS=EPSG%3A4326&WIDTH=${size.x}&HEIGHT=${size.y}&BBOX=${bbox}`;
//     console.log("WMS Request URL:", urrr);
 
//     try {
//       let response = await fetch(urrr);
//       if (!response.ok) {
//         throw new Error(`Network response was not ok: ${response.statusText}`);
//       }
//       let json = await response.json();
//       console.log("WMS Response JSON:", json);
 
//       if (json.features.length > 0) {
//         let htmldata = json.features[0].properties;
//         console.log("Feature Properties:", htmldata);
 
//         let txtk1 = "";
//         for (let key of selectedKeys) {
//           if (htmldata.hasOwnProperty(key)) {
//             let value = htmldata[key];
//             txtk1 += `<tr><td>${key}</td><td>${value}</td></tr>`;
//           }
//         }
 
//         let detaildata1 = `<table style='width:100%;' class='popup-table'>${txtk1}<tr><td>Coordinates</td><td>${e.latlng}</td></tr></table>`;
//         console.log("Modal Content:", detaildata1);
 
//         // Update the modal content
//         document.getElementById("modalContent").innerHTML = detaildata1;
 
//         // Set modal position to clicked position
//         let modal = document.getElementById("infoModal");
//         modal.style.display = "block"; // Show the modal
//         modal.style.left = `${e.containerPoint.x + 10}px`; // Adjust 10px to avoid cursor overlap
//         modal.style.top = `${e.containerPoint.y + 10}px`; // Adjust 10px to avoid cursor overlap
 
//       } else {
//         console.log("No features found for this location.");
//         closeModal(); // Close the modal if no features are found
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//       closeModal(); // Close the modal on error
//     }
//   }
// });
 
// // Function to close the modal
// function closeModal() {
//   document.getElementById("infoModal").style.display = "none";
// }
 
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

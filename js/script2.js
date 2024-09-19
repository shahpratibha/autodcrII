// Toggle options visibility when the optionsButton is clicked
document.getElementById("optionsButton").addEventListener("click", function () {
  var tabsOptions = document.getElementById("tabsOptions");
  var tabParent = document.getElementById("tabParent");

  // Show the options and hide the tabParent, only if options are currently hidden
  if (tabsOptions.style.display === "none" || tabsOptions.style.display === "") {
    tabsOptions.style.display = "flex"; // Show the options
    tabParent.style.display = "none"; // Hide the tab-parent
  } else {
    // Do nothing, keeping the options visible
  }
});

// Add click event listener for the Analytics button
document.querySelector(".component-6").addEventListener("click", function () {
  var tabParent = document.getElementById("tabParent");
  var tabsOptions = document.getElementById("tabsOptions");

  // Show the tabParent and hide tabsOptions when Analytics is clicked
  tabParent.style.display = "flex";
  tabsOptions.style.display = "none";
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



//print 
function printWindow() {
  // Directly open the print dialog
  window.print();
}





// Add scale control
L.control.scale({
  position: 'bottomleft' // Change position to bottom right
}).addTo(map);


//search
document.getElementById('search-button').addEventListener('click', function () {
  // Toggle the search container visibility
  const searchContainer = document.getElementById('search-container');
  searchContainer.classList.toggle('hidden');

  // Focus the search input when shown
  if (!searchContainer.classList.contains('hidden')) {
    document.getElementById('search-input').focus();
  }
});

document.getElementById('search-input').addEventListener('input', function () {
  const clearIcon = document.getElementById('clear-icon');
  if (this.value.trim() !== '') {
    clearIcon.classList.remove('hidden');
  } else {
    clearIcon.classList.add('hidden');
  }
});

// Clear the search input when the clear icon is clicked
document.getElementById('clear-icon').addEventListener('click', function () {
  const searchInput = document.getElementById('search-input');
  searchInput.value = '';
  this.classList.add('hidden');
  searchInput.focus();
});


// Add click event listener to .component-10 elements
document.querySelectorAll('.component-10').forEach(function (element) {
  element.addEventListener('click', function () {
    // Remove the 'active' class from all .component-10 elements
    document.querySelectorAll('.component-10').forEach(function (el) {
      el.classList.remove('active');
    });

    // Remove the 'active' class from all .component-11 elements
    document.querySelectorAll('.component-11').forEach(function (el) {
      el.classList.remove('active');
    });

    // Add the 'active' class to the currently clicked element
    element.classList.add('active');
  });
});

// Add click event listener to .component-11 elements
document.querySelectorAll('.component-11').forEach(function (element) {
  element.addEventListener('click', function () {
    // Remove the 'active' class from all .component-11 elements
    document.querySelectorAll('.component-11').forEach(function (el) {
      el.classList.remove('active');
    });

    // Remove the 'active' class from all .component-10 elements
    document.querySelectorAll('.component-10').forEach(function (el) {
      el.classList.remove('active');
    });

    // Add the 'active' class to the currently clicked element
    element.classList.add('active');
  });
});


//status
// Select all tabs within the parent
const tabs = document.querySelectorAll('.tab');

// Function to handle tab click
tabs.forEach(tab => {
  tab.addEventListener('click', function () {
    // Remove 'active' class from all tabs
    tabs.forEach(t => t.classList.remove('active'));

    // Add 'active' class to the clicked tab
    this.classList.add('active');
  });
});





//


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

document.addEventListener('DOMContentLoaded', function () {
  const component6 = document.querySelector('.component-6');
  const component7 = document.querySelector('.component-7');
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
  component6.addEventListener('click', function () {
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
  component7.addEventListener('click', function () {
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
document.addEventListener('DOMContentLoaded', function () {
  const clusterLegend = document.getElementById('cluster_legend');
  const toggleButton = document.getElementById('toggleClusterLegend');
  const map = document.getElementById('map'); // Assuming your map has an id of 'map'

  toggleButton.addEventListener('click', function (event) {
    // Toggle the 'no-border' class to remove or add border
    this.classList.toggle('no-border');

    // Toggle the visibility of the cluster legend
    clusterLegend.classList.toggle('hidden');

    // Prevent click event from bubbling up to the map
    event.stopPropagation();
  });

  // Close the cluster legend when clicking on the map
  map.addEventListener('click', function () {
    // Add the 'hidden' class to close the legend if it's visible
    if (!clusterLegend.classList.contains('hidden')) {
      clusterLegend.classList.add('hidden');
    }
  });
});
////
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

////


document.addEventListener('DOMContentLoaded', function () {
  const filters = document.getElementById('filters');
  const legendsDiv = document.querySelector('.legends');
  const northArrowContainer = document.querySelector('.north-arrow-container');
  const scaleControlElement = document.querySelector('.leaflet-control-scale');
  const analyticsButton = document.getElementById('analyticsButton'); // Select the analytics button

  function closeFilterAndLegend() {
    console.log('Closing filter and legend'); // Debugging message

    // Hide filters
    filters.style.display = 'none';
    filters.style.opacity = '0';
    filters.style.visibility = 'hidden';

    // Hide legends
    legendsDiv.classList.add('hidden');

    // Reset positions of north container and scale
    resetScaleControlPosition();
    northArrowContainer.classList.remove('move-right');
  }

  function resetScaleControlPosition() {
    if (scaleControlElement) {
      scaleControlElement.classList.remove('move-right');
    }
  }

  // Attach click events to component-10 and component-11
  document.querySelectorAll('.component-10').forEach(function (element) {
    element.addEventListener('click', function () {
      console.log('Component 10 clicked'); // Debugging message
      closeFilterAndLegend();
    });
  });

  document.querySelectorAll('.component-11').forEach(function (element) {
    element.addEventListener('click', function () {
      console.log('Component 11 clicked'); // Debugging message
      closeFilterAndLegend();
    });
  });

  // Attach click event to analytics button
  analyticsButton.addEventListener('click', function () {
    console.log('Analytics button clicked'); // Debugging message
    closeFilterAndLegend();
  });
});

document.getElementById('toggle-select').addEventListener('click', function () {
  const searchContainer = document.getElementById('search-container');
  const selectElement = document.getElementById('search_type');

  // Toggle the display of the select element
  if (selectElement.style.display === 'none' || selectElement.style.display === '') {
    selectElement.style.display = 'block';
  } else {
    selectElement.style.display = 'none';
  }
});

// Optional: Close the select element if clicked outside
document.addEventListener('click', function (event) {
  const toggleSelect = document.getElementById('toggle-select');

  // Close dropdown if clicked outside
  // if (!searchContainer.contains(event.target) && !toggleSelect.contains(event.target)) {
  //   selectElement.style.display = 'none';
  // }
});


// calender

$(document).ready(function () {
  // ----------------------------------

  // ---------------------------------
 
  // Example usage of the function
  const layername = "AutoDCR:Plot_Layout";
  const main_url = "https://iwmsgis.pmc.gov.in/geoserver/";
  // const filter = ""; // Add any additional filter if required

  // loadAndProcessGeoJSON(main_url, layername,cql_filter1 );
  var start =  moment('2024-04-01');
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
    // $('#daterange').val(start.format('2023') + ' - ' + end.format('YYYY'));
    var formattedStartDate = start.format('YYYY-MM-DDTHH:mm:ssZ');;
    var formattedEndDate = end.format('YYYY-MM-DDTHH:mm:ssZ');;
    // cql_filter1 = `entry_timestamp >= '${formattedStartDate}' AND entry_timestamp < '${formattedEndDate}'`;
    cql_filter1 = `entry_timestamp >='2024-09-04T00:00:00Z' AND entry_timestamp < '2024-09-04T23:59:59Z'`

    console.log(cql_filter1, "lllokkkkk")


    // loadAndProcessGeoJSON(main_url, layername,cql_filter1);
    DataTableFilter(cql_filter1)

    loadinitialData(cql_filter1);
    
    console.log(cql_filter1,"cql_filter1")
    getCheckedValues(function (filterString) {
      const mainfilter = combineFilters(cql_filter1, filterString);
      console.log("Main Filterfor checking:", mainfilter);
      FilterAndZoom(mainfilter);
      DataTableFilter(mainfilter)
    });
  }
  $('#calendarIcon').on('click', function () {
    $('#daterange').click();
  });
  $('#daterange').on('apply.daterangepicker', function (ev, picker) {
    var startDate = picker.startDate.format('YYYY-MM-DDTHH:mm:ssZ');
    var endDate = picker.endDate.format('YYYY-MM-DDTHH:mm:ssZ');
    console.log('Selected date range:', startDate, 'to', endDate);
    cql_filter1= `entry_timestamp >= '${startDate}' AND entry_timestamp < '${endDate}'`;
    
    console.log(" cql_filter1", cql_filter1);
    // alert("hhhhhhhhh");
    loadinitialData(cql_filter1);
    const cql_filter = getCqlFilter();
    getCheckedValues(function (filterString) {
      const mainfilter = combineFilters(cql_filter1, filterString);
      console.log("Main Filterfor checking:", mainfilter);
      FilterAndZoom(mainfilter);
      DataTableFilter(mainfilter);
    });
  });

  // Function to get cql_filter1 value
  function getCqlFilter() {
    return cql_filter1;
  }

  function loadinitialData(cql_filter) {
    const filternames = ["siteaddress_area", "caseinformation_applyfor","gut_no", "caseinformation_casetype", "caseinformation_proposaltype", "token", "caseinformation_grossplotarea","plotdetails_developmentzonedp", "ownerinformation_firstname"]; //accordn column names , if want add one more filter criteria add here

    filternames.forEach(function (filtername) {
      var url = `${main_url}AutoDCR/wms?service=WFS&version=1.1.0&request=GetFeature&typeName=Plot_Layout&propertyName=${filtername}&outputFormat=application/json&cql_filter=${encodeURIComponent(cql_filter)}`;
      console.log(url);
      $.getJSON(url, function (data) {
        var projectFiSet = new Set();
        var projectFiMap = new Map();

        // Iterate through the features and add non-null values to the set
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

        var uniqueProjectFiList = Array.from(projectFiMap.entries()).map(([name]) => `${name}`);
        populateDropdown(filtername, uniqueProjectFiList);
      });
    });

    FilterAndZoom(cql_filter)
  }
  function combineFilters(cql_filter123, filterString) {
    if (filterString !== null && filterString !== undefined && filterString !== '') {
      return `${cql_filter123} AND ${filterString}`;
    } else {
      return cql_filter123;
    }
  }

  function initialize() {

    $('#daterange').on('apply.daterangepicker', function (ev, picker) {
      var startDate = picker.startDate.format('YYYY-MM-DDTHH:mm:ssZ');
      var endDate = picker.endDate.format('YYYY-MM-DDTHH:mm:ssZ');

      console.log('Selected date rangelooooooooooooooo:', startDate, 'to', endDate);

      cql_filter1 = `entry_timestamp >= '${startDate}' AND entry_timestamp < '${endDate}'`;

      loadinitialData(cql_filter1);
      const cql_filter = getCqlFilter();
      getCheckedValues(function (filterString) {


        const mainfilter = combineFilters(cql_filter1, filterString);
        console.log("Main Filterfor checking:", mainfilter);

        FilterAndZoom(mainfilter);

        DataTableFilter(mainfilter)

      });
    });
  }

  initialize();
});




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



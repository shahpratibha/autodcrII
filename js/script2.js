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





//legend
document
.getElementById("toggleButton")
.addEventListener("click", function () {
  // Get the legends div
  const legendsDiv = document.querySelector(".legends");

  // Toggle the 'hidden' class to show/hide the legends div
  if (legendsDiv) {
    // Ensure legendsDiv exists
    legendsDiv.classList.toggle("hidden");
  } else {
    console.error("Legends div not found");
  }
});

//status

    document.addEventListener('DOMContentLoaded', function() {
        const statusElement = document.querySelector('.status');
        const dataGraphsElement = document.querySelector('.data-graphs');

        statusElement.addEventListener('click', function() {
            // Toggle the display property
            if (dataGraphsElement.style.display === 'none' || dataGraphsElement.style.display === '') {
                dataGraphsElement.style.display = 'block';
            } else {
                dataGraphsElement.style.display = 'none';
            }
        });
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


document.getElementById('closeLegendButton').addEventListener('click', function() {
  document.querySelector('.legends').classList.add('hidden');
});

document.addEventListener('DOMContentLoaded', function() {
  const component6 = document.querySelector('.component-6');
  const component7 = document.querySelector('.component-7');

  // Define colors
  const defaultColor6 = '#f0f0f0'; // Default background color for component-6
  const activeColor6 = 'radial-gradient(50% 50% at 50% 50%, #198038, #24a148)'; // Active background color for component-6
  
  const defaultColor7 = '#f0f0f0'; // Default background color for component-7
  const activeColor7 = 'radial-gradient(50% 50% at 50% 50%, #198038, #24a148)'; // Active background color for component-7

  // Click event for component-6
  component6.addEventListener('click', function() {
    // Set background color for component-6
    component6.style.background = activeColor6;
    component6.style.color = 'white'; // Change text color to white for better contrast

    // Reset background color for component-7
    component7.style.background = defaultColor7;
    component7.style.color = 'black'; // Default text color
  });

  // Click event for component-7
  component7.addEventListener('click', function() {
    // Set background color for component-7
    component7.style.background = activeColor7;
    component7.style.color = 'white'; // Change text color to white for better contrast

    // Reset background color for component-6
    component6.style.background = defaultColor6;
    component6.style.color = 'black'; // Default text color
  });
});




document.getElementById("optionsButton")
.addEventListener("click", function () {
  var tabsOptions = document.getElementById("tabsOptions");
  var tabParent = document.getElementById("tabParent");

  // Toggle visibility of tabsOptions
  if (
    tabsOptions.style.display === "none" ||
    tabsOptions.style.display === ""
  ) {
    tabsOptions.style.display = "flex"; // Show the options
    tabParent.style.display = "none"; // Hide the tab-parent
  } else {
    tabsOptions.style.display = "none"; // Hide the options
  }
});


// Add click event listener for the Analytics button
document
.querySelector(".component-6")
.addEventListener("click", function () {
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


    //filter
    function toggleFilters() {
        const filters = document.getElementById('filters');
        // Toggle the display property between 'block' and 'none'
        if (filters.style.display === 'none' || filters.style.display === '') {
            filters.style.display = 'block';  // Show the filters
        } else {
            filters.style.display = 'none';   // Hide the filters
        }
    }
    
    function closeFilters() {
        // Hide the filters when the close button is clicked
        document.getElementById('filters').style.display = 'none';
    }
    
    function toggleFilter(labelElement) {
        // Toggle the dropdown list for each filter group when the label is clicked
        const ul = labelElement.nextElementSibling.nextElementSibling; // Assumes ul follows the input
        if (ul.style.display === 'none' || ul.style.display === '') {
            ul.style.display = 'block';
        } else {
            ul.style.display = 'none';
        }
    }
    



    
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

//input cross sign
function clearInput(inputId) {
    const inputElement = document.getElementById(inputId);
    inputElement.value = ''; // Clear the input value
    inputElement.focus(); // Optionally refocus the input field
}




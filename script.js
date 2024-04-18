
document.addEventListener("DOMContentLoaded", function () {
    // Load data from local storage on page load
    loadFromLocalStorage();

    // Add new row when Add button is clicked
    document.querySelectorAll(".add-btn").forEach(function (button) {
        button.addEventListener("click", function () {
            addRow(this);
            init();
        });
    });

    // Delete row when Delete button is clicked
    document.querySelectorAll(".delete-btn").forEach(function (button) {
        button.addEventListener("click", function () {
            deleteRow(this);
            init();
        });
    });
    init();
});

function saveData(button, tableId) {
    let table = document.getElementById(tableId);
    let inputs = table.querySelectorAll("input[type='text']");
    let data = [];
    data.push('');
    inputs.forEach(function (input) {
        data.push(input.value);
        input.value = ""; // Clear input fields
    });

    // Add <a> tag around saved data
    let anchorTaggedData = data.map(item => {
        if (isValidUrl(item)) {
            return `<a href="${item}">${item}</a>`;
        } else {
            return item;
        }
    });

    // Save data to local storage
    let storedData = localStorage.getItem(tableId);
    if (storedData) {
        storedData = JSON.parse(storedData);
    } else {
        storedData = [];
    }
    storedData.push(anchorTaggedData);
    localStorage.setItem(tableId, JSON.stringify(storedData));

 
    addDataRow(table, data);
    
  
    init();
}

// Function to check if a string is a valid URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}


function loadFromLocalStorage() {
    let tables = document.querySelectorAll("table");
    tables.forEach(function (table) {
        let key = table.id;
        let storedData = localStorage.getItem(key);
        if (storedData) {
            storedData = JSON.parse(storedData);
            storedData.forEach(function (data) {
                // Check if the data contains an anchor tag
                if (data.some(item => item.includes("<a href="))) {
                    // If it does, add the row with individual cells
                    addDataRowWithHTML(table, data);
                } else {
                    // If it doesn't, add the row as usual
                    addDataRow(table, data);
                }
            });
        }
    });
    init();
}

// Function to add a row with HTML content
function addDataRowWithHTML(table, data) {
    let row = table.insertRow(-1); // Insert new row at the end of the table

    // Add cells with HTML content
    data.forEach(function (item) {
        let cell = row.insertCell(-1); // Insert new cell
        cell.innerHTML = item; // Set cell content to HTML
    });

    // Add delete button cell
    let deleteCell = row.insertCell(-1); // Insert new cell for delete button
    deleteCell.innerHTML = '<button class="delete-btn">Delete</button>'; // Set delete button HTML

    // Add event listener to delete button
    deleteCell.querySelector(".delete-btn").addEventListener("click", function () {
        deleteRow(this);
    });
}


function addDataRow(table, data) {
    let row = table.insertRow(-1);

    for (let i = 0; i < data.length; i++) {
        let cell = row.insertCell(-1);
        cell.textContent = data[i];
    }

    let deleteCell = row.insertCell(-1);
    deleteCell.innerHTML = '<button class="delete-btn">Delete</button>';
    deleteCell.querySelector(".delete-btn").addEventListener("click", function () {
        deleteRow(this);
    });
}

function addRow(button) {
    let table = button.closest("div").querySelector("table"); // Find the table within the same div as the button


    let newRow = table.insertRow(-1);
    let cells = table.rows[1].cells.length; // Assuming the first row has cells, adjust if necessary
    for (let i = 0; i < cells; i++) {
        let cell = newRow.insertCell(i);
        if (i === cells - 1) {
            cell.innerHTML = '<button class="save-btn">Save</button>';
            cell.querySelector(".save-btn").addEventListener("click", function () {
                
                saveData(this, table.id);
            });
        }         
        else {
            cell.innerHTML = '<input type="text" placeholder="Enter value">';
        }
    }
  }



function deleteRow(button) {
    let row = button.parentNode ? button.parentNode.parentNode : null; // Check if the button has a parent node before accessing its parent's parent
    if (!row) return; // Exit the function if the row is null
    let table = row.parentNode ? row.parentNode.parentNode : null; // Check if the row's parent node exists before accessing its parent's parent
    if (!table) return; // Exit the function if the table is null
    let rowIndex = row.rowIndex;

    // Remove data from local storage
    let key = table.id;
    let storedData = localStorage.getItem(key);
    if (storedData) {
        storedData = JSON.parse(storedData);
        storedData.splice(rowIndex - 2, 1); // Adjusted index to match array index
        localStorage.setItem(key, JSON.stringify(storedData));
    }

    // Remove row from the table
    if (table && row) {
        table.deleteRow(rowIndex);
        init();
    }
}


function init() {
    document.querySelectorAll('table').forEach(table => table.querySelectorAll('tr td:first-child').forEach(cell => cell.style.textAlign = 'center'));
    document.querySelectorAll('table').forEach((table) => Array.from(table.rows).slice(2).forEach((row, index) => row.cells[0].textContent = index + 1));
}

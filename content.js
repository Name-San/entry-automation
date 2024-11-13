let currentIndex = 0; 
let data;

// Fetch data from Google Sheets and fill in the form
async function fetchDataAndFillForm(sheetUrl) {
    try {
        const response = await fetch(sheetUrl);
        data = await response.json();
        startSubmission();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function submitData(item) {
    // Set form fields with current item data
    document.getElementById("id_model_name").value = item.model_name;
    document.getElementById("id_serial_number").value = item.serial_number;
    document.getElementById("id_status").value = item.status;
    document.getElementById("id_asset_type").value = item.asset_type;
    document.getElementById("id_site").value = item.site;
    document.getElementById("id_date").value = item.date;
    document.getElementById("id_department").value = item.department;
    document.getElementById("id_supplier_name").value = item.supplier_name;
    document.getElementById("id_remarks").value = item.remarks;

    // Create form data for submission
    const formData = new FormData(document.querySelector('.modal-content form'));

    try {
        // Send data to server via AJAX/fetch without reloading
        const response = await fetch(`${window.location.href}`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            console.log(`Submitted item ${currentIndex + 1} successfully`);

            // Move to the next item and submit if there's more data
            currentIndex++;
            if (currentIndex < data.length) {
                submitData(data[currentIndex]);
            } else {
                console.log("All items submitted!");
            }
        } else {
            console.error('Error in submission:', response.statusText);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

function startSubmission() {
    // Prevent the modal form from submitting the traditional way
    document.querySelector('.modal-content form').onsubmit = (event) => {
        event.preventDefault(); // Stop form from submitting
    };

    // Open the modal
    document.getElementById("addModal").click();

    // Start submitting the first item
    if (data && data.length > 0) {
        submitData(data[0]);
    }
}

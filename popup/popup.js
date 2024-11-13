
document.getElementById("automate-btn").addEventListener("click", () => {
    document.getElementById("link-group").classList.add('active');
    document.getElementById("automate-btn").classList.add('inactive');
})   

document.getElementById("start-btn").addEventListener("click", async () => {

    function getSite() {
        const radios = document.getElementsByName('btnradio');
        for (const radio of radios) {
            if (radio.checked) {
                return radio.value;  // Return the value of the selected radio button
            }
        }
        return null;  // Return null if none are selected
    }

    const popupData = {};

    popupData.sheetUrl = document.getElementById("sheetUrl").value;
    popupData.site = getSite();
    popupData.department = document.getElementById("department-select").value;
    popupData.supplier = document.getElementById("supplier-select").value;
    
    if (sheetUrl) {
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                args: [popupData],
                func: ({sheetUrl, site, department, supplier}) => {
                    // This function runs directly in the content script's context

                    // Define the fetchDataAndFillForm function inline
                    async function fetchDataAndFillForm(sheetUrl) {
                        try {
                            const response = await fetch(sheetUrl);
                            const data = await response.json();
                            const date = new Date().toISOString().slice(0, 10);
                            let currentIndex = 0;
                            

                            async function submitData(item) {
                                
                                let model = item.model_name;
                                if(model.toLowerCase().includes('operating')) {
                                    item.asset_type = "Software";
                                }

                                // Populate form fields based on item data
                                document.getElementById("id_model_name").value = item.model_name;
                                document.getElementById("id_serial_number").value = item.serial_number;
                                document.getElementById("id_status").value = item.status;
                                document.getElementById("id_asset_type").value = item.asset_type;
                                document.getElementById("id_site").value = site;
                                document.getElementById("id_date").value = date;
                                document.getElementById("id_department").value = department;
                                document.getElementById("id_supplier_name").value = supplier;
                                document.getElementById("id_remarks").value = item.remarks;

                                // Create form data for submission
                                const formData = new FormData(document.querySelector('.modal-content form'));

                                // Submit the form data using fetch (or XMLHttpRequest)
                                const response = await fetch(window.location.href, {
                                    method: 'POST',
                                    body: formData
                                });

                                if (response.ok) {
                                    console.log(`Submitted item ${currentIndex + 1} successfully`);
                                    currentIndex++;
                                    if (currentIndex < data.length) {
                                        submitData(data[currentIndex]);
                                    } else {
                                        console.log("All items submitted!");
                                        document.querySelector('.btn.btn-danger[data-dismiss="modal"]').click();
                                    }
                                } else {
                                    console.error('Error in submission:', response.statusText);
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

                            startSubmission();
                            
                        } catch (error) {
                            console.error('Error fetching data:', error);
                        }
                    }

                    // Start the automation
                    fetchDataAndFillForm(sheetUrl);
                }
            });
        });
    } else {
        alert("Please enter valid data URL.")
    }
});





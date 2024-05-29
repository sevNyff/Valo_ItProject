function backToToursClick(){
    window.location.href = '../Valo_Routes/routes.html';
}

function startNewPlanning() {
    const newPlanningCard = document.createElement('div');
    newPlanningCard.classList.add('planning-card');

    newPlanningCard.innerHTML = `
        <div class="card-header">
            <h3>New Planning</h3>
            <p>Select Truck:</p>
            <select id="truckSelect" onchange="updateAvailableCapacity(this.options[this.selectedIndex])"></select>
            <p id="availableCapacityLabel">Available Capacity: 0 kg</p>
            <button onclick="createPackage()">Create Package</button>
            <button onclick="saveTour(event)" data-action="saveTour" class="saveTour-button">Save Tour</button>
            <button onclick="deleteTour(event)" data-action="deleteTour" class="delete-button">x</button>
            <button onclick="calculateRoute(event)" data-action="calculateRoute">Calculate Route</button>
        </div>
        <div class="package-container"></div>
    `;

 
    const planningContainer = document.getElementById('plannningContainer');

    planningContainer.insertBefore(newPlanningCard, planningContainer.firstChild);

    fetchTrucksForDropdown();
    
}

async function fetchTrucksForDropdown() {
    try {
        const response = await fetch('http://localhost:8080/trucks');
        const trucks = await response.json();

        //Debugging functionality
        console.log('Fetched Trucks:', trucks);

        const truckSelect = document.getElementById('truckSelect');
        truckSelect.innerHTML = ''; 

        trucks.forEach(truck => {
            const option = document.createElement('option');
            option.value = truck.truckID;
            option.textContent = `Truck ${truck.id} - ${truck.brandName}`;
            option.dataset.capacity = truck.truckCapacity;
            truckSelect.appendChild(option);
        });

        updateTruckCapacity(truckSelect.options[0]);
    } catch (error) {
        console.error('Error fetching trucks for dropdown:', error);
    }
}

async function fetchCustomersForDropdown(customerSelect) {
    try {
        const response = await fetch('http://localhost:8080/customers');
        const customers = await response.json();

        console.log('Fetched Customers:', customers); 

        customerSelect.innerHTML = ''; 

        customers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.customerID;
            option.textContent = `Customer ${customer.customerID} - ${customer.customerName}`;
            customerSelect.appendChild(option);
        });

    } catch (error) {
        console.error('Error fetching customers for dropdown:', error);
    }
}


function handleTruckSelectionChange(event) {
    const selectedOption = event.target.options[event.target.selectedIndex];
    console.log('Selected Option:', selectedOption); 
    updateTruckCapacity(selectedOption);
}


// Function to update available capacity based on the selected truck
function updateTruckCapacity(selectedOption) {
    const truckCapacity = parseFloat(selectedOption.dataset.capacity);
    const availableCapacityLabel = selectedOption.closest('.planning-card').querySelector('#availableCapacityLabel');

    if (availableCapacityLabel) {
        availableCapacityLabel.textContent = `Available Capacity: ${truckCapacity} kg`;
    }
}

// Event listener for truck selection change
document.addEventListener('change', function(event) {
    const target = event.target;
    if (target && target.tagName === 'SELECT' && target.id === 'truckSelect') {
        handleTruckSelectionChange(event);
    }
});

document.addEventListener('click', function(event) {
    const target = event.target;
    if (target && target.tagName === 'BUTTON') {
        if (target.dataset.action === 'calculateRoute') {
            calculateRoute(event);
        } else if (target.id === 'createPackageButton') {
            createPackage();
        } else if (target.dataset.action === 'saveTour') {
            const planningCard = target.closest('.planning-card');
            saveTour(planningCard, event);
        }
    }
});


async function calculateRoute(event) {
    showLoader();
    if (!event) {
        console.error('Event object not provided.');
        return;
    }
    
    const token = localStorage.getItem('token');

    const calculateButton = event.target;

    const planningCard = calculateButton.closest('.planning-card');
    if (!planningCard) {
        console.error('Planning card not found.');
        return;
    }

    const truckSelect = planningCard.querySelector('#truckSelect');
    const selectedTruckOption = truckSelect.options[truckSelect.selectedIndex];

    const truckOptionText = selectedTruckOption.textContent;
    const selectedTruckId = extractTruckId(truckOptionText);

    const packageContainers = planningCard.querySelectorAll('.planningPackage-info');

    let totalPackageWeight = 0;

    packageContainers.forEach(container => {
        const packageWeightInput = container.querySelector('input[type="number"]');
        const packageWeight = parseFloat(packageWeightInput.value) || 0;
        totalPackageWeight += packageWeight;
    });
    
    const packages = [];
    let isValid = true;

    packageContainers.forEach(container => {
        const packageWeightInput = container.querySelector('input[type="number"]');
        const deliveryAddressSelect = container.querySelector('select[id^=deliveryAddress]');

        const packageWeight = parseFloat(packageWeightInput.value);
        const deliveryAddress = deliveryAddressSelect.options[deliveryAddressSelect.selectedIndex];
        const deliveryAddressText = deliveryAddress.textContent;

        const customerSelect = container.querySelector('select[id^=customerSelect]');
        const selectedCustomerOption = customerSelect.options[customerSelect.selectedIndex];

        const customerOptionText = selectedCustomerOption.textContent;
        const selectedCustomerId = extractCustomerId(customerOptionText);

        if (packageWeight > 0 && deliveryAddress !== '') {
            const packageData = {
                packageWeight: packageWeight,
                deliveryAddress: deliveryAddressText,
                customerID: selectedCustomerId
            };
            packages.push(packageData);
        } else {
            isValid = false;
            console.warn('Invalid package data found:', packageWeight, deliveryAddress);
        }
    });

    if (!isValid) {
        showAlert('Please ensure all package details are valid (weight > 0, address not empty) before saving.');
        return;
    }

    const payload = {
        token: token,
        truckID: selectedTruckId,
        packages: packages
    };

    

    try {
        const response = await fetch('http://localhost:8080/tours/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Error: ' + response.status);
        }

        const responseData = await response.json();
        console.log('Generated Route Data:', responseData);

    responseData.packages.forEach((packageData, index) => {
        if (!packageData) {
            return;
        }

        const packageContainer = planningCard.querySelectorAll('.planningPackage-info')[index];
        if (!packageContainer) {
            console.warn(`Package container not found for index ${index}. Skipping.`);
            return; // Skip this iteration if package container is not found
        }

        const packageWeightInput = packageContainer.querySelector('input[type="number"]');

        packageWeightInput.value = packageData.packageWeight || 0;

        const deliveryAddressSelect = packageContainer.querySelector('select[id^=deliveryAddress]');
        const optionIndexAddress = [...deliveryAddressSelect.options].findIndex(option => option.textContent === packageData.deliveryAddress);
        if (optionIndexAddress !== -1) {
            deliveryAddressSelect.selectedIndex = optionIndexAddress;
        } else {
            console.warn(`Delivery address '${deliveryAddressText}' not found in dropdown.`);
        }

        const customerSelect = packageContainer.querySelector('select[id^=customerSelect]');
        const optionIndexCustomer = [...customerSelect.options].findIndex(option => option.textContent.includes(`Customer ${packageData.customerID}`));
        if (optionIndexCustomer !== -1) {
            customerSelect.selectedIndex = optionIndexCustomer;
        } else {
            console.warn(`Customer ${packageData.customerID} not found in dropdown.`);
        }
    });

    updateAvailableCapacity(planningCard);
    
    } catch (error) {
        console.error('Error calculating route:', error);
        showAlert('Failed to calculate route. Please try again.');
        
    } finally{
        hideLoader();
    }
}




function createPackage() {
    const planningCard = event.target.closest('.planning-card');
    const packageContainer = planningCard.querySelector('.package-container');
    const existingPackages = planningCard.querySelectorAll('.planningPackage-info');

    let nextPackageNumber = 1;
    existingPackages.forEach(packageElement => {
        const packageNumber = parseInt(packageElement.querySelector('h3').textContent.split(' ')[1]);
        if (packageNumber >= nextPackageNumber) {
            nextPackageNumber = packageNumber + 1;
        }
    });

    const newPackage = document.createElement('div');
    newPackage.classList.add('planningPackage-info');

    // Make the package container draggable
    newPackage.draggable = true;
    newPackage.addEventListener('dragstart', function(event) {
        event.dataTransfer.setData('text/plain', ''); // Required for Firefox to allow drag
    });

    newPackage.innerHTML = `
        <h3>Package ${nextPackageNumber}</h3>
        <label>Package Weight (kg):</label>
        <br>
        <input type="number" id="packageWeight${nextPackageNumber}" onchange="updateAvailableCapacity(this)">
        <br>
        <label>Delivery Address:</label>
        <br>
        <select id="deliveryAddress${nextPackageNumber}"></select>
        <br>
        <p>Select Customer:</p>
        <select id="customerSelect${nextPackageNumber}"></select>
        <button class="delete-button" onclick="deletePackage(event)">x</button>
    `;

    packageContainer.appendChild(newPackage);

    const customerSelect = newPackage.querySelector(`#customerSelect${nextPackageNumber}`);

    fetchCustomersForDropdown(customerSelect);

    updateAvailableCapacity(planningCard);

    const deliveryAddressSelect = newPackage.querySelector(`#deliveryAddress${nextPackageNumber}`);
    fetchAndPopulateDeliveryAddresses(deliveryAddressSelect);
}

async function fetchAndPopulateDeliveryAddresses(selectElement = null) {
    try {
        // Fetch the CSV file
        const response = await fetch('../resources/nodesTours.csv');
        if (!response.ok) {
            throw new Error('Failed to fetch CSV file');
        }

        const csvText = await response.text();

        // Parse the CSV data
        const parsedData = Papa.parse(csvText, {
            header: false,
            skipEmptyLines: true
        });

        if (parsedData.errors.length) {
            console.error('Errors while parsing CSV:', parsedData.errors);
            return;
        }

        const addresses = parsedData.data.map(row => row[0]);

        populateSelectElements(addresses, selectElement);

    } catch (error) {
        console.error('Error fetching or parsing CSV:', error);
    }
}

function populateSelectElements(addresses, selectElement) {
    const selectElements = selectElement ? [selectElement] : document.querySelectorAll('[id^=deliveryAddress]');
    selectElements.forEach(select => {
        select.innerHTML = '';

        addresses.forEach(address => {
            const option = document.createElement('option');
            option.value = address;
            option.textContent = address;
            select.appendChild(option);
        });
    });
}


function updateAvailableCapacity(planningCard) {
    const truckSelect = planningCard.querySelector('#truckSelect');
    if (!truckSelect) {
        console.error('Truck select not found.');
        return;
    }

    const selectedOption = truckSelect.options[truckSelect.selectedIndex];
    const truckCapacity = parseFloat(selectedOption.dataset.capacity);

    const packageInputs = planningCard.querySelectorAll('input[type="number"]');
    let usedCapacity = 0;

    packageInputs.forEach(input => {
        let packageWeight = parseFloat(input.value) || 0;
        
        // Validate package weight to ensure it's not below 0
        if (packageWeight < 0) {
            packageWeight = 0;
            input.value = packageWeight;
        }

        usedCapacity += packageWeight;
    });

    const availableCapacity = truckCapacity - usedCapacity;
    const availableCapacityLabel = planningCard.querySelector('#availableCapacityLabel');

    if (availableCapacityLabel) {
        availableCapacityLabel.textContent = `Available Capacity: ${availableCapacity.toFixed(2)} kg`;

        // Check if used capacity exceeds truck capacity
        const saveTourButton = planningCard.querySelector('button[data-action="saveTour"]');
        if (usedCapacity > truckCapacity) {
            availableCapacityLabel.style.color = 'red';
        } else {
            availableCapacityLabel.style.color = '';
        }
    }
}
// Event listener for input change within a planning card (tour)
document.addEventListener('input', function(event) {
    const target = event.target;
    if (target && target.type === 'number' && target.closest('.planning-card')) {
        const planningCard = target.closest('.planning-card');
        updateAvailableCapacity(planningCard);
    }
});




// Function to update package numbers after deleting a package
function updatePackageNumbers(planningCard) {
    const packageContainers = planningCard.querySelectorAll('.planningPackage-info');
    packageContainers.forEach((container, index) => {
        const packageNumberHeading = container.querySelector('h3');
        packageNumberHeading.textContent = `Package ${index + 1}`;
    });
}

function deletePackage(event) {
    const packageElement = event.target.closest('.planningPackage-info');
    packageElement.remove();

    const planningCard = event.target.closest('.planning-card');
    updatePackageNumbers(planningCard);
    updateAvailableCapacity(planningCard);
}

function deleteTour(event) {
    const planningCard = event.target.closest('.planning-card'); // Find the closest parent with the class 'planning-card'
    
    if (planningCard) {
        planningCard.remove();
    } else {
        console.error('Planning card not found.');
    }
}


function saveTour(event) {
    showLoader();
    if (!event) {
        console.error('Event object not provided.');
        return;
    }
    
    const token = localStorage.getItem('token');

    const saveButton = event.target;

    const planningCard = saveButton.closest('.planning-card');
    if (!planningCard) {
        console.error('Planning card not found.');
        return;
    }

    const truckSelect = planningCard.querySelector('#truckSelect');
    const selectedTruckOption = truckSelect.options[truckSelect.selectedIndex];

    const truckOptionText = selectedTruckOption.textContent;
    const selectedTruckId = extractTruckId(truckOptionText);

    const packageContainers = planningCard.querySelectorAll('.planningPackage-info');

    let totalPackageWeight = 0;

    packageContainers.forEach(container => {
        const packageWeightInput = container.querySelector('input[type="number"]');
        const packageWeight = parseFloat(packageWeightInput.value) || 0;
        totalPackageWeight += packageWeight;
    });

    const truckCapacity = parseFloat(selectedTruckOption.dataset.capacity);
    if (totalPackageWeight === 0) {
        showAlert('Please add at least one package before saving.');
        return; // Exit the function without saving
    } else if (totalPackageWeight > truckCapacity) {
        showAlert('Total package weight exceeds truck capacity. Please adjust the packages or select another truck.');
        return; // Exit the function without saving
    }

    const packages = [];
    let isValid = true;

    packageContainers.forEach(container => {
        const packageWeightInput = container.querySelector('input[type="number"]');
        const deliveryAddressSelect = container.querySelector('select[id^=deliveryAddress]');

        const packageWeight = parseFloat(packageWeightInput.value);
        const deliveryAddress = deliveryAddressSelect.options[deliveryAddressSelect.selectedIndex];
        const deliveryAddressText = deliveryAddress.textContent;

        const customerSelect = container.querySelector('select[id^=customerSelect]');
        const selectedCustomerOption = customerSelect.options[customerSelect.selectedIndex];

        const customerOptionText = selectedCustomerOption.textContent;
        const selectedCustomerId = extractCustomerId(customerOptionText);

        if (packageWeight > 0 && deliveryAddressText !== '') {
            const packageData = {
                packageWeight: packageWeight,
                deliveryAddress: deliveryAddressText,
                customerID: selectedCustomerId
            };
            packages.push(packageData);
        } else {
            isValid = false;
            console.warn('Invalid package data found:', packageWeight, deliveryAddressText);
        }
    });

    if (!isValid) {
        showAlert('Please ensure all package details are valid (weight > 0, address not empty) before saving.');
        return;
    }

    const payload = {
        token: token,
        truckID: selectedTruckId,
        packages: packages
    };
    
    fetch('http://localhost:8080/tours/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Save Tour Successful:', data);
        showAlert('Tour saved successfully!');
        planningCard.remove();
        
    })
    .catch(error => {
        console.error('Error saving tour:', error);
        showAlert('Failed to save tour. Please try again.');
    })
    .finally(
        hideLoader()
    );
}




//Loader functions from https://www.youtube.com/watch?v=yDL04vG1ed4

function showLoader(){
    const loaderDiv = document.getElementById('loader');
    console.log('showLoader called');
    loaderDiv.classList.add('show');
}
function hideLoader(){
    const loaderDiv = document.getElementById('loader');
    console.log('hideLoader called');
    loaderDiv.classList.remove('show');
}



// Event listener for dragover to show drop indicator
document.addEventListener('dragover', function(event) {
    event.preventDefault(); // Allow drop behavior
    const target = event.target;
    const draggedPackage = document.querySelector('.planningPackage-info.dragging');

    if (target.closest('.planning-card') && draggedPackage) {
        // Calculate the drop position
        const rect = target.getBoundingClientRect();
        const offset = event.clientY - rect.top;
        const isBelowMidpoint = offset > rect.height / 2;

        // Create or update the drop indicator element
        let dropIndicator = document.querySelector('.drop-indicator');
        if (!dropIndicator) {
            dropIndicator = document.createElement('div');
            dropIndicator.classList.add('drop-indicator');
            target.closest('.planning-card').appendChild(dropIndicator);
        }

        // Position the drop indicator based on mouse position
        if (isBelowMidpoint) {
            dropIndicator.style.top = rect.height + 'px';
            dropIndicator.style.transform = 'translateY(-100%)';
        } else {
            dropIndicator.style.top = '0';
            dropIndicator.style.transform = 'translateY(0)';
        }
    }
});

// Event listener for drop to handle package placement
document.addEventListener('drop', function(event) {
    event.preventDefault();
    const target = event.target;
    const draggedPackage = document.querySelector('.planningPackage-info.dragging');
    const dropIndicator = document.querySelector('.drop-indicator');

    if (target.closest('.planning-card') && draggedPackage) {
        const newPlanningCard = target.closest('.planning-card');
        const originalPlanningCard = draggedPackage.closest('.planning-card');
        const position = dropIndicator.getBoundingClientRect().top - newPlanningCard.getBoundingClientRect().top;

        // Insert the dragged package at the calculated position
        if (position > 0) {
            newPlanningCard.insertBefore(draggedPackage, dropIndicator.nextSibling);
        } else {
            newPlanningCard.insertBefore(draggedPackage, dropIndicator);
        }

        // Remove the drop indicator
        dropIndicator.remove();

        // Update package numbers and available capacity for both planning cards
        updatePackageNumbers(originalPlanningCard);
        updateAvailableCapacity(originalPlanningCard);
        updatePackageNumbers(newPlanningCard);
        updateAvailableCapacity(newPlanningCard);
    }
});


// Event listeners to handle dragging status
document.addEventListener('dragstart', function(event) {
    const target = event.target;
    if (target.classList.contains('planningPackage-info')) {
        target.classList.add('dragging');
    }
});

document.addEventListener('dragend', function(event) {
    const target = event.target;
    if (target.classList.contains('planningPackage-info')) {
        target.classList.remove('dragging');
        // Remove any remaining drop indicator on drag end
        const dropIndicator = document.querySelector('.drop-indicator');
        if (dropIndicator) {
            dropIndicator.remove();
        }
    }
});





// Helper function to extract truck ID from the option text
function extractTruckId(optionText) {
    const regex = /Truck (\d+) -/;
    const match = optionText.match(regex);
    if (match && match[1]) {
        return match[1];
    }
    return null;
}

function extractCustomerId(optionText) {
    const regex = /Customer (\d+) -/;
    const match = optionText.match(regex);
    if (match && match[1]) {
        return match[1]; 
    }
    return null;
}


//ALERT FUNCTIONS
function showAlert(message) {
    const customAlert = document.getElementById('customAlert');
    const alertMessage = document.getElementById('alertMessage');

    alertMessage.textContent = message;
    customAlert.style.display = 'block';
}

function hideAlert() {
    const customAlert = document.getElementById('customAlert');
    customAlert.style.display = 'none';
}

document.getElementById('closeAlertButton').addEventListener('click', hideAlert);




//LOGIN FUNCTIONS
  document.addEventListener('DOMContentLoaded', function() {
    const loginButton = document.getElementById('loginRegisterButton');
    const loginStatus = localStorage.getItem('loginStatus');

    if (loginStatus === 'Logout') {
        loginButton.textContent = 'Logout';
    } else {
        loginButton.textContent = 'Login';
    }
});

function loginRegisterButtonClick(){
    if (document.getElementById('loginRegisterButton').textContent === 'Logout'){
        var username = localStorage.getItem('userName')
        const logoutData = {
            userName: username,
        };
    
        fetch('http://localhost:8080/users/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(logoutData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error: ' + response.status);
            }
            return response.json(); 
        })
        .then(data => {
            showAlert('Logout successful!');
    
            
            localStorage.setItem('loginStatus', 'Login');
            localStorage.setItem('userName', null)
            localStorage.setItem('token', null)

            document.getElementById('loginRegisterButton').textContent = 'Login';

        })
        .catch(error => {
            console.error('Error:', error);
            showAlert('An error occurred, please try again.');
        });
    }  else{
        window.location.href = '../Valo_Login/login.html';
    }
}
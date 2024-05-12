// truckplanningScript.js

function startNewPlanning() {
    // Create a new planning card element
    const newPlanningCard = document.createElement('div');
    newPlanningCard.classList.add('planning-card');

    // HTML content for the new planning card
    newPlanningCard.innerHTML = `
    <h3>New Planning</h3>
    <p>Select Truck:</p>
    <select id="truckSelect" onchange="updateAvailableCapacity(this.options[this.selectedIndex])"></select>
    <p id="availableCapacityLabel">Available Capacity: 0 kg</p>
    <button onclick="createPackage()">Create Package</button>
    <button onclick="saveTour(event)" data-action="saveTour">Save Tour</button>
    
`;

    // Get the planning container
    const planningContainer = document.getElementById('plannningContainer');

    // Insert the new planning card before the button
    planningContainer.insertBefore(newPlanningCard, planningContainer.firstChild);

    // Fetch trucks and populate the dropdown
    fetchTrucksForDropdown();
}

async function fetchTrucksForDropdown() {
    try {
        const response = await fetch('http://localhost:8080/trucks');
        const trucks = await response.json();

        console.log('Fetched Trucks:', trucks); // Check fetched trucks

        const truckSelect = document.getElementById('truckSelect');
        truckSelect.innerHTML = ''; // Clear existing options

        trucks.forEach(truck => {
            const option = document.createElement('option');
            option.value = truck.truckID;
            option.textContent = `Truck ${truck.id} - ${truck.brandName}`;
            option.dataset.capacity = truck.truckCapacity; // Store capacity as dataset attribute
            truckSelect.appendChild(option);
        });

        // Update the available capacity label initially
        updateTruckCapacity(truckSelect.options[0]); // Check if options exist
    } catch (error) {
        console.error('Error fetching trucks for dropdown:', error);
    }
}

function handleTruckSelectionChange(event) {
    const selectedOption = event.target.options[event.target.selectedIndex];
    console.log('Selected Option:', selectedOption); // Check selected option
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

function createPackage(planningCard) {
    
    const truckSelect = document.getElementById('truckSelect');
    const selectedTruckOption = truckSelect.options[truckSelect.selectedIndex];
    const selectedTruckId = selectedTruckOption.value;

    
    const packageInfoContainer = document.createElement('div');
    packageInfoContainer.classList.add('planningPackage-info');

    const existingPackages = planningCard.querySelectorAll('.planningPackage-info').length;
    const packageNumber = existingPackages + 1;

    const packageHeading = document.createElement('h3');
    packageHeading.textContent = `Package ${packageNumber}`;

    const weightLabel = document.createElement('label');
    weightLabel.textContent = 'Package Weight (kg):';
    const weightInput = document.createElement('input');
    weightInput.type = 'number';
    weightInput.id = `packageWeight${packageNumber}`;
    weightInput.addEventListener('input', () => {
        updateAvailableCapacity(selectedTruckOption);
    });

    const addressLabel = document.createElement('label');
    addressLabel.textContent = 'Delivery Address:';
    const addressInput = document.createElement('input');
    addressInput.type = 'text';
    addressInput.id = `deliveryAddress${packageNumber}`;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'x';
    deleteButton.classList.add('delete-button');
    deleteButton.onclick = function() {
        // Add back the weight to available capacity when package is deleted
        const packageWeight = parseFloat(weightInput.value) || 0;
        selectedTruckOption.dataset.capacity = parseFloat(selectedTruckOption.dataset.capacity) + packageWeight;
        
        packageInfoContainer.remove();
        updatePackageNumbers(planningCard);
        updateAvailableCapacity(selectedTruckOption);
    };

    packageInfoContainer.appendChild(packageHeading);
    packageInfoContainer.appendChild(deleteButton);
    packageInfoContainer.appendChild(weightLabel);
    packageInfoContainer.appendChild(weightInput);
    packageInfoContainer.appendChild(document.createElement('br'));
    packageInfoContainer.appendChild(addressLabel);
    packageInfoContainer.appendChild(addressInput);

    planningCard.insertBefore(packageInfoContainer, event.target);

    updateAvailableCapacity(selectedTruckOption);
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
        const packageWeight = parseFloat(input.value) || 0;
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
            // Disable save button if needed
            // saveTourButton.disabled = true;
        } else {
            availableCapacityLabel.style.color = '';
            // Enable save button if needed
            // saveTourButton.disabled = false;
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

// Event listener for creating a new package within a planning card (tour)
document.addEventListener('click', function(event) {
    const target = event.target;
    if (target && target.tagName === 'BUTTON' && target.textContent === 'Create Package') {
        const planningCard = target.closest('.planning-card');
        createPackage(planningCard);
    }
});

// Function to handle the 'Save Tour' button click within a planning card (tour)
document.addEventListener('click', function(event) {
    const target = event.target;
    if (target && target.tagName === 'BUTTON' && target.dataset.action === 'saveTour') {
        const planningCard = target.closest('.planning-card');
        saveTour(planningCard);
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


function saveTour(planningCard) {
    // Get the authentication token from localStorage
    const token = localStorage.getItem('token');

    // Get the button element that triggered the saveTour function
    const saveButton = event.target;

    // Find the parent planning card (tour) of the save button
    

    if (!planningCard) {
        console.error('Planning card not found.');
        return;
    }

    // Get the selected truck option from the dropdown within the planning card
    const truckSelect = planningCard.querySelector('#truckSelect');
    const selectedTruckOption = truckSelect.options[truckSelect.selectedIndex];

    // Extract the truck ID from the selected option text
    const truckOptionText = selectedTruckOption.textContent;
    const selectedTruckId = extractTruckId(truckOptionText);

    // Get all package info containers under the current planning card
    const packageContainers = planningCard.querySelectorAll('.planningPackage-info');

    // Calculate total package weight
    let totalPackageWeight = 0;

    packageContainers.forEach(container => {
        const packageWeightInput = container.querySelector('input[type="number"]');
        const packageWeight = parseFloat(packageWeightInput.value) || 0;
        totalPackageWeight += packageWeight;
    });

    // Check if total package weight exceeds truck capacity
    const truckCapacity = parseFloat(selectedTruckOption.dataset.capacity);
    if (totalPackageWeight > truckCapacity) {
        alert('Total package weight exceeds truck capacity. Please adjust the packages or select another truck.');
        return; // Exit the function without saving
    }

    // Prepare packages array to hold package details
    const packages = [];
    let isValid = true;

    // Iterate over each package info container to extract package data
    packageContainers.forEach(container => {
        const packageWeightInput = container.querySelector('input[type="number"]');
        const deliveryAddressInput = container.querySelector('input[type="text"]');

        const packageWeight = parseFloat(packageWeightInput.value);
        const deliveryAddress = deliveryAddressInput.value.trim();

        if (packageWeight > 0 && deliveryAddress !== '') {
            const packageData = {
                packageWeight: packageWeight,
                deliveryAddress: deliveryAddress
            };
            packages.push(packageData);
        } else {
            isValid = false;
            console.warn('Invalid package data found:', packageWeight, deliveryAddress);
        }
    });

    if (!isValid) {
        alert('Please ensure all package details are valid (weight > 0, address not empty) before saving.');
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
        alert('Tour saved successfully!');
        // Remove the parent planning card (tour) from the DOM
        planningCard.remove();
    })
    .catch(error => {
        console.error('Error saving tour:', error);
        alert('Failed to save tour. Please try again.');
    });
}







// Helper function to extract truck ID from the option text
function extractTruckId(optionText) {
    const regex = /Truck (\d+) -/;
    const match = optionText.match(regex);
    if (match && match[1]) {
        return match[1]; // Return the captured ID part
    }
    return null; // Return null if no match found (shouldn't happen with consistent format)
}


















//LOGIN FUNCTIONS
  document.addEventListener('DOMContentLoaded', function() {
    // Update login/register button text based on login status in localStorage
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
                // Server responded with an error status
                throw new Error('Error: ' + response.status);
            }
            return response.json(); // Parse response JSON
        })
        .then(data => {
            
    
            // Alert success message (replace with your actual success handling)
            alert('Logout successful!');
    
            
            localStorage.setItem('loginStatus', 'Login');
            localStorage.setItem('userName', null)
            localStorage.setItem('token', null)
            // Update login/register button text to 'Login'
            document.getElementById('loginRegisterButton').textContent = 'Login';

        })
        .catch(error => {
            console.error('Error:', error);
    
            // Display a generic error message for any other types of errors
            alert('An error occurred, please try again.');
        });
    }  else{
        window.location.href = '../Valo_Login/login.html';
    }
}
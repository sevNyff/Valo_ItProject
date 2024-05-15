function backToToursClick(){
    window.location.href = '../Valo_Routes/routes.html';
}

function startNewPlanning() {
    // Create a new planning card element
    const newPlanningCard = document.createElement('div');
    newPlanningCard.classList.add('planning-card');

    // HTML content for the new planning card
    newPlanningCard.innerHTML = `
        <div class="card-header">
            <h3>New Planning</h3>
            <p>Select Truck:</p>
            <select id="truckSelect" onchange="updateAvailableCapacity(this.options[this.selectedIndex])"></select>
            <p id="availableCapacityLabel">Available Capacity: 0 kg</p>
            <button onclick="createPackage()">Create Package</button>
            <button onclick="saveTour(event)" data-action="saveTour" class="saveTour-button">Save Tour</button>
            <button onclick="deleteTour(event)" data-action="deleteTour" class="delete-button">x</button>
        </div>
        <div class="package-container"></div>
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

function createPackage() {
    const planningCard = event.target.closest('.planning-card');
    const packageContainer = planningCard.querySelector('.package-container');
    const existingPackages = planningCard.querySelectorAll('.planningPackage-info');

    // Determine the next available package number within this planning card
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
        <input type="number" id="packageWeight${nextPackageNumber}" onchange="updateAvailableCapacity(this)">
        <br>
        <label>Delivery Address:</label>
        <input type="text" id="deliveryAddress${nextPackageNumber}">
        <button class="delete-button" onclick="deletePackage(event)">x</button>
    `;

    // Insert the new package below the fixed buttons
    packageContainer.appendChild(newPackage);

    // Update available capacity
    updateAvailableCapacity(planningCard);
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
            packageWeight = 0; // Reset to 0 if below 0
            input.value = packageWeight; // Update input value
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
document.addEventListener('DOMContentLoaded', function() {
    const createPackageButton = document.getElementById('createPackageButton');
    if (createPackageButton) {
        createPackageButton.addEventListener('click', createPackage);
    }
});

// Function to handle the 'Save Tour' button click within a planning card (tour)
document.addEventListener('click', function(event) {
    const target = event.target;
    if (target && target.tagName === 'BUTTON' && target.dataset.action === 'saveTour') {
        const planningCard = target.closest('.planning-card');
        saveTour(planningCard, event); // Pass the planningCard and event objects
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

    // Update package numbers and available capacity
    const planningCard = event.target.closest('.planning-card');
    updatePackageNumbers(planningCard);
    updateAvailableCapacity(planningCard);
}

function deleteTour(event) {
    const planningCard = event.target.closest('.planning-card'); // Find the closest parent with the class 'planning-card'
    
    if (planningCard) {
        planningCard.remove(); // Remove the entire planning card element
    } else {
        console.error('Planning card not found.');
    }
}


function saveTour(planningCard, event) {
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
    if (totalPackageWeight === 0) {
        showAlert('Please add at least one package before saving.');
        return; // Exit the function without saving
    } else if (totalPackageWeight > truckCapacity) {
        showAlert('Total package weight exceeds truck capacity. Please adjust the packages or select another truck.');
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
        // Remove the parent planning card (tour) from the DOM
        planningCard.remove();
        
    })
    .catch(error => {
        console.error('Error saving tour:', error);
        showAlert('Failed to save tour. Please try again.');
        
    });
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
    event.preventDefault(); // Prevent default drop behavior
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
        return match[1]; // Return the captured ID part
    }
    return null; // Return null if no match found (shouldn't happen with consistent format)
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

// Event listener for closing the custom alert
document.getElementById('closeAlertButton').addEventListener('click', hideAlert);




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
            showAlert('Logout successful!');
    
            
            localStorage.setItem('loginStatus', 'Login');
            localStorage.setItem('userName', null)
            localStorage.setItem('token', null)
            // Update login/register button text to 'Login'
            document.getElementById('loginRegisterButton').textContent = 'Login';

        })
        .catch(error => {
            console.error('Error:', error);
    
            // Display a generic error message for any other types of errors
            showAlert('An error occurred, please try again.');
        });
    }  else{
        window.location.href = '../Valo_Login/login.html';
    }
}
// truckplanningScript.js

function startNewPlanning() {
    // Create a new planning card element
    const newPlanningCard = document.createElement('div');
    newPlanningCard.classList.add('planning-card');

    // HTML content for the new planning card
    newPlanningCard.innerHTML = `
        <h3>New Planning</h3>
        <p>Select Truck:</p>
        <select id="truckSelect"></select>
        <button onclick="createPackage()">Create Package</button>
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

        // Get the dropdown element inside the new planning card
        const truckSelect = document.getElementById('truckSelect');

        // Populate the dropdown with truck options
        trucks.forEach(truck => {
            const option = document.createElement('option');
            option.value = truck.truckID;
            option.textContent = `Truck ${truck.id} - ${truck.brandName}`;
            truckSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching trucks for dropdown:', error);
    }
}

function createPackage() {
    // Get selected truck ID from the dropdown
    const selectedTruckId = document.getElementById('truckSelect').value;

    // Get the button element that was clicked (the "Create Package" button)
    const createPackageButton = event.target;

    // Get the parent element (planning card) of the button
    const planningCard = createPackageButton.parentElement;

    // Create a new container for package details
    const packageInfoContainer = document.createElement('div');
    packageInfoContainer.classList.add('planningPackage-info');

    // Determine the number of existing package info containers (packages)
    const existingPackages = planningCard.querySelectorAll('.planningPackage-info').length;
    const packageNumber = existingPackages + 1; // Calculate the package number

    // Create a heading for the package number
    const packageHeading = document.createElement('h3');
    packageHeading.textContent = `Package ${packageNumber}`;

    // Create elements for entering package details
    const weightLabel = document.createElement('label');
    weightLabel.textContent = 'Package Weight (kg):';
    const weightInput = document.createElement('input');
    weightInput.type = 'number';
    weightInput.id = `packageWeight${packageNumber}`; // Unique ID for weight input

    const addressLabel = document.createElement('label');
    addressLabel.textContent = 'Delivery Address:';
    const addressInput = document.createElement('input');
    addressInput.type = 'text';
    addressInput.id = `deliveryAddress${packageNumber}`; // Unique ID for address input

    // Append package number heading and details to the package info container
    packageInfoContainer.appendChild(packageHeading);
    
    packageInfoContainer.appendChild(weightLabel);
    packageInfoContainer.appendChild(weightInput);
    packageInfoContainer.appendChild(document.createElement('br')); // Add line break
    packageInfoContainer.appendChild(addressLabel);
    packageInfoContainer.appendChild(addressInput);

    // Insert the package info container into the planning card (before the button)
    planningCard.insertBefore(packageInfoContainer, createPackageButton);

    // Additional logic to create a package with the selected truck ID
    console.log(`Package ${packageNumber} - Selected Truck ID:`, selectedTruckId);
    console.log(`Package ${packageNumber} - Package Weight:`, weightInput.value);
    console.log(`Package ${packageNumber} - Delivery Address:`, addressInput.value);
    // Implement package creation logic here
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
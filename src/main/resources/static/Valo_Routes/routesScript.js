document.addEventListener('DOMContentLoaded', function() {
    const toursContainer = document.getElementById('toursContainer');

    async function fetchTours() {
        try {
            const toursResponse = await fetch('http://localhost:8080/tours');
            const trucksResponse = await fetch('http://localhost:8080/trucks');

            const tours = await toursResponse.json();
            const trucks = await trucksResponse.json();

            toursContainer.innerHTML = ''; // Clear previous content

            tours.forEach(tour => {
                // Find the associated truck for the tour
                const truck = trucks.find(truck => truck.id === tour.truckID);

                // Create a div element for each tour
                const tourCard = document.createElement('div');
                tourCard.classList.add('tour-card');

                // Create a title for the tour
                const tourTitle = document.createElement('h2');
                tourTitle.textContent = `Tour ${tour.id}`;
                tourCard.appendChild(tourTitle);

                const tourDistance = document.createElement('p');
                tourDistance.textContent = `Distance: ${tour.distanceTour} km`;
                tourCard.appendChild(tourDistance);

                const tourTime = document.createElement('p');
                tourTime.textContent = `Time: ${tour.timeTour} h`;
                tourCard.appendChild(tourTime);


                // Display truck details if found
                if (truck) {
                    const truckTitle = document.createElement('h3');
                    truckTitle.textContent = `Truck ${truck.id}: ${truck.brandName}`;
                    tourCard.appendChild(truckTitle);

                    const truckCapacityInfo = document.createElement('p');
                    truckCapacityInfo.textContent = `Capacity: ${truck.truckCapacity} kg`;
                    tourCard.appendChild(truckCapacityInfo);

                    // Calculate used capacity for the tour
                    const usedCapacity = tour.packages.reduce((totalWeight, pkg) => totalWeight + pkg.packageWeight, 0);
                    const availableCapacity = truck.truckCapacity - usedCapacity;
                    const usedCapacityInfo = document.createElement('p');
                    usedCapacityInfo.textContent = `Available Capacity: ${availableCapacity} kg`;
                    tourCard.appendChild(usedCapacityInfo);
                } else {
                    // Display a message if truck not found (should not happen ideally)
                    const truckInfo = document.createElement('p');
                    truckInfo.textContent = `Truck details not found for Tour ${tour.id}`;
                    tourCard.appendChild(truckInfo);
                }

                const packagesTitle = document.createElement('h2');
                packagesTitle.textContent = `Packages in Tour:`;
                packagesTitle.classList.add('packages-title')
                tourCard.appendChild(packagesTitle);

                // Create a div for packages associated with the tour
                const packageContainer = document.createElement('div');
                packageContainer.classList.add('tour-container');

                // Populate packageContainer with package information
                tour.packages.forEach((package, index) => {
                    const packageInfo = document.createElement('div');
                    packageInfo.classList.add('tour-info');

                    // Populate packageInfo with package details
                    packageInfo.innerHTML += `
                        <h3>Package ${package.packageID}</h3>
                        <p><strong>Weight:</strong> ${package.packageWeight} kg</p>
                        <p><strong>Delivery Address:</strong> ${package.deliveryAddress}</p>
                        
                    `;

                    // Append packageInfo to packageContainer
                    packageContainer.appendChild(packageInfo);
                });

                // Append packageContainer to tourCard
                tourCard.appendChild(packageContainer);

                // Append tourCard to toursContainer
                toursContainer.appendChild(tourCard);
            });
        } catch (error) {
            console.error('Error fetching tours:', error);
        }
    }
    
    // Load tours when DOM content is loaded
    fetchTours();
});

function changeToTruckplanningWindow() {
    window.location.href = "../Valo_Truckplanning/truckplanning.html";
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
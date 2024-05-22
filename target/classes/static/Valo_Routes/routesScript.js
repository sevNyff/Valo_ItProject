document.addEventListener('DOMContentLoaded', function() {
    const toursContainer = document.getElementById('toursContainer');

    async function fetchTours() {
        try {
            const [toursResponse, trucksResponse, customersResponse] = await Promise.all([
                fetch('http://localhost:8080/tours'),
                fetch('http://localhost:8080/trucks'),
                fetch('http://localhost:8080/customers')
            ]);

            if (!toursResponse.ok || !trucksResponse.ok || !customersResponse.ok) {
                throw new Error('Error fetching data from the server');
            }

            const tours = await toursResponse.json();
            const trucks = await trucksResponse.json();
            const customers = await customersResponse.json();

            console.log('Fetched tours:', tours);  // Debugging step
            console.log('Fetched trucks:', trucks);  // Debugging step
            console.log('Fetched customers:', customers);  // Debugging step

            toursContainer.innerHTML = ''; // Clear previous content

            tours.forEach(tour => {
                const truck = trucks.find(truck => truck.id === tour.truckID);
                const customer = customers.find(customer => customer.customerID === tour.customerID);

                const tourCard = document.createElement('div');
                tourCard.classList.add('tour-card');

                const tourTitle = document.createElement('h2');
                tourTitle.textContent = `Tour ${tour.id}`;
                tourCard.appendChild(tourTitle);

                const tourDistance = document.createElement('p');
                tourDistance.textContent = `Distance: ${tour.distanceTour} km`;
                tourCard.appendChild(tourDistance);

                const tourTime = document.createElement('p');
                tourTime.textContent = `Time: ${tour.timeTour} h`;
                tourCard.appendChild(tourTime);

                if (truck) {
                    const truckTitle = document.createElement('h3');
                    truckTitle.textContent = `Truck ${truck.id}: ${truck.brandName}`;
                    tourCard.appendChild(truckTitle);

                    const truckCapacityInfo = document.createElement('p');
                    truckCapacityInfo.textContent = `Capacity: ${truck.truckCapacity} kg`;
                    tourCard.appendChild(truckCapacityInfo);

                    const usedCapacity = tour.packages.reduce((totalWeight, pkg) => totalWeight + pkg.packageWeight, 0);
                    const availableCapacity = truck.truckCapacity - usedCapacity;
                    const usedCapacityInfo = document.createElement('p');
                    usedCapacityInfo.textContent = `Available Capacity: ${availableCapacity} kg`;
                    tourCard.appendChild(usedCapacityInfo);
                } else {
                    const truckInfo = document.createElement('p');
                    truckInfo.textContent = `Truck details not found for Tour ${tour.id}`;
                    tourCard.appendChild(truckInfo);
                }

                if (customer) {
                    const customerTitle = document.createElement('h3');
                    customerTitle.textContent = `Customer ${customer.customerID}: ${customer.customerName}`;
                    tourCard.appendChild(customerTitle);
                } else {
                    const customerInfo = document.createElement('p');
                    customerInfo.textContent = `Customer details not found for Tour ${tour.id}`;
                    tourCard.appendChild(customerInfo);
                }

                const packagesTitle = document.createElement('h2');
                packagesTitle.textContent = `Packages in Tour:`;
                packagesTitle.classList.add('packages-title');
                tourCard.appendChild(packagesTitle);

                const packageContainer = document.createElement('div');
                packageContainer.classList.add('tour-container');

                tour.packages.forEach(pkg => {
                    const packageInfo = document.createElement('div');
                    packageInfo.classList.add('tour-info');

                    packageInfo.innerHTML = `
                        <h3>Package ${pkg.packageID}</h3>
                        <p><strong>Weight:</strong> ${pkg.packageWeight} kg</p>
                        <p><strong>Delivery Address:</strong> ${pkg.deliveryAddress}</p>
                    `;

                    packageContainer.appendChild(packageInfo);
                });

                tourCard.appendChild(packageContainer);
                toursContainer.appendChild(tourCard);
            });
        } catch (error) {
            console.error('Error fetching tours:', error);
        }
    }

    fetchTours();
});

function changeToTruckplanningWindow() {
    var token = localStorage.getItem('token');
    
  if (token === null || token === 'null') {
      showAlert("You need to login first!");
  } else {
    window.location.href = "../Valo_Truckplanning/truckplanning.html";
  }
    
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
document.addEventListener('DOMContentLoaded', function() {
    const toursContainer = document.getElementById('toursContainer');

    async function fetchTours() {
        fetch('http://localhost:8080/tours')
            .then(response => response.json())
            .then(tours => {
                toursContainer.innerHTML = ''; // Clear previous content

                tours.forEach(tour => {
                    // Create a div element for each tour
                    const tourCard = document.createElement('div');
                    tourCard.classList.add('tour-card');

                    // Create a title for the tour
                    const tourTitle = document.createElement('h2');
                    tourTitle.textContent = `Tour ${tour.id}`;
                    tourCard.appendChild(tourTitle);

                    const truckTitle = document.createElement('h3');
                    truckTitle.textContent = `Truck ${tour.truckID}`;
                    tourCard.appendChild(truckTitle);
                    
                    // Create a div for packages associated with the tour
                    const packageContainer = document.createElement('div');
                    packageContainer.classList.add('tour-container');
                    
                        

                    // Filter packages belonging to the current tour
                    const tourPackages = tour.packages.filter(package => package.tourID === tour.tourID);

                    // Populate packageContainer with package information
                    tourPackages.forEach((package, index) => {
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
            })
            .catch(error => {
                console.error('Error fetching tours:', error);
            });
    }
    
    // Load tours when DOM content is loaded
    fetchTours();

    
});


function changeToTruckplanningWindow(){
    window.location.href = "../Valo_Truckplanning/truckplanning.html"
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
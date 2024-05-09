
//Load Trucks into the table
document.addEventListener('DOMContentLoaded', function() {
    const trucksContainer = document.getElementById('trucksContainer');
  
    function fetchTrucks() {
      fetch('http://localhost:8080/trucks')
        .then(response => response.json())
        .then(trucks => {
          trucksContainer.innerHTML = ''; // Clear previous content
  
          trucks.forEach(truck => {
            // Create a div element for each truck card
            const truckCard = document.createElement('div');
            truckCard.classList.add('truck-card');
  
            // Populate truck card with truck information
            truckCard.innerHTML = `
              <div class="truck-info">
                <p><strong>ID:</strong> ${truck.id}</p>
                <p><strong>Brand:</strong> ${truck.brandName}</p>
                <p><strong>Capacity:</strong> ${truck.truckCapacity}</p>
              </div>
              <button class="delete-button" data-truck-id="${truck.id}">Delete</button>
            `;
  
            // Append truck card to trucksContainer
            trucksContainer.appendChild(truckCard);
  
            // Attach event listener to the delete button
            const deleteButton = truckCard.querySelector('.delete-button');
            deleteButton.addEventListener('click', handleDeleteButtonClick);
          });
        })
        .catch(error => {
          console.error('Error fetching trucks:', error);
        });
    }
  
    // Function to handle the "Delete" button click
    function handleDeleteButtonClick(event) {
      const truckId = event.target.dataset.truckId;
  
      fetch(`http://localhost:8080/trucks/delete/${truckId}`, {
        method: 'GET'
      })
        .then(response => response.text())
        .then(message => {
          alert(message); // Display success message
          event.target.closest('.truck-card').remove(); // Remove truck card from DOM
        })
        .catch(error => {
          console.error('Error:', error);
          alert('An error occurred. Please try again.');
        });
    }
  
    // Load trucks when DOM content is loaded
    fetchTrucks();
  });
  

function changeToAddTruckPage(){
    window.location.href = '../Valo_Trucks/addTruck.html';
}

function backToTrucksButtonClick(){
    window.location.href = '../Valo_Trucks/trucks.html';
}

function newTruckButtonClick() {
    var brandName = document.getElementById('brand').value;
    var truckCapacity = document.getElementById('capacity').value;
    var token = localStorage.getItem('token');

    const truckData = {
        brandName: brandName,
        truckCapacity: truckCapacity,
        token: token
    };

    // Send a POST request to the server to add a new truck
    fetch('http://localhost:8080/trucks/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(truckData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        // Redirect to trucks.html after successfully adding a new truck
        window.location.href = '../Valo_Trucks/trucks.html';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred, please try again.');
    });
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
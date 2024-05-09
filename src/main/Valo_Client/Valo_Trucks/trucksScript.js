
//Load Trucks into the table
document.addEventListener('DOMContentLoaded', function(){
    const trucksTableBody = document.getElementById('trucksTableBody');


    function fetchTrucks(){
        fetch('http://localhost:8080/trucks')
        .then(response => response.json())
        .then(trucks => {
            trucksTableBody.innerHTML = '';

            trucks.forEach(truck => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${truck.id}</td>
                <td>${truck.brandName}</td>
                <td>${truck.truckCapacity}</td>
                <td>
                    <button class="delete-button" data-truck-id="${truck.id}">Delete</button>
                </td>
                `;     
                trucksTableBody.appendChild(row);

            });

            // Attach event listeners to the "Delete" buttons
            const deleteButtons = document.querySelectorAll('.delete-button');
            deleteButtons.forEach((button) => {
            button.addEventListener('click', handleDeleteButtonClick);
            });
        
        })
        .catch(error => {
           console.error('Error fetching trucks:', error)
        })
    
    }

// Function to handle the "Delete" button click
function handleDeleteButtonClick(event) {
    const truckId = event.target.dataset.truckId;

    // Send a DELETE request to the server to delete the car
    fetch(`http://localhost:8080/trucks/delete/${truckId}`, {
      method: 'GET'
    })
      .then(response => response.text())
      .then(message => {
        // Handle the response from the server
        alert(message); // Display a success message
        // Remove the corresponding row from the table
        const row = event.target.parentNode.parentNode;
        row.parentNode.removeChild(row);
      })
      .catch(error => {
        // Handle any errors that occurred during the request
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
      });
  }


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
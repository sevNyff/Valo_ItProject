
//Load Trucks into the table
document.addEventListener('DOMContentLoaded', function() {
    const trucksContainer = document.getElementById('trucksContainer');
  
    function fetchTrucks() {
      fetch('http://localhost:8080/trucks')
        .then(response => response.json())
        .then(trucks => {
          trucksContainer.innerHTML = '';
  
          trucks.forEach(truck => {
            const truckCard = document.createElement('div');
            truckCard.classList.add('truck-card');
  
            truckCard.innerHTML = `
              <div class="truck-info">
                <h3>Truck ${truck.id}</h3>
                <p><strong>Brand:</strong> ${truck.brandName}</p>
                <p><strong>Capacity:</strong> ${truck.truckCapacity}</p>
              </div>
              <button class="delete-button" data-truck-id="${truck.id}">x</button>
            `;
  
            trucksContainer.appendChild(truckCard);
  
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
          showAlert(message);
          event.target.closest('.truck-card').remove();
        })
        .catch(error => {
          console.error('Error:', error);
          showAlert('An error occurred. Please try again.');
        });
    }

    fetchTrucks();
  });
  

function changeToAddTruckPage(){
  var token = localStorage.getItem('token');
    
  if (token === null || token === 'null') {
      showAlert("You need to login first!");
  } else {
    window.location.href = '../Valo_Trucks/addTruck.html';
  }


    
}

function backToTrucksButtonClick(){
    window.location.href = '../Valo_Trucks/trucks.html';
}

function newTruckButtonClick() {
  var brandName = document.getElementById('brand').value;
  var truckCapacity = document.getElementById('capacity').value;
  var token = localStorage.getItem('token');

  if (brandName.length < 3) {
      showAlert('Brand name must be at least 3 characters long.');
      return; // Exit the function if validation fails
  }

  const parsedCapacity = parseFloat(truckCapacity);
  if (isNaN(parsedCapacity) || parsedCapacity <= 0) {
      showAlert('Capacity must be a valid number bigger than 0.');
      return; // Exit the function if validation fails
  }

  const truckData = {
      brandName: brandName,
      truckCapacity: parsedCapacity,
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
      window.location.href = '../Valo_Trucks/trucks.html';
  })
  .catch(error => {
      console.error('Error:', error);
      showAlert('An error occurred, please try again.');
  });
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
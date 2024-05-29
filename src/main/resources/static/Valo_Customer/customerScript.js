
//Load customers into the table
document.addEventListener('DOMContentLoaded', function() {
    const customersContainer = document.getElementById('customersContainer');
  
    function fetchcustomers() {
      fetch('http://localhost:8080/customers')
        .then(response => response.json())
        .then(customers => {
          customersContainer.innerHTML = '';
  
          customers.forEach(customer => {
            const customerCard = document.createElement('div');
            customerCard.classList.add('customer-card');
  
            customerCard.innerHTML = `
              <div class="customer-info">
                <h3>Customer ${customer.customerID}</h3>
                <p><strong>Name:</strong> ${customer.customerName}</p>
                <p><strong>Address:</strong> ${customer.addressName}</p>
                <p><strong>City:</strong> ${customer.cityName}</p>
              </div>
              <button class="delete-button" data-customer-id="${customer.customerID}">x</button>
            `;
  
            customersContainer.appendChild(customerCard);
  
            const deleteButton = customerCard.querySelector('.delete-button');
            deleteButton.addEventListener('click', handleDeleteButtonClick);
          });
        })
        .catch(error => {
          console.error('Error fetching customers:', error);
        });
    }
  
    // Function to handle the "Delete" button click
    function handleDeleteButtonClick(event) {
      const customerId = event.target.dataset.customerId;
  
      fetch(`http://localhost:8080/customers/delete/${customerId}`, {
        method: 'GET'
      })
        .then(response => response.text())
        .then(message => {
          showAlert(message);
          event.target.closest('.customer-card').remove();
        })
        .catch(error => {
          console.error('Error:', error);
          showAlert('An error occurred. Please try again.');
        });
    }
  
    fetchcustomers();
  });
  
// Function to handle the Button to get to the add customer page
function changeToAddCustomerPage(){
  var token = localStorage.getItem('token');
    
  if (token === null || token === 'null') {
      showAlert("You need to login first!");
  } else {
    window.location.href = '../Valo_Customer/addCustomer.html';
  }
    
}
// Function to handle to get back to the custoemr page
function backToCustomersButtonClick(){
    window.location.href = '../Valo_Customer/customers.html';
}
// Function to handle newCustomerButton click
function newCustomerButtonClick() {
  var customerName = document.getElementById('name').value;
  var customerAddress = document.getElementById('address').value;
  var customerCity = document.getElementById('city').value;

  if (!customerName || !customerAddress || !customerCity) {
    showAlert('All fields are required. Please fill in all fields.');
    return; // Prevent the request from being sent
}

  var token = localStorage.getItem('token');

  const customerData = {
      customerName: customerName,
      addressName: customerAddress,
      cityName: customerCity,
      token: token
  };

  // Send a POST request to the server to add a new customer
  fetch('http://localhost:8080/customers/new', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(customerData)
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Error: ' + response.status);
      }
      return response.json();
  })
  .then(data => {
      window.location.href = '../Valo_Customer/customers.html';
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

// Event listener for closing the custom alert
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
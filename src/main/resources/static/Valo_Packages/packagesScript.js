document.addEventListener('DOMContentLoaded', function() {
  const packagesContainer = document.getElementById('packagesContainer');

  async function fetchPackages() {
      try {
          const [packagesResponse, customersResponse] = await Promise.all([
              fetch('http://localhost:8080/packages'),
              fetch('http://localhost:8080/customers')
          ]);

          if (!packagesResponse.ok || !customersResponse.ok) {
              throw new Error('Error fetching data from the server');
          }

          const packages = await packagesResponse.json();
          const customers = await customersResponse.json();

          packagesContainer.innerHTML = ''; // Clear previous content

          packages.forEach(package => {
              // Find the customer for this package
              const packageCustomer = customers.find(customer => customer.customerID === package.customerID);

              // Create a div element for each package card
              const packageCard = document.createElement('div');
              packageCard.classList.add('package-card');

              // Populate package card with package information
              packageCard.innerHTML = `
                  <div class="package-info">
                      <h2>Package ${package.packageID}</h2>
                      <p><strong>Weight:</strong> ${package.packageWeight} kg</p>
                      <p><strong>Delivery Address:</strong> ${package.deliveryAddress}</p>
                      <p><strong>Customer:</strong> ${packageCustomer ? packageCustomer.customerName : 'Customer details not found'}</p>
                  </div>
              `;

              // Append package card to packagesContainer
              packagesContainer.appendChild(packageCard);
          });
      } catch (error) {
          console.error('Error fetching packages:', error);
      }
  }

  // Load packages when DOM content is loaded
  fetchPackages();
});

// ALERT FUNCTIONS
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

// LOGIN FUNCTIONS
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

function loginRegisterButtonClick() {
  if (document.getElementById('loginRegisterButton').textContent === 'Logout') {
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
          localStorage.setItem('userName', null);
          localStorage.setItem('token', null);
          // Update login/register button text to 'Login'
          document.getElementById('loginRegisterButton').textContent = 'Login';
      })
      .catch(error => {
          console.error('Error:', error);

          // Display a generic error message for any other types of errors
          showAlert('An error occurred, please try again.');
      });
  } else {
      window.location.href = '../Valo_Login/login.html';
  }
}

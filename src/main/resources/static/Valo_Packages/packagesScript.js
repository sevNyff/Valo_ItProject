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

          packagesContainer.innerHTML = '';

          packages.forEach(package => {
              const packageCustomer = customers.find(customer => customer.customerID === package.customerID);

              const packageCard = document.createElement('div');
              packageCard.classList.add('package-card');

              packageCard.innerHTML = `
                  <div class="package-info">
                      <h2>Package ${package.packageID}</h2>
                      <p><strong>Weight:</strong> ${package.packageWeight} kg</p>
                      <p><strong>Delivery Address:</strong> ${package.deliveryAddress}</p>
                      <p><strong>Customer:</strong> ${packageCustomer ? packageCustomer.customerName : 'Customer details not found'}</p>
                  </div>
              `;

              packagesContainer.appendChild(packageCard);
          });
      } catch (error) {
          console.error('Error fetching packages:', error);
      }
  }
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

document.getElementById('closeAlertButton').addEventListener('click', hideAlert);

// LOGIN FUNCTIONS
document.addEventListener('DOMContentLoaded', function() {
  const loginButton = document.getElementById('loginRegisterButton');
  const loginStatus = localStorage.getItem('loginStatus');

  // Initialize loginStatus if it's not set in localStorage
  if (!loginStatus) {
    localStorage.setItem('loginStatus', 'Login');
    loginStatus = 'Login';
}

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
              throw new Error('Error: ' + response.status);
          }
          return response.json();
      })
      .then(data => {
          showAlert('Logout successful!');

          localStorage.setItem('loginStatus', 'Login');
          localStorage.setItem('userName', null);
          localStorage.setItem('token', null);

          document.getElementById('loginRegisterButton').textContent = 'Login';
      })
      .catch(error => {
          console.error('Error:', error);
          showAlert('An error occurred, please try again.');
      });
  } else {
      window.location.href = '../Valo_Login/login.html';
  }
}

//Load packages into the table
document.addEventListener('DOMContentLoaded', function() {
    const packagesContainer = document.getElementById('packagesContainer');
  
    function fetchPackages() {
      fetch('http://localhost:8080/packages')
        .then(response => response.json())
        .then(packages => {
          packagesContainer.innerHTML = ''; // Clear previous content
  
          packages.forEach(package => {
            // Create a div element for each package card
            const packageCard = document.createElement('div');
            packageCard.classList.add('package-card');
  
            // Populate package card with package information
            packageCard.innerHTML = `
              <div class="package-info">
                <h2>Package ${package.packageID}</h2>
                <p><strong>Weight:</strong> ${package.packageWeight} kg</p>
                <p><strong>Delivery Adress:</strong> ${package.deliveryAddress}</p>
              </div>
              
            `;
  
            // Append package card to packagesContainer
            packagesContainer.appendChild(packageCard);
          });
        })
        .catch(error => {
          console.error('Error fetching packages:', error);
        });
    }
  
    
  
    // Load packages when DOM content is loaded
    fetchPackages();
  });






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
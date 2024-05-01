
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
                `;     
                trucksTableBody.appendChild(row);

            });
        
        })
        .catch(error => {
           console.error('Error fetching trucks:', error)
        })
    
    }

    fetchTrucks();
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
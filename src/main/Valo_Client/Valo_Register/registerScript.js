

function registerButtonClick() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if (username.length < 3 || password.length < 3) {
        // Display alert message if username or password is too short
        alert('Username and password must be at least 3 characters long.');
        return; // Exit the function without attempting login
    }

    const loginData = {
        userName: username,
        password: password
    };

    fetch('http://localhost:8080/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (!response.ok) {
            // Server responded with an error status
            throw new Error('Error: ' + response.status);
        }
        return response.json(); // Parse response JSON
    })
    .then(data => {
        // Check if the response contains an error message indicating incorrect password
        if (data.error && data.error_description.includes('already exists')) {
            // Display alert for incorrect password
            alert('User already exists');
            return; // Exit the function without setting the token
        }
        

        // Alert success message (replace with your actual success handling)
        alert('Registration successful!');

        // Clear input fields after successful login
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';

        
        // Redirect to another page after login
        window.location.href = '../Valo_Login/login.html';
    })
    .catch(error => {
        console.error('Error:', error);

        // Display a generic error message for any other types of errors
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
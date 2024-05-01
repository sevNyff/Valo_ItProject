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

function loginButtonClick() {
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

    fetch('http://localhost:8080/users/login', {
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
        if (data.error && data.error_description.includes('Wrong password')) {
            // Display alert for incorrect password
            alert('Password or username is wrong. Please try again.');
            return; // Exit the function without setting the token
        }

        // Alert success message (replace with your actual success handling)
        alert('Login successful! Token saved.');

        // Clear input fields after successful login
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';

        // Store token and login status in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', username);
        localStorage.setItem('loginStatus', 'Logout');

        // Update login/register button text to 'Logout'
        document.getElementById('loginRegisterButton').textContent = 'Logout';

        // Redirect to another page after login
        // window.location.href = '../Valo_Home/home.html';
    })
    .catch(error => {
        console.error('Error:', error);

        // Display a generic error message for any other types of errors
        alert('An error occurred, please try again.');
    });
}

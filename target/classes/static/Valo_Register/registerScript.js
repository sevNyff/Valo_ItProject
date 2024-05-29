

function registerButtonClick() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    if (username.length < 3 || password.length < 3) {
        showAlert('Username and password must be at least 3 characters long.');
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
            throw new Error('Error: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        if (data.error && data.error_description.includes('already exists')) {
            showAlert('User already exists');
            return; // Exit the function without setting the token
        }
        
        showAlert('Registration successful!');

        document.getElementById('username').value = '';
        document.getElementById('password').value = '';

        window.location.href = '../Valo_Login/login.html';
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
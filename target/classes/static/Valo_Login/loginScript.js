

function loginButtonClick() {
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

    fetch('http://localhost:8080/users/login', {
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
        // Check if the response contains an error message indicating incorrect password
        if (data.error && data.error_description.includes('Wrong password')) {
            showAlert('Password or username is wrong. Please try again.');
            return; // Exit the function without setting the token
        }
        showAlert('Login successful! Token saved.');

        document.getElementById('username').value = '';
        document.getElementById('password').value = '';

        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', username);
        localStorage.setItem('loginStatus', 'Logout');

        document.getElementById('loginRegisterButton').textContent = 'Logout';

        window.location.href = '../Valo_Home/home.html';
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
document.getElementById('login-button').addEventListener('click', login);

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const result = await response.json();
    const messageDiv = document.getElementById('login-message');

    if (result.success) {
        localStorage.setItem('userRole', result.role); // Store user role in local storage
        window.location.href = 'index.html'; // Redirect to the main page
    } else {
        messageDiv.innerText = result.message; // Show error message
    }
}

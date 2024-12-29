document.getElementById('submitBtn').addEventListener('click', function(event) {
    event.preventDefault();
    let email = document.getElementById('logemail').value;
    let password = document.getElementById('logpass').value;

    if (email && password) {
        fetch('http://127.0.0.1:5000/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = 'inner.html';
            } else {
                alert('Enter correct credentials');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Something went wrong. Please try again.');
        });
    } else {
        alert('Please fill in both fields.');
    }
});

document.getElementById('register').addEventListener('click', function(event) {
    event.preventDefault();

    let name = document.getElementById('logname').value.trim();
    let email = document.getElementById('logemail1').value.trim();
    let password = document.getElementById('logpass1').value.trim();
    
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!name || !email || !password) {
        alert('Please fill in all fields.');
        return;
    }

    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Registration successful. Please log in.");
            window.location.href = 'index.html';
        } else {
            alert(data.message || 'Failed to register.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Something went wrong. Please try again.');
    });
});


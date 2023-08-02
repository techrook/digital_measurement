const form = document.getElementById('signup');
const userEmail = document.getElementById('email');
const userPassword = document.getElementById('password');
const error = document.getElementById('error');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  try {
    const userData = {
      email: userEmail.value,
      password: userPassword.value,
    };
    const response = await fetch('/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      body: JSON.stringify(userData),
    });
    if (response.status !== 201) {
      const data = await response.json();
      error.innerText = `Sign-up error: ${data.message}`; // Assuming the server sends the error message in a "message" field
      return; // Stop the execution here, so the href won't change
    }
    const data = await response.json();
    const token = data.token;

    localStorage.setItem('authToken', JSON.stringify(token));
    window.location.href = '/auth/verify-email'; // Change this URL to your verification page URL
  } catch (error) {
    error.innerText = `Sign-up error: ${error.message}`;
    console.error('Sign-up error:', error);
  }
});

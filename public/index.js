document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
  
    try {
      const response = await fetch('/auth/signup', {
        method: 'POST',
        body: formData,
      });
  
  
      const data = await response.json();
      const token = data.token;
  
      // Store the token securely (e.g., in localStorage)
      localStorage.setItem('authToken', token);
  
      // Redirect to the verification page
      window.location.href = '/auth/verify-email'; // Change this URL to your verification page URL
    } catch (error) {
      console.error('Sign-up error:', error);
      // Handle error (e.g., show an error message to the user)
    }
  });
  
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();

  // TODO: mock API call
});

document.getElementById('register-button').addEventListener('click', () => {
  window.location.href = 'src/pages/registration.html';
});

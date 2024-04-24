const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  window.location.href = 'src/pages/feed.html';

  // TODO: mock API call
});

const registrationButton = document.getElementById('register-button');
registrationButton.addEventListener('click', () => {
  window.location.href = 'src/pages/registration.html';
});

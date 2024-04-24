const signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  window.location.href = '../pages/feed.html';
  // TODO: mock API call
});

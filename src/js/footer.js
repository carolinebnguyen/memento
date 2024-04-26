const backButton = document.getElementById('back-button');
backButton.addEventListener('click', () => {
  window.history.back();
});

const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('contact-form').style.display = 'none';
  document.getElementById('success-message').style.display = 'block';
});

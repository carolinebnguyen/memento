const setUserLoggedIn = () => {
  localStorage.setItem('isLoggedIn', 'true');
};

const setUserLoggedOut = () => {
  localStorage.removeItem('isLoggedIn');
};

const isUserLoggedIn = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

export { setUserLoggedIn, setUserLoggedOut, isUserLoggedIn };

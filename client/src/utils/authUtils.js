import { mementoBackend } from './utils';

const signUpUser = async (user) => {
  const { username, password, email, name } = user;
  try {
    await mementoBackend.post('/auth/signup', {
      username,
      password,
      email,
      name,
    });
  } catch (error) {
    throw error;
  }
};

const logInUser = async (username, password) => {
  try {
    await mementoBackend.post('/auth/login', {
      username,
      password,
    });
    console.log(document.cookie);
  } catch (error) {
    throw error;
  }
};

const logOutUser = async () => {
  try {
    await mementoBackend.post('/auth/logout');
  } catch (error) {
    throw error;
  }
};

const setUserLoggedIn = () => {
  localStorage.setItem('isLoggedIn', 'true');
};

const setUserLoggedOut = () => {
  localStorage.removeItem('isLoggedIn');
};

const isUserLoggedIn = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

export {
  signUpUser,
  logInUser,
  logOutUser,
  setUserLoggedIn,
  setUserLoggedOut,
  isUserLoggedIn,
};

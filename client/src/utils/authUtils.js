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
  sessionStorage.setItem('isLoggedIn', 'true');
};

const setUserLoggedOut = () => {
  sessionStorage.removeItem('isLoggedIn');
};

const isUserLoggedIn = () => {
  return sessionStorage.getItem('isLoggedIn') === 'true';
};

const updatePassword = async (currentPassword, newPassword) => {
  try {
    await mementoBackend.put('/auth/password', {
      currentPassword,
      newPassword,
    });
  } catch (error) {
    throw error;
  }
};

export {
  signUpUser,
  logInUser,
  logOutUser,
  setUserLoggedIn,
  setUserLoggedOut,
  isUserLoggedIn,
  updatePassword,
};

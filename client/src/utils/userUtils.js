import { mementoBackend } from './utils';
import { jwtDecode } from 'jwt-decode';
import cookies from 'js-cookie';

const getCurrentUsername = async () => {
  const accessToken = cookies.get('accessToken');
  const decodedAccessToken = jwtDecode(accessToken);
  return decodedAccessToken.username;
};

const getCurrentUserProfile = async () => {
  const res = await mementoBackend.get('/user');
  const profile = res.data;
  return profile;
};

const getUserProfile = async (username) => {
  try {
    const res = await mementoBackend.get(`/user?username=${username}`);
    const profile = res.data;
    return profile;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

const updateProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    await mementoBackend.put('/user/picture', formData);
  } catch (error) {
    throw error;
  }
};

export {
  getCurrentUsername,
  getCurrentUserProfile,
  getUserProfile,
  updateProfilePicture,
};

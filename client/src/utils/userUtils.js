import { mementoBackend } from './utils';
import { jwtDecode } from 'jwt-decode';
import cookies from 'js-cookie';

const getCurrentUsername = async () => {
  const accessToken = cookies.get('accessToken');
  const decodedAccessToken = jwtDecode(accessToken);
  return decodedAccessToken.username;
};

const getCurrentUserProfile = async () => {
  const currentUsername = await getCurrentUsername();
  const res = await mementoBackend.get(`/users/${currentUsername}`);
  const profile = res.data;
  return profile;
};

const getCurrentUserInformation = async () => {
  try {
    const currentUsername = await getCurrentUsername();
    const currentUser = await getUserInformation(currentUsername);
    return currentUser;
  } catch (error) {
    throw error;
  }
};

const getUserProfile = async (username) => {
  try {
    const res = await mementoBackend.get(`/users/${username}`);
    const profile = res.data;
    return profile;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

const getUserInformation = async (username) => {
  if (typeof username !== 'string') {
    return username;
  }

  try {
    const res = await mementoBackend.get(`/users/${username}/info`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    const res = await mementoBackend.get('/users/');
    const users = res.data;
    return users;
  } catch (error) {
    throw error;
  }
};

const updateUserProfile = async (user) => {
  const { email, name, bio } = user;
  try {
    await mementoBackend.put('/users/account', { email, name, bio });
  } catch (error) {
    throw error;
  }
};

const updateProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    await mementoBackend.put('/users/picture', formData);
  } catch (error) {
    throw error;
  }
};

const followUser = async (username) => {
  try {
    await mementoBackend.put(`/users/${username}/follow`);
  } catch (error) {
    throw error;
  }
};

const unfollowUser = async (username) => {
  try {
    await mementoBackend.delete(`/users/${username}/follow`);
  } catch (error) {
    throw error;
  }
};

const checkIsFollowing = async (username) => {
  const { user } = await getCurrentUserProfile();
  const { following } = user || {};
  return (
    Array.isArray(following) &&
    following.some((follower) => follower.username === username)
  );
};

export {
  getCurrentUsername,
  getCurrentUserProfile,
  getCurrentUserInformation,
  getUserProfile,
  getUserInformation,
  getAllUsers,
  updateUserProfile,
  updateProfilePicture,
  followUser,
  unfollowUser,
  checkIsFollowing,
};

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
  const res = await mementoBackend.get(`/user/${currentUsername}`);
  const profile = res.data;
  return profile;
};

const getUserProfile = async (username) => {
  try {
    const res = await mementoBackend.get(`/user/${username}`);
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
  try {
    const res = await mementoBackend.get(`/user/${username}/info`);
    const profile = res.data;
    return profile;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

const getAllUserProfiles = async (usersList) => {
  try {
    const profilesPromises = usersList.map((username) =>
      getUserInformation(username)
    );
    const profiles = await Promise.all(profilesPromises);
    return profiles;
  } catch (error) {
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    const res = await mementoBackend.get('/user');
    const users = res.data;
    return users;
  } catch (error) {
    throw error;
  }
};

const updateUserProfile = async (user) => {
  const { email, name, bio } = user;
  try {
    await mementoBackend.put('/user/account', { email, name, bio });
  } catch (error) {
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

const followUser = async (username) => {
  try {
    await mementoBackend.put(`/user/${username}/follow`);
  } catch (error) {
    throw error;
  }
};

const unfollowUser = async (username) => {
  try {
    await mementoBackend.put(`/user/${username}/unfollow`);
  } catch (error) {
    throw error;
  }
};

const checkIsFollowing = async (username) => {
  const { user } = await getCurrentUserProfile();
  const { following } = user || {};
  return Array.isArray(following) && following.includes(username);
};

export {
  getCurrentUsername,
  getCurrentUserProfile,
  getUserProfile,
  getAllUserProfiles,
  getAllUsers,
  updateUserProfile,
  updateProfilePicture,
  followUser,
  unfollowUser,
  checkIsFollowing,
};

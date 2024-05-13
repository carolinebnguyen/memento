import { mementoBackend } from './utils';

const getCurrentUsername = async () => {
  const res = await mementoBackend.get('/user/current');
  const { username } = res.data;
  return username;
};

const getCurrentUserProfile = async () => {
  const res = await mementoBackend.get('/user');
  const profile = res.data;
  return profile;
};

export { getCurrentUsername, getCurrentUserProfile };

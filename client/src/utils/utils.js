import { formatDistanceToNowStrict } from 'date-fns';
import { format } from 'date-fns-tz';
import axios from 'axios';

import postNotFoundDog from '../assets/postNotFoundDog.jpg';
import userNotFoundDog from '../assets/userNotFoundDog.jpg';
import serverErrorCat from '../assets/serverErrorCat.jpg';

const mementoBackend = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

const formatDateDistanceToNow = (dateString) => {
  if (!dateString) {
    return '';
  }

  const dateToFormat = new Date(dateString);
  return formatDistanceToNowStrict(dateToFormat, {
    addSuffix: true,
  });
};

const formatDate = (dateString) => {
  if (!dateString) {
    return '';
  }

  const dateToFormat = new Date(dateString);
  return format(dateToFormat, 'PPPPPp (z)', {
    timeZone: 'America/Los_Angeles',
  });
};

/*
From stackoverflow: https://stackoverflow.com/a/19605207
- at least 8 characters
- at least 1 lowercase letter
- at least 1 uppercase letter
- at least 1 number
- at least 1 special character
*/
const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

const passwordErrorMessage =
  'Password requires: \n- at least 8 characters \n- at least 1 lowercase letter\n- at least 1 uppercase letter\n- at least 1 number \n- at least 1 special character';

const sortReverseChronologicalOrder = (a, b) =>
  new Date(b.postedAt) - new Date(a.postedAt);

const getFollowAction = (isFollowing) => {
  let action = 'follow';
  if (isFollowing) {
    action = 'unfollow';
  }
  return action;
};

const getLikeAction = (isLiked) => {
  let action = 'like';
  if (isLiked) {
    action = 'unlike';
  }
  return action;
};

const errorContentMap = {
  POST: {
    code: '404',
    statusReason: 'Post Not Found',
    errorMessage: `Oops! We couldn't find that post.`,
    imageSrc: postNotFoundDog,
    altText: 'Pomeranian with Santa hat',
    credits: 'RudyPongki',
  },
  USER: {
    code: '404',
    statusReason: 'User Not Found',
    errorMessage: `Oops! We couldn't find that user.`,
    imageSrc: userNotFoundDog,
    altText: 'Pomeranian with scarf',
    credits: 'RudyPongki',
  },
  SERVER: {
    code: '500',
    statusReason: 'Internal Server Error',
    errorMessage: `Oops! We're experiencing technical difficulties. Please try again later.`,
    imageSrc: serverErrorCat,
    altText: 'Cat with glasses sitting at laptop',
    credits: '',
  },
};

const getErrorContent = (errorType) => {
  return errorContentMap[errorType];
};

export {
  mementoBackend,
  formatDateDistanceToNow,
  formatDate,
  passwordRegex,
  passwordErrorMessage,
  sortReverseChronologicalOrder,
  getFollowAction,
  getLikeAction,
  getErrorContent,
};

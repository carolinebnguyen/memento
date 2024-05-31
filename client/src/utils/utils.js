import { formatDistanceToNowStrict } from 'date-fns';
import { format } from 'date-fns-tz';
import axios from 'axios';

import forbiddenDog from '../assets/forbiddenDog.png';
import postNotFoundDog from '../assets/postNotFoundDog.jpg';
import userNotFoundDog from '../assets/userNotFoundDog.jpg';
import conversationNotFoundDogs from '../assets/conversationNotFoundDogs.png';
import serverErrorCat from '../assets/serverErrorCat.jpg';
import notFoundDog from '../assets/notFoundDog.jpg';

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

const dateUnitToAbbreviationMap = {
  seconds: 's',
  minutes: 'm',
  hours: 'h',
  days: 'd',
  weeks: 'w',
  months: 'mo',
  years: 'y',
};

const getDateUnit = (unit, isSingular) => {
  let dateUnit = unit;
  if (isSingular) {
    dateUnit = `${unit}s`;
  }
  return dateUnitToAbbreviationMap[dateUnit];
};

const formatDateDistanceToNowShortened = (dateString) => {
  if (!dateString) {
    return '';
  }

  const distanceString = formatDistanceToNowStrict(dateString, {
    addSuffix: true,
  });

  const [num, unit] = distanceString.split(' ');
  const isSingular = parseInt(num) === 1;

  const abbreviatedUnit = getDateUnit(unit, isSingular);
  return `${num}${abbreviatedUnit}`;
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

const formatDateOnly = (dateString) => {
  if (!dateString) {
    return '';
  }

  const dateToFormat = new Date(dateString);
  return format(dateToFormat, 'iiii, MMMM do, yyyy', {
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
  FORBIDDEN: {
    code: '403',
    statusReason: 'Forbidden',
    errorMessage: `Sorry! You don't have access to this content.`,
    imageSrc: forbiddenDog,
    altText: 'Pomeranian with strawberry hat',
    credits: 'Mulshie',
    back: false,
  },
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
    back: true,
  },
  CONVERSATION: {
    code: '404',
    statusReason: 'Conversation Not Found',
    errorMessage: `Oops! We couldn't find that conversation.`,
    imageSrc: conversationNotFoundDogs,
    altText: 'Two Pomeranians lying side by side',
    credits: 'Mulshie',
    back: false,
  },
  SERVER: {
    code: '500',
    statusReason: 'Internal Server Error',
    errorMessage: `Oops! We're experiencing technical difficulties. Please try again later.`,
    imageSrc: serverErrorCat,
    altText: 'Cat with glasses sitting at laptop',
    credits: '',
    back: true,
  },
  NOT_FOUND: {
    code: '404',
    statusReason: 'Page Not Found',
    errorMessage: `Oops! We couldn't find that page.`,
    imageSrc: notFoundDog,
    altText: 'Pomeranian with Santa hat',
    credits: 'missyminzi',
    back: true,
  },
};

const getErrorContent = (errorType) => {
  return errorContentMap[errorType];
};

export {
  mementoBackend,
  formatDateDistanceToNow,
  formatDateDistanceToNowShortened,
  formatDate,
  formatDateOnly,
  passwordRegex,
  passwordErrorMessage,
  sortReverseChronologicalOrder,
  getFollowAction,
  getLikeAction,
  getErrorContent,
};

import { formatDistanceToNow } from 'date-fns';
import { format } from 'date-fns-tz';
import axios from 'axios';

const mementoBackend = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

const formatDateDistanceToNow = (dateString) => {
  if (!dateString) {
    return '';
  }

  const dateToFormat = new Date(dateString);
  return formatDistanceToNow(dateToFormat, {
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

const NotificationType = {
  LIKE: 'like',
  FOLLOW: 'follow',
  COMMENT: 'comment',
};

const notificationGroupToHeadingMap = {
  today: 'Today',
  thisWeek: 'This Week',
  thisMonth: 'This Month',
  earlier: 'Earlier',
};

const notificationTypeToMessageMap = {
  [NotificationType.LIKE]: 'liked your ',
  [NotificationType.FOLLOW]: 'started following you',
  [NotificationType.COMMENT]: 'commented on your ',
};

const getNotificationMessage = (notificationType) => {
  return notificationTypeToMessageMap[notificationType];
};

const PostType = {
  PHOTO: 'photo',
  STATUS: 'status',
  POST: 'post',
};

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

export {
  mementoBackend,
  formatDateDistanceToNow,
  formatDate,
  passwordRegex,
  passwordErrorMessage,
  NotificationType,
  notificationGroupToHeadingMap,
  getNotificationMessage,
  PostType,
  getFollowAction,
  getLikeAction,
};

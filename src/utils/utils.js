import { formatDistanceToNow } from 'date-fns';
import { format } from 'date-fns-tz';

const formatDateDistanceToNow = (dateToFormat) => {
  return formatDistanceToNow(dateToFormat, {
    addSuffix: true,
  });
};

const formatDate = (dateToFormat) => {
  return format(dateToFormat, 'PPPPPp (z)', {
    timeZone: 'America/Los_Angeles',
  });
};

/*
- at least 8 characters
- at least 1 lowercase letter
- at least 1 uppercase letter
- at least 1 number
- at least 1 special character
*/
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const passwordErrorMessage = `Password requires:
- at least 8 characters
- at least 1 lowercase letter
- at least 1 uppercase letter
- at least 1 number
- at least 1 special character`;

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
};

export {
  formatDateDistanceToNow,
  formatDate,
  passwordRegex,
  passwordErrorMessage,
  NotificationType,
  notificationGroupToHeadingMap,
  getNotificationMessage,
  PostType,
};

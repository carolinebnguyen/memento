import { mementoBackend } from './utils';
import {
  isToday,
  isWithinInterval,
  startOfToday,
  subWeeks,
  subMonths,
} from 'date-fns';

const sortReverseChronologicalOrder = (a, b) =>
  new Date(b.createdAt) - new Date(a.createdAt);

const groupNotificationsByDate = (notifications) => {
  const today = startOfToday();
  const oneWeekAgo = subWeeks(today, 1);
  const oneMonthAgo = subMonths(today, 1);

  const groupedNotifications = {
    today: [],
    thisWeek: [],
    thisMonth: [],
    earlier: [],
  };

  notifications.forEach((notification) => {
    const createdAt = new Date(notification.createdAt);
    if (isToday(createdAt)) {
      groupedNotifications.today.push(notification);
    } else if (isWithinInterval(createdAt, { start: oneWeekAgo, end: today })) {
      groupedNotifications.thisWeek.push(notification);
    } else if (
      isWithinInterval(createdAt, { start: oneMonthAgo, end: today })
    ) {
      groupedNotifications.thisMonth.push(notification);
    } else {
      groupedNotifications.earlier.push(notification);
    }
  });

  Object.keys(groupedNotifications).forEach((group) => {
    groupedNotifications[group].sort(sortReverseChronologicalOrder);
  });

  return groupedNotifications;
};

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

const getNotificationGroupHeading = (notificationGroup) => {
  return notificationGroupToHeadingMap[notificationGroup];
};

const notificationTypeToMessageMap = {
  [NotificationType.LIKE]: 'liked your ',
  [NotificationType.FOLLOW]: 'started following you',
  [NotificationType.COMMENT]: 'commented on your ',
};

const getNotificationMessage = (notificationType) => {
  return notificationTypeToMessageMap[notificationType];
};

const getNotifications = async () => {
  try {
    const res = await mementoBackend.get('/notifications');
    return res.data;
  } catch (error) {
    throw error;
  }
};

export {
  groupNotificationsByDate,
  getNotificationGroupHeading,
  getNotificationMessage,
  getNotifications,
};

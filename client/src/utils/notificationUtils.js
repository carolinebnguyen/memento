import { mementoBackend } from './utils';
import {
  isToday,
  isWithinInterval,
  startOfToday,
  subWeeks,
  subMonths,
} from 'date-fns';

const NotificationStatus = {
  READ: 'READ',
  UNREAD: 'UNREAD',
};

const sortNotificationsByStatus = (notifications) => {
  const unreadNotifications = [];
  const readNotifications = [];

  notifications.forEach((notification) => {
    if (notification.status === NotificationStatus.UNREAD) {
      unreadNotifications.push(JSON.parse(JSON.stringify(notification)));
    } else {
      readNotifications.push(JSON.parse(JSON.stringify(notification)));
    }
  });

  return {
    unreadNotifications,
    readNotifications,
  };
};

const sortReverseChronologicalOrder = (a, b) =>
  new Date(b.createdAt) - new Date(a.createdAt);

const groupNotificationsByDate = (notifications) => {
  const today = startOfToday();
  const oneWeekAgo = subWeeks(today, 1);
  const oneMonthAgo = subMonths(today, 1);

  const { unreadNotifications, readNotifications } =
    sortNotificationsByStatus(notifications);

  const groupedNotifications = {
    unread: unreadNotifications,
    today: [],
    thisWeek: [],
    thisMonth: [],
    earlier: [],
  };

  readNotifications.forEach((notification) => {
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

  const filteredGroups = Object.fromEntries(
    Object.entries(groupedNotifications).filter(
      ([group, notifications]) => notifications.length > 0
    )
  );

  return filteredGroups;
};

const NotificationType = {
  LIKE: 'like',
  FOLLOW: 'follow',
  COMMENT: 'comment',
};

const notificationGroupToHeadingMap = {
  unread: 'Unread',
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

const markNotificationsAsRead = async (notificationIds) => {
  try {
    await mementoBackend.put('/notifications/status', { notificationIds });
  } catch (error) {
    throw error;
  }
};

const filterUnreadNotifications = (notifications) => {
  return notifications
    .filter((notification) => notification.status === NotificationStatus.UNREAD)
    .map((notification) => notification.notificationId);
};

export {
  groupNotificationsByDate,
  getNotificationGroupHeading,
  getNotificationMessage,
  getNotifications,
  markNotificationsAsRead,
  filterUnreadNotifications,
};

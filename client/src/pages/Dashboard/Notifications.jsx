import React from 'react';
import { Box, Flex, Divider, Heading } from '@chakra-ui/react';
import {
  isToday,
  isWithinInterval,
  startOfToday,
  subWeeks,
  subMonths,
} from 'date-fns';
import NotificationGroup from '../../components/NotificationGroup';
import { notifications } from '../../utils/testData';

export default function Notifications() {
  const sortedNotifications = notifications
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt);

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

    sortedNotifications.forEach((notification) => {
      const createdAt = new Date(notification.createdAt);
      if (isToday(createdAt)) {
        groupedNotifications.today.push(notification);
      } else if (
        isWithinInterval(createdAt, { start: oneWeekAgo, end: today })
      ) {
        groupedNotifications.thisWeek.push(notification);
      } else if (
        isWithinInterval(createdAt, { start: oneMonthAgo, end: today })
      ) {
        groupedNotifications.thisMonth.push(notification);
      } else {
        groupedNotifications.earlier.push(notification);
      }
    });
    return groupedNotifications;
  };

  const groupedNotifications = groupNotificationsByDate(sortedNotifications);

  return (
    <Flex
      justify="center"
      align="center"
      w="100vw"
      direction="column"
      px={{ base: 5, sm: 0 }}
    >
      <Heading as="h1" size="lg" mb={5}>
        Notifications
      </Heading>
      {Object.entries(groupedNotifications).map(
        ([groupName, notifications], index, array) => (
          <Box key={groupName} w="100%">
            <NotificationGroup
              groupName={groupName}
              notifications={notifications}
            />
            {notifications.length > 0 && index !== array.length - 1 && (
              <Divider my={3} />
            )}
          </Box>
        )
      )}
    </Flex>
  );
}

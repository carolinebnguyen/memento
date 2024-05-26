import React, { useEffect, useState } from 'react';
import { Box, Flex, Divider, Heading, Text, Spinner } from '@chakra-ui/react';
import NotificationGroup from '../../components/NotificationGroup';
import {
  filterUnreadNotifications,
  getNotifications,
  groupNotificationsByDate,
  markNotificationsAsRead,
} from '../../utils/notificationUtils';
import ErrorComponent from '../../components/ErrorComponent';

export default function Notifications() {
  const [groupedNotifications, setGroupedNotifications] = useState([]);
  const [pageState, setPageState] = useState('LOADING');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notifications = await getNotifications();
        if (notifications && notifications.length > 0) {
          const notificationGroupsByDate =
            groupNotificationsByDate(notifications);
          setGroupedNotifications(notificationGroupsByDate);
        }
        const notificationIds = filterUnreadNotifications(notifications);
        if (notificationIds && notificationIds.length > 0) {
          await markNotificationsAsRead(notificationIds);
        }
        setPageState('DONE');
      } catch (error) {
        setPageState('ERROR');
      }
    };
    fetchNotifications();
  }, []);

  if (pageState === 'LOADING') {
    return (
      <Flex
        justify="center"
        align="center"
        direction="column"
        px={{ base: 5, sm: 0 }}
      >
        <Heading as="h1" size="lg" mb={5}>
          Notifications
        </Heading>
        <Spinner />
      </Flex>
    );
  } else if (pageState === 'ERROR') {
    return <ErrorComponent errorType="SERVER" />;
  }

  return (
    <Flex
      justify="center"
      align="center"
      direction="column"
      px={{ base: 5, sm: 0 }}
      w={{ base: '90vw', sm: '100vw' }}
    >
      <Heading as="h1" size="lg" mb={5}>
        Notifications
      </Heading>
      {Object.entries(groupedNotifications).length > 0 ? (
        Object.entries(groupedNotifications).map(
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
        )
      ) : (
        <Text>No notifications to display</Text>
      )}
    </Flex>
  );
}

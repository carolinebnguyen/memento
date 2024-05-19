import React from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';
import NotificationCard from '../components/NotificationCard';
import { getNotificationGroupHeading } from '../utils/notificationUtils';

export default function NotificationGroup({ groupName, notifications }) {
  return (
    <Flex justify="center" direction="column">
      {notifications.length > 0 ? (
        <>
          <Heading as="h2" size="md">
            {getNotificationGroupHeading(groupName)}
          </Heading>
          {notifications.map((notification) => (
            <Box key={notification.notificationId} w="100%">
              <NotificationCard notification={notification} />
            </Box>
          ))}
        </>
      ) : null}
    </Flex>
  );
}

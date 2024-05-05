import React from 'react';
import { Box, Flex, Heading } from '@chakra-ui/react';
import NotificationCard from '../components/NotificationCard';
import { notificationGroupToHeadingMap } from '../utils/utils';

export default function NotificationGroup({ groupName, notifications }) {
  return (
    <Flex justify="center" direction="column">
      {notifications.length > 0 ? (
        <>
          <Heading as="h2" size="md">
            {notificationGroupToHeadingMap[groupName]}
          </Heading>
          {notifications.map((notification, index, array) => (
            <Box key={notification.id} w="100%" my={3}>
              <NotificationCard notification={notification} />
            </Box>
          ))}
        </>
      ) : null}
    </Flex>
  );
}

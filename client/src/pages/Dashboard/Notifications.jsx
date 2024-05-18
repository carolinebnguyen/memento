import React from 'react';
import { Box, Flex, Divider, Heading, Text } from '@chakra-ui/react';
import NotificationGroup from '../../components/NotificationGroup';

export default function Notifications() {
  const groupedNotifications = [];

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

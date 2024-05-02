import React from 'react';
import { Flex, Divider, Text } from '@chakra-ui/react';
import StatusCard from './StatusCard';

export default function StatusTabContent({ user }) {
  const { username, picture, statuses } = user;

  return (
    <Flex direction="column" w="full">
      {statuses.length > 0 ? (
        statuses
          .slice()
          .reverse()
          .map((status, index, array) => (
            <>
              <StatusCard
                username={username}
                picture={picture}
                status={status}
              />
              {index !== array.length - 1 && <Divider my={3} />}
            </>
          ))
      ) : (
        <Text>No posts to display</Text>
      )}
    </Flex>
  );
}

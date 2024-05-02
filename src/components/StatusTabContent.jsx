import React from 'react';
import { Flex, Divider, Text, Box } from '@chakra-ui/react';
import StatusCard from './StatusCard';

export default function StatusTabContent({ profile }) {
  const { username, picture, statuses } = profile;

  return (
    <Flex direction="column" w="full">
      {statuses.length > 0 ? (
        statuses
          .slice()
          .reverse()
          .map((status, index, array) => (
            <Box key={status.id}>
              <StatusCard
                username={username}
                picture={picture}
                status={status}
              />
              {index !== array.length - 1 && <Divider my={3} />}
            </Box>
          ))
      ) : (
        <Text>No statuses to display</Text>
      )}
    </Flex>
  );
}

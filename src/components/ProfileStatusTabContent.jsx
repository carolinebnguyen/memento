import React from 'react';
import { Flex, Divider, Text, Box } from '@chakra-ui/react';
import StatusCard from './StatusCard';

export default function ProfileStatusTabContent({ profile }) {
  const { statuses } = profile;
  const sortedStatuses = statuses
    .slice()
    .sort((a, b) => b.postedAt - a.postedAt);

  return (
    <Flex direction="column" w="full">
      {sortedStatuses.length > 0 ? (
        sortedStatuses.map((status, index, array) => (
          <Box key={status.id}>
            <StatusCard status={status} />
            {index !== array.length - 1 && <Divider my={3} />}
          </Box>
        ))
      ) : (
        <Text>No statuses to display</Text>
      )}
    </Flex>
  );
}

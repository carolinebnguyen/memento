import React from 'react';
import { Flex, Divider, Text, Box } from '@chakra-ui/react';
import StatusCard from './StatusCard';

export default function HomeStatusTabContent({ statusList }) {
  return (
    <Flex direction="column" w="full">
      {statusList.length > 0 ? (
        statusList.map((status, index, array) => (
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

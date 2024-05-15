import React from 'react';
import { Flex, Divider, Text, Box } from '@chakra-ui/react';
import PostCard from './PostCard';

export default function ProfileStatusTabContent({ statuses }) {
  let sortedStatuses = [];
  if (statuses.length > 0) {
    sortedStatuses = statuses.slice().sort((a, b) => b.postedAt - a.postedAt);
  }

  return (
    <Flex direction="column" w="full">
      {sortedStatuses.length > 0 ? (
        sortedStatuses.map((status, index, array) => (
          <Box key={status.postId}>
            <PostCard post={status} />
            {index !== array.length - 1 && <Divider my={3} />}
          </Box>
        ))
      ) : (
        <Text>No statuses to display</Text>
      )}
    </Flex>
  );
}

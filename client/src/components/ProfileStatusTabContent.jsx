import React from 'react';
import { Flex, Divider, Text, Box } from '@chakra-ui/react';
import PostCard from './PostCard';

export default function ProfileStatusTabContent({ statuses, onDeleteStatus }) {
  return (
    <Flex direction="column" w="full">
      {statuses.length > 0 ? (
        statuses.map((status, index, array) => (
          <Box key={status.postId}>
            <PostCard post={status} removePost={onDeleteStatus} />
            {index !== array.length - 1 && <Divider my={3} />}
          </Box>
        ))
      ) : (
        <Text>No statuses to display</Text>
      )}
    </Flex>
  );
}

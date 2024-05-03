import React from 'react';
import { Flex, Divider, Text, Box } from '@chakra-ui/react';
import PostCard from './PostCard';

export default function HomePostTabContent({ postList, postType }) {
  return (
    <Flex direction="column" w="full">
      {postList.length > 0 ? (
        postList.map((post, index, array) => (
          <Box key={post.id}>
            <PostCard post={post} />
            {index !== array.length - 1 && <Divider my={3} />}
          </Box>
        ))
      ) : (
        <Text>No {postType}s to display</Text>
      )}
    </Flex>
  );
}

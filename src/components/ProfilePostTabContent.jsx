import React from 'react';
import { Text, Grid, Box, Flex } from '@chakra-ui/react';
import ProfilePostCard from './ProfilePostCard';

export default function ProfilePostTabContent({ profile }) {
  const { posts } = profile;

  return (
    <Flex justify="center">
      {posts.length > 0 ? (
        <Grid templateColumns="repeat(3, 1fr)" gap={2}>
          {posts
            .slice()
            .reverse()
            .map((post) => (
              <Box key={post.id}>
                <ProfilePostCard post={post} />
              </Box>
            ))}
        </Grid>
      ) : (
        <Text>No posts to display</Text>
      )}
    </Flex>
  );
}

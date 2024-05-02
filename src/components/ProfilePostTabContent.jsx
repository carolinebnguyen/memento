import React from 'react';
import { Text, Grid, Box } from '@chakra-ui/react';
import ProfilePostCard from './ProfilePostCard';

export default function ProfilePostTabContent({ user }) {
  const { posts } = user;

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={2}>
      {posts.length > 0 ? (
        posts
          .slice()
          .reverse()
          .map((post) => (
            <Box key={post.id}>
              <ProfilePostCard post={post} />
            </Box>
          ))
      ) : (
        <Text>No posts to display</Text>
      )}
    </Grid>
  );
}

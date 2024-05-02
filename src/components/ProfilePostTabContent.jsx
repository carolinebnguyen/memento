import React from 'react';
import { Text, Grid } from '@chakra-ui/react';
import ProfilePostCard from './ProfilePostCard';

export default function ProfilePostTabContent({ user }) {
  const { posts } = user;

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={2}>
      {posts.length > 0 ? (
        posts
          .slice()
          .reverse()
          .map((post) => <ProfilePostCard post={post} />)
      ) : (
        <Text>No posts to display</Text>
      )}
    </Grid>
  );
}

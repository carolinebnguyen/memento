import React from 'react';
import { Flex, Divider, Text, Box } from '@chakra-ui/react';
import PostCard from './PostCard';
import { PostType } from '../utils/utils';

export default function HomePostTabContent({ postList, postType }) {
  const getPluralForm = (postType) => {
    let suffix = 's';
    if (postType === PostType.STATUS) {
      suffix = 'es';
    }
    return `${postType}${suffix}`;
  };

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
        <Text>No {getPluralForm(postType)} to display</Text>
      )}
    </Flex>
  );
}

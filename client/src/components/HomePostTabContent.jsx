import React, { useCallback } from 'react';
import { Flex, Text, Box } from '@chakra-ui/react';
import PostCard from './PostCard';
import { PostType } from '../utils/utils';

export default function HomePostTabContent({
  postList,
  postType,
  onPostDelete,
}) {
  const removePostById = useCallback(
    (postId) => {
      onPostDelete(postId);
    },
    [onPostDelete]
  );

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
          <Box key={post.postId}>
            <PostCard
              post={post}
              hasDivider={index !== array.length - 1}
              removePost={removePostById}
            />
          </Box>
        ))
      ) : (
        <Text>No {getPluralForm(postType)} to display</Text>
      )}
    </Flex>
  );
}

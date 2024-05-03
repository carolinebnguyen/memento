import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { PostType } from '../utils/utils';
import PhotoCard from './PhotoCard';
import StatusCard from './StatusCard';
import CommentCard from './CommentCard';

export default function PostContent({ post }) {
  const { id, type, comments } = post;
  return (
    <Flex direction="column" justify="center" align="center" w="100%">
      {type === PostType.PHOTO ? (
        <PhotoCard photo={post} />
      ) : (
        <StatusCard status={post} />
      )}
      {comments.length > 0
        ? comments.map((comment, index) => (
            <Box key={id} w="full" mt={index === 0 ? 3 : 0}>
              <CommentCard comment={comment} />
            </Box>
          ))
        : null}
    </Flex>
  );
}

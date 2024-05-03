import React, { useState } from 'react';
import { Box, Divider, Flex } from '@chakra-ui/react';
import PostCard from './PostCard';
import CommentCard from './CommentCard';
import CommentField from './CommentField';

export default function PostContent({ post }) {
  const { id, postedBy, type, comments } = post;
  const [newComments, setNewComments] = useState([]);

  const handleAddComment = (comment) => {
    setNewComments((prevComments) => [...prevComments, comment]);
  };

  return (
    <Flex direction="column" justify="center" align="center" w="100%">
      <PostCard post={post} />
      <Divider my={3} />
      <CommentField addComment={handleAddComment} />
      {comments.length > 0
        ? comments.map((comment, index) => (
            <Box key={`${id}-${type}-${index}`} w="full">
              <CommentCard poster={postedBy} comment={comment} />
            </Box>
          ))
        : null}
      {newComments.length > 0
        ? newComments.map((comment, index) => (
            <Box key={`${id}-${type}-${index}`} w="full">
              <CommentCard poster={postedBy} comment={comment} />
            </Box>
          ))
        : null}
    </Flex>
  );
}

import React, { useEffect, useState } from 'react';
import { Box, Divider, Flex } from '@chakra-ui/react';
import PostCard from './PostCard';
import CommentCard from './CommentCard';
import CommentField from './CommentField';
import { getCurrentUserProfile } from '../utils/userUtils';

export default function PostContent({ post }) {
  const { postId, username, comments } = post;
  const [newComments, setNewComments] = useState(comments);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { user } = await getCurrentUserProfile();
      setCurrentUser(user);
    };
    fetchCurrentUser();
  }, []);

  const handleAddComment = (comment) => {
    setNewComments((prevComments) => [...prevComments, comment]);
  };

  return (
    <Flex direction="column" justify="center" align="center" w="100%">
      <PostCard post={post} />
      <Divider my={3} />
      <CommentField addComment={handleAddComment} currentUser={currentUser} />
      {newComments.length > 0
        ? newComments.map((comment, index) => (
            <Box key={`${postId}-${index}`} w="full">
              <CommentCard
                poster={username}
                comment={comment}
                currentUser={currentUser}
              />
            </Box>
          ))
        : null}
    </Flex>
  );
}

import React, { useCallback, useEffect, useState } from 'react';
import { Box, Divider, Flex } from '@chakra-ui/react';
import PostCard from './PostCard';
import CommentCard from './CommentCard';
import CommentField from './CommentField';
import { getCurrentUserProfile } from '../utils/userUtils';
import { sortComments } from '../utils/commentUtils';

export default function PostContent({ post, onRemovePost }) {
  const { postId, username, comments } = post;
  const [newComments, setNewComments] = useState(sortComments(comments) || []);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { user } = await getCurrentUserProfile();
      setCurrentUser(user);
    };
    fetchCurrentUser();
  }, []);

  const handleDeletePost = useCallback(
    (postId) => {
      onRemovePost('NOT_FOUND');
    },
    [onRemovePost]
  );

  const handleAddComment = useCallback((comment) => {
    setNewComments((prevComments) => [...prevComments, comment]);
  }, []);

  const handleDeleteComment = useCallback(
    (commentId) => {
      const updatedComments = newComments.filter(
        (comment) => comment.commentId !== commentId
      );
      setNewComments(updatedComments);
    },
    [newComments, setNewComments]
  );

  return (
    <Flex direction="column" justify="center" align="center" w="100%">
      <PostCard
        post={post}
        removePost={handleDeletePost}
        updatedCount={newComments.length}
      />
      <Divider my={3} />
      <CommentField
        postId={postId}
        poster={username}
        addComment={handleAddComment}
        currentUser={currentUser}
      />
      {newComments.length > 0
        ? newComments.map((comment, index) => (
            <Box key={comment.commentId} w="full">
              <CommentCard
                poster={username}
                comment={comment}
                currentUser={currentUser}
                handleDeleteComment={handleDeleteComment}
              />
            </Box>
          ))
        : null}
    </Flex>
  );
}

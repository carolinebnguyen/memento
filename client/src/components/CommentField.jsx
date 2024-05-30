import React, { useContext, useState } from 'react';
import {
  Flex,
  Textarea,
  Avatar,
  Stack,
  Button,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { postComment } from '../utils/commentUtils';
import { UserContext } from '../contexts/UserContext';

export default function CommentField({ postId, poster, addComment }) {
  const [commentText, setCommentText] = useState('');
  const { currentUser } = useContext(UserContext);
  const { username, picture } = currentUser;
  const toast = useToast();

  const handleSubmit = async () => {
    try {
      const commentId = await postComment(commentText, postId, poster);
      if (commentId && commentText.trim() !== '') {
        const newComment = {
          commentId: commentId,
          picture: picture,
          username: username,
          text: commentText.trim(),
          postedAt: new Date().toISOString(),
        };
        addComment(newComment);
        setCommentText('');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `An error occurred while attempting to comment`,
        status: 'error',
        duration: 3000,
        variant: 'subtle',
        position: 'top',
        containerStyle: {
          zIndex: '9999',
        },
      });
    }
  };

  const handleCancel = () => {
    setCommentText('');
  };

  return (
    <Flex w="100%" direction="row">
      <Stack w="full">
        <Stack direction="row" mb={1}>
          <Avatar size="sm" mr={2} src={picture} />
          <Textarea
            placeholder="Write a comment..."
            size="sm"
            borderRadius={5}
            rows="1"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
        </Stack>
        {commentText && (
          <HStack display="flex" justify="flex-end" mb={2}>
            <Button size="xs" onClick={handleCancel}>
              Cancel
            </Button>
            <Button size="xs" colorScheme="blue" onClick={handleSubmit}>
              Comment
            </Button>
          </HStack>
        )}
      </Stack>
    </Flex>
  );
}

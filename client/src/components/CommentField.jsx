import React, { useState } from 'react';
import {
  Flex,
  Textarea,
  Avatar,
  Stack,
  Button,
  HStack,
} from '@chakra-ui/react';

export default function CommentField({ addComment, currentUser }) {
  const [commentText, setCommentText] = useState('');
  const { username, picture } = currentUser;

  const handleSubmit = () => {
    if (commentText.trim() !== '') {
      const newComment = {
        username: username,
        text: commentText.trim(),
        postedAt: new Date().toISOString(),
      };
      addComment(newComment);
      setCommentText('');
    }
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
          <HStack display="flex" justify="flex-end">
            <Button size="xs">Cancel</Button>
            <Button size="xs" colorScheme="blue" onClick={handleSubmit}>
              Comment
            </Button>
          </HStack>
        )}
      </Stack>
    </Flex>
  );
}

import React, { useState } from 'react';
import { Flex, Textarea, Avatar } from '@chakra-ui/react';
import { carolineProfile } from '../utils/testData';

export default function CommentField({ addComment }) {
  const [commentText, setCommentText] = useState('');
  const { picture } = carolineProfile;

  const handleSubmit = () => {
    if (commentText.trim() !== '') {
      const newComment = {
        user: carolineProfile,
        content: commentText.trim(),
        postedAt: new Date().toISOString(),
      };
      addComment(newComment);
      setCommentText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit();
    }
  };

  return (
    <Flex mb={3} w="100%" direction="row">
      <Avatar size="sm" mr={2} src={picture} />
      <Textarea
        placeholder="Write a comment..."
        size="sm"
        borderRadius={5}
        rows="1"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </Flex>
  );
}

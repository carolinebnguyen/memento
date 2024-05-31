import React, { useEffect, useRef } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import MessageBubble from './MessageBubble';
import { groupMessagesByDate } from '../utils/messageUtils';
import { formatDateOnly } from '../utils/utils';

export default function ConversationContent({ conversation }) {
  const groupedMessages = groupMessagesByDate(conversation.messages);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [groupedMessages]);

  return (
    <Flex
      direction="column"
      maxH="100vh"
      w="100%"
      id="conversation-content"
      mb="60px"
    >
      {Object.entries(groupedMessages).map(([date, messages], index) => (
        <Box key={date}>
          <Box fontSize="sm" color="gray.500" textAlign="center" my={2}>
            {formatDateOnly(new Date(date))}
          </Box>
          {messages.map((message, index) => (
            <Box key={`${date}-${index}`}>
              <MessageBubble message={message} />
            </Box>
          ))}
        </Box>
      ))}
      <div ref={chatEndRef} />
    </Flex>
  );
}

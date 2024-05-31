import React from 'react';
import { Flex } from '@chakra-ui/react';
import MessageBubble from './MessageBubble';

export default function ConversationContent({ conversation }) {
  const { messages } = conversation;
  return (
    <Flex direction="column" maxH="100vh" w="100%">
      {messages.map((message, index) => (
        <MessageBubble key={index} message={message} />
      ))}
    </Flex>
  );
}

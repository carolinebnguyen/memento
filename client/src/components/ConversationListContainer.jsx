import React from 'react';
import { Box, Center, Flex } from '@chakra-ui/react';
import ConversationCard from './ConversationCard';

export default function ConversationListContainer({ conversations }) {
  return (
    <Flex direction="column" h="100%">
      {conversations.length > 0 ? (
        conversations.map((conversation) => (
          <Box key={conversation.conversationId}>
            <ConversationCard conversation={conversation} />
          </Box>
        ))
      ) : (
        <Center h="100%">No messages to display</Center>
      )}
    </Flex>
  );
}

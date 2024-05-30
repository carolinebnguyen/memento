import React, { useEffect, useState } from 'react';
import { Box, Center, Flex } from '@chakra-ui/react';
import ConversationCard from './ConversationCard';
import { getCurrentUsername } from '../utils/userUtils';

export default function ConversationListContainer({ conversations }) {
  const [currentUsername, setCurrentUsername] = useState('');

  useEffect(() => {
    const fetchCurrentUsername = async () => {
      const username = await getCurrentUsername();
      setCurrentUsername(username);
    };
    fetchCurrentUsername();
  }, []);

  return (
    <Flex direction="column" h="100%">
      {conversations.length > 0 ? (
        conversations.map((conversation) => (
          <Box key={conversation.conversationId}>
            <ConversationCard
              conversation={conversation}
              currentUsername={currentUsername}
            />
          </Box>
        ))
      ) : (
        <Center h="100%">No messages to display</Center>
      )}
    </Flex>
  );
}

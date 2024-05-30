import React, { useEffect, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import ConversationCard from './ConversationCard';
import { getCurrentUsername } from '../utils/userUtils';
import { HEADER_HEIGHT } from '../utils/constants';

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
    <Flex
      direction="column"
      mb={{ base: HEADER_HEIGHT, sm: 0 }}
      h={{ base: `calc(100% - ${HEADER_HEIGHT})`, sm: '100%' }}
    >
      {conversations.length > 0
        ? conversations.map((conversation) => (
            <Box key={conversation.conversationId} mb={2}>
              <ConversationCard
                conversation={conversation}
                currentUsername={currentUsername}
              />
            </Box>
          ))
        : null}
    </Flex>
  );
}

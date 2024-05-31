import React, { useContext } from 'react';
import { Box, Flex, Text, Tooltip } from '@chakra-ui/react';
import { UserContext } from '../contexts/UserContext';
import { formatDate } from '../utils/utils';

export default function MessageBubble({ message }) {
  const { currentUser } = useContext(UserContext);
  const { sender, text, timestamp } = message;
  const isOwnMessage = sender === currentUser.username;

  return (
    <Flex justify={isOwnMessage ? 'flex-end' : 'flex-start'} mb={1}>
      <Box
        bg={isOwnMessage ? 'blue.500' : 'gray.200'}
        color={isOwnMessage ? 'white' : 'black'}
        p={3}
        rounded="lg"
        maxW="50%"
      >
        <Tooltip
          label={formatDate(timestamp)}
          placement="bottom"
          openDelay={500}
        >
          <Text _hover={{ cursor: 'default' }}>{text}</Text>
        </Tooltip>
      </Box>
    </Flex>
  );
}

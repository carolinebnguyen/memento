import React from 'react';
import { Flex, Text, Avatar, HStack, Stack } from '@chakra-ui/react';
import { formatDateDistanceToNowShortened } from '../utils/utils';

export default function ConversationCard({ conversation, currentUsername }) {
  const { participants, lastMessage } = conversation;
  const { sender, text, timestamp } = lastMessage;
  const partner = participants.find(
    (participant) => participant.username !== currentUsername
  );

  return (
    <Flex
      justify="space-between"
      align="center"
      _hover={{ backgroundColor: '#cbebef;', cursor: 'pointer' }}
      p={3}
      borderRadius={10}
    >
      <HStack>
        <Avatar size="md" src={partner.picture} />
        <Stack direction="column" gap={0}>
          <Text as="b" noOfLines={1}>
            {partner.username}
          </Text>
          <HStack gap={1}>
            <Text fontSize="sm" color="gray" fontWeight={500} noOfLines={1}>
              {sender === currentUsername && 'You: '} {text}
            </Text>
            <Text fontSize="sm" whiteSpace="pre">
              •
            </Text>
            <Text fontSize="sm" color="gray" fontWeight={500} noOfLines={1}>
              {formatDateDistanceToNowShortened(timestamp)}
            </Text>
          </HStack>
        </Stack>
      </HStack>
    </Flex>
  );
}

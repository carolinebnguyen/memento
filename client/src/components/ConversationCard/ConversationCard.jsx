import React, { useContext } from 'react';
import { Flex, Text, Avatar, HStack, Stack } from '@chakra-ui/react';
import { formatDateDistanceToNowShortened } from '../../utils/utils';
import { NavLink, useParams } from 'react-router-dom';
import { ConversationContext } from '../../contexts/ConversationContext';
import { UserContext } from '../../contexts/UserContext';
import styles from './ConversationCard.module.css';

export default function ConversationCard({ conversation }) {
  const { setConversationId } = useContext(ConversationContext);
  const { currentUser } = useContext(UserContext);
  const { username: currentUsername } = currentUser;
  const { conversationId: convoId, participants, lastMessage } = conversation;
  const { sender, text, timestamp } = lastMessage;
  const partner = participants.find(
    (participant) => participant.username !== currentUsername
  );
  const { conversationId: conversationIdParams } = useParams();

  return (
    <NavLink
      to={`/messages/${convoId}`}
      onClick={() => setConversationId(convoId)}
    >
      <Flex
        justify="space-between"
        align="center"
        p={3}
        borderRadius={10}
        className={
          convoId === conversationIdParams
            ? styles['conversation-card-active']
            : styles['conversation-card']
        }
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
    </NavLink>
  );
}

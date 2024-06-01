import React, { useContext, useEffect, useState } from 'react';
import {
  Flex,
  Text,
  Avatar,
  HStack,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { formatDateDistanceToNowShortened } from '../../utils/utils';
import { NavLink, useParams } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import styles from './ConversationCard.module.css';
import { ConversationContext } from '../../contexts/ConversationContext';

export default function ConversationCard({ conversation }) {
  const { currentUser } = useContext(UserContext);
  const { currentConversationCard } = useContext(ConversationContext);
  const { username: currentUsername } = currentUser;
  const { conversationId, participants, lastMessage } = conversation;
  const partner = participants.find(
    (participant) => participant.username !== currentUsername
  );
  const { conversationId: conversationIdParams } = useParams();
  const isSmall = useBreakpointValue({ base: true, md: false });

  const isActive = conversationId === conversationIdParams;
  const [activeLastMessage, setActiveLastMessage] = useState(lastMessage);

  useEffect(() => {
    if (isActive) {
      setActiveLastMessage(currentConversationCard.lastMessage);
    }
  }, [conversationId, conversationIdParams, currentConversationCard, isActive]);

  useEffect(() => {
    if (isActive) {
      setActiveLastMessage(lastMessage);
    }
  }, [isActive, lastMessage]);

  const fullContent = (
    <HStack>
      <Avatar size="md" src={partner.picture} />
      <Stack direction="column" gap={0}>
        <Text as="b" noOfLines={1}>
          {partner.username}
        </Text>
        <HStack gap={1}>
          <Text fontSize="sm" color="gray" fontWeight={500} noOfLines={1}>
            {activeLastMessage.sender === currentUsername && 'You: '}{' '}
            {activeLastMessage.text}
          </Text>
          <Text fontSize="sm" whiteSpace="pre">
            •
          </Text>
          <Text fontSize="sm" color="gray" fontWeight={500}>
            {formatDateDistanceToNowShortened(activeLastMessage.timestamp)}
          </Text>
        </HStack>
      </Stack>
    </HStack>
  );

  const compactContent = <Avatar size="md" src={partner.picture} />;

  return (
    <NavLink to={`/messages/${conversationId}`}>
      <Flex
        justify={isSmall ? 'center' : 'space-between'}
        align="center"
        p={3}
        borderRadius={10}
        className={
          isActive
            ? styles['conversation-card-active']
            : styles['conversation-card']
        }
      >
        {isSmall ? compactContent : fullContent}
      </Flex>
    </NavLink>
  );
}

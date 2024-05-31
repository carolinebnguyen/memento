import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Center,
  Flex,
  Heading,
  Spinner,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { getConversationById } from '../utils/messageUtils';
import ErrorComponent from './ErrorComponent';
import CreateConversationModal from './CreateConversationModal';
import ConversationHeader from './ConversationHeader';
import { UserContext } from '../contexts/UserContext';
import {
  CONVERSATION_HEADER_HEIGHT,
  FULL_COMPACT_SIDEBAR_WIDTH,
  FULL_SIDEBAR_WIDTH,
} from '../utils/constants';
import { ConversationContext } from '../contexts/ConversationContext';

export default function ConversationContainer({ conversationId }) {
  const [conversation, setConversation] = useState({});
  const [partner, setPartner] = useState({});
  const [pageState, setPageState] = useState('LOADING');
  const [errorType, setErrorType] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentUser } = useContext(UserContext);
  const { selectedPartner } = useContext(ConversationContext);
  const { username: currentUsername } = currentUser;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!conversationId) {
          setPageState('NOT_SELECTED');
          return;
        } else if (conversationId === 'new') {
          setPageState('NEW_CHAT');
          return;
        }

        const conversation = await getConversationById(conversationId);

        if (!conversation && conversation === null) {
          setConversation(null);
          setPageState('NOT_FOUND');
          return;
        }

        const partner = conversation.participants.find(
          (participant) => participant.username !== currentUsername
        );
        setPartner(partner);

        setConversation(conversation);
        setPageState('DONE');
      } catch (error) {
        const errorStatus = error.response.status;
        switch (errorStatus) {
          case 403:
            setErrorType('FORBIDDEN');
            break;
          case 404:
            setErrorType('CONVERSATION');
            break;
          default:
            setErrorType('SERVER');
        }
        setPageState('ERROR');
      }
    };
    fetchPost();
  }, [conversationId, currentUsername]);

  if (pageState === 'LOADING') {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  } else if (pageState === 'ERROR') {
    return (
      <Center
        h="100vh"
        w={{
          base: `calc(100vw - ${FULL_COMPACT_SIDEBAR_WIDTH})`,
          md: `calc(100vw - ${FULL_SIDEBAR_WIDTH})`,
        }}
        ml={{ base: FULL_COMPACT_SIDEBAR_WIDTH, md: FULL_SIDEBAR_WIDTH }}
      >
        <ErrorComponent errorType={errorType} />
      </Center>
    );
  } else if (pageState === 'NOT_SELECTED') {
    return (
      <Center
        h="100vh"
        w={{
          base: `calc(100vw - ${FULL_COMPACT_SIDEBAR_WIDTH})`,
          md: `calc(100vw - ${FULL_SIDEBAR_WIDTH})`,
        }}
        ml={{ base: FULL_COMPACT_SIDEBAR_WIDTH, md: FULL_SIDEBAR_WIDTH }}
      >
        <VStack gap={3}>
          <Heading as="h2" size="md">
            Your Messages
          </Heading>
          <Text>Send a message to start a chat</Text>
          <Button colorScheme="blue" size="sm" onClick={onOpen}>
            Send message
          </Button>
          <CreateConversationModal isOpen={isOpen} onClose={onClose} />
        </VStack>
      </Center>
    );
  }

  return (
    <Flex
      direction="column"
      h="100%"
      w={{
        base: `calc(100vw - ${FULL_COMPACT_SIDEBAR_WIDTH})`,
        md: `calc(100vw - ${FULL_SIDEBAR_WIDTH})`,
      }}
      ml={{ base: FULL_COMPACT_SIDEBAR_WIDTH, md: FULL_SIDEBAR_WIDTH }}
    >
      <ConversationHeader
        partner={pageState === 'NEW_CHAT' ? selectedPartner : partner}
      />
      <Flex mt={CONVERSATION_HEADER_HEIGHT}>{conversation.participantKey}</Flex>
    </Flex>
  );
}

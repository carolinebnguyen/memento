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
  FULL_SIDEBAR_WIDTH,
} from '../utils/constants';

export default function ConversationContainer({ conversationId }) {
  const [conversation, setConversation] = useState({});
  const [partner, setPartner] = useState({});
  const [pageState, setPageState] = useState('LOADING');
  const [errorType, setErrorType] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentUser } = useContext(UserContext);
  const { username: currentUsername } = currentUser;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!conversationId) {
          setPageState('NOT_SELECTED');
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
    return <ErrorComponent errorType={errorType} />;
  } else if (pageState === 'NOT_SELECTED') {
    return (
      <Center
        h="100vh"
        w={{ sm: `calc(100vw - ${FULL_SIDEBAR_WIDTH})` }}
        ml={{ sm: FULL_SIDEBAR_WIDTH }}
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
      w={{ sm: `calc(100vw - ${FULL_SIDEBAR_WIDTH})` }}
      ml={{ sm: FULL_SIDEBAR_WIDTH }}
    >
      <ConversationHeader partner={partner} />
      <Flex mt={CONVERSATION_HEADER_HEIGHT}>{conversation.participantKey}</Flex>
    </Flex>
  );
}

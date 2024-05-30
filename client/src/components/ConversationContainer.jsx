import React, { useEffect, useState } from 'react';
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

export default function ConversationContainer({ conversationId }) {
  const [conversation, setConversation] = useState({});
  const [pageState, setPageState] = useState('LOADING');
  const [errorType, setErrorType] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!conversationId) {
          setPageState('NOT_SELECTED');
          return;
        }

        const res = await getConversationById(conversationId);

        if (!res && res === null) {
          setConversation(null);
          setPageState('NOT_FOUND');
          return;
        }

        setConversation(res);
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
  }, [conversationId]);

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
      <Center h="95vh">
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
    <Flex direction="column" h="100%">
      Conversation: {conversation.participantKey}
    </Flex>
  );
}

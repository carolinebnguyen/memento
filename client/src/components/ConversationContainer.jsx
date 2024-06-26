import React, { useContext, useEffect, useRef, useState } from 'react';
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
import {
  getConversationById,
  updateConversationListOrder,
} from '../utils/messageUtils';
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
import ConversationContent from './ConversationContent';
import { useNavigate } from 'react-router-dom';
import ChatInputField from './ChatInputField';

export default function ConversationContainer({ conversationId }) {
  const [conversation, setConversation] = useState({});
  const [partner, setPartner] = useState({});
  const [pageState, setPageState] = useState('LOADING');
  const [errorType, setErrorType] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentUser } = useContext(UserContext);
  const {
    currentConversationCard,
    setCurrentConversationCard,
    selectedPartner,
    conversationList,
    setConversationList,
  } = useContext(ConversationContext);
  const { username: currentUsername } = currentUser;
  const isExistingConversation = conversationId !== 'new';
  const navigate = useNavigate();
  const conversationWebSocket = useRef(null);

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        if (!conversationId) {
          setPageState('NOT_SELECTED');
          return;
        } else if (!isExistingConversation) {
          if (Object.keys(selectedPartner).length > 0) {
            setPageState('NEW_CHAT');
            setConversation({});
          } else {
            navigate('/messages');
          }
          return;
        }

        const conversation = await getConversationById(conversationId);
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
    fetchConversation();
  }, [
    conversationId,
    currentUsername,
    selectedPartner,
    navigate,
    isExistingConversation,
  ]);

  useEffect(() => {
    const subscribeToConversationId = (conversationId) => {
      const wsPort = window.location.hostname === 'localhost' ? ':9000' : '';
      const wsUrl = `ws://${window.location.hostname}${wsPort}/ws/conversations/subscribe/${conversationId}`;
      const ws = new WebSocket(wsUrl);
      ws.onopen = () => {
        conversationWebSocket.current = ws;
      };
      ws.onclose = () => {
        conversationWebSocket.current = null;
      };
      ws.onerror = (err) => {
        console.error(err);
      };
    };

    if (
      isExistingConversation &&
      conversationWebSocket.current?.url.split('/').at(-1) !== conversationId
    ) {
      conversationWebSocket.current?.close();
      subscribeToConversationId(conversationId);
    }

    if (conversationWebSocket.current) {
      conversationWebSocket.current.onmessage = ({ data }) => {
        const receivedMessage = JSON.parse(data);
        const updatedConversation = {
          ...conversation,
          messages: [...conversation.messages, receivedMessage],
        };
        setConversation(updatedConversation);
        setCurrentConversationCard({
          ...currentConversationCard,
          lastMessage: receivedMessage,
        });
        const updatedConversationList = updateConversationListOrder(
          conversationList,
          conversationId
        );
        setConversationList(updatedConversationList);
      };
    }
  }, [
    conversationId,
    conversation,
    currentConversationCard,
    setCurrentConversationCard,
    conversationList,
    setConversationList,
    isExistingConversation,
  ]);

  useEffect(() => {
    return () => {
      conversationWebSocket.current?.close();
    };
  }, [conversationId]);

  const handleSendMessage = (newMessage) => {
    const updatedConversation = {
      ...conversation,
      messages: [...conversation.messages, newMessage],
    };
    setConversation(updatedConversation);
  };

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
      {conversation && (
        <Flex mt={CONVERSATION_HEADER_HEIGHT} px={5}>
          <ConversationContent conversation={conversation} />
        </Flex>
      )}
      <ChatInputField onSendMessage={handleSendMessage} />
    </Flex>
  );
}

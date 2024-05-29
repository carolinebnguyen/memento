import React, { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  Center,
  Flex,
  Heading,
  IconButton,
  Spinner,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FaPenToSquare } from 'react-icons/fa6';
import { BsExclamationCircle } from 'react-icons/bs';
import { getAllConversations } from '../utils/messageUtils';
import {
  COMPACT_SIDEBAR_WIDTH,
  CONVERSATION_SIDEBAR_WIDTH,
} from '../utils/constants';
import ConversationContainer from './ConversationContainer';

export default function ConversationSidebar() {
  const [conversations, setConversations] = useState([]);
  const [pageState, setPageState] = useState('LOADING');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const conversations = await getAllConversations();
        setConversations(conversations);
        setPageState('DONE');
      } catch (error) {
        setPageState('ERROR');
      }
    };
    fetchConversations();
  }, []);

  if (pageState === 'LOADING') {
    return (
      <Flex
        direction="column"
        h="100%"
        ml={COMPACT_SIDEBAR_WIDTH}
        w={{ base: '100vw', sm: CONVERSATION_SIDEBAR_WIDTH }}
        position="fixed"
      >
        <Center p={20}>
          <Spinner />
        </Center>
      </Flex>
    );
  } else if (pageState === 'ERROR') {
    return (
      <Flex
        direction="column"
        h="100%"
        ml={COMPACT_SIDEBAR_WIDTH}
        w={{ base: '100vw', sm: CONVERSATION_SIDEBAR_WIDTH }}
        position="fixed"
      >
        <Card h="100vh">
          <CardBody>
            <Heading as="h1" size="lg" mb={2} p={2}>
              Messages
            </Heading>
            <VStack>
              <BsExclamationCircle size="50px" />
              <Text p={2}>Unable to load conversations</Text>
            </VStack>
          </CardBody>
        </Card>
      </Flex>
    );
  }

  return (
    <Flex
      direction="column"
      h="100%"
      ml={COMPACT_SIDEBAR_WIDTH}
      w={{
        base: `calc(100vw - ${COMPACT_SIDEBAR_WIDTH})`,
        sm: '300px',
        md: CONVERSATION_SIDEBAR_WIDTH,
      }}
      position="fixed"
    >
      <Card h="100vh">
        <CardBody>
          <Stack direction="row" align="center" justify="space-between">
            <Heading as="h1" size="lg" mb={2} p={2}>
              Messages
            </Heading>
            <IconButton icon={<FaPenToSquare />} isRound={true} />
          </Stack>
          <ConversationContainer conversations={conversations} />
        </CardBody>
      </Card>
    </Flex>
  );
}

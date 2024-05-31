import React, { useContext } from 'react';
import {
  Card,
  Flex,
  Heading,
  IconButton,
  Stack,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { FaPenToSquare } from 'react-icons/fa6';
import {
  COMPACT_CONVERSATION_SIDEBAR_WIDTH,
  COMPACT_SIDEBAR_WIDTH,
  CONVERSATION_SIDEBAR_WIDTH,
} from '../utils/constants';
import ConversationListContainer from './ConversationListContainer';
import CreateConversationModal from './CreateConversationModal';
import { ConversationContext } from '../contexts/ConversationContext';

export default function ConversationSidebar() {
  const { conversationList } = useContext(ConversationContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isWide = useBreakpointValue({ md: true });

  return (
    <Flex
      direction="column"
      h="100vh"
      ml={COMPACT_SIDEBAR_WIDTH}
      w={{
        base: COMPACT_CONVERSATION_SIDEBAR_WIDTH,
        md: CONVERSATION_SIDEBAR_WIDTH,
      }}
      position="fixed"
    >
      <Card h="100vh" p={5}>
        <Stack
          direction="row"
          align="center"
          justify={isWide ? 'space-between' : 'center'}
          mb={5}
        >
          {isWide && (
            <Heading as="h1" size="lg">
              Messages
            </Heading>
          )}
          <IconButton
            icon={<FaPenToSquare />}
            isRound={true}
            onClick={onOpen}
          />
          <CreateConversationModal isOpen={isOpen} onClose={onClose} />
        </Stack>
        <ConversationListContainer conversations={conversationList} />
      </Card>
    </Flex>
  );
}

import React, { useContext } from 'react';
import {
  Card,
  CardBody,
  Flex,
  Heading,
  IconButton,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { FaPenToSquare } from 'react-icons/fa6';
import {
  COMPACT_SIDEBAR_WIDTH,
  CONVERSATION_SIDEBAR_WIDTH,
} from '../utils/constants';
import ConversationListContainer from './ConversationListContainer';
import CreateConversationModal from './CreateConversationModal';
import { ConversationContext } from '../contexts/ConversationContext';

export default function ConversationSidebar() {
  const { conversationList } = useContext(ConversationContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
            <IconButton
              icon={<FaPenToSquare />}
              isRound={true}
              onClick={onOpen}
            />
            <CreateConversationModal isOpen={isOpen} onClose={onClose} />
          </Stack>
          <ConversationListContainer conversations={conversationList} />
        </CardBody>
      </Card>
    </Flex>
  );
}

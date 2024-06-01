import React, { useContext, useEffect, useState } from 'react';
import { Flex, Spinner, Center, Stack } from '@chakra-ui/react';
import ErrorComponent from '../../components/ErrorComponent';
import CompactSidebar from '../../components/CompactSidebar';
import ConversationSidebar from '../../components/ConversationSidebar';
import ConversationContainer from '../../components/ConversationContainer';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { getCurrentUserInformation } from '../../utils/userUtils';
import { getAllConversations } from '../../utils/messageUtils';
import { ConversationContext } from '../../contexts/ConversationContext';

export default function Messages() {
  const [pageState, setPageState] = useState('LOADING');
  const { setCurrentUser } = useContext(UserContext);
  const { setConversationList, setCurrentConversationCard } =
    useContext(ConversationContext);
  const { conversationId } = useParams();

  useEffect(() => {
    const configureContext = async () => {
      try {
        const user = await getCurrentUserInformation();
        setCurrentUser(user);
        const conversations = await getAllConversations();
        if (conversationId) {
          const selectedConversation = conversations.find(
            (conversation) => conversation.conversationId === conversationId
          );
          setCurrentConversationCard(selectedConversation);
        }
        setConversationList(conversations);
        setPageState('DONE');
      } catch (error) {
        setPageState('ERROR');
      }
    };
    configureContext();
  }, [
    setCurrentUser,
    conversationId,
    setConversationList,
    setCurrentConversationCard,
  ]);

  if (pageState === 'LOADING') {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  } else if (pageState === 'ERROR') {
    return (
      <>
        <CompactSidebar />
        <ErrorComponent errorType="SERVER" />
      </>
    );
  }

  return (
    <>
      <Stack>
        <CompactSidebar />
        <ConversationSidebar />
      </Stack>
      <Flex justify="center" align="center">
        <ConversationContainer conversationId={conversationId} />
      </Flex>
    </>
  );
}

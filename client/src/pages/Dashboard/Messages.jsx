import React, { useEffect, useState } from 'react';
import { Flex, Spinner, Center, Stack } from '@chakra-ui/react';
import ErrorComponent from '../../components/ErrorComponent';
import CompactSidebar from '../../components/CompactSidebar';
import ConversationSidebar from '../../components/ConversationSidebar';
import { FULL_SIDEBAR_WIDTH } from '../../utils/constants';
import { getCurrentUserProfile } from '../../utils/userUtils';
import ConversationContainer from '../../components/ConversationContainer';
import { useParams } from 'react-router-dom';

export default function Messages() {
  const [pageState, setPageState] = useState('LOADING');
  const [currentUser, setCurrentUser] = useState({});
  const { conversationId } = useParams();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { user } = await getCurrentUserProfile();
        setCurrentUser(user);
        setPageState('DONE');
      } catch (error) {
        setPageState('ERROR');
      }
    };
    fetchCurrentUser();
  }, []);

  if (pageState === 'LOADING') {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  } else if (pageState === 'ERROR') {
    return (
      <>
        <CompactSidebar currentUser={currentUser} />
        <ErrorComponent errorType="SERVER" />
      </>
    );
  }

  return (
    <>
      <Stack>
        <CompactSidebar currentUser={currentUser} />
        <ConversationSidebar />
      </Stack>
      <Flex justify="center" align="center">
        <Flex
          px={16}
          py={8}
          ml={{ base: 0, sm: FULL_SIDEBAR_WIDTH }}
          maxW={{ sm: '80vw', md: '60vw', xl: '50vw' }}
        >
          <ConversationContainer conversationId={conversationId} />
        </Flex>
      </Flex>
    </>
  );
}

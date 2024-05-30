import React, { useContext, useEffect, useState } from 'react';
import { Flex, Spinner, Center, Stack } from '@chakra-ui/react';
import ErrorComponent from '../../components/ErrorComponent';
import CompactSidebar from '../../components/CompactSidebar';
import ConversationSidebar from '../../components/ConversationSidebar';
import { FULL_SIDEBAR_WIDTH } from '../../utils/constants';
import ConversationContainer from '../../components/ConversationContainer';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { getCurrentUserInformation } from '../../utils/userUtils';

export default function Messages() {
  const [pageState, setPageState] = useState('LOADING');
  const { setCurrentUser } = useContext(UserContext);
  const { conversationId } = useParams();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUserInformation();
        setCurrentUser(user);
        setPageState('DONE');
      } catch (error) {
        setPageState('ERROR');
      }
    };
    fetchCurrentUser();
  }, [setCurrentUser]);

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

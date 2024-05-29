import React, { useEffect, useState } from 'react';
import { Flex, Spinner, Center, Text, Stack } from '@chakra-ui/react';
import ErrorComponent from '../../components/ErrorComponent';
import CompactSidebar from '../../components/CompactSidebar';
import ConversationSidebar from '../../components/ConversationSidebar';
import { FULL_SIDEBAR_WIDTH, HEADER_HEIGHT } from '../../utils/constants';
import { getCurrentUserProfile } from '../../utils/userUtils';

export default function Messages() {
  const [pageState, setPageState] = useState('LOADING');
  const [currentUser, setCurrentUser] = useState({});

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
          my={{ base: HEADER_HEIGHT, sm: 0 }}
          maxW={{ sm: '80vw', md: '60vw', xl: '50vw' }}
        >
          <Text>Hello</Text>
        </Flex>
      </Flex>
    </>
  );
}

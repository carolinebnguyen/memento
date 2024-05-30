import React, { useContext, useEffect } from 'react';
import { Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import {
  HEADER_HEIGHT,
  SIDEBAR_WIDTH,
  COMPACT_SIDEBAR_WIDTH,
} from '../../utils/constants';
import { getCurrentUserInformation } from '../../utils/userUtils';
import { UserContext } from '../../contexts/UserContext';

export default function DashboardLayout() {
  const { setCurrentUser } = useContext(UserContext);
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUserInformation();
        setCurrentUser(user);
      } catch (error) {
        return;
      }
    };
    fetchCurrentUser();
  }, [setCurrentUser]);

  return (
    <>
      <Sidebar />
      <Flex justify="center" align="center">
        <Flex
          px={{ base: 4, sm: 16 }}
          py={{ base: 4, sm: 8 }}
          ml={{ base: 0, sm: COMPACT_SIDEBAR_WIDTH, md: SIDEBAR_WIDTH }}
          my={{ base: HEADER_HEIGHT, sm: 0 }}
          maxW={{ sm: '80vw', md: '60vw', xl: '50vw' }}
        >
          <Outlet />
        </Flex>
      </Flex>
    </>
  );
}

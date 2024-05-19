import React, { useEffect, useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import {
  headerHeight,
  sidebarWidth,
  compactSidebarWidth,
} from '../../utils/constants';
import { getCurrentUserProfile } from '../../utils/userUtils';

export default function DashboardLayout() {
  const [currentUser, setCurrentUser] = useState({});
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { user } = await getCurrentUserProfile();
        setCurrentUser(user);
      } catch (error) {
        return;
      }
    };
    fetchCurrentUser();
  }, []);

  return (
    <>
      <Sidebar currentUser={currentUser} />
      <Flex justify="center" align="center">
        <Flex
          px={{ base: 4, sm: 16 }}
          py={8}
          ml={{ base: 0, sm: compactSidebarWidth, md: sidebarWidth }}
          my={{ base: headerHeight, sm: 0 }}
          maxW={{ sm: '80vw', md: '60vw', xl: '50vw' }}
        >
          <Outlet />
        </Flex>
      </Flex>
    </>
  );
}

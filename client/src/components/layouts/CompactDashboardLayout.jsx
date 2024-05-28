import React, { useEffect, useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { compactSidebarWidth, headerHeight } from '../../utils/constants';
import CompactSidebar from '../CompactSidebar';
import { getCurrentUserProfile } from '../../utils/userUtils';

export default function CompactDashboardLayout() {
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
      <CompactSidebar currentUser={currentUser} />
      <Flex justify="center" align="center">
        <Flex
          px={16}
          py={8}
          ml={{ base: 0, sm: compactSidebarWidth }}
          my={{ base: headerHeight, sm: 0 }}
          maxW={{ sm: '80vw', md: '60vw', xl: '50vw' }}
        >
          <Outlet />
        </Flex>
      </Flex>
    </>
  );
}

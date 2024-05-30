import React, { useContext, useEffect } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { UserContext } from '../../contexts/UserContext';
import { getCurrentUserInformation } from '../../utils/userUtils';

export default function FooterLayout() {
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
    <Flex direction="column" justify="center" align="center" h="100%">
      <Navbar />
      <Box>
        <Outlet />
      </Box>
      <>
        <Box h="35px" />
        <Footer />
      </>
    </Flex>
  );
}

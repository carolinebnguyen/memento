import React from 'react';
import { Flex, Box, useBreakpointValue } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';

export default function FooterLayout() {
  const showFooter = useBreakpointValue({ base: false, md: true });
  return (
    <Flex direction="column" justify="center" align="center" h="100%">
      <Navbar />
      <Box>
        <Outlet />
      </Box>
      {showFooter ? (
        <>
          <Box h="35px" />
          <Footer />
        </>
      ) : null}
    </Flex>
  );
}

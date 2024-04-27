import React from 'react';
import { Flex, Box, useBreakpointValue } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';

export default function FooterLayout() {
  const hideFooter = useBreakpointValue({ base: true, sm: true, md: false });
  return (
    <Flex direction="column" justify="center" align="center">
      <Navbar />
      <Box>
        <Outlet />
      </Box>
      {!hideFooter && <Footer />}
    </Flex>
  );
}

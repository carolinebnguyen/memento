import React from 'react';
import { Flex, Box, useBreakpointValue } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer';

export default function LandingLayout() {
  const hideFooter = useBreakpointValue({ base: true, sm: true, md: false });
  return (
    <Flex direction="column" justify="center" align="center">
      <Box>
        <Outlet />
      </Box>
      {!hideFooter && <Footer />}
    </Flex>
  );
}

import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <Flex>
      <Sidebar />
      <Box p={4}>
        <Outlet />
      </Box>
    </Flex>
  );
}

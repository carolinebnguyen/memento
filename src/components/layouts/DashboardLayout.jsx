import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';

export default function DashboardLayout() {
  return (
    <Flex>
      <Sidebar />
      <Box p={4}>
        <Outlet />
      </Box>
    </Flex>
  );
}

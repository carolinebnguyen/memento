import React from 'react';
import { Box, Flex, Stack } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header';

export default function DashboardLayout() {
  return (
    <Flex>
      <Sidebar />
      <Stack>
        <Header />
        <Box p={4}>
          <Outlet />
        </Box>
      </Stack>
    </Flex>
  );
}

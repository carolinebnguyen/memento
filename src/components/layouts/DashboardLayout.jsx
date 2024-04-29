import React from 'react';
import { Box, Flex, Stack } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import { headerHeight, sidebarWidth } from '../../utils/constants';

export default function DashboardLayout() {
  return (
    <Flex>
      <Sidebar />
      <Stack>
        <Box
          px={16}
          py={8}
          ml={{ base: 0, sm: 5, md: sidebarWidth }}
          my={{ base: headerHeight, sm: 0 }}
        >
          <Outlet />
        </Box>
      </Stack>
    </Flex>
  );
}

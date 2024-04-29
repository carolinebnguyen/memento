import React from 'react';
import { Box, Flex, Stack, useBreakpointValue } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import { sidebarWidth } from '../../utils/constants';

export default function DashboardLayout() {
  const isWide = useBreakpointValue({ base: false, md: true });
  return (
    <Flex>
      <Sidebar />
      <Stack>
        <Box px={16} py={8} ml={isWide ? sidebarWidth : 0}>
          <Outlet />
        </Box>
      </Stack>
    </Flex>
  );
}

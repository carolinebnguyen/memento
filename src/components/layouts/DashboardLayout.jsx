import React from 'react';
import { Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import {
  headerHeight,
  sidebarWidth,
  compactSidebarWidth,
} from '../../utils/constants';

export default function DashboardLayout() {
  return (
    <>
      <Sidebar />
      <Flex justify="center" align="center">
        <Flex
          px={{ base: 4, sm: 16 }}
          py={8}
          ml={{ base: 0, sm: compactSidebarWidth, md: sidebarWidth }}
          my={{ base: headerHeight, sm: 0 }}
          maxW={{ md: '60vw', xl: '50vw' }}
        >
          <Outlet />
        </Flex>
      </Flex>
    </>
  );
}

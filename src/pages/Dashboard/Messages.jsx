import React from 'react';
import { Flex } from '@chakra-ui/react';
import CompactSidebar from '../../components/CompactSidebar';
import {
  headerHeight,
  sidebarWidth,
  compactSidebarWidth,
} from '../../utils/constants';

export default function Messages() {
  return (
    <>
      <CompactSidebar />
      <Flex justify="center" align="center">
        <Flex
          px={16}
          py={8}
          ml={{ base: 0, sm: compactSidebarWidth, md: sidebarWidth }}
          my={{ base: headerHeight, sm: 0 }}
          maxW={{ md: '60vw', xl: '50vw' }}
        >
          Messages
        </Flex>
      </Flex>
    </>
  );
}

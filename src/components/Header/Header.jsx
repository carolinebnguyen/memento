import React from 'react';
import { Flex, Image, useBreakpointValue } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

import { headerHeight, sidebarWidth } from '../../utils/constants';
import logo from '../../assets/logoBlack.png';

export default function Header() {
  const isWide = useBreakpointValue({ base: false, md: true });

  return (
    <Flex
      as="header"
      align="center"
      justify="center"
      w={isWide ? `calc(100vw - ${sidebarWidth})` : `full`}
      px={5}
      borderBottomWidth="1px"
      borderColor="blackAlpha.300"
      h={headerHeight}
      ml={isWide ? sidebarWidth : 0}
      position="fixed"
      bgColor="white"
    >
      <NavLink to="/">
        <Image src={logo} boxSize={24} objectFit="contain" />
      </NavLink>
    </Flex>
  );
}

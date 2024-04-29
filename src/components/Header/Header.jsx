import React from 'react';
import { Flex, Image, useBreakpointValue, Icon } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { headerHeight, sidebarWidth } from '../../utils/constants';
import { FaRegBell, FaBell } from 'react-icons/fa';
import logo from '../../assets/logoBlack.png';

export default function Header() {
  const isWide = useBreakpointValue({ base: false, md: true });

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      w={isWide ? `calc(100vw - ${sidebarWidth})` : `full`}
      px={5}
      borderBottomWidth="1px"
      borderColor="blackAlpha.300"
      h={headerHeight}
      ml={isWide ? sidebarWidth : 0}
      position="fixed"
      bgColor="white"
    >
      <NavLink to="/home">
        <Image src={logo} boxSize={24} objectFit="contain" />
      </NavLink>
      <NavLink to="/notifications">
        {({ isActive }) => (
          <Icon as={isActive ? FaBell : FaRegBell} boxSize={22} />
        )}
      </NavLink>
    </Flex>
  );
}

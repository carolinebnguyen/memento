import React from 'react';
import { Flex, Image, useBreakpointValue } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { HEADER_HEIGHT, SIDEBAR_WIDTH } from '../../utils/constants';
import { FaRegBell, FaBell } from 'react-icons/fa';

import logo from '../../assets/logoBlack.png';
import { CompactIconButton } from '../CompactNavLink/CompactNavLink';

export default function Header() {
  const isWide = useBreakpointValue({ base: false, md: true });

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      w={isWide ? `calc(100vw - ${SIDEBAR_WIDTH})` : `full`}
      px={5}
      borderBottomWidth="1px"
      borderColor="blackAlpha.300"
      h={HEADER_HEIGHT}
      ml={isWide ? SIDEBAR_WIDTH : 0}
      position="fixed"
      bgColor="white"
    >
      <NavLink to="/home">
        <Image src={logo} boxSize={24} objectFit="contain" />
      </NavLink>
      <CompactIconButton
        to="/notifications"
        icon={FaRegBell}
        filledIcon={FaBell}
      />
    </Flex>
  );
}

import React from 'react';
import { Flex, Image, Stack, Divider } from '@chakra-ui/react';
import {
  MdOutlineHome,
  MdHome,
  MdOutlineSearch,
  MdOutlineMail,
  MdMail,
  MdLogout,
  MdOutlineSettings,
  MdSettings,
} from 'react-icons/md';
import { FaRegBell, FaBell, FaRegUser, FaUser, FaSearch } from 'react-icons/fa';
import { FiPlusCircle } from 'react-icons/fi';
import { AiFillPlusCircle } from 'react-icons/ai';
import { NavLink } from 'react-router-dom';
import { compactSidebarWidth } from '../utils/constants';
import FooterMenu from './FooterMenu/FooterMenu';
import logoLetter from '../assets/mementoLetter.png';
import { CompactNavLink } from './CompactNavLink/CompactNavLink';

export default function CompactSidebar() {
  return (
    <>
      <Flex
        direction="column"
        boxShadow="md"
        w={compactSidebarWidth}
        zIndex="9999"
      >
        <NavLink to="/home">
          <Image src={logoLetter} alt="Letter M" mb={5} p={3} />
        </NavLink>
        <Divider />
        <CompactSidebarContent />
      </Flex>
    </>
  );
}

function CompactSidebarContent() {
  return (
    <>
      <Flex direction="column" justify="space-between" h="100%">
        <Stack gap={5} mt={5} p={3}>
          <CompactNavLink to="/home" icon={MdOutlineHome} filledIcon={MdHome} />
          <CompactNavLink
            to="/search"
            icon={MdOutlineSearch}
            filledIcon={FaSearch}
          />
          <CompactNavLink
            to="/create"
            icon={FiPlusCircle}
            filledIcon={AiFillPlusCircle}
          />
          <CompactNavLink
            to="/messages"
            icon={MdOutlineMail}
            filledIcon={MdMail}
          />
          <CompactNavLink
            to="/notifications"
            icon={FaRegBell}
            filledIcon={FaBell}
          />
          <CompactNavLink to="/profile" icon={FaRegUser} filledIcon={FaUser} />
          <Divider />
          <CompactNavLink
            to="/settings"
            icon={MdOutlineSettings}
            filledIcon={MdSettings}
          />
          <CompactNavLink to="/" icon={MdLogout} />
        </Stack>
        <FooterMenu />
      </Flex>
    </>
  );
}

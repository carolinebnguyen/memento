import React, { useContext } from 'react';
import { Flex, Image, Stack, Divider, useToast } from '@chakra-ui/react';
import {
  MdOutlineHome,
  MdHome,
  MdOutlineSearch,
  MdLogout,
  MdOutlineSettings,
  MdSettings,
} from 'react-icons/md';
import { FaRegBell, FaBell, FaRegUser, FaUser, FaSearch } from 'react-icons/fa';
import { FiPlusCircle } from 'react-icons/fi';
import { AiFillPlusCircle } from 'react-icons/ai';
import { MdMailOutline, MdMail } from 'react-icons/md';
import { NavLink, useNavigate } from 'react-router-dom';
import { COMPACT_SIDEBAR_WIDTH } from '../utils/constants';
import FooterMenu from './FooterMenu/FooterMenu';
import logoLetter from '../assets/mementoLetter.png';
import {
  CompactNavLink,
  CompactProfileNavLink,
} from './CompactNavLink/CompactNavLink';
import { logOutUser, setUserLoggedOut } from '../utils/authUtils';
import { UserContext } from '../contexts/UserContext';

export default function CompactSidebar() {
  return (
    <Flex
      direction="column"
      boxShadow="md"
      w={COMPACT_SIDEBAR_WIDTH}
      zIndex="9999"
      h="100vh"
      position="fixed"
    >
      <NavLink to="/home">
        <Image src={logoLetter} alt="Letter M" mb={5} p={3} />
      </NavLink>
      <Divider />
      <CompactSidebarContent />
    </Flex>
  );
}

function CompactSidebarContent() {
  const navigate = useNavigate();
  const toast = useToast();
  const { currentUser } = useContext(UserContext);
  const { username: currentUsername } = currentUser;

  const handleLogout = async () => {
    try {
      await logOutUser();
      setUserLoggedOut();
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error logging out. Please try again later.',
        status: 'error',
        variant: 'subtle',
        position: 'top',
        containerStyle: {
          zIndex: '9999',
        },
      });
    }
  };

  return (
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
          icon={MdMailOutline}
          filledIcon={MdMail}
        />
        <CompactNavLink
          to="/notifications"
          icon={FaRegBell}
          filledIcon={FaBell}
        />
        <CompactProfileNavLink
          to={`/profile/${currentUsername}`}
          icon={FaRegUser}
          filledIcon={FaUser}
        />
        <Divider />
        <CompactNavLink
          to="/settings"
          icon={MdOutlineSettings}
          filledIcon={MdSettings}
        />
        <Flex ml={1} _hover={{ cursor: 'pointer' }} onClick={handleLogout}>
          <MdLogout size={22} />
        </Flex>
      </Stack>
      <FooterMenu />
    </Flex>
  );
}

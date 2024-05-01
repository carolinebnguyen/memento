import React from 'react';
import {
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Image,
  Icon,
  useBreakpointValue,
  IconButton,
} from '@chakra-ui/react';
import {
  MdOutlineHome,
  MdHome,
  MdOutlineSearch,
  MdLogout,
  MdOutlineSettings,
} from 'react-icons/md';
import { FaRegUser, FaUser, FaSearch, FaRegBell, FaBell } from 'react-icons/fa';
import { FiPlusCircle } from 'react-icons/fi';
import { AiFillPlusCircle } from 'react-icons/ai';
import { useLocation } from 'react-router-dom';
import caroline from '../../assets/placeholders/carolineAvatarClear.png';
import { CompactIconButton } from '../CompactNavLink/CompactNavLink';
import { headerHeight, sidebarWidth } from '../../utils/constants';
import styles from './BottomNav.module.css';

export default function BottomNav() {
  const isWide = useBreakpointValue({ base: false, md: true });
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      w={isWide ? `calc(100vw - ${sidebarWidth})` : `full`}
      px={5}
      borderTopWidth="1px"
      borderColor="blackAlpha.300"
      h={headerHeight}
      ml={isWide ? sidebarWidth : 0}
      position="fixed"
      bottom="0"
      bgColor="white"
    >
      <CompactIconButton to="/home" icon={MdOutlineHome} filledIcon={MdHome} />
      <CompactIconButton
        to="/search"
        icon={MdOutlineSearch}
        filledIcon={FaSearch}
      />
      <CompactIconButton
        to="/create"
        icon={FiPlusCircle}
        filledIcon={AiFillPlusCircle}
      />
      <CompactIconButton
        to="/notifications"
        icon={FaRegBell}
        filledIcon={FaBell}
      />
      <Menu>
        <MenuButton
          as={IconButton}
          icon={isProfilePage ? <FaUser /> : <FaRegUser />}
          cursor="pointer"
          variant="ghost"
        />
        <MenuList>
          <MenuItem as="a" href="/profile" className={styles['menu-link']}>
            <Image
              boxSize="3rem"
              borderRadius="full"
              src={caroline}
              alt="User profile picture"
              mr={2}
              size="lg"
            />
            <Text>My Profile</Text>
          </MenuItem>
          <MenuDivider />
          <MenuItem as="a" href="/settings" className={styles['menu-link']}>
            <Icon as={MdOutlineSettings} boxSize={5} mr={3} />
            Settings
          </MenuItem>
          <MenuItem as="a" href="/" className={styles['menu-link']}>
            <Icon as={MdLogout} boxSize={5} mr={3} />
            Log Out
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}

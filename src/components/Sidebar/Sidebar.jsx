import React from 'react';
import {
  useBreakpointValue,
  Flex,
  Icon,
  Text,
  Image,
  HStack,
  Stack,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  MenuGroup,
} from '@chakra-ui/react';
import {
  MdOutlineHome,
  MdOutlineSearch,
  MdMenu,
  MdOutlineMail,
  MdLogout,
  MdOutlineSettings,
} from 'react-icons/md';
import { FaRegBell } from 'react-icons/fa';
import { FiPlusCircle, FiUser } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/logoBlack.png';
import logoLetter from '../../assets/mementoLetter.png';
import StyledNavLink from '../StyledNavLink/StyledNavLink';
import BottomNav from '../BottomNav/BottomNav';
import styles from './Sidebar.module.css';
import { sidebarWidth, compactSidebarWidth } from '../../utils/constants';
import Header from '../Header/Header';

export default function Sidebar() {
  const isCollapsed = useBreakpointValue({ base: true, sm: false });
  const isCompact = useBreakpointValue({ sm: true, md: false });

  return (
    <Flex minH="100vh" h="100%" position="fixed" zIndex="2">
      {isCollapsed ? (
        <>
          <Header />
          <BottomNav />
        </>
      ) : isCompact ? (
        <CompactSidebar />
      ) : (
        <FullSidebar />
      )}
    </Flex>
  );
}

function FullSidebar() {
  return (
    <>
      <Flex
        direction="column"
        boxShadow="md"
        p={3}
        w={sidebarWidth}
        zIndex="9999"
      >
        <NavLink to="/">
          <Image src={logo} alt="Memento logo" p={3} />
        </NavLink>
        <SidebarContent />
      </Flex>
    </>
  );
}

function CompactSidebar() {
  return (
    <>
      <Flex
        direction="column"
        boxShadow="md"
        w={compactSidebarWidth}
        zIndex="9999"
      >
        <NavLink to="/">
          <Image src={logoLetter} alt="Letter M" mb={5} p={3} />
        </NavLink>
        <Divider />
        <CompactSidebarContent />
      </Flex>
    </>
  );
}

function SidebarContent() {
  return (
    <>
      <Flex direction="column" justify="space-between" h="100%">
        <Stack gap={5} mt={5}>
          <StyledNavLink to="/home" icon={MdOutlineHome} label="Home" />
          <StyledNavLink to="/search" icon={MdOutlineSearch} label="Search" />
          <StyledNavLink
            to="/messages"
            icon={MdOutlineMail}
            label="Direct Messages"
          />
          <StyledNavLink
            to="/notifications"
            icon={FaRegBell}
            label="Notifications"
          />
          <StyledNavLink to="/create" icon={FiPlusCircle} label="Create" />
          <StyledNavLink to="/profile" icon={FiUser} label="Profile" />
          <Divider />
          <StyledNavLink
            to="/settings"
            icon={MdOutlineSettings}
            label="Settings"
          />
          <StyledNavLink to="/" icon={MdLogout} label="Log Out" />
        </Stack>
        <Stack fontSize={12} p={3}>
          <Text>© 2024 Memento</Text>
          <HStack justify="space-between">
            <FooterNavLink to="/about" label="About" />
            <FooterNavLink to="/terms" label="Terms" />
            <FooterNavLink to="/privacy" label="Privacy" />
            <FooterNavLink to="/contact" label="Contact" />
          </HStack>
        </Stack>
      </Flex>
    </>
  );
}

function CompactSidebarContent() {
  return (
    <>
      <Flex direction="column" justify="space-between" h="100%">
        <Stack gap={5} mt={5} p={3}>
          <CompactNavLink to="/home" icon={MdOutlineHome} />
          <CompactNavLink to="/search" icon={MdOutlineSearch} />
          <CompactNavLink
            to="/messages"
            icon={MdOutlineMail}
            label="Direct Messages"
          />
          <CompactNavLink
            to="/notifications"
            icon={FaRegBell}
            label="Notifications"
          />
          <CompactNavLink to="/create" icon={FiPlusCircle} />
          <CompactNavLink to="/profile" icon={FiUser} />
          <Divider />
          <CompactNavLink to="/settings" icon={MdOutlineSettings} />
          <CompactNavLink to="/" icon={MdLogout} />
        </Stack>
        <FooterMenu />
      </Flex>
    </>
  );
}

function FooterMenu() {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={<MdMenu />}
        cursor="pointer"
        variant="link"
        mb={5}
      />
      <MenuList>
        <MenuGroup title="© 2024 Memento">
          <MenuItem
            as="a"
            href="/about"
            className={`${styles['compact-footer-link']}`}
          >
            About
          </MenuItem>
          <MenuItem
            as="a"
            href="/terms"
            className={`${styles['compact-footer-link']}`}
          >
            Terms
          </MenuItem>
          <MenuItem
            as="a"
            href="/privacy"
            className={`${styles['compact-footer-link']}`}
          >
            Privacy
          </MenuItem>
          <MenuItem
            as="a"
            href="/contact"
            className={`${styles['compact-footer-link']}`}
          >
            Contact
          </MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
}

function CompactNavLink({ to, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? styles['compact-nav-link-active']
          : styles['compact-nav-link']
      }
    >
      <Icon as={icon} boxSize={22} />
    </NavLink>
  );
}

function FooterNavLink({ to, label }) {
  return (
    <NavLink to={to} className={`${styles['footer-link']}`}>
      {label}
    </NavLink>
  );
}

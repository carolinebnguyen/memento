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
  MdHome,
  MdOutlineSearch,
  MdMenu,
  MdOutlineMail,
  MdMail,
  MdLogout,
  MdOutlineSettings,
  MdSettings,
} from 'react-icons/md';
import { FaRegBell, FaBell, FaRegUser, FaUser, FaSearch } from 'react-icons/fa';
import { BsPlusCircle, BsFillPlusCircleFill } from 'react-icons/bs';
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
          <StyledNavLink
            to="/home"
            icon={MdOutlineHome}
            filledIcon={MdHome}
            label="Home"
          />
          <StyledNavLink
            to="/search"
            icon={MdOutlineSearch}
            filledIcon={FaSearch}
            label="Search"
          />
          <StyledNavLink
            to="/messages"
            icon={MdOutlineMail}
            filledIcon={MdMail}
            label="Direct Messages"
          />
          <StyledNavLink
            to="/notifications"
            icon={FaRegBell}
            filledIcon={FaBell}
            label="Notifications"
          />
          <StyledNavLink
            to="/create"
            icon={BsPlusCircle}
            filledIcon={BsFillPlusCircleFill}
            label="Create"
          />
          <StyledNavLink
            to="/profile"
            icon={FaRegUser}
            filledIcon={FaUser}
            label="Profile"
          />
          <Divider />
          <StyledNavLink
            to="/settings"
            icon={MdOutlineSettings}
            filledIcon={MdSettings}
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
          <CompactNavLink to="/home" icon={MdOutlineHome} filledIcon={MdHome} />
          <CompactNavLink
            to="/search"
            icon={MdOutlineSearch}
            filledIcon={FaSearch}
          />
          <CompactNavLink
            to="/messages"
            icon={MdOutlineMail}
            filledIcon={MdMail}
            label="Direct Messages"
          />
          <CompactNavLink
            to="/notifications"
            icon={FaRegBell}
            filledIcon={FaBell}
            label="Notifications"
          />
          <CompactNavLink
            to="/create"
            icon={BsPlusCircle}
            filledIcon={BsFillPlusCircleFill}
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

function CompactNavLink({ to, icon, filledIcon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? styles['compact-nav-link-active']
          : styles['compact-nav-link']
      }
    >
      {({ isActive }) => (
        <Icon as={isActive ? filledIcon : icon} boxSize={22} />
      )}
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

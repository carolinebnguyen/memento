import React from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useBreakpointValue,
  Flex,
  Icon,
  Text,
  Image,
  HStack,
  Stack,
  Divider,
  VStack,
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
import styles from './Sidebar.module.css';
import {
  headerHeight,
  sidebarWidth,
  compactSidebarWidth,
} from '../../utils/constants';

export default function Sidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isCollapsed = useBreakpointValue({ base: true, sm: false });
  const isCompact = useBreakpointValue({ sm: true, md: false });

  return (
    <Flex minH="100vh" h="100%" position="fixed" zIndex="2">
      {isCollapsed ? (
        <>
          <Icon
            as={MdMenu}
            boxSize={30}
            pl={2}
            onClick={onOpen}
            cursor="pointer"
            h={headerHeight}
          >
            Open Modal
          </Icon>
          <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader borderBottomWidth="1px">
                <NavLink to="/">
                  <Image src={logo} alt="Memento logo" />
                </NavLink>
              </DrawerHeader>
              <DrawerBody>
                <SidebarContent />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
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
        p={3}
        w={compactSidebarWidth}
        zIndex="9999"
      >
        <NavLink to="/">
          <Image src={logoLetter} alt="Letter M" mb={5} />
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
        <Stack gap={5} mt={5}>
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
        <VStack fontSize={12} p={3}>
          <Text>© 2024 Memento</Text>
          <FooterNavLink to="/about" label="About" />
          <FooterNavLink to="/terms" label="Terms" />
          <FooterNavLink to="/privacy" label="Privacy" />
          <FooterNavLink to="/contact" label="Contact" />
        </VStack>
      </Flex>
    </>
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
